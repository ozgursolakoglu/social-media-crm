import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { posts, schedules, platforms } from '../services/api';
import { Mail, Clock, Users, Camera } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ posts: 0, scheduled: 0, platforms: 0 });
  const [recent, setRecent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      let postsData = [];
      let schedulesData = [];
      let platformsData = [];

      try {
        const pRes = await posts.list();
        postsData = pRes.data || [];
      } catch {
        postsData = [];
      }
      try {
        const sRes = await schedules.list();
        schedulesData = sRes.data || [];
      } catch {
        schedulesData = [];
      }
      try {
        const plRes = await platforms.list();
        platformsData = plRes.data || [];
      } catch {
        platformsData = [];
      }

      setStats({
        posts: postsData.length,
        scheduled: schedulesData.length,
        platforms: platformsData.length,
      });
      setRecent(postsData.slice(0, 5));
    };
    load();
  }, []);

  return (
    <div>
      <div className="page-title">Dashboard</div>
      <div className="grid-4">
        <div className="card">
          <div className="muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={20} color="#2563eb" /> Posts
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem' }}>{stats.posts}</div>
        </div>
        <div className="card">
          <div className="muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="#2563eb" /> Scheduled posts
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem' }}>{stats.scheduled}</div>
        </div>
        <div className="card">
          <div className="muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="#2563eb" /> Connected platforms
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem' }}>{stats.platforms}</div>
        </div>
        <div className="card">
          <button className="btn btn-primary" onClick={() => navigate('/compose')}>
            <Camera size={20} style={{ marginRight: '0.5rem' }} /> New post
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 700 }}>Recent posts</div>
        </div>
        {recent.length === 0 ? (
          <p className="muted">No posts yet. Create your first post.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Caption</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((p) => (
                <tr key={p.id}>
                  <td>{p.caption}</td>
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
