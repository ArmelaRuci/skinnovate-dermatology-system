import styles from './UI.module.css'

/* ── Card ───────────────────────────────────────────────── */
export function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div
      className={`${styles.card} ${hover ? styles.cardHover : ''} ${className}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      {children}
    </div>
  )
}

/* ── Button ─────────────────────────────────────────────── */
export function Button({
  children, onClick, type = 'button',
  variant = 'primary', size = 'md',
  disabled = false, loading = false,
  className = '', fullWidth = false, icon,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${styles.btn} ${styles[`btn_${variant}`]} ${styles[`btn_${size}`]} ${fullWidth ? styles.btnFull : ''} ${className}`}
    >
      {loading
        ? <span className={styles.btnSpinner} />
        : <>
            {icon && <span className={styles.btnIcon}>{icon}</span>}
            {children}
          </>
      }
    </button>
  )
}

/* ── StatCard ───────────────────────────────────────────── */
export function StatCard({ label, value, icon, accent = 'teal', sublabel }) {
  return (
    <div className={`${styles.statCard} ${styles[`stat_${accent}`]}`}>
      {icon && <span className={styles.statIcon}>{icon}</span>}
      <div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
        {sublabel && <div className={styles.statSub}>{sublabel}</div>}
      </div>
    </div>
  )
}

/* ── Section divider ────────────────────────────────────── */
export function SectionTitle({ children, sub }) {
  return (
    <div className={styles.sectionTitle}>
      <h3>{children}</h3>
      {sub && <p>{sub}</p>}
    </div>
  )
}

/* ── Empty state ────────────────────────────────────────── */
export function Empty({ icon, title, description, action }) {
  return (
    <div className={styles.empty}>
      {icon && <div className={styles.emptyIcon}>{icon}</div>}
      <h4>{title}</h4>
      {description && <p>{description}</p>}
      {action && <div style={{ marginTop: '1.2rem' }}>{action}</div>}
    </div>
  )
}

/* ── FormField wrapper ──────────────────────────────────── */
export function FormField({ label, error, children, required }) {
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label}>
          {label}{required && <span className={styles.required}>*</span>}
        </label>
      )}
      {children}
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  )
}

/* ── Input ──────────────────────────────────────────────── */
export function Input({ error, ...props }) {
  return <input className={`${styles.input} ${error ? styles.inputError : ''}`} {...props} />
}

/* ── Select ─────────────────────────────────────────────── */
export function Select({ error, children, ...props }) {
  return (
    <select className={`${styles.input} ${error ? styles.inputError : ''}`} {...props}>
      {children}
    </select>
  )
}

/* ── Textarea ───────────────────────────────────────────── */
export function Textarea({ error, ...props }) {
  return <textarea className={`${styles.input} ${styles.textarea} ${error ? styles.inputError : ''}`} {...props} />
}
