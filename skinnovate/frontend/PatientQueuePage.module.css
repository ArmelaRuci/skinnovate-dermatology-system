import { useEffect, useState } from 'react'
import { appointmentsApi } from '../../services/api'
import DashboardLayout from '../../components/common/DashboardLayout'
import { Card, SectionTitle, Empty, Button } from '../../components/common/UI'
import Spinner from '../../components/common/Spinner'
import { Calendar, Clock, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { format, isToday, isTomorrow, parseISO } from 'date-fns'
import styles from './DoctorSchedulePage.module.css'

const STATUS_BADGE = {
  scheduled: 'badge badge-teal', requested: 'badge badge-gold',
  completed: 'badge badge-success', cancelled: 'badge badge-danger',
}

function groupByDate(appts) {
  const map = {}
  appts.forEach(a => {
    const key = format(parseISO(a.scheduled_at), 'yyyy-MM-dd')
    if (!map[key]) map[key] = []
    map[key].push(a)
  })
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
}

function dateLabel(dateStr) {
  const d = parseISO(dateStr + 'T00:00:00')
  if (isToday(d))    return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return format(d, 'EEEE, MMMM d')
}

export default function DoctorSchedulePage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    appointmentsApi.list()
      .then(r => setAppointments(r.data.data?.filter(a => a.status !== 'cancelled') || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleStatusUpdate = async (id, status) => {
    try {
      await appointmentsApi.update(id, { status })
      setAppointments(p => p.map(a => a.id === id ? { ...a, status } : a))
      toast.success(`Appointment marked as ${status}`)
    } catch { toast.error('Update failed') }
  }

  const grouped = groupByDate(appointments)

  return (
    <DashboardLayout
      title="My Schedule"
      subtitle="Upcoming appointments and consultations"
    >
      {loading
        ? <div style={{ display:'flex', justifyContent:'center', padding:80 }}><Spinner size={40}/></div>
        : appointments.length === 0
        ? <Empty icon="📅" title="No appointments" description="Your schedule will appear here once patients book with you." />
        : <div className={styles.schedule}>
            {grouped.map(([dateKey, appts]) => (
              <div key={dateKey} className={styles.dayGroup}>
                <div className={styles.dayLabel}>
                  <Calendar size={14}/>
                  {dateLabel(dateKey)}
                  <span className={styles.dayCount}>{appts.length}</span>
                </div>
                <div className={styles.dayAppts}>
                  {appts.map(a => (
                    <Card key={a.id} className={styles.apptCard}>
                      <div className={styles.apptLeft}>
                        <Clock size={14} color="var(--teal)" />
                        <span className={styles.apptTime}>{format(parseISO(a.scheduled_at), 'h:mm a')}</span>
                      </div>
                      <div className={styles.apptMid}>
                        <div className={styles.patName}>{a.patient_name || 'Patient'}</div>
                        <div className={styles.apptType}>{a.appointment_type?.replace('_',' ')}</div>
                        {a.reason && <div className={styles.apptReason}>{a.reason}</div>}
                      </div>
                      <div className={styles.apptRight}>
                        <span className={STATUS_BADGE[a.status] || 'badge badge-muted'}>{a.status}</span>
                        {a.is_emergency && <span className="badge badge-danger"><AlertTriangle size={11}/> Urgent</span>}
                        {a.status === 'scheduled' && (
                          <div className={styles.quickActions}>
                            <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(a.id, 'in_progress')}>Start</Button>
                            <Button size="sm" variant="ghost"     onClick={() => handleStatusUpdate(a.id, 'completed')}>Done</Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
      }
    </DashboardLayout>
  )
}
