import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { analysisApi, appointmentsApi } from '../../services/api'
import DashboardLayout from '../../components/common/DashboardLayout'
import { Card, StatCard, Button, SectionTitle, Empty } from '../../components/common/UI'
import Spinner from '../../components/common/Spinner'
import { Users, ClipboardList, CheckCircle, Clock, ChevronRight, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import styles from './DoctorDashboard.module.css'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [analyses,     setAnalyses]     = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    Promise.all([
      analysisApi.history(),
      appointmentsApi.list({ status: 'scheduled' }),
    ]).then(([a, ap]) => {
      setAnalyses(a.data.data || [])
      setAppointments(ap.data.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const pending    = analyses.filter(a => a.diagnosis?.doctor_confirmed === null)
  const validated  = analyses.filter(a => a.diagnosis?.doctor_confirmed !== null)
  const todayAppts = appointments.filter(a => {
    const d = new Date(a.scheduled_at)
    const n = new Date()
    return d.toDateString() === n.toDateString()
  })

  if (loading) return <DashboardLayout><div style={{ display:'flex', justifyContent:'center', padding:80 }}><Spinner size={40}/></div></DashboardLayout>

  return (
    <DashboardLayout
      title={`Dr. ${user?.full_name?.split(' ').slice(1).join(' ') || user?.full_name}`}
      subtitle="Your clinical dashboard"
    >
      <div className={styles.statsRow}>
        <StatCard label="Pending Reviews"    value={pending.length}    icon={<Clock size={22}/>}          accent="gold" sublabel="Awaiting your validation" />
        <StatCard label="Today's Appts"      value={todayAppts.length} icon={<ClipboardList size={22}/>}  accent="teal" />
        <StatCard label="Total Validated"    value={validated.length}  icon={<CheckCircle size={22}/>}    accent="teal" />
        <StatCard label="Upcoming"           value={appointments.length} icon={<Users size={22}/>}        accent="gold" />
      </div>

      <div className={styles.grid2}>
        {/* Pending AI reviews */}
        <div>
          <SectionTitle sub="AI analyses awaiting your confirmation">Pending Reviews</SectionTitle>
          {pending.length === 0
            ? <Empty icon="✅" title="All caught up" description="No analyses waiting for review." />
            : <div className={styles.list}>
                {pending.slice(0, 5).map(item => (
                  <Card key={item.id} hover className={styles.reviewItem}>
                    <div className={styles.reviewTop}>
                      <div>
                        <div className={styles.condName}>{item.diagnosis?.predicted_condition}</div>
                        <div className={styles.condMeta}>
                          {item.body_area && <span>{item.body_area} · </span>}
                          <span>{format(new Date(item.uploaded_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      <div className={styles.reviewRight}>
                        <span className={`badge badge-${item.diagnosis?.severity === 'high' ? 'danger' : item.diagnosis?.severity === 'medium' ? 'gold' : 'teal'}`}>
                          {item.diagnosis?.severity}
                        </span>
                        <span className={styles.confScore}>{Math.round((item.diagnosis?.confidence_score || 0) * 100)}%</span>
                      </div>
                    </div>
                    {item.diagnosis?.requires_consultation && (
                      <div className={styles.consultFlag}><AlertTriangle size={12}/> Consultation recommended</div>
                    )}
                    <div className={styles.reviewActions}>
                      <Link to={`/doctor/validate/${item.diagnosis?.id}`}>
                        <Button size="sm" icon={<CheckCircle size={13}/>}>Review</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
                {pending.length > 5 && (
                  <Link to="/doctor/queue" className={styles.viewAll}>
                    View all {pending.length} pending <ChevronRight size={15}/>
                  </Link>
                )}
              </div>
          }
        </div>

        {/* Today's appointments */}
        <div>
          <SectionTitle sub="Your schedule for today">Today's Appointments</SectionTitle>
          {appointments.length === 0
            ? <Empty icon="📅" title="No appointments scheduled" description="Your upcoming appointments will appear here." />
            : <div className={styles.list}>
                {appointments.slice(0, 5).map(a => (
                  <Card key={a.id} className={styles.apptItem}>
                    <div className={styles.apptTime}>
                      <span className={styles.apptHour}>{format(new Date(a.scheduled_at), 'h:mm')}</span>
                      <span className={styles.apptAmPm}>{format(new Date(a.scheduled_at), 'a')}</span>
                    </div>
                    <div className={styles.apptInfo}>
                      <div className={styles.patientName}>{a.patient_name || 'Patient'}</div>
                      <div className={styles.apptType}>{a.appointment_type?.replace('_',' ')} · {format(new Date(a.scheduled_at), 'MMM d')}</div>
                      {a.reason && <div className={styles.apptReason}>{a.reason}</div>}
                    </div>
                    {a.is_emergency && <span className="badge badge-danger"><AlertTriangle size={11}/></span>}
                  </Card>
                ))}
                <Link to="/doctor/schedule" className={styles.viewAll}>Full schedule <ChevronRight size={15}/></Link>
              </div>
          }
        </div>
      </div>
    </DashboardLayout>
  )
}
