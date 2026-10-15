import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Camera, Calendar, Clock, Layers, LogOut, Users } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: Mail },
    { to: '/compose', label: 'Compose Post', icon: Camera },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/scheduled', label: 'Scheduled', icon: Clock },
    { to: '/posts', label: 'All Posts', icon: Layers },
    { to: '/platforms', label: 'Platforms', icon: Users },
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/dashboard" className="brand" onClick={() => setOpen(false)}>
          Social Media <span style={{ color: '#2563eb' }}>CRM</span>
        </Link>
        <div className="nav-links">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
                <Icon size={18} />
                {l.label}
              </Link>
            );
          })}
          <button className="btn btn-danger" onClick={onLogout} style={{ padding: '0.55rem 1rem', fontSize: '0.95rem' }}>
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
