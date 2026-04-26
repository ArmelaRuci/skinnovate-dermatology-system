import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Activity, Eye, EyeOff } from 'lucide-react'
import { Button, FormField, Input } from '../../components/common/UI'
import toast from 'react-hot-toast'
import styles from './AuthPages.module.css'

export function LoginPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      const map  = { patient: '/dashboard', dermatologist: '/doctor', admin: '/admin' }
      navigate(map[user.role] || '/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg}><div className={styles.orb} /></div>
      <div className={styles.card}>
        <Link to="/" className={styles.logo}><Activity size={20} /> Skinnovate</Link>
        <h2 className={styles.title}>Welcome back</h2>
        <p className={styles.sub}>Sign in to your account</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <FormField label="Email" required>
            <Input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </FormField>
          <FormField label="Password" required>
            <div className={styles.passWrap}>
              <Input type={show ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={set('password')} required />
              <button type="button" className={styles.eyeBtn} onClick={() => setShow(p => !p)}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>
          <Button type="submit" loading={loading} fullWidth size="lg">Sign in</Button>
        </form>

        <p className={styles.switchText}>
          No account? <Link to="/register" className={styles.switchLink}>Create one</Link>
        </p>

        <div className={styles.demo}>
          <p className={styles.demoTitle}>Demo credentials</p>
          <div className={styles.demoGrid}>
            {[
              { role: 'Patient',  email: 'patient@skinnovate.com',    pass: 'Patient1234!' },
              { role: 'Doctor',   email: 'doctor@skinnovate.com',     pass: 'Doctor1234!' },
              { role: 'Admin',    email: 'admin@skinnovate.com',      pass: 'Admin1234!' },
            ].map(d => (
              <button
                key={d.role}
                className={styles.demoChip}
                onClick={() => setForm({ email: d.email, password: d.pass })}
              >
                <span className={styles.demoRole}>{d.role}</span>
                <span className={styles.demoEmail}>{d.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate      = useNavigate()
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirmPassword: '',
    role: 'patient', license_number: '', skin_type: '',
  })
  const [loading, setLoading] = useState(false)

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }

    setLoading(true)
    try {
      const user = await register(form)
      const map  = { patient: '/dashboard', dermatologist: '/doctor', admin: '/admin' }
      toast.success('Account created!')
      navigate(map[user.role] || '/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg}><div className={styles.orb} /></div>
      <div className={styles.card} style={{ maxWidth: 520 }}>
        <Link to="/" className={styles.logo}><Activity size={20} /> Skinnovate</Link>
        <h2 className={styles.title}>Create account</h2>
        <p className={styles.sub}>Join Skinnovate today</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <FormField label="Full Name" required>
            <Input placeholder="Jane Doe" value={form.full_name} onChange={set('full_name')} required />
          </FormField>
          <FormField label="Email" required>
            <Input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </FormField>
          <FormField label="Role" required>
            <select className={styles.select} value={form.role} onChange={set('role')}>
              <option value="patient">Patient</option>
              <option value="dermatologist">Dermatologist</option>
            </select>
          </FormField>
          {form.role === 'dermatologist' && (
            <FormField label="License Number" required>
              <Input placeholder="DERM-2024-XXX" value={form.license_number} onChange={set('license_number')} required />
            </FormField>
          )}
          {form.role === 'patient' && (
            <FormField label="Skin Type">
              <select className={styles.select} value={form.skin_type} onChange={set('skin_type')}>
                <option value="">Select skin type</option>
                <option value="normal">Normal</option>
                <option value="oily">Oily</option>
                <option value="dry">Dry</option>
                <option value="combination">Combination</option>
                <option value="sensitive">Sensitive</option>
              </select>
            </FormField>
          )}
          <div className={styles.twoCol}>
            <FormField label="Password" required>
              <Input type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
            </FormField>
            <FormField label="Confirm Password" required>
              <Input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set('confirmPassword')} required />
            </FormField>
          </div>
          <Button type="submit" loading={loading} fullWidth size="lg">Create Account</Button>
        </form>

        <p className={styles.switchText}>
          Already have an account? <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
