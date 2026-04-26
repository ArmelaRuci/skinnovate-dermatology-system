import { useState, useEffect } from 'react'
import { treatmentsApi } from '../../services/api'
import DashboardLayout from '../../components/common/DashboardLayout'
import { Card, SectionTitle, Empty, Button } from '../../components/common/UI'
import Spinner from '../../components/common/Spinner'
import { Activity, ChevronDown, ChevronUp, CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import styles from './TreatmentsPage.module.css'

const STATUS_COLOR = { active: 'badge-teal', completed: 'badge-success', paused: 'badge-gold', cancelled: 'badge-muted' }

function TreatmentCard({ treatment }) {
  const [expanded, setExpanded] = useState(false)
  const logs = treatment.progress_logs || []

  return (
    <Card className={styles.treatCard}>
      <div className={styles.treatHead}>
        <div className={styles.treatLeft}>
          <div className={styles.treatTitle}>{treatment.title}</div>
          <div className={styles.treatType}>{treatment.treatment_type || 'General'}</div>
        </div>
        <div className={styles.treatRight}>
          <span className={`badge ${STATUS_COLOR[treatment.status] || 'badge-muted'}`}>{treatment.status}</span>
          <div className={styles.treatDates}>
            <CalendarDays size={12}/>
            {format(new Date(treatment.start_date), 'MMM d, yyyy')}
            {treatment.end_date && ` – ${format(new Date(treatment.end_date), 'MMM d, yyyy')}`}
          </div>
        </div>
      </div>

      {treatment.description && (
        <p className={styles.treatDesc}>{treatment.description}</p>
      )}

      {/* Progress logs */}
      {logs.length > 0 && (
        <>
          <button className={styles.toggleLogs} onClick={() => setExpanded(p => !p)}>
            <Activity size={13}/> {logs.length} progress {logs.length === 1 ? 'log' : 'logs'}
            {expanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
          </button>
          {expanded && (
            <div className={styles.timeline}>
              {logs.map((log, i) => (
                <div key={log.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  {i < logs.length - 1 && <div className={styles.timelineLine}/>}
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineDate}>{format(new Date(log.logged_at), 'MMM d, yyyy · h:mm a')}</div>
                    {log.notes && <p className={styles.timelineNote}>{log.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  )
}

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState('active')

  useEffect(() => {
    treatmentsApi.my()
      .then(r => setTreatments(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? treatments : treatments.filter(t => t.status === filter)

  return (
    <DashboardLayout
      title="Treatment Plans"
      subtitle="Track your dermatology treatments and progress"
    >
      {/* Filter tabs */}
      <div className={styles.tabs}>
        {['active', 'completed', 'all'].map(f => (
          <button key={f} className={`${styles.tab} ${filter === f ? styles.tabActive : ''}`}
            onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading
        ? <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spinner size={40}/></div>
        : filtered.length === 0
        ? <Empty icon="💊"
            title={filter === 'active' ? 'No active treatments' : 'No treatments found'}
            description="Your dermatologist will create treatment plans after your consultation." />
        : <div className={styles.list}>
            {filtered.map(t => <TreatmentCard key={t.id} treatment={t} />)}
          </div>
      }
    </DashboardLayout>
  )
}
