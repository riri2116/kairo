import React from 'react';
import { BarChart2, TrendingUp } from 'lucide-react';

const PREDICTIONS = [
  { title: 'MAU Growth — Q3 2025',  type: 'USER_GROWTH', confidence: 78, value: '18,500 MAU',  horizon: '90 days' },
  { title: 'MRR Forecast — 1 Year', type: 'REVENUE',     confidence: 71, value: '$320k MRR',   horizon: '1 year'  },
  { title: 'D30 Retention',         type: 'RETENTION',   confidence: 85, value: '58%',          horizon: '30 days' },
];

const TYPE_COLOR = { USER_GROWTH: '#6366f1', REVENUE: '#22c55e', RETENTION: '#f97316', CHURN: '#ef4444' };

export default function AnalyticsPage() {
  return (
    <>
      <div className="db-page-header">
        <h1 className="db-page-title">Analytics</h1>
        <p className="db-page-subtitle">AI-powered predictions and product metrics</p>
      </div>
      <div className="db-stats-grid" style={{ marginBottom: 24 }}>
        {[['Avg Confidence', '78%'], ['Predictions Active', '3'], ['Forecasting Horizon', '1yr'], ['Models Used', 'v2.1']].map(([label, value]) => (
          <div key={label} className="db-stat-card">
            <div className="db-stat-label">{label}</div>
            <div className="db-stat-value" style={{ fontSize: 24 }}>{value}</div>
          </div>
        ))}
      </div>
      <div className="db-card">
        <div className="db-card-header">
          <span className="db-card-title">Active Predictions</span>
        </div>
        {PREDICTIONS.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < PREDICTIONS.length - 1 ? '1px solid #F6F5F2' : 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: `${TYPE_COLOR[p.type]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TrendingUp size={16} color={TYPE_COLOR[p.type]} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 550, color: '#111', marginBottom: 3 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: '#aaa' }}>{p.horizon} horizon</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, color: '#111', lineHeight: 1 }}>{p.value}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{p.confidence}% confidence</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
