import { useEffect, useState } from 'react';
import { schedules } from '../services/api';
import { Clock, Trash2 } from 'lucide-react';

export default function Scheduled() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schedules.list().then((res) => { setList(res.data); setLoading(false); });
  }, []);

  const remove = async (id) => {
    if (!window.confirm('Remove this scheduled post?')) return;
    await schedules.remove(id);
    setList(list.filter((s) => s.id !== id));
  };

  if (loading) return <div className="page-title">Loading scheduled posts…</div>;

  return (
    <div>
      <div className="page-title">Scheduled Posts</div>
      <div className="card">
        {list.length === 0 ? (
          <p className="muted">No scheduled posts. Create one from Compose.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Caption</th>
                <th>Platform</th>
                <th>Scheduled at</th>
                <th>Recurrence</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id}>
                  <td>{s.caption}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {s.type === 'instagram' ? <span style={{ color: '#2563eb' }}>IG</span> : <span style={{ color: '#1877f2' }}>FB</span>}
                      {s.platform_name}
                    </span>
                  </td>
                  <td>{new Date(s.scheduled_at).toLocaleString()}</td>
                  <td>{s.recurrence}</td>
                  <td><span className={`badge badge-${s.status}`}>{s.status}</span></td>
                  <td>
                    <button className="btn btn-danger" onClick={() => remove(s.id)} style={{ padding: '0.35rem 0.7rem', fontSize: '0.85rem' }}>
                      <Trash2 size={16} style={{ marginRight: '0.3rem' }} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
