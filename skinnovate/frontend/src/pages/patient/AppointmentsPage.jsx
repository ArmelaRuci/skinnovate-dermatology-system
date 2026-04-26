import { useState, useEffect } from 'react'
import { appointmentsApi, usersApi } from '../../services/api'
import DashboardLayout from '../../components/common/DashboardLayout'
import { Card, Button, SectionTitle, Empty, FormField, Input, Select } from '../../components/common/UI'
import Spinner from '../../components/common/Spinner'
import { Calendar, Plus, X, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import styles from './AppointmentsPage.module.css'

const STATUS_BADGE = {
  scheduled:   'badge badge-teal',
  requested:   'badge badge-gold',
  completed:   'badge badge-success',
  cancelled:   'badge badge-danger',
  in_progress: 'badge badge-teal',
  no_show:     'badge badge-muted',
}

function BookingModal({ doctors, onClose, onBooked }) {
  const [form, setForm] = useState({
    dermatologist_id: '', scheduled_at: '', appointment_type: 'in_person',
    reason: '', is_emergency: false,
  })
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.scheduled_at) { toast.error('Please select a date and time'); return }
    setLoading(true)
    try {
      const res = await appointmentsApi.book({
        ...form,
        dermatologist_id: form.dermatologist_id || undefined,
        scheduled_at: new Date(form.scheduled_at).toISOString(),
        is_emergency: form.is_emergency,
      })
      toast.success('Appointment booked!')
      onBooked(res.data.data)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed')
    } finally { setLoading(false) }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <h3>Book Appointment</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <FormField label="Date & Time" required>
            <Input type="datetime-local" value={form.scheduled_at} onChange={set('scheduled_at')} required
              min={new Date(Date.now() + 3600000).toISOString().slice(0,16)} />
          </FormField>
          <FormField label="Appointment Type">
            <Select value={form.appointment_type} onChange={set('appointment_type')}>
              <option value="in_person">In Person</option>
              <option value="video">Video Consultation</option>
              <option value="emergency">Emergency</option>
            </Select>
          </FormField>
          <FormField label="Preferred Doctor">
            <Select value={form.dermatologist_id} onChange={set('dermatologist_id')}>
              <option value="">Any available doctor</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.full_name} — {d.specialization || 'General'}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Reason for visit">
            <Input placeholder="Briefly describe your concern" value={form.reason} onChange={set('reason')} />
          </FormField>
          <label className={styles.emergencyCheck}>
            <input type="checkbox" checked={form.is_emergency}
              onChange={e => setForm(p => ({ ...p, is_emergency: e.target.checked }))} />
            <AlertTriangle size={14} color="var(--rose)" />
            <span>Mark as emergency</span>
          </label>
          <div className={styles.modalActions}>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={loading} icon={<Calendar size={15}/>}>Confirm Booking</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [doctors,      setDoctors]      = useState([])
  const [loading,      setLoading]      = useState(true)
  const [showModal,    setShowModal]    = useState(false)
  const [filter,       setFilter]       = useState('all')

  useEffect(() => {
    Promise.all([appointmentsApi.list(), appointmentsApi.availableDoctors()])
      .then(([a, d]) => { setAppointments(a.data.data || []); setDoctors(d.data.data || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async id => {
    if (!window.confirm('Cancel this appointment?')) return
    try {
      await appointmentsApi.update(id, { status: 'cancelled' })
      setAppointments(p => p.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
      toast.success('Appointment cancelled')
    } catch { toast.error('Could not cancel') }
  }

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)

  return (
    <DashboardLayout
      title="Appointments"
      subtitle="Manage your clinic visits and consultations"
      actions={<Button icon={<Plus size={16}/>} onClick={() => setShowModal(true)}>Book Appointment</Button>}
    >
      {/* Filter tabs */}
      <div className={styles.filters}>
        {['all', 'scheduled', 'requested', 'completed', 'cancelled'].map(f => (
          <button key={f} className={`${styles.filterTab} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading
        ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={40}/></div>
        : filtered.length === 0
        ? <Empty icon="📅" title="No appointments found"
            action={<Button icon={<Plus size={15}/>} onClick={() => setShowModal(true)}>Book Now</Button>} />
        : <div className={styles.list}>
            {filtered.map(a => (
              <Card key={a.id} className={styles.apptCard}>
                <div className={styles.apptLeft}>
                  <div className={styles.dateBlock}>
                    <span className={styles.dateDay}>{format(new Date(a.scheduled_at), 'd')}</span>
                    <span className={styles.dateMon}>{format(new Date(a.scheduled_at), 'MMM yyyy')}</span>
                  </div>
                </div>
                <div className={styles.apptMid}>
                  <div className={styles.apptType}>{a.appointment_type?.replace('_', ' ')}</div>
                  <div className={styles.apptTime}>{format(new Date(a.scheduled_at), 'EEEE, h:mm a')}</div>
                  {a.reason && <div className={styles.apptReason}>{a.reason}</div>}
                  {a.dermatologist_name && <div className={styles.apptDoc}>Dr. {a.dermatologist_name}</div>}
                  {a.is_emergency && <span className="badge badge-danger" style={{ marginTop: 6, display: 'inline-flex', gap: 4 }}><AlertTriangle size={11}/> Emergency</span>}
                </div>
                <div className={styles.apptRight}>
                  <span className={STATUS_BADGE[a.status] || 'badge badge-muted'}>{a.status}</span>
                  {['scheduled', 'requested'].includes(a.status) && (
                    <Button variant="ghost" size="sm" onClick={() => handleCancel(a.id)}>Cancel</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
      }

      {showModal && (
        <BookingModal
          doctors={doctors}
          onClose={() => setShowModal(false)}
          onBooked={appt => setAppointments(p => [appt, ...p])}
        />
      )}
    </DashboardLayout>
  )
}
