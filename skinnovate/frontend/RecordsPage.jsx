import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { analysisApi, appointmentsApi, treatmentsApi } from '../../services/api'
import DashboardLayout from '../../components/common/DashboardLayout'
import { Card, StatCard, Button, Empty, SectionTitle } from '../../components/common/UI'
import Spinner from '../../components/common/Spinner'
import { Brain, Calendar, FileText, Activity, ChevronRight, Clock, Award } from 'lucide-react'
import { format } from 'date-fns'
import styles from './PatientDashboard.module.css'

function severityBadge(s) {
  const map = { high: 'badge badge-danger', medium: 'badge badge-gold', low: 'badge badge-teal' }
  return map[s] || 'badge badge-muted'
}

function statusBadge(s) {
  const map = {
    scheduled: 'badge badge-teal', requested: 'badge badge-gold',
    completed: 'badge badge-success', cancelled: 'badge badge-danger',
    in_progress: 'badge badge-teal',
  }
  return map[s] || 'badge badge-muted'
}

export default function PatientDashboard() {
  const { user } = useAuth()
  const [analyses,     setAnalyses]     = useState([])
  const [appointments, setAppointments] = useState([])
  const [treatments,   setTreatments]   = useState([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    Promise.all([
      analysisApi.history(),
      appointmentsApi.list({ status: 'scheduled' }),
      treatmentsApi.my(),
    ]).then(([a, ap, t]) => {
      setAnalyses(a.data.data?.slice(0, 4) || [])
      setAppointments(ap.data.data?.slice(0, 3) || [])
      setTreatments(t.data.data?.filter(x => x.status === 'active').slice(0, 3) || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><div style={{display:'flex',justifyContent:'center',padding:'80px'}}><Spinner size={40}/></div></DashboardLayout>

  const unvalidated = analyses.filter(a => a.diagnosis && a.diagnosis.doctor_confirmed === null).length
  const activeAppts = appointments.length
  const loyalty     = user?.profile?.loyalty_points || 0

  return (
    <DashboardLayout
      title={`Good day, ${user?.full_name?.split(' ')[0]}.`}
      subtitle="Here's an overview of your skin health"
    >
      {/* Stats row */}
      <div className={styles.statsRow}>
        <StatCard label="AI Analyses"       value={analyses.length}    icon={<Brain size={22}/>}    accent="teal" />
        <StatCard label="Appointments"       value={activeAppts}        icon={<Calendar size={22}/>} accent="gold" />
        <StatCard label="Active Treatments"  value={treatments.length}  icon={<Activity size={22}/>} accent="teal" />
        <StatCard label="Loyalty Points"     value={loyalty}            icon={<Award size={22}/>}    accent="gold" sublabel="+5 per analysis" />
      </div>

      {/* CTA banner when no analyses */}
      {analyses.length === 0 && (
        <Card className={`${styles.ctaBanner} fade-up`}>
          <div>
            <h3 className={styles.ctaTitle}>Run your first AI skin analysis</h3>
            <p className={styles.ctaDesc}>Upload a photo and get an instant diagnosis in under 5 seconds.</p>
          </div>
          <Link to="/analysis"><Button icon={<Brain size={16}/>}>Start Analysis</Button></Link>
        </Card>
      )}

      <div className={styles.grid2}>
        {/* Recent analyses */}
        <div>
          <SectionTitle sub="Latest AI results">Recent Analyses</SectionTitle>
          {analyses.length === 0
            ? <Empty icon="🔬" title="No analyses yet" description="Upload a skin image to get started." action={<Link to="/analysis"><Button size="sm">Upload Image</Button></Link>} />
            : <div className={styles.list}>
                {analyses.map(item => (
                  <Card key={item.id} hover className={styles.analysisItem}>
                    <div className={styles.analysisTop}>
                      <div>
                        <div className={styles.conditionName}>{item.diagnosis?.predicted_condition || 'Processing...'}</div>
                        <div className={styles.uploadDate}>{format(new Date(item.uploaded_at), 'MMM d, yyyy')}</div>
                      </div>
                      <div className={styles.analysisRight}>
                        {item.diagnosis && (
                          <>
                            <span className={severityBadge(item.diagnosis.severity)}>{item.diagnosis.severity}</span>
                            <div className={styles.confidence}>{Math.round((item.diagnosis.confidence_score || 0) * 100)}%</div>
                          </>
                        )}
                      </div>
                    </div>
                    {item.diagnosis && (
                      <div className={styles.validStatus}>
                        {item.diagnosis.doctor_confirmed === null
                          ? <span className="badge badge-gold"><Clock size={11}/> Awaiting doctor review</span>
                          : item.diagnosis.doctor_confirmed
                          ? <span className="badge badge-success">✓ Doctor validated</span>
                          : <span className="badge badge-muted">Modified by doctor</span>
                        }
                      </div>
                    )}
                  </Card>
                ))}
                <Link to="/analysis" className={styles.viewAll}>View all analyses <ChevronRight size={15}/></Link>
              </div>
          }
        </div>

        {/* Upcoming appointments */}
        <div>
          <SectionTitle sub="Your scheduled visits">Upcoming Appointments</SectionTitle>
          {appointments.length === 0
            ? <Empty icon="📅" title="No upcoming appointments" action={<Link to="/appointments"><Button size="sm">Book Now</Button></Link>} />
            : <div className={styles.list}>
                {appointments.map(a => (
                  <Card key={a.id} className={styles.apptItem}>
                    <div className={styles.apptDate}>
                      <span className={styles.apptDay}>{format(new Date(a.scheduled_at), 'd')}</span>
                      <span className={styles.apptMonth}>{format(new Date(a.scheduled_at), 'MMM')}</span>
                    </div>
                    <div className={styles.apptInfo}>
                      <div className={styles.apptType}>{a.appointment_type?.replace('_', ' ')}</div>
                      <div className={styles.apptTime}><Clock size={12}/> {format(new Date(a.scheduled_at), 'h:mm a')}</div>
                      {a.reason && <div className={styles.apptReason}>{a.reason}</div>}
                    </div>
                    <span className={statusBadge(a.status)}>{a.status}</span>
                  </Card>
                ))}
                <Link to="/appointments" className={styles.viewAll}>Manage appointments <ChevronRight size={15}/></Link>
              </div>
          }
        </div>
      </div>

      {/* Active treatments */}
      {treatments.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <SectionTitle sub="Your current treatment plans">Active Treatments</SectionTitle>
          <div className={styles.treatmentsRow}>
            {treatments.map(t => (
              <Card key={t.id} hover className={styles.treatCard}>
                <div className={`badge badge-teal`} style={{ marginBottom: 10 }}>{t.treatment_type || 'General'}</div>
                <h4 className={styles.treatTitle}>{t.title}</h4>
                <p className={styles.treatDesc}>{t.description}</p>
                <div className={styles.treatMeta}>
                  Started {format(new Date(t.start_date), 'MMM d, yyyy')}
                </div>
              </Card>
            ))}
          </div>
          <Link to="/treatments" className={styles.viewAll} style={{ marginTop: 12 }}>View all treatments <ChevronRight size={15}/></Link>
        </div>
      )}
    </DashboardLayout>
  )
}
