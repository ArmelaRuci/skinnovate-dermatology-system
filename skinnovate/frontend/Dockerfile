/* ============================================================
   Skinnovate — Global Design System
   Aesthetic: Clinical luxury — deep navy, warm cream, teal accents
   Fonts: Cormorant Garamond (headings) + DM Sans (body)
   ============================================================ */

:root {
  /* Palette */
  --navy:        #0f1f2e;
  --navy-mid:    #162436;
  --navy-light:  #1e3448;
  --teal:        #2a9d8f;
  --teal-light:  #3bbfb0;
  --teal-dim:    rgba(42, 157, 143, 0.15);
  --cream:       #f5f0e8;
  --cream-dark:  #ede7d9;
  --gold:        #e9c46a;
  --gold-dim:    rgba(233, 196, 106, 0.18);
  --rose:        #e76f51;
  --rose-dim:    rgba(231, 111, 81, 0.15);
  --success:     #2ecc71;
  --warning:     #f39c12;
  --danger:      #e74c3c;
  --danger-dim:  rgba(231, 76, 60, 0.15);

  /* Surface */
  --bg:          #0c1a27;
  --surface-1:   #0f1f2e;
  --surface-2:   #162436;
  --surface-3:   #1e3448;
  --border:      rgba(255,255,255,0.08);
  --border-light:rgba(255,255,255,0.14);

  /* Text */
  --text-primary:   #f0ebe2;
  --text-secondary: rgba(240, 235, 226, 0.65);
  --text-muted:     rgba(240, 235, 226, 0.38);

  /* Typography */
  --font-heading: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;

  /* Spacing */
  --nav-h: 72px;
  --radius-sm:  6px;
  --radius-md:  12px;
  --radius-lg:  20px;
  --radius-xl:  32px;

  /* Shadows */
  --shadow-sm:  0 2px 8px rgba(0,0,0,0.3);
  --shadow-md:  0 8px 24px rgba(0,0,0,0.4);
  --shadow-lg:  0 20px 48px rgba(0,0,0,0.5);
  --glow-teal:  0 0 32px rgba(42,157,143,0.25);

  /* Transitions */
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Reset ─────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; font-size: 16px; }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text-primary);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

h1,h2,h3,h4,h5,h6 {
  font-family: var(--font-heading);
  font-weight: 600;
  line-height: 1.2;
  color: var(--cream);
}

h1 { font-size: clamp(2.4rem, 5vw, 4rem); }
h2 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); }
h3 { font-size: clamp(1.3rem, 2.5vw, 1.8rem); }
h4 { font-size: 1.2rem; }

p { color: var(--text-secondary); margin-bottom: 1rem; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
button { cursor: pointer; font-family: var(--font-body); }
input, select, textarea { font-family: var(--font-body); }

/* ── Scrollbar ─────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--surface-1); }
::-webkit-scrollbar-thumb { background: var(--navy-light); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--teal); }

/* ── Utility classes ───────────────────────────────────── */
.container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }

.badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 100px; font-size: 0.72rem;
  font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
}
.badge-teal    { background: var(--teal-dim);   color: var(--teal-light); }
.badge-gold    { background: var(--gold-dim);   color: var(--gold); }
.badge-rose    { background: var(--rose-dim);   color: var(--rose); }
.badge-danger  { background: var(--danger-dim); color: var(--danger); }
.badge-success { background: rgba(46,204,113,.15); color: var(--success); }
.badge-muted   { background: rgba(255,255,255,.07); color: var(--text-secondary); }

/* ── Animations ────────────────────────────────────────── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; } to { opacity: 1; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes pulse {
  0%,100% { opacity: 1; } 50% { opacity: 0.5; }
}
@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
}

.fade-up  { animation: fadeUp  0.55s var(--ease) both; }
.fade-in  { animation: fadeIn  0.4s  var(--ease) both; }

/* Stagger helpers */
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }

/* ── Skeleton loader ───────────────────────────────────── */
.skeleton {
  background: linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  border-radius: var(--radius-sm);
}
