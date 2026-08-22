import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { AboutSection } from '../../types/database';

const SECTIONS = [
  { key: 'mission', label: 'Mission' },
  { key: 'values', label: 'Values' },
  { key: 'history', label: 'History' },
  { key: 'technology', label: 'Technology' },
] as const;

type SectionKey = (typeof SECTIONS)[number]['key'];

const VALUE_KEYS = ['excellence', 'integrity', 'innovation', 'empathy'] as const;
const VALUE_LABELS: Record<(typeof VALUE_KEYS)[number], string> = {
  excellence: 'Excellence',
  integrity: 'Integrity',
  innovation: 'Innovation',
  empathy: 'Empathy',
};

type MissionContent = {
  title_it: string;
  title_en: string;
  p1_it: string;
  p1_en: string;
  p2_it: string;
  p2_en: string;
};

type ValueItem = {
  key: string;
  title_it: string;
  title_en: string;
  desc_it: string;
  desc_en: string;
};

type HistoryItem = {
  year_it: string;
  year_en: string;
  title_it: string;
  title_en: string;
  text_it: string;
  text_en: string;
};

type TechnologyContent = {
  title_it: string;
  title_en: string;
  content_it: string;
  content_en: string;
  items_it: string[];
  items_en: string[];
};

const defaultMission = (): MissionContent => ({
  title_it: '',
  title_en: '',
  p1_it: '',
  p1_en: '',
  p2_it: '',
  p2_en: '',
});

const defaultValues = (): ValueItem[] =>
  VALUE_KEYS.map((key) => ({
    key,
    title_it: '',
    title_en: '',
    desc_it: '',
    desc_en: '',
  }));

const defaultHistory = (): HistoryItem[] => [
  { year_it: '', year_en: '', title_it: '', title_en: '', text_it: '', text_en: '' },
];

const defaultTechnology = (): TechnologyContent => ({
  title_it: '',
  title_en: '',
  content_it: '',
  content_en: '',
  items_it: [''],
  items_en: [''],
});

function parseMission(raw: Record<string, unknown> | undefined): MissionContent {
  const d = defaultMission();
  if (!raw) return d;
  return {
    title_it: String(raw.title_it ?? d.title_it),
    title_en: String(raw.title_en ?? d.title_en),
    p1_it: String(raw.p1_it ?? d.p1_it),
    p1_en: String(raw.p1_en ?? d.p1_en),
    p2_it: String(raw.p2_it ?? d.p2_it),
    p2_en: String(raw.p2_en ?? d.p2_en),
  };
}

function parseValues(raw: Record<string, unknown> | undefined): ValueItem[] {
  const items = raw?.items as ValueItem[] | undefined;
  const defaults = defaultValues();
  if (!items?.length) return defaults;
  return VALUE_KEYS.map((key) => {
    const found = items.find((item) => item.key === key);
    const fallback = defaults.find((item) => item.key === key)!;
    return {
      key,
      title_it: String(found?.title_it ?? fallback.title_it),
      title_en: String(found?.title_en ?? fallback.title_en),
      desc_it: String(found?.desc_it ?? fallback.desc_it),
      desc_en: String(found?.desc_en ?? fallback.desc_en),
    };
  });
}

function parseHistory(raw: Record<string, unknown> | undefined): HistoryItem[] {
  const items = raw?.items as HistoryItem[] | undefined;
  if (!items?.length) return defaultHistory();
  return items.map((item) => {
    const legacyYear = String(item.year ?? '');
    return {
      year_it: String(item.year_it ?? legacyYear),
      year_en: String(item.year_en ?? (legacyYear === 'Oggi' ? 'Today' : legacyYear)),
      title_it: String(item.title_it ?? ''),
      title_en: String(item.title_en ?? ''),
      text_it: String(item.text_it ?? ''),
      text_en: String(item.text_en ?? ''),
    };
  });
}

function parseTechnology(raw: Record<string, unknown> | undefined): TechnologyContent {
  const d = defaultTechnology();
  if (!raw) return d;
  const itemsIt = raw.items_it as string[] | undefined;
  const itemsEn = raw.items_en as string[] | undefined;
  return {
    title_it: String(raw.title_it ?? d.title_it),
    title_en: String(raw.title_en ?? d.title_en),
    content_it: String(raw.content_it ?? d.content_it),
    content_en: String(raw.content_en ?? d.content_en),
    items_it: itemsIt?.length ? itemsIt : d.items_it,
    items_en: itemsEn?.length ? itemsEn : d.items_en,
  };
}

function BilingualField({
  label,
  valueIt,
  valueEn,
  onChangeIt,
  onChangeEn,
  multiline = false,
  rows = 3,
}: {
  label: string;
  valueIt: string;
  valueEn: string;
  onChangeIt: (value: string) => void;
  onChangeEn: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const Field = multiline ? 'textarea' : 'input';
  return (
    <div>
      <p className="label-field mb-2">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-muted">Italian</label>
          <Field
            className="input-field"
            rows={multiline ? rows : undefined}
            value={valueIt}
            onChange={(e) => onChangeIt(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-muted">English</label>
          <Field
            className="input-field"
            rows={multiline ? rows : undefined}
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

const AdminAboutPage: React.FC = () => {
  const [active, setActive] = useState<SectionKey>('mission');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [mission, setMission] = useState<MissionContent>(defaultMission());
  const [values, setValues] = useState<ValueItem[]>(defaultValues());
  const [history, setHistory] = useState<HistoryItem[]>(defaultHistory());
  const [technology, setTechnology] = useState<TechnologyContent>(defaultTechnology());

  const applySection = (key: SectionKey, content: Record<string, unknown> | undefined) => {
    if (key === 'mission') setMission(parseMission(content));
    if (key === 'values') setValues(parseValues(content));
    if (key === 'history') setHistory(parseHistory(content));
    if (key === 'technology') setTechnology(parseTechnology(content));
  };

  const load = async () => {
    setLoading(true);
    try {
      const data: AboutSection[] = await adminApi.getAbout();
      const map = Object.fromEntries(data.map((row) => [row.section_key, row.content]));
      for (const { key } of SECTIONS) {
        applySection(key, map[key] as Record<string, unknown> | undefined);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const buildContent = (key: SectionKey): Record<string, unknown> => {
    if (key === 'mission') return { ...mission };
    if (key === 'values') return { items: values };
    if (key === 'history') return { items: history };
    return {
      ...technology,
      items_it: technology.items_it.map((item) => item.trim()).filter(Boolean),
      items_en: technology.items_en.map((item) => item.trim()).filter(Boolean),
    };
  };

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      await adminApi.saveAbout(active, buildContent(active));
      setMsg('Saved successfully');
    } catch {
      setMsg('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateHistory = (index: number, patch: Partial<HistoryItem>) => {
    setHistory((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const updateValue = (index: number, patch: Partial<ValueItem>) => {
    setValues((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const updateTechItems = (lang: 'it' | 'en', items: string[]) => {
    setTechnology((prev) => (lang === 'it' ? { ...prev, items_it: items } : { ...prev, items_en: items }));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">About page</h1>
          <p className="admin-page-subtitle">Edit text in Italian and English — no technical format needed.</p>
        </div>
      </div>

      <div className="admin-view-toggle mb-6">
        {SECTIONS.map(({ key, label }) => (
          <button key={key} type="button" className={active === key ? 'active' : ''} onClick={() => setActive(key)}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="admin-card max-w-4xl space-y-6">
          {active === 'mission' && (
            <>
              <BilingualField
                label="Section title"
                valueIt={mission.title_it}
                valueEn={mission.title_en}
                onChangeIt={(v) => setMission({ ...mission, title_it: v })}
                onChangeEn={(v) => setMission({ ...mission, title_en: v })}
              />
              <BilingualField
                label="First paragraph"
                valueIt={mission.p1_it}
                valueEn={mission.p1_en}
                onChangeIt={(v) => setMission({ ...mission, p1_it: v })}
                onChangeEn={(v) => setMission({ ...mission, p1_en: v })}
                multiline
                rows={4}
              />
              <BilingualField
                label="Second paragraph"
                valueIt={mission.p2_it}
                valueEn={mission.p2_en}
                onChangeIt={(v) => setMission({ ...mission, p2_it: v })}
                onChangeEn={(v) => setMission({ ...mission, p2_en: v })}
                multiline
                rows={4}
              />
            </>
          )}

          {active === 'values' && (
            <div className="space-y-6">
              <p className="text-sm text-ink-muted">Edit the four core values shown on the About page.</p>
              {values.map((item, index) => (
                <div key={item.key} className="rounded-md border border-ink-soft/20 p-4">
                  <p className="mb-3 text-sm font-semibold text-brand-navy">
                    {VALUE_LABELS[item.key as (typeof VALUE_KEYS)[number]]}
                  </p>
                  <div className="space-y-4">
                    <BilingualField
                      label="Title"
                      valueIt={item.title_it}
                      valueEn={item.title_en}
                      onChangeIt={(v) => updateValue(index, { title_it: v })}
                      onChangeEn={(v) => updateValue(index, { title_en: v })}
                    />
                    <BilingualField
                      label="Description"
                      valueIt={item.desc_it}
                      valueEn={item.desc_en}
                      onChangeIt={(v) => updateValue(index, { desc_it: v })}
                      onChangeEn={(v) => updateValue(index, { desc_en: v })}
                      multiline
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {active === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-ink-muted">Timeline entries appear in order from top to bottom.</p>
                <button
                  type="button"
                  className="btn-navy flex items-center gap-1 px-3 py-2 text-sm"
                  onClick={() =>
                    setHistory((prev) => [
                      ...prev,
                      { year_it: '', year_en: '', title_it: '', title_en: '', text_it: '', text_en: '' },
                    ])
                  }
                >
                  <Plus size={16} /> Add entry
                </button>
              </div>
              {history.map((item, index) => (
                <div key={index} className="rounded-md border border-ink-soft/20 p-4">
                  {history.length > 1 && (
                    <div className="mb-4 flex justify-end">
                      <button
                        type="button"
                        className="admin-icon-btn text-red-600"
                        onClick={() => setHistory((prev) => prev.filter((_, i) => i !== index))}
                        aria-label="Remove entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  <div className="space-y-4">
                    <BilingualField
                      label="Year / label"
                      valueIt={item.year_it}
                      valueEn={item.year_en}
                      onChangeIt={(v) => updateHistory(index, { year_it: v })}
                      onChangeEn={(v) => updateHistory(index, { year_en: v })}
                    />
                    <BilingualField
                      label="Title"
                      valueIt={item.title_it}
                      valueEn={item.title_en}
                      onChangeIt={(v) => updateHistory(index, { title_it: v })}
                      onChangeEn={(v) => updateHistory(index, { title_en: v })}
                    />
                    <BilingualField
                      label="Description"
                      valueIt={item.text_it}
                      valueEn={item.text_en}
                      onChangeIt={(v) => updateHistory(index, { text_it: v })}
                      onChangeEn={(v) => updateHistory(index, { text_en: v })}
                      multiline
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {active === 'technology' && (
            <>
              <BilingualField
                label="Section title"
                valueIt={technology.title_it}
                valueEn={technology.title_en}
                onChangeIt={(v) => setTechnology({ ...technology, title_it: v })}
                onChangeEn={(v) => setTechnology({ ...technology, title_en: v })}
              />
              <BilingualField
                label="Intro paragraph"
                valueIt={technology.content_it}
                valueEn={technology.content_en}
                onChangeIt={(v) => setTechnology({ ...technology, content_it: v })}
                onChangeEn={(v) => setTechnology({ ...technology, content_en: v })}
                multiline
                rows={4}
              />
              <div className="grid gap-6 sm:grid-cols-2">
                {(['it', 'en'] as const).map((lang) => {
                  const items = lang === 'it' ? technology.items_it : technology.items_en;
                  return (
                    <div key={lang}>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="label-field mb-0">
                          Bullet points ({lang === 'it' ? 'Italian' : 'English'})
                        </p>
                        <button
                          type="button"
                          className="admin-icon-btn"
                          onClick={() => updateTechItems(lang, [...items, ''])}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {items.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              className="input-field"
                              value={item}
                              placeholder={`Item ${index + 1}`}
                              onChange={(e) => {
                                const next = [...items];
                                next[index] = e.target.value;
                                updateTechItems(lang, next);
                              }}
                            />
                            {items.length > 1 && (
                              <button
                                type="button"
                                className="admin-icon-btn shrink-0 text-red-600"
                                onClick={() => updateTechItems(lang, items.filter((_, i) => i !== index))}
                                aria-label="Remove item"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div className="flex items-center gap-3 border-t border-ink-soft/15 pt-4">
            <button type="button" className="btn-primary" disabled={saving} onClick={save}>
              {saving ? 'Saving…' : 'Save section'}
            </button>
            {msg && <span className="text-sm text-brand-cyan">{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAboutPage;
