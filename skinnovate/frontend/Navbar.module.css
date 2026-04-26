import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { analysisApi } from '../../services/api'
import DashboardLayout from '../../components/common/DashboardLayout'
import { Card, Button, SectionTitle, Empty } from '../../components/common/UI'
import Spinner from '../../components/common/Spinner'
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import styles from './PatientQueuePage.module.css'

export default function PatientQueuePage() {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('pending')

  useEffect(() => {
    analysisApi.history()
      .then(r => setItems(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(i => {
    if (!i.diagnosis) return false
    if (filter === 'pending')   return i.diagnosis.doctor_confirmed === null
    if (filter === 'validated') return i.diagnosis.doctor_confirmed !== null
    return true
  })

  return (
    <DashboardLayout
      title="Patient Queue"
      subtitle="AI analyses awaiting your review and validation"
    >
      <div className={styles.tabs}>
        {[['pending', 'Pending'], ['validated', 'Validated'], ['all', 'All']].map(([v, l]) => (
          <button key={v} className={`${styles.tab} ${filter === v ? styles.tabActive : ''}`} onClick={() => setFilter(v)}>
            {l} {v === 'pending' ? `(${items.filter(i => i.diagnosis?.doctor_confirmed === null).length})` : ''}
          </button>
        ))}
      </div>

      {loading
        ? <div style={{ display:'flex', justifyContent:'center', padding:60 }}><Spinner size={40}/></div>
        : filtered.length === 0
        ? <Empty icon="✅" title="Queue is clear" description="No analyses waiting for review." />
        : <div className={styles.grid}>
            {filtered.map(item => (
              <Card key={item.id} hover className={styles.queueCard}>
                <div className={styles.qTop}>
                  <div className={styles.qCondition}>{item.diagnosis?.predicted_condition}</div>
                  <span className={`badge badge-${item.diagnosis?.severity === 'high' ? 'danger' : item.diagnosis?.severity === 'medium' ? 'gold' : 'teal'}`}>
                    {item.diagnosis?.severity}
                  </span>
                </div>
                <div className={styles.qMeta}>
                  <span>{Math.round((item.diagnosis?.confidence_score || 0) * 100)}% confidence</span>
                  {item.body_area && <span>· {item.body_area}</span>}
                  <span>· {format(new Date(item.uploaded_at), 'MMM d, yyyy')}</span>
                </div>
                {item.diagnosis?.requires_consultation && (
                  <div className={styles.qFlag}><AlertTriangle size={12}/> Consultation required</div>
                )}
                <div className={styles.qStatus}>
                  {item.diagnosis?.doctor_confirmed === null
                    ? <span className="badge badge-gold"><Clock size={11}/> Pending review</span>
                    : item.diagnosis?.doctor_confirmed
                    ? <span className="badge badge-success"><CheckCircle size={11}/> Validated</span>
                    : <span className="badge badge-muted">Modified</span>
                  }
                </div>
                {item.diagnosis?.doctor_confirmed === null && (
                  <Link to={`/doctor/validate/${item.diagnosis?.id}`} style={{ marginTop: 12 }}>
                    <Button size="sm" fullWidth>Review & Validate</Button>
                  </Link>
                )}
              </Card>
            ))}
          </div>
      }
    </DashboardLayout>
  )
}
