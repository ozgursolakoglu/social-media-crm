import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { posts, platforms, schedules } from '../services/api';
import { Camera, Clock, Send, Instagram, Facebook } from 'lucide-react';

export default function Compose() {
  const [platformsList, setPlatforms] = useState([]);
  const [form, setForm] = useState({ caption: '', imageUrl: '', platformIds: [] });
  const [scheduling, setScheduling] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [recurrence, setRecurrence] = useState('none');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    platforms.list().then((res) => setPlatforms(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await posts.create({ caption: form.caption, imageUrl: form.imageUrl, platforms: form.platformIds });
      if (scheduling && scheduledAt && form.platformIds.length) {
        for (const pid of form.platformIds) {
          await schedules.create({ postId: res.data.id, platformId: pid, scheduledAt, recurrence });
        }
      }
      setMsg('Post created' + (scheduling ? ' and scheduled' : ''));
      setTimeout(() => navigate('/scheduled'), 1200);
    } catch {
      setMsg('Failed to create post');
    }
  };

  return (
    <div>
      <div className="page-title">Compose Post</div>
      <div className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="label">Caption <Camera size={16} style={{ marginLeft: '0.5rem', color: '#2563eb' }} /></div>
            <textarea className="textarea" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} placeholder="Write your post caption…" />
          </div>

          <div className="form-group">
            <div className="label">Image URL</div>
            <input className="input" type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" />
          </div>

          <div className="form-group">
            <div className="label">Select platforms</div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {platformsList.map((p) => (
                <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                  <input
                    type="checkbox"
                    checked={form.platformIds.includes(p.id)}
                    onChange={(e) => {
                      const ids = e.target.checked ? [...form.platformIds, p.id] : form.platformIds.filter((i) => i !== p.id);
                      setForm({ ...form, platformIds: ids });
                    }}
                  />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {p.type === 'instagram' ? <Instagram size={18} color="#2563eb" /> : <Facebook size={18} color="#2563eb" />}
                    {p.name}
                  </span>
                </label>
              ))}
              {platformsList.length === 0 && <p className="muted">No platforms connected. Go to Platforms page.</p>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <input type="checkbox" id="schedule" checked={scheduling} onChange={(e) => setScheduling(e.target.checked)} />
            <label htmlFor="schedule" style={{ fontWeight: 600, cursor: 'pointer' }}>
              Schedule for later (monthly recurrence available)
            </label>
          </div>

          {scheduling && (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <div className="label">Date & time <Clock size={16} style={{ marginLeft: '0.5rem', color: '#2563eb' }} /></div>
                <input className="input" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <div className="label">Recurrence</div>
                <select className="input" value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
                  <option value="none">None (one-time)</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          )}

          {msg && <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#d1fae5', color: '#065f46', borderRadius: '8px' }}>{msg}</div>}
          <button className="btn btn-primary" type="submit">
            <Send size={18} style={{ marginRight: '0.5rem' }} /> {scheduling ? 'Schedule post' : 'Create post'}
          </button>
        </form>
      </div>
    </div>
  );
}
