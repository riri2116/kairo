import React from 'react';
import { X, Zap, Users, Target, Bell, CheckCheck } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'sim',
    title: 'Simulation Complete',
    message: '"AI Flashcard Launch Impact" completed with 82% confidence.',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'br',
    title: 'AI Boardroom Ready',
    message: 'Your debate on AI flashcard launch is ready. 3 champions, 1 cautious vote.',
    time: '14 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'comp',
    title: 'Competitor Alert',
    message: 'Quizlet launched a new AI feature. Impact analysis available.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: '4',
    type: 'team',
    title: 'Team Invitation',
    message: 'Carol Nair joined Acme Corp as a Member.',
    time: '3 hr ago',
    read: true,
  },
  {
    id: '5',
    type: 'sys',
    title: 'Prediction Updated',
    message: 'D30 Retention forecast revised to 58% (+4pp from last week).',
    time: '1 day ago',
    read: true,
  },
];

const ICON_MAP = {
  sim:  { Icon: Zap,    cls: 'sim'  },
  br:   { Icon: Users,  cls: 'br'   },
  comp: { Icon: Target, cls: 'comp' },
  team: { Icon: Users,  cls: 'team' },
  sys:  { Icon: Bell,   cls: 'sys'  },
};

export default function NotificationsPanel({ open, onClose }) {
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <>
      {open && <div className="db-notif-overlay" onClick={onClose} />}
      <div className={`db-notif-panel ${open ? 'open' : ''}`}>
        <div className="db-notif-panel-header">
          <div className="db-notif-panel-title">
            Notifications
            {unread > 0 && <span className="db-notif-count">{unread}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {unread > 0 && (
              <button className="db-notif-mark-all">
                <CheckCheck size={13} style={{ display: 'inline', marginRight: 4 }} />
                Mark all read
              </button>
            )}
            <button className="db-icon-btn" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="db-notif-list">
          {MOCK_NOTIFICATIONS.length === 0 ? (
            <div className="db-notif-empty">
              <Bell size={28} />
              <p>You're all caught up</p>
            </div>
          ) : (
            MOCK_NOTIFICATIONS.map(n => {
              const { Icon, cls } = ICON_MAP[n.type] || ICON_MAP.sys;
              return (
                <div key={n.id} className={`db-notif-item ${!n.read ? 'unread' : ''}`}>
                  <div className={`db-notif-icon-wrap ${cls}`}>
                    <Icon size={15} />
                  </div>
                  <div className="db-notif-body">
                    <div className="db-notif-title">{n.title}</div>
                    <div className="db-notif-msg">{n.message}</div>
                    <div className="db-notif-time">{n.time}</div>
                  </div>
                  {!n.read && <div className="db-notif-unread-dot" />}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
