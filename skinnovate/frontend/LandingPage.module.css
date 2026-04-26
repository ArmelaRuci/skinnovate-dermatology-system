import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../services/api'
import DashboardLayout from '../../components/common/DashboardLayout'
import { Card, StatCard, SectionTitle, Button, Empty } from '../../components/common/UI'
import Spinner from '../../components/common/Spinner'
import { Users, Calendar, Brain, ShieldCheck, ChevronRight, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null)
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.pendingAppointments()])
      .then(([s, p]) => {
        setStats(s.data.data)
        setPending(p.data.data?.slice(0, 6) || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout title="Admin Dashboard"><div style={{ display:'flex', justifyContent:'center', padding:80 }}><Spinner size={40}/></div></DashboardLayout>

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Platform overview and operations">
      {/* Stats */}
      <div className={styles.statsRow}>
        <StatCard label="Total Patients"    value={stats?.total_patients        || 0} icon={<Users size={22}/>}      accent="teal" />
        <StatCard label="Total Appointments" value={stats?.total_appointments   || 0} icon={<Calendar size={22}/>}   accent="gold" />
        <StatCard label="AI Analyses"        value={stats?.total_analyses       || 0} icon={<Brain size={22}/>}       accent="teal" />
        <StatCard label="Pending Validations" value={stats?.unvalidated_diagnoses|| 0} icon={<ShieldCheck size={22}/>} accent="rose"
          sublabel={stats?.unvalidated_diagnoses > 0 ? 'Need doctor review' : 'All validated'} />
      </div>

      {/* Alerts */}
      {stats?.pending_appointments > 0 && (
        <div className={styles.alertBanner}>
          <AlertTriangle size={16}/>
          <span><strong>{stats.pending_appointments}</strong> appointments are pending confirmation.</span>
          <Link to="/admin/users"><Button size="sm" variant="secondary">Review</Button></Link>
        </div>
      )}

      <div className={styles.grid2}>
        {/* Pending appointments */}
        <div>
          <SectionTitle sub="Requests awaiting assignment">Pending Appointments</SectionTitle>
          {pending.length === 0
            ? <Empty icon="✅" title="No pending appointments" />
            : <div className={styles.list}>
                {pending.map(a => (
                  <Card key={a.id} className={styles.pendingCard}>
                    <div className={styles.pendingLeft}>
                      <div className={styles.pendingDate}>
                        <span>{format(new Date(a.scheduled_at), 'd')}</span>
                        <span>{format(new Date(a.scheduled_at), 'MMM')}</span>
                      </div>
                    </div>
                    <div className={styles.pendingMid}>
                      <div className={styles.pendingName}>{a.patient_name || 'Patient'}</div>
                      <div className={styles.pendingMeta}>
                        {format(new Date(a.scheduled_at), 'h:mm a')} · {a.appointment_type?.replace('_',' ')}
                      </div>
                      {a.reason && <div className={styles.pendingReason}>{a.reason}</div>}
                    </div>
                    <div className={styles.pendingRight}>
                      <span className={`badge badge-${a.status === 'requested' ? 'gold' : 'teal'}`}>{a.status}</span>
                      {a.is_emergency && <span className="badge badge-danger"><AlertTriangle size={10}/></span>}
                    </div>
                  </Card>
                ))}
              </div>
          }
        </div>

        {/* Quick links */}
        <div>
          <SectionTitle sub="Common admin tasks">Quick Actions</SectionTitle>
          <div className={styles.quickLinks}>
            {[
              { to: '/admin/users?role=patient',       icon: <Users size={20}/>,      label: 'Manage Patients',       sub: `${stats?.total_patients || 0} registered` },
              { to: '/admin/users?role=dermatologist',  icon: <ShieldCheck size={20}/>, label: 'Manage Doctors',        sub: 'Verify licenses' },
              { to: '/admin/users',                    icon: <Brain size={20}/>,       label: 'All Users',             sub: 'Full user list' },
            ].map(l => (
              <Link key={l.to} to={l.to}>
                <Card hover className={styles.quickCard}>
                  <div className={styles.quickIcon}>{l.icon}</div>
                  <div className={styles.quickInfo}>
                    <div className={styles.quickLabel}>{l.label}</div>
                    <div className={styles.quickSub}>{l.sub}</div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
