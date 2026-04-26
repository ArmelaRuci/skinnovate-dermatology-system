.page {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}
.bg {
  position: absolute; inset: 0; pointer-events: none;
}
.orb {
  position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
  width: 700px; height: 700px; border-radius: 50%;
  background: radial-gradient(circle, rgba(42,157,143,0.12) 0%, transparent 65%);
}
.card {
  position: relative; z-index: 1;
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 44px 40px;
  width: 100%; max-width: 440px;
  box-shadow: var(--shadow-lg);
}
.logo {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-heading);
  font-size: 1.3rem; font-weight: 600;
  color: var(--cream);
  margin-bottom: 32px;
}
.logo svg { color: var(--teal); }
.title {
  font-size: 1.8rem;
  font-family: var(--font-heading);
  color: var(--cream);
  margin-bottom: 6px;
}
.sub {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 32px;
}
.form { display: flex; flex-direction: column; gap: 18px; }
.twoCol {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
}
.passWrap { position: relative; }
.passWrap input { padding-right: 44px; }
.eyeBtn {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none;
  color: var(--text-muted); cursor: pointer;
  display: flex; align-items: center;
  transition: color 0.2s;
}
.eyeBtn:hover { color: var(--cream); }
.select {
  width: 100%;
  background: var(--surface-2);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  color: var(--text-primary);
  font-size: 0.92rem;
  font-family: var(--font-body);
  transition: border-color 0.2s;
}
.select:focus { outline: none; border-color: var(--teal); box-shadow: 0 0 0 3px rgba(42,157,143,0.15); }
.select option { background: var(--surface-2); }
.switchText {
  text-align: center;
  font-size: 0.88rem; color: var(--text-muted);
  margin-top: 24px; margin-bottom: 0;
}
.switchLink { color: var(--teal-light); font-weight: 500; }
.switchLink:hover { text-decoration: underline; }

/* Demo credentials box */
.demo {
  margin-top: 28px;
  padding: 16px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
.demoTitle {
  font-size: 0.75rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--text-muted); margin-bottom: 10px;
}
.demoGrid { display: flex; flex-direction: column; gap: 6px; }
.demoChip {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer; text-align: left;
  transition: border-color 0.2s, background 0.2s;
}
.demoChip:hover { border-color: var(--teal); background: var(--teal-dim); }
.demoRole  { font-size: 0.78rem; font-weight: 700; color: var(--teal-light); min-width: 68px; }
.demoEmail { font-size: 0.78rem; color: var(--text-muted); }

@media (max-width: 480px) {
  .card { padding: 32px 24px; }
  .twoCol { grid-template-columns: 1fr; }
}
