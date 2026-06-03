import React from 'react';
import { Brain, Play, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';

const SIMULATIONS = [
  { name: 'AI Flashcard Launch Impact', status: 'COMPLETED', confidence: 82, risk: 'MEDIUM', time: '2 days ago' },
  { name: 'Offline Mode Feasibility',   status: 'COMPLETED', confidence: 74, risk: 'LOW',    time: '5 days ago' },
  { name: 'Gamification Rollout',       status: 'PENDING',   confidence: null, risk: null,   time: 'Queued'     },
];

const STATUS_CONFIG = {
  COMPLETED: { icon: CheckCircle, color: '#22c55e', label: 'Completed' },
  RUNNING:   { icon: Play,        color: '#6366f1', label: 'Running'   },
  PENDING:   { icon: Clock,       color: '#f59e0b', label: 'Pending'   },
  FAILED:    { icon: AlertCircle, color: '#ef4444', label: 'Failed'    },
};

const RISK_COLOR = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#ef4444', CRITICAL: '#7f1d1d' };

export default function ProductBrainPage() {
  return (
    <>
      <div className="db-page-header">
        <h1 className="db-page-title">Product Brain</h1>
        <p className="db-page-subtitle">AI-powered simulations and behavioral predictions</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 550, cursor: 'pointer', letterSpacing: '-0.01em' }}>
          <Plus size={14} /> New Simulation
        </button>
      </div>

      <div className="db-card">
        <div className="db-card-header">
          <span className="db-card-title">Simulations</span>
          <span style={{ fontSize: 12, color: '#999' }}>{SIMULATIONS.length} total</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {SIMULATIONS.map((sim, i) => {
            const cfg = STATUS_CONFIG[sim.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < SIMULATIONS.length - 1 ? '1px solid #F6F5F2' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: '#F6F5F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Brain size={16} color="#888" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 550, color: '#111', marginBottom: 2, letterSpacing: '-0.01em' }}>{sim.name}</div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: cfg.color, fontWeight: 500 }}>
                      <StatusIcon size={11} />{cfg.label}
                    </span>
                    {sim.risk && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: RISK_COLOR[sim.risk], background: `${RISK_COLOR[sim.risk]}18`, padding: '2px 7px', borderRadius: 100 }}>
                        {sim.risk}
                      </span>
                    )}
                  </div>
                </div>
                {sim.confidence != null && (
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 20, fontFamily: 'Instrument Serif, serif', color: '#111', lineHeight: 1 }}>{sim.confidence}%</div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>confidence</div>
                  </div>
                )}
                <div style={{ fontSize: 12, color: '#bbb', flexShrink: 0, minWidth: 70, textAlign: 'right' }}>{sim.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
