import crypto from 'crypto';

// --- Config -----------------------------------------------------------
const GITHUB_OWNER = 'RohitThanvi';
const GITHUB_REPO = 'portfolio';
const GITHUB_BRANCH = 'main';
const CONTENT_PATH = 'src/data/content.json';

// Same hash that ships in the client bundle (src/data/portfolio.js) —
// duplicating it here just lets this endpoint check the password on its
// own; it isn't a separate secret. The thing that actually protects this
// endpoint is GITHUB_TOKEN below, which is NEVER sent to the browser.
const ADMIN_PASSWORD_HASH =
  '0e89f223e226ae63268cf39152ab75722e811b89d29efb22a852f1667bd22ae0';

function sha256Hex(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

// Very small in-memory limiter. Serverless instances are short-lived and
// can be recycled at any time, so this is a best-effort speed bump, not a
// guarantee — GitHub's own API rate limits are the real backstop.
const attempts = { count: 0, lockedUntil: 0 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const now = Date.now();
  if (now < attempts.lockedUntil) {
    res.status(429).json({ error: 'Too many attempts. Try again shortly.' });
    return;
  }

  const { password, data } = req.body || {};

  if (!password || sha256Hex(password) !== ADMIN_PASSWORD_HASH) {
    attempts.count += 1;
    if (attempts.count >= 5) {
      attempts.lockedUntil = now + 30000;
      attempts.count = 0;
    }
    res.status(401).json({ error: 'Invalid credentials.' });
    return;
  }
  attempts.count = 0;

  if (!data || typeof data !== 'object') {
    res.status(400).json({ error: 'Missing content to publish.' });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    res.status(500).json({
      error: 'Server is missing GITHUB_TOKEN. Add it in the Vercel project settings (Environment Variables) — see README.md.',
    });
    return;
  }

  try {
    const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    // GitHub's "update file" call requires the current file's SHA.
    const getRes = await fetch(`${apiBase}?ref=${GITHUB_BRANCH}`, { headers });
    if (!getRes.ok) {
      throw new Error(`Could not read current content.json from GitHub (${getRes.status}).`);
    }
    const current = await getRes.json();

    const contentStr = JSON.stringify(data, null, 2) + '\n';
    const contentB64 = Buffer.from(contentStr, 'utf-8').toString('base64');

    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Publish site content update via admin panel',
        content: contentB64,
        sha: current.sha,
        branch: GITHUB_BRANCH,
      }),
    });

    if (!putRes.ok) {
      const errBody = await putRes.json().catch(() => ({}));
      throw new Error(errBody.message || `GitHub commit failed (${putRes.status}).`);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Publish failed.' });
  }
}
