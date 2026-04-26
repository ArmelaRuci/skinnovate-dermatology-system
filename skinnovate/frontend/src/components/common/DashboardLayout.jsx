import Navbar from './Navbar'
import styles from './DashboardLayout.module.css'

export default function DashboardLayout({ children, title, subtitle, actions }) {
  return (
    <div className={styles.shell}>
      <Navbar />
      <main className={styles.main}>
        {(title || actions) && (
          <div className={styles.pageHeader}>
            <div>
              {title && <h1 className={styles.pageTitle}>{title}</h1>}
              {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}
