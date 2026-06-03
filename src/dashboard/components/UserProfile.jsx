import React, { useState, useRef, useEffect } from 'react';
import { Settings, HelpCircle, LogOut, User, ChevronsUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_USER = {
  name: 'Alice Chen',
  email: 'alice@kairo.ai',
  image: null,
};

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function UserProfile() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSignOut() {
    setOpen(false);
    navigate('/');
  }

  return (
    <div className="db-user-profile" ref={ref}>
      <button className="db-user-trigger" onClick={() => setOpen(o => !o)}>
        <div className="db-user-avatar">
          {MOCK_USER.image
            ? <img src={MOCK_USER.image} alt={MOCK_USER.name} />
            : getInitials(MOCK_USER.name)
          }
        </div>
        <span className="db-user-name">{MOCK_USER.name.split(' ')[0]}</span>
        <ChevronsUpDown size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
      </button>

      {open && (
        <div className="db-user-dropdown">
          <div className="db-user-dropdown-header">
            <div className="db-user-dropdown-name">{MOCK_USER.name}</div>
            <div className="db-user-dropdown-email">{MOCK_USER.email}</div>
          </div>

          <button className="db-user-dropdown-item" onClick={() => { setOpen(false); navigate('/dashboard/settings'); }}>
            <User size={14} />
            Profile
          </button>
          <button className="db-user-dropdown-item" onClick={() => { setOpen(false); navigate('/dashboard/settings'); }}>
            <Settings size={14} />
            Settings
          </button>
          <button className="db-user-dropdown-item">
            <HelpCircle size={14} />
            Help & Docs
          </button>

          <div className="db-user-dropdown-sep" />

          <button className="db-user-dropdown-item danger" onClick={handleSignOut}>
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
