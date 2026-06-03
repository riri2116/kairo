import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn';

const ORBS = [
  { top: '15%', left: '11%', size: 56, delay: '0s',   dur: '8s',  bg: 'radial-gradient(circle at 34% 28%, #ffffff 0%, #e2e8f8 42%, #ead4b6 100%)' },
  { top: '21%', left: '80%', size: 66, delay: '1.2s', dur: '9s',  bg: 'radial-gradient(circle at 32% 26%, #ffffff 0%, #f0e2c6 44%, #d9b98c 100%)' },
  { top: '40%', left: '25%', size: 40, delay: '0.6s', dur: '7s',  bg: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #dfe6f7 46%, #c9d4f0 100%)' },
  { top: '72%', left: '9%',  size: 60, delay: '1.8s', dur: '8.5s', bg: 'radial-gradient(circle at 34% 28%, #ffffff 0%, #e7ecf9 44%, #d7c0a0 100%)' },
  { top: '74%', left: '85%', size: 64, delay: '0.9s', dur: '9.5s', bg: 'radial-gradient(circle at 33% 27%, #ffffff 0%, #e9e2f3 42%, #cdd6f2 100%)' },
];

const STEPS = [
  { label: 'Reading your product context', desc: 'Kairo frames the question against your goals and constraints.' },
  { label: 'Simulating user reactions', desc: 'Synthetic users respond the way your real segments would.' },
  { label: 'Mapping the emotional journey', desc: 'Pinpointing where delight turns to friction across the flow.' },
  { label: 'Scoring impact & risk', desc: 'Weighing retention lift, effort, and downside together.' },
  { label: 'Drafting the recommendation', desc: 'A clear call — with the reasoning behind it.' },
];

const SAMPLE_PROMPT = 'Should we add AI onboarding to cut new-user drop-off?';

export default function AIDemo() {
  const [value, setValue] = useState('');
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState(0);
  const [complete, setComplete] = useState(false);
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const start = (e) => {
    if (e) e.preventDefault();
    if (started) return;
    setPrompt(value.trim() || SAMPLE_PROMPT);
    setStarted(true);
  };

  const reset = () => {
    setStarted(false);
    setActive(0);
    setComplete(false);
  };

  useEffect(() => {
    if (!started) return;
    if (active < STEPS.length) {
      const t = setTimeout(() => setActive((a) => a + 1), active === 0 ? 320 : 880);
      return () => clearTimeout(t);
    }
    if (!complete) {
      const t = setTimeout(() => setComplete(true), 720);
      return () => clearTimeout(t);
    }
  }, [started, active, complete]);

  return (
    <section className="aidemo-section">
      <div className="aidemo-panel">
        <svg className="aidemo-figure" viewBox="0 0 420 440" aria-hidden="true">
          <defs>
            <linearGradient id="aidemoBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eef2fb" />
              <stop offset="50%" stopColor="#e2e7f5" />
              <stop offset="100%" stopColor="#f3e7d1" />
            </linearGradient>
            <radialGradient id="aidemoHead" cx="42%" cy="34%" r="72%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="52%" stopColor="#e0e5f3" />
              <stop offset="100%" stopColor="#e9d4b6" />
            </radialGradient>
          </defs>
          <path d="M64 440 C64 312 128 262 210 262 C292 262 356 312 356 440 Z" fill="url(#aidemoBody)" />
          <ellipse cx="210" cy="132" rx="88" ry="100" fill="url(#aidemoHead)" />
        </svg>

        {ORBS.map((o, i) => (
          <span
            key={i}
            className="aidemo-orb"
            style={{
              top: o.top,
              left: o.left,
              width: o.size,
              height: o.size,
              background: o.bg,
              animationDelay: o.delay,
              animationDuration: o.dur,
            }}
          />
        ))}

        <div className="aidemo-content">
          {!started ? (
            <>
              <FadeIn>
                <p className="aidemo-eyebrow">AI Demo</p>
                <h2 className="aidemo-title">See Kairo simulate<br />your product decisions</h2>
              </FadeIn>

              <FadeIn delay={0.1}>
                <form className="aidemo-form" onSubmit={start}>
                  <input
                    className="aidemo-input"
                    type="text"
                    aria-label="Ask Kairo anything about your product"
                    placeholder="Ask Kairo anything about your product…"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <button className="aidemo-send" type="submit" aria-label="Ask Kairo">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                  </button>
                </form>

                <button className="btn btn-primary aidemo-start" type="button" onClick={start}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Start demo
                </button>
              </FadeIn>
            </>
          ) : (
            <div className="aidemo-run">
              <p className="aidemo-run-label">Kairo is thinking</p>
              <p className="aidemo-run-prompt">&ldquo;{prompt}&rdquo;</p>

              <div className="aidemo-steps">
                {STEPS.map((s, i) => {
                  const revealed = i < active;
                  const done = complete || i < active - 1;
                  const running = revealed && !done;
                  return (
                    <div key={i} className={`aidemo-step${revealed ? ' show' : ''}${done ? ' done' : ''}`}>
                      <div className="aidemo-step-icon">
                        {done ? (
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : running ? (
                          <span className="aidemo-spinner" />
                        ) : null}
                      </div>
                      <div className="aidemo-step-body">
                        <div className="aidemo-step-label">{s.label}</div>
                        <div className="aidemo-step-desc">{s.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {complete && (
                <div className="aidemo-cta">
                  <p className="aidemo-cta-note">
                    That&rsquo;s the shape of every Kairo run. Sign in to run the full simulation on your real product — with the data, charts, and recommendation in full.
                  </p>
                  <div className="aidemo-cta-row">
                    <button className="btn btn-primary aidemo-start" type="button" onClick={() => navigate('/dashboard/login')}>
                      Run the full simulation
                    </button>
                    <button className="aidemo-reset" type="button" onClick={reset}>
                      Ask something else
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
