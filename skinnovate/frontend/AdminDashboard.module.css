import { useState, useEffect } from 'react'
import { recordsApi } from '../../services/api'
import DashboardLayout from '../../components/common/DashboardLayout'
import { Card, SectionTitle, Empty } from '../../components/common/UI'
import Spinner from '../../components/common/Spinner'
import { FileText, Pill, Image } from 'lucide-react'
import { format } from 'date-fns'
import styles from './RecordsPage.module.css'

export default function RecordsPage() {
  const [records,  setRecords]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState('notes')

  useEffect(() => {
    recordsApi.my()
      .then(r => setRecords(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <DashboardLayout title="Health Records">
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spinner size={40}/></div>
    </DashboardLayout>
  )

  const notes   = records?.medical_notes   || []
  const scripts = records?.prescriptions   || []

  return (
    <DashboardLayout
      title="Health Records"
      subtitle="Your complete medical history in one place"
    >
      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'notes' ? styles.tabActive : ''}`} onClick={() => setTab('notes')}>
          <FileText size={15}/> Medical Notes ({notes.length})
        </button>
        <button className={`${styles.tab} ${tab === 'prescriptions' ? styles.tabActive : ''}`} onClick={() => setTab('prescriptions')}>
          <Pill size={15}/> Prescriptions ({scripts.length})
        </button>
      </div>

      {tab === 'notes' && (
        <div>
          <SectionTitle sub="Written by your dermatologist after each visit">Medical Notes</SectionTitle>
          {notes.length === 0
            ? <Empty icon="📋" title="No medical notes yet" description="Notes will appear here after your first consultation." />
            : <div className={styles.list}>
                {notes.map(n => (
                  <Card key={n.id} className={styles.noteCard}>
                    <div className={styles.noteHeader}>
                      <div className={styles.noteDate}>{format(new Date(n.note_date), 'MMMM d, yyyy')}</div>
                      {n.follow_up_date && (
                        <span className="badge badge-gold">
                          Follow-up: {format(new Date(n.follow_up_date), 'MMM d')}
                        </span>
                      )}
                    </div>
                    <p className={styles.noteText}>{n.note_text}</p>
                  </Card>
                ))}
              </div>
          }
        </div>
      )}

      {tab === 'prescriptions' && (
        <div>
          <SectionTitle sub="Electronic prescriptions issued by your doctor">Prescriptions</SectionTitle>
          {scripts.length === 0
            ? <Empty icon="💊" title="No prescriptions yet" />
            : <div className={styles.list}>
                {scripts.map(rx => (
                  <Card key={rx.id} className={styles.rxCard}>
                    <div className={styles.rxHeader}>
                      <div className={styles.rxDate}>{format(new Date(rx.issued_at), 'MMMM d, yyyy')}</div>
                      <span className={`badge badge-${rx.status === 'active' ? 'teal' : 'muted'}`}>{rx.status}</span>
                    </div>
                    <div className={styles.medList}>
                      {(rx.medications || []).map((m, i) => (
                        <div key={i} className={styles.medItem}>
                          <Pill size={14} color="var(--teal)"/>
                          <div>
                            <div className={styles.medName}>{m.name}</div>
                            <div className={styles.medDetail}>{m.dosage} · {m.frequency} · {m.duration}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {rx.notes && <p className={styles.rxNotes}>{rx.notes}</p>}
                    {rx.valid_until && (
                      <div className={styles.rxExpiry}>
                        Valid until {format(new Date(rx.valid_until), 'MMM d, yyyy')}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
          }
        </div>
      )}
    </DashboardLayout>
  )
}
