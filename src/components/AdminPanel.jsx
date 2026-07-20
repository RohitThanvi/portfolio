import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';

export default function AdminPanel() {
  const { isAdmin, editMode, setEditMode, siteData, updateData, resetToDefault } = useAdmin();
  const [activeTab, setActiveTab] = useState('hero');
  const [showReset, setShowReset] = useState(false);
  const [minimized, setMinimized] = useState(false);

  if (!isAdmin) return null;

  const tabs = [
    { key: 'hero', label: 'Hero' },
    { key: 'about', label: 'About' },
    { key: 'experience', label: 'Exp' },
    { key: 'projects', label: 'Projects' },
    { key: 'research', label: 'Research' },
  ];

  const updateHeroField = (field, value) => {
    updateData('hero', { ...siteData.hero, [field]: value });
  };

  // ---- Research ----
  const updateResearchField = (idx, field, value) => {
    const updated = [...(siteData.research || [])];
    updated[idx] = { ...updated[idx], [field]: value };
    updateData('research', updated);
  };
  const addResearchPaper = () => {
    updateData('research', [...(siteData.research || []), {
      id: Date.now(),
      title: "New Research Paper",
      conference: "Conference Name, Year",
      status: "Accepted for Presentation",
      year: new Date().getFullYear().toString(),
      description: "Brief description of the paper."
    }]);
  };
  const removeResearch = (idx) => {
    updateData('research', (siteData.research || []).filter((_, i) => i !== idx));
  };

  // ---- Experience ----
  const updateExperienceField = (idx, field, value) => {
    const updated = [...(siteData.experience || [])];
    updated[idx] = { ...updated[idx], [field]: value };
    updateData('experience', updated);
  };
  const updateExperienceBullets = (idx, text) => {
    updateExperienceField(idx, 'bullets', text.split('\n').map(s => s.trim()).filter(Boolean));
  };
  const addExperience = () => {
    updateData('experience', [...(siteData.experience || []), {
      id: Date.now(),
      company: "New Company",
      role: "Role Title",
      period: "Month YYYY – Month YYYY",
      location: "City, India",
      bullets: ["Bullet point one"]
    }]);
  };
  const removeExperience = (idx) => {
    updateData('experience', (siteData.experience || []).filter((_, i) => i !== idx));
  };

  // ---- Projects ----
  const updateProjectField = (idx, field, value) => {
    const updated = [...(siteData.projects || [])];
    updated[idx] = { ...updated[idx], [field]: value };
    updateData('projects', updated);
  };
  const updateProjectListField = (idx, field, text) => {
    updateProjectField(idx, field, text.split('\n').map(s => s.trim()).filter(Boolean));
  };
  const addProject = () => {
    updateData('projects', [...(siteData.projects || []), {
      id: Date.now(),
      name: "New Project",
      fullName: "New Project: Full Name",
      description: "Project description goes here.",
      tech: ["Tech1", "Tech2"],
      highlights: ["Key achievement one"],
      category: "AI / Research",
      github: "https://github.com/RohitThanvi",
      color: "#C9A84C"
    }]);
  };
  const removeProject = (idx) => {
    updateData('projects', (siteData.projects || []).filter((_, i) => i !== idx));
  };

  return (
    <>
      <motion.div
        className="admin-panel"
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        drag
        dragMomentum={false}
        dragHandle=".admin-drag-handle"
      >
        <div className="admin-drag-handle">
          <span className="panel-title">Admin Panel</span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button className="panel-icon-btn" onClick={() => setMinimized(m => !m)}>
              {minimized ? '▲' : '▼'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!minimized && (
            <motion.div
              className="panel-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Edit mode toggle */}
              <div className="panel-row">
                <span className="panel-label">Inline Edit Mode</span>
                <button
                  className={`toggle-btn ${editMode ? 'on' : ''}`}
                  onClick={() => setEditMode(e => !e)}
                >
                  <span className="toggle-dot" />
                </button>
              </div>

              {editMode && (
                <p className="panel-hint">Click on text with underline (Home/About) to edit inline. Everything else is edited below.</p>
              )}

              {/* Tabs */}
              <div className="panel-tabs">
                {tabs.map(t => (
                  <button
                    key={t.key}
                    className={`panel-tab ${activeTab === t.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="panel-content">
                {activeTab === 'hero' && (
                  <HeroEditor data={siteData.hero || {}} onChange={updateHeroField} />
                )}
                {activeTab === 'research' && (
                  <ResearchEditor
                    data={siteData.research || []}
                    onUpdate={updateResearchField}
                    onAdd={addResearchPaper}
                    onRemove={removeResearch}
                  />
                )}
                {activeTab === 'experience' && (
                  <ExperienceEditor
                    data={siteData.experience || []}
                    onUpdate={updateExperienceField}
                    onUpdateBullets={updateExperienceBullets}
                    onAdd={addExperience}
                    onRemove={removeExperience}
                  />
                )}
                {activeTab === 'projects' && (
                  <ProjectsEditor
                    data={siteData.projects || []}
                    onUpdate={updateProjectField}
                    onUpdateList={updateProjectListField}
                    onAdd={addProject}
                    onRemove={removeProject}
                  />
                )}
                {activeTab === 'about' && (
                  <AboutEditor data={siteData.about || {}} onChange={(field, value) => updateData('about', { ...siteData.about, [field]: value })} />
                )}
              </div>

              {/* Reset */}
              <div className="panel-footer">
                {!showReset ? (
                  <button className="reset-btn" onClick={() => setShowReset(true)}>
                    Reset to Default
                  </button>
                ) : (
                  <div className="reset-confirm">
                    <span>Sure? This clears all changes.</span>
                    <button className="reset-yes" onClick={() => { resetToDefault(); setShowReset(false); }}>Yes</button>
                    <button className="reset-no" onClick={() => setShowReset(false)}>No</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .admin-panel {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 340px;
          background: var(--navy);
          border: 1px solid var(--gold-dim);
          z-index: 9998;
          font-family: var(--font-mono);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1);
          user-select: none;
        }
        .admin-drag-handle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 1rem;
          background: rgba(201,168,76,0.08);
          border-bottom: 1px solid var(--gold-dim);
          cursor: grab;
        }
        .admin-drag-handle:active { cursor: grabbing; }
        .panel-title {
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .panel-icon-btn {
          background: none;
          border: none;
          color: var(--white-dim);
          font-size: 0.7rem;
          cursor: none;
          padding: 0.2rem 0.4rem;
          transition: color 0.2s ease;
        }
        .panel-icon-btn:hover { color: var(--gold); }
        .panel-body { overflow: hidden; }
        .panel-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .panel-label {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          color: var(--white-dim);
        }
        .toggle-btn {
          width: 36px; height: 20px;
          border-radius: 10px;
          background: var(--white-faint);
          border: none;
          cursor: none;
          position: relative;
          transition: background 0.25s ease;
        }
        .toggle-btn.on { background: var(--gold); }
        .toggle-dot {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: var(--white);
          transition: transform 0.25s ease;
        }
        .toggle-btn.on .toggle-dot { transform: translateX(16px); }
        .panel-hint {
          font-size: 0.6rem;
          letter-spacing: 0.05em;
          line-height: 1.5;
          color: var(--gold-dim);
          padding: 0.5rem 1rem;
          background: rgba(201,168,76,0.04);
        }
        .panel-tabs {
          display: flex;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .panel-tab {
          flex: 1;
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.6rem 0.2rem;
          background: none;
          border: none;
          color: var(--white-dim);
          cursor: none;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }
        .panel-tab:hover { color: var(--white); }
        .panel-tab.active { color: var(--gold); border-bottom-color: var(--gold); }
        .panel-content { padding: 1rem; max-height: 360px; overflow-y: auto; }
        .panel-content::-webkit-scrollbar { width: 2px; }
        .panel-content::-webkit-scrollbar-thumb { background: var(--gold-dim); }
        .panel-note {
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          line-height: 1.6;
          color: var(--white-dim);
          padding: 0.5rem 0;
        }
        .field-row { margin-bottom: 0.8rem; }
        .field-row-label {
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold-dim);
          display: block;
          margin-bottom: 0.3rem;
        }
        .field-input, .field-textarea {
          width: 100%;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--white-faint);
          color: var(--white);
          padding: 0.4rem 0.6rem;
          outline: none;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }
        .field-textarea { resize: vertical; min-height: 4.5em; line-height: 1.5; }
        .field-input:focus, .field-textarea:focus { border-color: var(--gold); }
        .field-hint {
          font-size: 0.55rem;
          color: var(--white-faint);
          margin-top: 0.25rem;
          display: block;
        }
        .research-item, .list-item {
          border: 1px solid var(--white-faint);
          padding: 0.8rem;
          margin-bottom: 0.8rem;
          position: relative;
        }
        .remove-btn {
          position: absolute;
          top: 0.5rem; right: 0.5rem;
          background: none;
          border: none;
          color: #EF4444;
          font-size: 0.8rem;
          cursor: none;
        }
        .add-btn {
          width: 100%;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.5rem;
          background: transparent;
          border: 1px dashed var(--gold-dim);
          color: var(--gold-dim);
          cursor: none;
          transition: all 0.2s ease;
          margin-top: 0.5rem;
        }
        .add-btn:hover { border-color: var(--gold); color: var(--gold); }
        .panel-footer {
          padding: 0.7rem 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .reset-btn {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: none;
          border: none;
          color: #EF4444;
          cursor: none;
          opacity: 0.6;
          transition: opacity 0.2s ease;
        }
        .reset-btn:hover { opacity: 1; }
        .reset-confirm {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.6rem;
          color: var(--white-dim);
        }
        .reset-yes, .reset-no {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          padding: 0.25rem 0.5rem;
          border: none;
          cursor: none;
        }
        .reset-yes { background: #EF4444; color: var(--white); }
        .reset-no { background: var(--white-faint); color: var(--white-dim); }
      `}</style>
    </>
  );
}

function HeroEditor({ data, onChange }) {
  const fields = [
    { key: 'name', label: 'Name' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'subtitle', label: 'Subtitle' },
    { key: 'email', label: 'Email' },
    { key: 'github', label: 'GitHub Username' },
    { key: 'linkedin', label: 'LinkedIn Username' },
    { key: 'phone', label: 'Phone' },
  ];
  return (
    <div>
      {fields.map(f => (
        <div key={f.key} className="field-row">
          <label className="field-row-label">{f.label}</label>
          <input
            className="field-input"
            value={data[f.key] || ''}
            onChange={e => onChange(f.key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

function AboutEditor({ data, onChange }) {
  const textFields = [
    { key: 'bio', label: 'Bio (paragraph 1)', textarea: true },
    { key: 'bio2', label: 'Bio (paragraph 2)', textarea: true },
    { key: 'cgpa', label: 'CGPA' },
    { key: 'college', label: 'College' },
    { key: 'degree', label: 'Degree' },
    { key: 'year', label: 'Years' },
  ];
  return (
    <div>
      {textFields.map(f => (
        <div key={f.key} className="field-row">
          <label className="field-row-label">{f.label}</label>
          {f.textarea ? (
            <textarea
              className="field-textarea"
              value={data[f.key] || ''}
              onChange={e => onChange(f.key, e.target.value)}
            />
          ) : (
            <input
              className="field-input"
              value={data[f.key] || ''}
              onChange={e => onChange(f.key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ResearchEditor({ data, onUpdate, onAdd, onRemove }) {
  return (
    <div>
      {data.map((paper, idx) => (
        <div key={paper.id} className="research-item">
          <button className="remove-btn" onClick={() => onRemove(idx)}>×</button>
          {[
            { key: 'title', label: 'Title' },
            { key: 'conference', label: 'Conference' },
            { key: 'status', label: 'Status' },
            { key: 'year', label: 'Year' },
            { key: 'description', label: 'Description' },
          ].map(f => (
            <div key={f.key} className="field-row">
              <label className="field-row-label">{f.label}</label>
              <input
                className="field-input"
                value={paper[f.key] || ''}
                onChange={e => onUpdate(idx, f.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}
      <button className="add-btn" onClick={onAdd}>+ Add Paper</button>
    </div>
  );
}

function ExperienceEditor({ data, onUpdate, onUpdateBullets, onAdd, onRemove }) {
  return (
    <div>
      {data.map((exp, idx) => (
        <div key={exp.id} className="list-item">
          <button className="remove-btn" onClick={() => onRemove(idx)}>×</button>
          {[
            { key: 'company', label: 'Company' },
            { key: 'role', label: 'Role' },
            { key: 'period', label: 'Period' },
            { key: 'location', label: 'Location' },
          ].map(f => (
            <div key={f.key} className="field-row">
              <label className="field-row-label">{f.label}</label>
              <input
                className="field-input"
                value={exp[f.key] || ''}
                onChange={e => onUpdate(idx, f.key, e.target.value)}
              />
            </div>
          ))}
          <div className="field-row">
            <label className="field-row-label">Bullets</label>
            <textarea
              className="field-textarea"
              value={(exp.bullets || []).join('\n')}
              onChange={e => onUpdateBullets(idx, e.target.value)}
            />
            <span className="field-hint">One bullet per line.</span>
          </div>
        </div>
      ))}
      <button className="add-btn" onClick={onAdd}>+ Add Experience</button>
    </div>
  );
}

function ProjectsEditor({ data, onUpdate, onUpdateList, onAdd, onRemove }) {
  return (
    <div>
      {data.map((proj, idx) => (
        <div key={proj.id} className="list-item">
          <button className="remove-btn" onClick={() => onRemove(idx)}>×</button>
          {[
            { key: 'name', label: 'Short Name' },
            { key: 'fullName', label: 'Full Name' },
            { key: 'category', label: 'Category' },
            { key: 'github', label: 'GitHub / Link URL' },
            { key: 'color', label: 'Accent Color (hex)' },
          ].map(f => (
            <div key={f.key} className="field-row">
              <label className="field-row-label">{f.label}</label>
              <input
                className="field-input"
                value={proj[f.key] || ''}
                onChange={e => onUpdate(idx, f.key, e.target.value)}
              />
            </div>
          ))}
          <div className="field-row">
            <label className="field-row-label">Description</label>
            <textarea
              className="field-textarea"
              value={proj.description || ''}
              onChange={e => onUpdate(idx, 'description', e.target.value)}
            />
          </div>
          <div className="field-row">
            <label className="field-row-label">Highlights</label>
            <textarea
              className="field-textarea"
              value={(proj.highlights || []).join('\n')}
              onChange={e => onUpdateList(idx, 'highlights', e.target.value)}
            />
            <span className="field-hint">One highlight per line.</span>
          </div>
          <div className="field-row">
            <label className="field-row-label">Tech Stack</label>
            <textarea
              className="field-textarea"
              value={(proj.tech || []).join('\n')}
              onChange={e => onUpdateList(idx, 'tech', e.target.value)}
            />
            <span className="field-hint">One tag per line.</span>
          </div>
        </div>
      ))}
      <button className="add-btn" onClick={onAdd}>+ Add Project</button>
    </div>
  );
}
