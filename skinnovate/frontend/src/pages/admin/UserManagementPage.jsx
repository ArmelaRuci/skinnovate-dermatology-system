import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { adminApi } from '../../services/api'
import DashboardLayout from '../../components/common/DashboardLayout'
import { Card, Button, Empty } from '../../components/common/UI'
import Spinner from '../../components/common/Spinner'
import { Search, UserCheck, UserX, ShieldCheck, User, Stethoscope } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import styles from './UserManagementPage.module.css'

const ROLE_ICON = {
  patient:       <User size={14} />,
  dermatologist: <Stethoscope size={14} />,
  admin:         <ShieldCheck size={14} />,
}
const ROLE_BADGE = {
  patient:       'badge badge-teal',
  dermatologist: 'badge badge-gold',
  admin:         'badge badge-rose',
}

export default function UserManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [query,   setQuery]   = useState('')
  const [role,    setRole]    = useState(searchParams.get('role') || 'all')
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    setLoading(true)
    const params = role !== 'all' ? { role } : {}
    adminApi.users(params)
      .then(r => setUsers(r.data.data || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }, [role])

  const handleRoleChange = r => {
    setRole(r)
    if (r !== 'all') setSearchParams({ role: r })
    else setSearchParams({})
  }

  const handleToggle = async (id) => {
    setTogglingId(id)
    try {
      const res = await adminApi.toggleUser(id)
      setUsers(p => p.map(u => u.id === id ? { ...u, is_active: res.data.data.is_active } : u))
      toast.success(res.data.message)
    } catch { toast.error('Action failed') }
    finally { setTogglingId(null) }
  }

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(query.toLowerCase()) ||
    u.email?.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <DashboardLayout
      title="User Management"
      subtitle="Manage all platform users — patients, doctors, and admins"
    >
      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search by name or email…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className={styles.roleTabs}>
          {[['all','All'], ['patient','Patients'], ['dermatologist','Doctors'], ['admin','Admins']].map(([v, l]) => (
            <button
              key={v}
              className={`${styles.roleTab} ${role === v ? styles.roleTabActive : ''}`}
              onClick={() => handleRoleChange(v)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Spinner size={40} />
        </div>
      ) : filtered.length === 0 ? (
        <Empty icon="👤" title="No users found" description="Try adjusting your search or filter." />
      ) : (
        <>
          {/* Count */}
          <div className={styles.countRow}>
            Showing <strong>{filtered.length}</strong> user{filtered.length !== 1 ? 's' : ''}
          </div>

          {/* Table */}
          <Card className={styles.tableCard}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id} className={!u.is_active ? styles.rowInactive : ''}>
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.avatar}>
                            {u.full_name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className={styles.userName}>{u.full_name}</div>
                            <div className={styles.userEmail}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={ROLE_BADGE[u.role] || 'badge badge-muted'}>
                          {ROLE_ICON[u.role]} {u.role}
                        </span>
                      </td>
                      <td className={styles.dateCell}>
                        {u.created_at ? format(new Date(u.created_at), 'MMM d, yyyy') : '—'}
                      </td>
                      <td>
                        <span className={`badge ${u.is_active ? 'badge-success' : 'badge-muted'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant={u.is_active ? 'danger' : 'secondary'}
                          loading={togglingId === u.id}
                          onClick={() => handleToggle(u.id)}
                          icon={u.is_active ? <UserX size={13}/> : <UserCheck size={13}/>}
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </DashboardLayout>
  )
}
