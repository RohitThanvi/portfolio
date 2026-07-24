import crypto from 'crypto';

const GITHUB_OWNER = 'RohitThanvi';
const GITHUB_REPO = 'portfolio';
const GITHUB_BRANCH = 'main';
const GALLERY_DIR = 'public/gallery';
const CONTENT_PATH = 'src/data/content.json';

// Same hash as src/data/portfolio.js and api/publish.js — see the note
// there. GITHUB_TOKEN (never sent to the browser) is what actually
// protects this endpoint.
const ADMIN_PASSWORD_HASH =
  '0e89f223e226ae63268cf39152ab75722e811b89d29efb22a852f1667bd22ae0';

function sha256Hex(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

const attempts = { count: 0, lockedUntil: 0 };

function safeExt(name) {
  const m = /\.([a-zA-Z0-9]+)$/.exec(name || '');
  const ext = (m ? m[1] : 'jpg').toLowerCase();
  return /^(jpg|jpeg|png|webp|gif)$/.test(ext) ? ext : 'jpg';
}

export const config = {
  api: { bodyParser: { sizeLimit: '8mb' } },
};

function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

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

  const { password, filename, dataBase64, caption } = req.body || {};

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

  if (!dataBase64) {
    res.status(400).json({ error: 'Missing image data.' });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    res.status(500).json({
      error: 'Server is missing GITHUB_TOKEN. Add it in the Vercel project settings — see README.md.',
    });
    return;
  }

  const base64 = dataBase64.replace(/^data:[^;]+;base64,/, '');
  if (base64.length > 7_000_000) {
    res.status(400).json({ error: 'Image is too large. Please use one under about 5MB.' });
    return;
  }

  const ext = safeExt(filename);
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const imagePath = `${GALLERY_DIR}/${uniqueName}`;
  const headers = ghHeaders(token);

  try {
    // 1. Upload the image file itself.
    const putImgRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${imagePath}`,
      {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Add gallery photo ${uniqueName}`,
          content: base64,
          branch: GITHUB_BRANCH,
        }),
      }
    );
    if (!putImgRes.ok) {
      const errBody = await putImgRes.json().catch(() => ({}));
      throw new Error(errBody.message || `Image upload failed (${putImgRes.status}).`);
    }

    // 2. Read the current published content.json...
    const getContentRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}?ref=${GITHUB_BRANCH}`,
      { headers }
    );
    if (!getContentRes.ok) {
      throw new Error(`Could not read content.json (${getContentRes.status}).`);
    }
    const currentFile = await getContentRes.json();
    const currentJson = JSON.parse(Buffer.from(currentFile.content, 'base64').toString('utf-8'));

    // 3. ...append the new photo, and write it straight back. This is
    //    what makes an upload go live immediately for every visitor,
    //    without needing a separate "Publish" step.
    const newPhoto = {
      id: Date.now(),
      url: `/gallery/${uniqueName}`,
      repoPath: imagePath,
      caption: caption || '',
    };
    const updatedJson = { ...currentJson, gallery: [...(currentJson.gallery || []), newPhoto] };
    const updatedContentStr = JSON.stringify(updatedJson, null, 2) + '\n';

    const putContentRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}`,
      {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Publish gallery photo ${uniqueName}`,
          content: Buffer.from(updatedContentStr, 'utf-8').toString('base64'),
          sha: currentFile.sha,
          branch: GITHUB_BRANCH,
        }),
      }
    );
    if (!putContentRes.ok) {
      const errBody = await putContentRes.json().catch(() => ({}));
      throw new Error(errBody.message || `Publishing gallery entry failed (${putContentRes.status}).`);
    }

    res.status(200).json({ success: true, photo: newPhoto });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Upload failed.' });
  }
}
