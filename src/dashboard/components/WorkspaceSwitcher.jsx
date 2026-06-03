import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Check } from 'lucide-react';

const MOCK_WORKSPACES = [
  { id: '1', name: 'Acme Corp', plan: 'PRO', initials: 'AC' },
  { id: '2', name: 'Stealth Labs', plan: 'ENTERPRISE', initials: 'SL' },
];

export default function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(MOCK_WORKSPACES[0]);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="db-ws-switcher" ref={ref}>
      <button className="db-ws-trigger" onClick={() => setOpen(o => !o)}>
        <div className="db-ws-avatar">{active.initials}</div>
        <div className="db-ws-info">
          <div className="db-ws-name">{active.name}</div>
          <div className="db-ws-plan">{active.plan}</div>
        </div>
        <ChevronDown size={14} className="db-ws-chevron" style={{ transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.15s' }} />
      </button>

      {open && (
        <div className="db-ws-dropdown">
          {MOCK_WORKSPACES.map(ws => (
            <div
              key={ws.id}
              className={`db-ws-dropdown-item ${ws.id === active.id ? 'active' : ''}`}
              onClick={() => { setActive(ws); setOpen(false); }}
            >
              <div className="db-ws-avatar" style={{ width: 24, height: 24, fontSize: 10, borderRadius: 5 }}>{ws.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="db-ws-dropdown-item-name">{ws.name}</div>
                <div className="db-ws-dropdown-item-plan">{ws.plan}</div>
              </div>
              {ws.id === active.id && <Check size={13} style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />}
            </div>
          ))}
          <div className="db-ws-dropdown-sep" />
          <div className="db-ws-dropdown-action">
            <Plus size={14} />
            Create workspace
          </div>
        </div>
      )}
    </div>
  );
}
