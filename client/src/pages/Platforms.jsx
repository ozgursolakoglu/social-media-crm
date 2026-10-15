import { useEffect, useState } from 'react';
import { platforms } from '../services/api';
import { Users, Instagram, Facebook, Save } from 'lucide-react';

export default function Platforms() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'instagram', accessToken: '', pageId: '', instagramAccountId: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    platforms.list().then((res) => setList(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await platforms.connect(form);
      setMsg('Platform connected');
      setForm({ name: '', type: 'instagram', accessToken: '', pageId: '', instagramAccountId: '' });
      platforms.list().then((res) => setList(res.data));
    } catch {
      setMsg('Failed to connect platform');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Remove this platform?')) return;
    await platforms.remove(id);
    setList(list.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="page-title">Connected Platforms</div>
      <div className="card" style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div className="form-group">
            <div className="label">Platform name <Users size={16} style={{ marginLeft: '0.5rem', color: '#2563eb' }} /></div>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. My Instagram Page" required />
          </div>
          <div className="form-group">
            <div className="label">Type</div>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="instagram"><Instagram size={18} style={{ marginRight: '0.5rem', color: '#2563eb' }} /> Instagram</option>
              <option value="facebook"><Facebook size={18} style={{ marginRight: '0.5rem', color: '#2563eb' }} /> Facebook</option>
            </select>
          </div>
          <div className="form-group">
            <div className="label">Meta access token</div>
            <input className="input" value={form.accessToken} onChange={(e) => setForm({ ...form, accessToken: e.target.value })} placeholder="Graph API access token" />
          </div>
          <div className="form-group">
            <div className="label">Page ID</div>
            <input className="input" value={form.pageId} onChange={(e) => setForm({ ...form, pageId: e.target.value })} placeholder="Facebook Page ID" />
          </div>
          <div className="form-group">
            <div className="label">Instagram account ID</div>
            <input className="input" value={form.instagramAccountId} onChange={(e) => setForm({ ...form, instagramAccountId: e.target.value })} placeholder="Instagram account ID" />
          </div>
          {msg && <div style={{ padding: '0.75rem', background: '#d1fae5', color: '#065f46', borderRadius: '8px' }}>{msg}</div>}
          <button className="btn btn-primary" type="submit"><Save size={18} style={{ marginRight: '0.5rem' }} /> Connect</button>
        </form>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Connected platforms</div>
        {list.length === 0 ? (
          <p className="muted">No platforms connected yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Type</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.type === 'instagram' ? <span style={{ color: '#2563eb' }}>Instagram</span> : <span style={{ color: '#1877f2' }}>Facebook</span>}</td>
                  <td><span className={`badge ${p.is_active ? 'badge-published' : 'badge-draft'}`}>{p.is_active ? 'active' : 'inactive'}</span></td>
                  <td>
                    <button className="btn btn-danger" onClick={() => remove(p.id)} style={{ padding: '0.35rem 0.7rem', fontSize: '0.85rem' }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="muted" style={{ marginTop: '0.5rem' }}>
        Note: To post live, add Meta Graph API publishing logic in server/routes/meta.js and server/services/metaPublisher.js.
      </p>
    </div>
  );
}
