// NOTE ON ADMIN AUTH: this is a static site with no backend, so a fully
// secure login isn't possible here — anything shipped to the browser can
// be read in dev tools. What this DOES fix vs before: the real password
// is no longer sitting in plaintext in the source/bundle (a SHA-256 hash
// is compared instead), and AdminContext now locks out rapid repeated
// login attempts. Treat this as "keep casual visitors out", not as
// bank-grade security.
export const ADMIN_USERNAME = "rohit";
// SHA-256 hash of the real password (still "admin2025" — change the
// password by hashing a new value and swapping it in here).
export const ADMIN_PASSWORD_HASH =
  "0e89f223e226ae63268cf39152ab75722e811b89d29efb22a852f1667bd22ae0";

// Bump this whenever `defaultData`'s shape changes in a way that data a
// visitor already has saved in localStorage might not match (renamed or
// removed fields, restructured objects, etc). AdminContext uses it to
// safely fall back to fresh defaults instead of crashing on missing
// fields — this is what was causing the random "client-side exception"
// errors when navigating between pages.
export const DATA_VERSION = 2;

// Site content lives in ./content.json, not here. The Admin Panel's
// "Publish" button calls /api/publish, which commits an updated
// content.json straight to this repo via the GitHub API — that's what
// makes edits show up for every visitor instead of just the admin's own
// browser. See /api/publish.js and README.md for the one-time setup
// (a GITHUB_TOKEN env var in the Vercel project).
import content from './content.json';
export const defaultData = content;
