import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, Activity, LogOut, User } from 'lucide-react'
import styles from './Navbar.module.css'

const NAV_LINKS = {
  public:        [{ to: '/', label: 'Home' }],
  patient:       [
    { to: '/dashboard',    label: 'Dashboard' },
    { to: '/analysis',     label: 'AI Analysis' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/records',      label: 'Records' },
    { to: '/treatments',   label: 'Treatments' },
  ],
  dermatologist: [
    { to: '/doctor',          label: 'Dashboard' },
    { to: '/doctor/queue',    label: 'Patient Queue' },
    { to: '/doctor/schedule', label: 'Schedule' },
  ],
  admin: [
    { to: '/admin',       label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
  ],
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate  = useNavigate()
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  const links = user ? (NAV_LINKS[user.role] || []) : NAV_LINKS.public

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.inner} container`}>
        {/* Logo */}
        <Link to={user ? (links[0]?.to || '/') : '/'} className={styles.logo}>
          <Activity size={22} strokeWidth={1.8} />
          <span>Skinnovate</span>
        </Link>

        {/* Desktop links */}
        <nav className={styles.links}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`${styles.link} ${location.pathname === l.to ? styles.active : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Auth area */}
        <div className={styles.auth}>
          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>
                <User size={15} />
                {user.full_name?.split(' ')[0]}
              </span>
              <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login"    className={styles.loginBtn}>Login</Link>
              <Link to="/register" className={styles.registerBtn}>Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className={styles.burger} onClick={() => setOpen(p => !p)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className={styles.drawer}>
          {links.map(l => (
            <Link key={l.to} to={l.to} className={styles.drawerLink}>{l.label}</Link>
          ))}
          {user
            ? <button className={styles.drawerLogout} onClick={handleLogout}>Logout</button>
            : <>
                <Link to="/login"    className={styles.drawerLink}>Login</Link>
                <Link to="/register" className={styles.drawerLink}>Register</Link>
              </>
          }
        </div>
      )}
    </header>
  )
}
