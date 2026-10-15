import { useEffect, useState } from 'react';
import { posts } from '../services/api';
import { Camera } from 'lucide-react';

export default function Posts() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    posts.list().then((res) => { setList(res.data); setLoading(false); });
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div className="page-title">All Posts</div>
      </div>
      <div className="card">
        {loading ? <p>Loading…</p> : list.length === 0 ? (
          <p className="muted">No posts yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Caption</th><th>Image</th><th>Status</th><th>Created</th></tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>{p.caption}</td>
                  <td>{p.image_url ? <img src={p.image_url} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} /> : '—'}</td>
                  <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
