import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function HexCell({ photo, index, isAdmin, onDelete, onOpen }) {
  const offsetRow = Math.floor(index / 5) % 2 === 1;
  return (
    <motion.div
      className={`hex-cell ${offsetRow ? 'hex-offset' : ''}`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: Math.min(index, 12) * 0.04 }}
      whileHover={{ scale: 1.06, zIndex: 5 }}
    >
      <div className="hex-inner" onClick={() => onOpen(photo)}>
        <img src={photo.url} alt={photo.caption || 'Gallery photo'} loading="lazy" />
        <div className="hex-shine" />
      </div>
      {isAdmin && (
        <button
          className="hex-delete"
          onClick={(e) => { e.stopPropagation(); onDelete(photo); }}
          title="Delete photo"
        >
          ×
        </button>
      )}
    </motion.div>
  );
}

export default function Gallery() {
  const { siteData, updateData, isAdmin } = useAdmin();
  const gallery = siteData.gallery || [];
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [pendingPassword, setPendingPassword] = useState('');
  const [showPasswordFor, setShowPasswordFor] = useState(null); // 'upload' | photo object for delete
  const [lightbox, setLightbox] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const fileInputRef = useRef(null);

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPendingFile(file);
    setShowPasswordFor('upload');
    setUploadError('');
  };

  const confirmUpload = async () => {
    if (!pendingFile || !pendingPassword) return;
    setUploading(true);
    setUploadError('');
    try {
      const dataBase64 = await fileToBase64(pendingFile);
      const res = await fetch('/api/gallery-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pendingPassword, filename: pendingFile.name, dataBase64 }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Upload failed.');

      updateData('gallery', [...gallery, body.photo]);
      setShowPasswordFor(null);
      setPendingPassword('');
      setPendingFile(null);
    } catch (err) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async (photo) => {
    if (!pendingPassword) return;
    setUploading(true);
    setUploadError('');
    try {
      const res = await fetch('/api/gallery-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pendingPassword, repoPath: photo.repoPath, photoId: photo.id }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Delete failed.');

      updateData('gallery', gallery.filter(p => p.id !== photo.id));
      setShowPasswordFor(null);
      setPendingPassword('');
    } catch (err) {
      setUploadError(err.message || 'Delete failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="gallery-page">
      <div className="page-container">
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Moments</p>
          <div className="gold-line" />
          <h1 className="gallery-main-title">
            A honeycomb of<br />
            <span className="gallery-gold">memories.</span>
          </h1>
          {isAdmin && (
            <div className="gallery-admin-bar">
              <button className="gallery-upload-btn" onClick={handlePickFile} disabled={uploading}>
                + Upload Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelected}
              />
              <span className="gallery-admin-hint">Photos publish immediately — this is live content, not a draft.</span>
            </div>
          )}
        </motion.div>

        {gallery.length === 0 ? (
          <div className="gallery-empty">
            <p>No photos yet.{isAdmin ? ' Upload your first one above.' : ''}</p>
          </div>
        ) : (
          <div className="hex-grid">
            {gallery.map((photo, i) => (
              <HexCell
                key={photo.id}
                photo={photo}
                index={i}
                isAdmin={isAdmin}
                onOpen={setLightbox}
                onDelete={(p) => { setShowPasswordFor(p); setUploadError(''); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox.url}
              alt={lightbox.caption || 'Gallery photo'}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button className="lightbox-close" onClick={() => setLightbox(null)}>×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload confirm modal */}
      <AnimatePresence>
        {showPasswordFor && (
          <motion.div
            className="gallery-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="gallery-modal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <h3>{showPasswordFor === 'upload' ? 'Confirm upload' : 'Delete this photo?'}</h3>
              {showPasswordFor !== 'upload' && (
                <img className="gallery-modal-preview" src={showPasswordFor.url} alt="" />
              )}
              <label className="gallery-modal-label">Admin password</label>
              <input
                type="password"
                className="gallery-modal-input"
                value={pendingPassword}
                onChange={e => setPendingPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (showPasswordFor === 'upload' ? confirmUpload() : confirmDelete(showPasswordFor))}
                autoFocus
              />
              {uploadError && <p className="gallery-modal-error">{uploadError}</p>}
              <div className="gallery-modal-actions">
                <button
                  className="gallery-modal-confirm"
                  disabled={uploading || !pendingPassword}
                  onClick={() => showPasswordFor === 'upload' ? confirmUpload() : confirmDelete(showPasswordFor)}
                >
                  {uploading ? 'Working…' : showPasswordFor === 'upload' ? 'Publish Photo' : 'Delete'}
                </button>
                <button
                  className="gallery-modal-cancel"
                  onClick={() => { setShowPasswordFor(null); setPendingPassword(''); setPendingFile(null); setUploadError(''); }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-page { padding: 8rem 0 6rem; min-height: 100vh; }
        .gallery-header { text-align: center; margin-bottom: 4rem; }
        .gallery-header .gold-line { margin: 1rem auto; }
        .gallery-main-title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          line-height: 1.05;
          color: var(--white);
          letter-spacing: 0.01em;
        }
        .gallery-gold { color: var(--gold); }

        .gallery-admin-bar {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .gallery-upload-btn {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: var(--gold);
          color: #000;
          font-weight: 600;
          border: none;
          padding: 0.8rem 1.6rem;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .gallery-upload-btn:hover { opacity: 0.85; }
        .gallery-upload-btn:disabled { opacity: 0.5; cursor: default; }
        .gallery-admin-hint {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--white-dim);
          letter-spacing: 0.04em;
        }

        .gallery-empty {
          text-align: center;
          padding: 4rem 0;
          color: var(--white-dim);
          font-family: var(--font-mono);
          font-size: 0.85rem;
        }

        /* Honeycomb grid: hexagons arranged in offset rows */
        .hex-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0;
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 0;
        }
        .hex-cell {
          position: relative;
          width: 160px;
          height: 184px;
          margin: -23px 4px;
          flex-shrink: 0;
        }
        .hex-offset:first-child { margin-left: 84px; }
        .hex-inner {
          position: absolute;
          inset: 0;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          cursor: pointer;
          overflow: hidden;
          background: var(--navy-light);
          border: 1px solid var(--gold-dim);
        }
        .hex-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .hex-cell:hover .hex-inner img { transform: scale(1.12); }
        .hex-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent 60%);
          pointer-events: none;
        }
        .hex-delete {
          position: absolute;
          top: 6px;
          right: 26px;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: rgba(0,0,0,0.75);
          border: 1px solid #EF4444;
          color: #EF4444;
          font-size: 0.9rem;
          line-height: 1;
          cursor: pointer;
          z-index: 6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 640px) {
          .hex-cell { width: 110px; height: 127px; margin: -16px 2px; }
          .hex-offset:first-child { margin-left: 57px; }
        }

        /* Lightbox */
        .lightbox-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.9);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          padding: 2rem;
        }
        .lightbox-backdrop img {
          max-width: 90vw;
          max-height: 85vh;
          object-fit: contain;
          box-shadow: 0 20px 80px rgba(0,0,0,0.6);
        }
        .lightbox-close {
          position: absolute;
          top: 2rem; right: 2rem;
          width: 44px; height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid var(--white-faint);
          color: var(--white);
          font-size: 1.4rem;
          cursor: pointer;
        }

        /* Upload/delete confirm modal */
        .gallery-modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 10000;
          padding: 1.5rem;
        }
        .gallery-modal {
          background: var(--navy);
          border: 1px solid var(--gold-dim);
          padding: 2rem;
          width: 100%;
          max-width: 360px;
          font-family: var(--font-mono);
        }
        .gallery-modal h3 {
          font-family: var(--font-display);
          font-size: 1.3rem;
          color: var(--white);
          margin: 0 0 1rem;
          letter-spacing: 0.02em;
        }
        .gallery-modal-preview {
          width: 100%;
          max-height: 160px;
          object-fit: cover;
          margin-bottom: 1rem;
        }
        .gallery-modal-label {
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold-dim);
          display: block;
          margin-bottom: 0.4rem;
        }
        .gallery-modal-input {
          width: 100%;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--white-faint);
          color: var(--white);
          padding: 0.6rem 0.7rem;
          outline: none;
          box-sizing: border-box;
        }
        .gallery-modal-input:focus { border-color: var(--gold); }
        .gallery-modal-error {
          color: #EF4444;
          font-size: 0.65rem;
          margin: 0.6rem 0 0;
        }
        .gallery-modal-actions {
          display: flex;
          gap: 0.6rem;
          margin-top: 1.2rem;
        }
        .gallery-modal-confirm {
          flex: 1;
          background: var(--gold);
          color: #000;
          font-weight: 600;
          border: none;
          padding: 0.6rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
        }
        .gallery-modal-confirm:disabled { opacity: 0.5; cursor: default; }
        .gallery-modal-cancel {
          background: transparent;
          border: 1px solid var(--white-faint);
          color: var(--white-dim);
          padding: 0.6rem 1rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
