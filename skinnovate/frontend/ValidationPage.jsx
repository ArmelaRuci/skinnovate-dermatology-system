import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { Activity, Brain, Calendar, Shield, ChevronRight, Zap, Eye, FileText } from 'lucide-react'
import styles from './LandingPage.module.css'

const FEATURES = [
  { icon: <Brain size={28} />, title: 'AI Skin Analysis', desc: 'Upload a photo and get instant AI-powered diagnosis with confidence scores in under 5 seconds.' },
  { icon: <Eye size={28} />, title: 'Doctor Validation', desc: 'Every AI result is reviewed and confirmed by board-certified dermatologists for accuracy.' },
  { icon: <Calendar size={28} />, title: 'Smart Scheduling', desc: 'Book in-person, video, or emergency appointments with real-time availability.' },
  { icon: <FileText size={28} />, title: 'Digital Health Records', desc: 'Securely access your full history — diagnoses, treatments, prescriptions — anytime.' },
  { icon: <Zap size={28} />, title: 'Treatment Tracking', desc: 'Follow your progress with a visual timeline of before/after images and notes.' },
  { icon: <Shield size={28} />, title: 'GDPR Compliant', desc: 'End-to-end encryption, role-based access, and full compliance with healthcare data laws.' },
]

const CONDITIONS = ['Acne', 'Eczema', 'Psoriasis', 'Rosacea', 'Melanoma Detection', 'Seborrheic Keratosis']

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.grid} />
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={`${styles.heroBadge} fade-up`}>
            <Activity size={13} />
            AI-Powered Dermatology Platform
          </div>
          <h1 className={`${styles.heroTitle} fade-up delay-1`}>
            Skin intelligence.<br />
            <span className={styles.heroAccent}>Doctor precision.</span>
          </h1>
          <p className={`${styles.heroDesc} fade-up delay-2`}>
            Upload a skin image, receive an instant AI diagnosis, and connect with
            certified dermatologists — all in one secure platform.
          </p>
          <div className={`${styles.heroCta} fade-up delay-3`}>
            <Link to="/register" className={styles.ctaPrimary}>
              Start Free Analysis <ChevronRight size={18} />
            </Link>
            <Link to="/login" className={styles.ctaSecondary}>Sign in</Link>
          </div>
        </div>
      </section>

      {/* Conditions ticker */}
      <div className={styles.ticker}>
        <div className={styles.tickerLabel}>Detects</div>
        <div className={styles.tickerTrack}>
          {[...CONDITIONS, ...CONDITIONS].map((c, i) => (
            <span key={i} className={styles.tickerItem}>{c}</span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.featuresHead}>
            <h2>Everything your skin needs,<br />in one place.</h2>
            <p>A complete clinical platform designed for patients, dermatologists, and clinic admins.</p>
          </div>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className={styles.flow}>
        <div className="container">
          <h2 className={styles.flowTitle}>How it works</h2>
          <div className={styles.flowSteps}>
            {[
              { n: '01', t: 'Upload Image', d: 'Take a close-up of the affected area and upload it securely.' },
              { n: '02', t: 'AI Analysis',  d: 'Our model returns a predicted condition and confidence score.' },
              { n: '03', t: 'Doctor Review',d: 'A dermatologist validates, modifies, or escalates the result.' },
              { n: '04', t: 'Treatment Plan',d: 'Receive a personalised plan with reminders and progress tracking.' },
            ].map((s, i) => (
              <div key={i} className={styles.flowStep}>
                <div className={styles.flowNum}>{s.n}</div>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
                {i < 3 && <div className={styles.flowArrow}><ChevronRight size={20} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className={styles.ctaStrip}>
        <div className="container">
          <h2>Ready to understand your skin?</h2>
          <p>Create a free account and get your first AI analysis in under 2 minutes.</p>
          <Link to="/register" className={styles.ctaPrimary} style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            Create Free Account <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <div className={styles.footerLogo}><Activity size={18} /> Skinnovate</div>
            <p className={styles.footerNote}>© 2025 Skinnovate. For educational purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
