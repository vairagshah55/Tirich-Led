import React, { useState, useEffect, useCallback } from 'react';
import styles from './AIStudioPage.module.css';

const API = process.env.REACT_APP_API_BASE_URL;

const PROMPT_TYPES = [
  { value: 'hero_banner', label: 'Hero Banner' },
  { value: 'product_detail', label: 'Product Detail' },
  { value: 'lifestyle', label: 'Lifestyle' },
];

const PROVIDERS = [
  { value: 'stability-ai', label: 'Stability AI (SDXL)' },
  { value: 'replicate', label: 'Replicate (SDXL)' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractPlaceholders(template = '') {
  const matches = template.match(/\{(\w+)\}/g) || [];
  return [...new Set(matches.map((m) => m.slice(1, -1)))];
}

function resolvePreview(template = '', vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] || `[${k}]`);
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data.data;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AIStudioPage({ user }) {
  const isSuperadmin = user?.roles?.includes('superadmin');

  // Templates
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filterType, setFilterType] = useState('');

  // Variables panel
  const [variables, setVariables] = useState({});
  const [provider, setProvider] = useState('stability-ai');

  // Custom prompt mode
  const [customMode, setCustomMode] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [pendingIds, setPendingIds] = useState([]);

  // Gallery
  const [images, setImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  // Template form (superadmin)
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [templateForm, setTemplateForm] = useState({ name: '', type: 'hero_banner', template: '', keywords: '' });
  const [templateSaving, setTemplateSaving] = useState(false);

  // Active tab
  const [tab, setTab] = useState('generate');

  // ── Fetch templates ──────────────────────────────────────────────
  const fetchTemplates = useCallback(async () => {
    try {
      const path = filterType ? `/prompts/templates?type=${filterType}` : '/prompts/templates';
      const data = await apiFetch(path);
      setTemplates(data);
    } catch (e) {
      console.error('fetchTemplates', e);
    }
  }, [filterType]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  // ── Fetch gallery ────────────────────────────────────────────────
  const fetchImages = useCallback(async () => {
    setGalleryLoading(true);
    try {
      const data = await apiFetch('/prompts/images');
      setImages(data);
    } catch (e) {
      console.error('fetchImages', e);
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'gallery') fetchImages();
  }, [tab, fetchImages]);

  // ── Poll pending generations ─────────────────────────────────────
  useEffect(() => {
    if (!pendingIds.length) return;
    const interval = setInterval(async () => {
      const updates = await Promise.all(
        pendingIds.map((id) => apiFetch(`/prompts/images/${id}`).catch(() => null))
      );
      const stillPending = [];
      updates.forEach((img) => {
        if (!img) return;
        if (img.status === 'completed' || img.status === 'failed') {
          setImages((prev) => {
            const exists = prev.find((i) => i.id === img.id);
            if (exists) return prev.map((i) => (i.id === img.id ? img : i));
            return [img, ...prev];
          });
        } else {
          stillPending.push(img.id);
        }
      });
      setPendingIds(stillPending);
    }, 4000);
    return () => clearInterval(interval);
  }, [pendingIds]);

  // ── Select template ──────────────────────────────────────────────
  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);
    setVariables({});
    setCustomMode(false);
  };

  // ── Generate ─────────────────────────────────────────────────────
  const handleGenerate = async () => {
    setGenError('');
    setGenerating(true);
    try {
      let result;
      if (customMode) {
        if (!customPrompt.trim()) throw new Error('Please enter a prompt.');
        result = await apiFetch('/prompts/generate/custom', {
          method: 'POST',
          body: JSON.stringify({ final_prompt: customPrompt, provider }),
        });
      } else {
        if (!selectedTemplate) throw new Error('Please select a template.');
        result = await apiFetch('/prompts/generate', {
          method: 'POST',
          body: JSON.stringify({
            template_id: selectedTemplate.id,
            variables,
            provider,
          }),
        });
      }
      setPendingIds((prev) => [...prev, result.id]);
      setImages((prev) => [{ ...result, status: 'generating' }, ...prev]);
      setTab('gallery');
    } catch (e) {
      setGenError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  // ── Delete image ─────────────────────────────────────────────────
  const handleDeleteImage = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await apiFetch(`/prompts/images/${id}`, { method: 'DELETE' });
      setImages((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  // ── Save template ─────────────────────────────────────────────────
  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    setTemplateSaving(true);
    try {
      let keywords = {};
      try { keywords = JSON.parse(templateForm.keywords || '{}'); } catch { keywords = {}; }
      await apiFetch('/prompts/templates', {
        method: 'POST',
        body: JSON.stringify({ ...templateForm, keywords }),
      });
      setShowTemplateForm(false);
      setTemplateForm({ name: '', type: 'hero_banner', template: '', keywords: '' });
      fetchTemplates();
    } catch (e) {
      alert(e.message);
    } finally {
      setTemplateSaving(false);
    }
  };

  // ── Delete template ───────────────────────────────────────────────
  const handleDeleteTemplate = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await apiFetch(`/prompts/templates/${id}`, { method: 'DELETE' });
      if (selectedTemplate?.id === id) setSelectedTemplate(null);
      fetchTemplates();
    } catch (e) {
      alert(e.message);
    }
  };

  const placeholders = selectedTemplate ? extractPlaceholders(selectedTemplate.template) : [];
  const preview = selectedTemplate
    ? resolvePreview(selectedTemplate.template, variables)
    : customPrompt;

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className={styles.studio}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>AI Studio</h1>
          <p className={styles.subtitle}>Generate editorial jewelry photography using AI</p>
        </div>
        <div className={styles.tabs}>
          <button
            className={tab === 'generate' ? styles.tabActive : styles.tab}
            onClick={() => setTab('generate')}
          >
            Generate
          </button>
          <button
            className={tab === 'gallery' ? styles.tabActive : styles.tab}
            onClick={() => setTab('gallery')}
          >
            Gallery {images.length > 0 && <span className={styles.badge}>{images.length}</span>}
          </button>
          {isSuperadmin && (
            <button
              className={tab === 'templates' ? styles.tabActive : styles.tab}
              onClick={() => setTab('templates')}
            >
              Templates
            </button>
          )}
        </div>
      </header>

      {/* ── GENERATE TAB ── */}
      {tab === 'generate' && (
        <div className={styles.generateLayout}>
          {/* Left: template picker */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Templates</h2>
              <select
                className={styles.select}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All types</option>
                {PROMPT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.templateList}>
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  className={selectedTemplate?.id === tpl.id ? styles.templateCardActive : styles.templateCard}
                  onClick={() => handleSelectTemplate(tpl)}
                >
                  <span className={`${styles.typeBadge} ${styles[tpl.type]}`}>
                    {PROMPT_TYPES.find((t) => t.value === tpl.type)?.label || tpl.type}
                  </span>
                  <span className={styles.templateName}>{tpl.name}</span>
                </button>
              ))}
            </div>

            <div className={styles.divider} />
            <button
              className={customMode ? styles.customBtnActive : styles.customBtn}
              onClick={() => { setCustomMode(true); setSelectedTemplate(null); }}
            >
              ✏ Write custom prompt
            </button>
          </aside>

          {/* Right: editor + preview */}
          <main className={styles.editor}>
            {customMode ? (
              <div className={styles.editorSection}>
                <h3 className={styles.editorSectionTitle}>Custom Prompt</h3>
                <p className={styles.hint}>
                  Use the power words: <em>85mm lens, f/1.8, 8k, VVS clarity, high-gloss finish, butterfly lighting…</em>
                </p>
                <textarea
                  className={styles.textarea}
                  rows={8}
                  placeholder="High-end jewelry editorial photography, a beautiful Indian woman wearing a 14k gold necklace with 0.5ct round-cut diamonds…"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
              </div>
            ) : selectedTemplate ? (
              <>
                <div className={styles.editorSection}>
                  <h3 className={styles.editorSectionTitle}>{selectedTemplate.name}</h3>
                  <p className={styles.templatePreviewRaw}>{selectedTemplate.template}</p>
                </div>

                {placeholders.length > 0 && (
                  <div className={styles.editorSection}>
                    <h3 className={styles.editorSectionTitle}>Customize</h3>
                    <div className={styles.variablesGrid}>
                      {placeholders.map((key) => (
                        <div key={key} className={styles.variableField}>
                          <label className={styles.label}>{key.replace(/_/g, ' ')}</label>
                          <input
                            className={styles.input}
                            type="text"
                            placeholder={key === 'ethnicity' ? 'e.g. Indian' : key === 'jewelry_description' ? 'e.g. 14k gold necklace with 0.5ct diamonds' : ''}
                            value={variables[key] || ''}
                            onChange={(e) =>
                              setVariables((prev) => ({ ...prev, [key]: e.target.value }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.emptyState}>
                <p>Select a template on the left, or write a custom prompt.</p>
              </div>
            )}

            {/* Preview */}
            {(selectedTemplate || customMode) && (
              <div className={styles.editorSection}>
                <h3 className={styles.editorSectionTitle}>Prompt Preview</h3>
                <div className={styles.previewBox}>{preview || '—'}</div>
              </div>
            )}

            {/* Provider + Generate */}
            {(selectedTemplate || customMode) && (
              <div className={styles.generateBar}>
                <div className={styles.providerSelect}>
                  <label className={styles.label}>AI Provider</label>
                  <select
                    className={styles.select}
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  className={styles.generateBtn}
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating ? 'Queued…' : '✦ Generate Image'}
                </button>
              </div>
            )}

            {genError && <p className={styles.errorMsg}>{genError}</p>}
          </main>
        </div>
      )}

      {/* ── GALLERY TAB ── */}
      {tab === 'gallery' && (
        <div className={styles.galleryContainer}>
          {galleryLoading ? (
            <p className={styles.galleryEmpty}>Loading gallery…</p>
          ) : images.length === 0 ? (
            <div className={styles.galleryEmpty}>
              <p>No images yet. Generate your first one!</p>
              <button className={styles.generateBtn} onClick={() => setTab('generate')}>
                Go to Generator
              </button>
            </div>
          ) : (
            <div className={styles.gallery}>
              {images.map((img) => (
                <GalleryCard key={img.id} img={img} onDelete={handleDeleteImage} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TEMPLATES TAB (superadmin only) ── */}
      {tab === 'templates' && isSuperadmin && (
        <div className={styles.templatesContainer}>
          <div className={styles.templatesHeader}>
            <h2>Manage Templates</h2>
            <button className={styles.generateBtn} onClick={() => setShowTemplateForm((v) => !v)}>
              {showTemplateForm ? 'Cancel' : '+ New Template'}
            </button>
          </div>

          {showTemplateForm && (
            <form className={styles.templateForm} onSubmit={handleSaveTemplate}>
              <div className={styles.formGrid}>
                <div className={styles.variableField}>
                  <label className={styles.label}>Name</label>
                  <input className={styles.input} required value={templateForm.name}
                    onChange={(e) => setTemplateForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div className={styles.variableField}>
                  <label className={styles.label}>Type</label>
                  <select className={styles.select} value={templateForm.type}
                    onChange={(e) => setTemplateForm((f) => ({ ...f, type: e.target.value }))}>
                    {PROMPT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.variableField}>
                <label className={styles.label}>Template (use {'{placeholder}'} for variables)</label>
                <textarea className={styles.textarea} rows={5} required value={templateForm.template}
                  onChange={(e) => setTemplateForm((f) => ({ ...f, template: e.target.value }))} />
              </div>
              <div className={styles.variableField}>
                <label className={styles.label}>Keywords JSON (optional)</label>
                <input className={styles.input} placeholder='{"lens": "85mm"}' value={templateForm.keywords}
                  onChange={(e) => setTemplateForm((f) => ({ ...f, keywords: e.target.value }))} />
              </div>
              <button className={styles.generateBtn} type="submit" disabled={templateSaving}>
                {templateSaving ? 'Saving…' : 'Save Template'}
              </button>
            </form>
          )}

          <div className={styles.templateListFull}>
            {templates.map((tpl) => (
              <div key={tpl.id} className={styles.templateRow}>
                <div>
                  <span className={`${styles.typeBadge} ${styles[tpl.type]}`}>
                    {PROMPT_TYPES.find((t) => t.value === tpl.type)?.label}
                  </span>
                  <strong className={styles.templateRowName}>{tpl.name}</strong>
                  <p className={styles.templateRowBody}>{tpl.template}</p>
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteTemplate(tpl.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Gallery Card ──────────────────────────────────────────────────────────────
function GalleryCard({ img, onDelete }) {
  const isGenerating = img.status === 'generating' || img.status === 'pending';
  const isFailed = img.status === 'failed';
  const imageUrl = img.image_path ? `http://localhost:5000${img.image_path}` : null;

  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        {isGenerating && (
          <div className={styles.cardPlaceholder}>
            <div className={styles.spinner} />
            <span>Generating…</span>
          </div>
        )}
        {isFailed && (
          <div className={`${styles.cardPlaceholder} ${styles.cardFailed}`}>
            <span>Generation failed</span>
            <small>{img.error_message}</small>
          </div>
        )}
        {imageUrl && !isGenerating && !isFailed && (
          <img src={imageUrl} alt={img.final_prompt} className={styles.cardImg} />
        )}
      </div>
      <div className={styles.cardMeta}>
        <span className={`${styles.statusDot} ${styles[`status_${img.status}`]}`} />
        <span className={styles.cardType}>{img.template_type || 'custom'}</span>
        {img.template_name && <span className={styles.cardName}>{img.template_name}</span>}
        <p className={styles.cardPrompt}>{img.final_prompt}</p>
        <div className={styles.cardActions}>
          {imageUrl && (
            <a
              href={imageUrl}
              download={`gemifyai_${img.id}.png`}
              className={styles.downloadBtn}
              target="_blank"
              rel="noreferrer"
            >
              Download
            </a>
          )}
          <button className={styles.deleteBtn} onClick={() => onDelete(img.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
