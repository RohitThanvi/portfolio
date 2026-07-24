import crypto from 'crypto';

const GITHUB_OWNER = 'RohitThanvi';
const GITHUB_REPO = 'portfolio';
const GITHUB_BRANCH = 'main';
const GALLERY_DIR = 'public/gallery/';
const CONTENT_PATH = 'src/data/content.json';

const ADMIN_PASSWORD_HASH =
  '0e89f223e226ae63268cf39152ab75722e811b89d29efb22a852f1667bd22ae0';

function sha256Hex(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

const attempts = { count: 0, lockedUntil: 0 };

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

  const { password, repoPath, photoId } = req.body || {};

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

  // Only ever allow deleting files inside the gallery folder — this
  // endpoint must never be able to touch anything else in the repo.
  if (
    !repoPath ||
    typeof repoPath !== 'string' ||
    !repoPath.startsWith(GALLERY_DIR) ||
    repoPath.includes('..')
  ) {
    res.status(400).json({ error: 'Invalid file path.' });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'Server is missing GITHUB_TOKEN.' });
    return;
  }

  const headers = ghHeaders(token);

  try {
    // 1. Remove the image file from the repo (if it's still there).
    const imgApiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${repoPath}`;
    const getImgRes = await fetch(`${imgApiUrl}?ref=${GITHUB_BRANCH}`, { headers });
    if (getImgRes.ok) {
      const currentImg = await getImgRes.json();
      const delRes = await fetch(imgApiUrl, {
        method: 'DELETE',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Remove gallery photo ${repoPath.split('/').pop()}`,
          sha: currentImg.sha,
          branch: GITHUB_BRANCH,
        }),
      });
      if (!delRes.ok) {
        const errBody = await delRes.json().catch(() => ({}));
        throw new Error(errBody.message || `Image delete failed (${delRes.status}).`);
      }
    } else if (getImgRes.status !== 404) {
      throw new Error(`Could not look up image file (${getImgRes.status}).`);
    }

    // 2. Remove the entry from content.json so it disappears for every
    //    visitor immediately, not just in the admin's local draft.
    const getContentRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}?ref=${GITHUB_BRANCH}`,
      { headers }
    );
    if (!getContentRes.ok) {
      throw new Error(`Could not read content.json (${getContentRes.status}).`);
    }
    const currentFile = await getContentRes.json();
    const currentJson = JSON.parse(Buffer.from(currentFile.content, 'base64').toString('utf-8'));

    const updatedGallery = (currentJson.gallery || []).filter(
      p => p.repoPath !== repoPath && (photoId === undefined || p.id !== photoId)
    );
    const updatedJson = { ...currentJson, gallery: updatedGallery };
    const updatedContentStr = JSON.stringify(updatedJson, null, 2) + '\n';

    const putContentRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}`,
      {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Remove gallery photo entry ${repoPath.split('/').pop()}`,
          content: Buffer.from(updatedContentStr, 'utf-8').toString('base64'),
          sha: currentFile.sha,
          branch: GITHUB_BRANCH,
        }),
      }
    );
    if (!putContentRes.ok) {
      const errBody = await putContentRes.json().catch(() => ({}));
      throw new Error(errBody.message || `Removing gallery entry failed (${putContentRes.status}).`);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Delete failed.' });
  }
}
