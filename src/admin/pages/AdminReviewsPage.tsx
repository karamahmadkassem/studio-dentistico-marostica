import React, { useEffect, useState } from 'react';
import { adminApi } from '../../lib/api';
import type { Review } from '../../types/database';

const AdminReviewsPage: React.FC = () => {
  const [tab, setTab] = useState<'pending' | 'published' | 'archived'>('pending');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await adminApi.getReviews(tab);
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [tab]);

  const updateStatus = async (id: string, status: string) => {
    await adminApi.updateReview(id, { status });
    load();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reviews</h1>
      </div>

      <div className="admin-view-toggle mb-6">
        {(['pending', 'published', 'archived'] as const).map((t) => (
          <button key={t} type="button" className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="text-ink-muted">No reviews in this tab.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="admin-card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-ink">{r.name} · {'★'.repeat(r.rating)}</p>
                  <p className="text-sm text-ink-muted">{r.treatment_type} · {new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  {tab === 'pending' && (
                    <>
                      <button type="button" className="btn-primary text-sm" onClick={() => updateStatus(r.id, 'published')}>
                        Publish on site
                      </button>
                      <button type="button" className="btn-white border text-sm" onClick={() => updateStatus(r.id, 'archived')}>
                        Archive
                      </button>
                    </>
                  )}
                  {tab === 'published' && (
                    <button type="button" className="btn-white border text-sm" onClick={() => updateStatus(r.id, 'archived')}>
                      Archive
                    </button>
                  )}
                  {tab === 'archived' && (
                    <button type="button" className="btn-primary text-sm" onClick={() => updateStatus(r.id, 'published')}>
                      Restore & publish
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">&ldquo;{r.body}&rdquo;</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;
