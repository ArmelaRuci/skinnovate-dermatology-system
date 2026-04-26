import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Public pages
import LandingPage    from './pages/public/LandingPage'
import LoginPage      from './pages/public/LoginPage'
import RegisterPage   from './pages/public/RegisterPage'

// Patient pages
import PatientDashboard   from './pages/patient/PatientDashboard'
import AIAnalysisPage     from './pages/patient/AIAnalysisPage'
import AppointmentsPage   from './pages/patient/AppointmentsPage'
import RecordsPage        from './pages/patient/RecordsPage'
import TreatmentsPage     from './pages/patient/TreatmentsPage'

// Doctor pages
import DoctorDashboard    from './pages/doctor/DoctorDashboard'
import PatientQueuePage   from './pages/doctor/PatientQueuePage'
import ValidationPage     from './pages/doctor/ValidationPage'
import DoctorSchedulePage from './pages/doctor/DoctorSchedulePage'

// Admin pages
import AdminDashboard     from './pages/admin/AdminDashboard'
import UserManagementPage from './pages/admin/UserManagementPage'

import Spinner from './components/common/Spinner'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner fullscreen />
  if (!user)   return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />
  return children
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner fullscreen />
  if (user) {
    const map = { patient: '/dashboard', dermatologist: '/doctor', admin: '/admin' }
    return <Navigate to={map[user.role] || '/'} replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Patient */}
      <Route path="/dashboard"    element={<ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>} />
      <Route path="/analysis"     element={<ProtectedRoute roles={['patient']}><AIAnalysisPage /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute roles={['patient']}><AppointmentsPage /></ProtectedRoute>} />
      <Route path="/records"      element={<ProtectedRoute roles={['patient']}><RecordsPage /></ProtectedRoute>} />
      <Route path="/treatments"   element={<ProtectedRoute roles={['patient']}><TreatmentsPage /></ProtectedRoute>} />

      {/* Doctor */}
      <Route path="/doctor"            element={<ProtectedRoute roles={['dermatologist']}><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/queue"      element={<ProtectedRoute roles={['dermatologist']}><PatientQueuePage /></ProtectedRoute>} />
      <Route path="/doctor/validate/:id" element={<ProtectedRoute roles={['dermatologist']}><ValidationPage /></ProtectedRoute>} />
      <Route path="/doctor/schedule"   element={<ProtectedRoute roles={['dermatologist']}><DoctorSchedulePage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin"       element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UserManagementPage /></ProtectedRoute>} />

      {/* Fallbacks */}
      <Route path="/unauthorized" element={
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column',gap:'1rem'}}>
          <h2 style={{fontFamily:'Cormorant Garamond'}}>Access Denied</h2>
          <p style={{color:'var(--text-secondary)'}}>You don't have permission to view this page.</p>
        </div>
      }/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
