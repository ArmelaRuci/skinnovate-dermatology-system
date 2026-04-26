.page { min-height: 100vh; }

/* Hero */
.hero {
  position: relative; overflow: hidden;
  padding: calc(var(--nav-h) + 80px) 0 100px;
  min-height: 100vh;
  display: flex; align-items: center;
}
.heroBg { position: absolute; inset: 0; pointer-events: none; }
.orb1 {
  position: absolute; top: -200px; left: -100px;
  width: 700px; height: 700px; border-radius: 50%;
  background: radial-gradient(circle, rgba(42,157,143,0.14) 0%, transparent 70%);
}
.orb2 {
  position: absolute; bottom: -300px; right: -150px;
  width: 800px; height: 800px; border-radius: 50%;
  background: radial-gradient(circle, rgba(233,196,106,0.08) 0%, transparent 70%);
}
.grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%);
}
.heroInner { position: relative; max-width: 760px; }
.heroBadge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 14px; border-radius: 100px;
  background: var(--teal-dim); color: var(--teal-light);
  border: 1px solid rgba(42,157,143,0.3);
  font-size: 0.78rem; font-weight: 600; letter-spacing: 0.04em;
  text-transform: uppercase; margin-bottom: 28px;
}
.heroTitle {
  margin-bottom: 24px;
  font-size: clamp(2.8rem, 6vw, 4.6rem);
  line-height: 1.1;
}
.heroAccent { color: var(--teal-light); }
.heroDesc {
  font-size: 1.1rem; color: var(--text-secondary);
  max-width: 520px; line-height: 1.7; margin-bottom: 40px;
}
.heroCta { display: flex; gap: 16px; flex-wrap: wrap; }
.ctaPrimary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 28px; border-radius: var(--radius-sm);
  background: var(--teal); color: #fff;
  font-weight: 600; font-size: 0.95rem;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(42,157,143,0.35);
}
.ctaPrimary:hover { background: var(--teal-light); transform: translateY(-2px); box-shadow: 0 6px 28px rgba(42,157,143,0.5); }
.ctaSecondary {
  display: inline-flex; align-items: center;
  padding: 13px 28px; border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.06); color: var(--text-secondary);
  border: 1px solid var(--border-light); font-weight: 500; font-size: 0.95rem;
  transition: all 0.2s;
}
.ctaSecondary:hover { background: rgba(255,255,255,0.1); color: var(--cream); }

/* Ticker */
.ticker {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 14px 0;
  display: flex; align-items: center; gap: 20px;
  overflow: hidden;
  background: var(--surface-1);
}
.tickerLabel {
  padding: 0 24px;
  font-size: 0.75rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--teal); white-space: nowrap; flex-shrink: 0;
}
.tickerTrack {
  display: flex; gap: 36px;
  animation: ticker 20s linear infinite;
  white-space: nowrap;
}
.tickerItem { color: var(--text-muted); font-size: 0.88rem; font-weight: 500; }
@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* Features */
.features { padding: 100px 0; }
.featuresHead { text-align: center; max-width: 600px; margin: 0 auto 56px; }
.featuresHead h2 { margin-bottom: 16px; }
.featuresHead p  { font-size: 1rem; color: var(--text-secondary); }
.featuresGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
.featureCard {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  transition: border-color 0.2s, transform 0.2s;
}
.featureCard:hover { border-color: var(--teal); transform: translateY(-3px); }
.featureIcon { color: var(--teal); margin-bottom: 16px; }
.featureCard h4 { font-size: 1.05rem; color: var(--cream); margin-bottom: 8px; font-family: var(--font-body); font-weight: 600; }
.featureCard p  { font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6; }

/* How it works */
.flow { padding: 80px 0 100px; background: var(--surface-1); border-top: 1px solid var(--border); }
.flowTitle { text-align: center; margin-bottom: 56px; }
.flowSteps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px; position: relative;
}
.flowStep {
  position: relative; text-align: center;
  padding: 32px 24px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
.flowNum {
  font-family: var(--font-heading);
  font-size: 3rem; font-weight: 700;
  color: var(--teal-dim); line-height: 1;
  margin-bottom: 12px;
  background: linear-gradient(135deg, var(--teal) 0%, transparent 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.flowStep h4 { font-size: 1rem; color: var(--cream); margin-bottom: 8px; font-family: var(--font-body); font-weight: 600; }
.flowStep p  { font-size: 0.84rem; color: var(--text-muted); margin: 0; }
.flowArrow {
  display: none;
  position: absolute; right: -14px; top: 50%; transform: translateY(-50%);
  color: var(--teal); z-index: 1;
}
@media (min-width: 900px) { .flowArrow { display: flex; } }

/* CTA strip */
.ctaStrip {
  padding: 80px 0;
  text-align: center;
  background: linear-gradient(135deg, var(--navy-mid) 0%, var(--navy-light) 100%);
  border-top: 1px solid var(--border);
}
.ctaStrip h2 { margin-bottom: 12px; }
.ctaStrip p  { color: var(--text-secondary); font-size: 1rem; }

/* Footer */
.footer {
  border-top: 1px solid var(--border);
  padding: 28px 0;
  background: var(--surface-1);
}
.footerInner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.footerLogo  { display: flex; align-items: center; gap: 8px; font-family: var(--font-heading); font-size: 1.1rem; color: var(--cream); }
.footerNote  { font-size: 0.8rem; color: var(--text-muted); margin: 0; }
