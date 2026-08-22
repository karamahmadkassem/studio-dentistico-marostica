import React, { useEffect, useRef, useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { adminApi } from '../../lib/api';
import { DEFAULT_SERVICE_ICON, SERVICE_ICONS } from '../../config/serviceIcons';
import { generateUniqueSlug } from '../../lib/slugify';
import type { Service } from '../../types/database';

function parseDetails(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeServiceForEdit(service: Service): Partial<Service> {
  const detailsIt = parseDetails(service.details_it);
  const detailsEn = parseDetails(service.details_en);
  return {
    ...service,
    icon_key: service.icon_key || DEFAULT_SERVICE_ICON,
    details_it: detailsIt.length ? detailsIt : [''],
    details_en: detailsEn.length ? detailsEn : [''],
  };
}

const emptyService = (): Partial<Service> => ({
  icon_key: DEFAULT_SERVICE_ICON,
  title_it: '',
  title_en: '',
  description_it: '',
  description_en: '',
  details_it: [''],
  details_en: [''],
  published: true,
});

type DetailListProps = {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
};

const DetailListEditor: React.FC<DetailListProps> = ({ label, items, onChange }) => {
  const list = items.length ? items : [''];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="label-field mb-0">{label}</p>
        <button type="button" className="admin-icon-btn" onClick={() => onChange([...list, ''])}>
          <Plus size={16} />
        </button>
      </div>
      <div className="space-y-2">
        {list.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              className="input-field"
              value={item}
              placeholder={`Item ${index + 1}`}
              onChange={(e) => {
                const next = [...list];
                next[index] = e.target.value;
                onChange(next);
              }}
            />
            {list.length > 1 && (
              <button
                type="button"
                className="admin-icon-btn shrink-0 text-red-600"
                onClick={() => onChange(list.filter((_, i) => i !== index))}
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
};

type ServiceRowProps = {
  service: Service;
  onEdit: (service: Service) => void;
  onRemove: (id: string) => void;
};

const ServiceRow: React.FC<ServiceRowProps> = ({ service, onEdit, onRemove }) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      as="div"
      value={service}
      dragListener={false}
      dragControls={dragControls}
      className="admin-card admin-reorder-item flex items-center justify-between gap-4"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="admin-drag-handle"
          onPointerDown={(e) => dragControls.start(e)}
          aria-label={`Drag to reorder ${service.title_en}`}
        >
          <GripVertical size={18} />
        </button>
        <div className="min-w-0">
          <p className="font-semibold text-ink">{service.title_en}</p>
          <p className="text-sm text-ink-muted">{service.published ? 'Published' : 'Draft'}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button type="button" className="admin-icon-btn" onClick={() => onEdit(service)}>
          Edit
        </button>
        <button type="button" className="admin-icon-btn text-red-600" onClick={() => onRemove(service.id)}>
          <Trash2 size={16} />
        </button>
      </div>
    </Reorder.Item>
  );
};

const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const saveOrderTimer = useRef<number>();

  const load = async () => {
    setLoading(true);
    const data = await adminApi.getServices();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    return () => {
      if (saveOrderTimer.current) window.clearTimeout(saveOrderTimer.current);
    };
  }, []);

  const cleanDetails = (items: string[] | undefined) =>
    (items ?? []).map((item) => item.trim()).filter(Boolean);

  const save = async () => {
    if (!editing) return;
    const existingSlugs = services.map((s) => s.slug);
    const payload = {
      ...editing,
      slug: generateUniqueSlug(
        editing.title_en || editing.title_it || 'service',
        existingSlugs,
        editing.id ? editing.slug : undefined,
      ),
      icon_key: editing.icon_key || DEFAULT_SERVICE_ICON,
      details_it: cleanDetails(editing.details_it as string[]),
      details_en: cleanDetails(editing.details_en as string[]),
    };
    if (editing.id) {
      await adminApi.updateService(editing.id, payload);
    } else {
      await adminApi.createService({ ...payload, sort_order: services.length });
    }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await adminApi.deleteService(id);
    load();
  };

  const persistOrder = (next: Service[]) => {
    if (saveOrderTimer.current) window.clearTimeout(saveOrderTimer.current);
    saveOrderTimer.current = window.setTimeout(async () => {
      setReordering(true);
      try {
        await adminApi.reorderServices(next.map((s) => s.id));
      } catch {
        load();
      } finally {
        setReordering(false);
      }
    }, 250);
  };

  const handleReorder = (next: Service[]) => {
    setServices(next);
    persistOrder(next);
  };

  const updateDetails = (lang: 'it' | 'en', items: string[]) => {
    if (!editing) return;
    setEditing(lang === 'it' ? { ...editing, details_it: items } : { ...editing, details_en: items });
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Services</h1>
          <p className="admin-page-subtitle">
            Drag services to change their order on the website.
            {reordering && ' Saving order…'}
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setEditing(emptyService())}>
          <Plus size={16} /> Add service
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <Reorder.Group
          as="div"
          axis="y"
          values={services}
          onReorder={handleReorder}
          className="space-y-3"
        >
          {services.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              onEdit={(s) => setEditing(normalizeServiceForEdit(s))}
              onRemove={remove}
            />
          ))}
        </Reorder.Group>
      )}

      {editing && (
        <div className="admin-modal-overlay" onClick={() => setEditing(null)}>
          <div
            className="admin-modal admin-modal--wide max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="heading-section text-lg">{editing.id ? 'Edit service' : 'New service'}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-field">Icon</label>
                <div className="admin-icon-picker">
                  {SERVICE_ICONS.map(({ key, label, Icon }) => {
                    const selected = (editing.icon_key || DEFAULT_SERVICE_ICON) === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`admin-icon-option${selected ? ' admin-icon-option--selected' : ''}`}
                        onClick={() => setEditing({ ...editing, icon_key: key })}
                        aria-pressed={selected}
                        title={label}
                      >
                        <Icon size={22} className="text-brand-cyan" />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="label-field">Title IT</label>
                <input
                  className="input-field"
                  value={editing.title_it ?? ''}
                  onChange={(e) => setEditing({ ...editing, title_it: e.target.value })}
                />
              </div>
              <div>
                <label className="label-field">Title EN</label>
                <input
                  className="input-field"
                  value={editing.title_en ?? ''}
                  onChange={(e) => setEditing({ ...editing, title_en: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Description IT</label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={editing.description_it ?? ''}
                  onChange={(e) => setEditing({ ...editing, description_it: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Description EN</label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={editing.description_en ?? ''}
                  onChange={(e) => setEditing({ ...editing, description_en: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <DetailListEditor
                  label="Included treatments (Italian)"
                  items={(editing.details_it as string[]) ?? ['']}
                  onChange={(items) => updateDetails('it', items)}
                />
              </div>
              <div className="sm:col-span-2">
                <DetailListEditor
                  label="Included treatments (English)"
                  items={(editing.details_en as string[]) ?? ['']}
                  onChange={(items) => updateDetails('en', items)}
                />
              </div>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={editing.published ?? true}
                  onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                />
                Published
              </label>
            </div>
            <div className="mt-6 flex gap-2">
              <button type="button" className="btn-primary" onClick={save}>
                Save
              </button>
              <button type="button" className="btn-white border" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServicesPage;
