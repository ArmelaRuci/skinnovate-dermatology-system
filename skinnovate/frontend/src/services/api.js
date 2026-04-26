import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const res = await axios.post('/api/auth/refresh', {}, {
            headers: { Authorization: `Bearer ${refreshToken}` },
          })
          const newToken = res.data.data.access_token
          localStorage.setItem('access_token', newToken)
          original.headers.Authorization = `Bearer ${newToken}`
          return api(original)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(err)
  }
)

export default api

// ── Domain-specific helpers ──────────────────────────────────────
export const authApi        = { me: () => api.get('/auth/me') }

export const analysisApi = {
  upload:   (formData) => api.post('/analysis/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  history:  ()         => api.get('/analysis/history'),
  get:      (id)       => api.get(`/analysis/${id}`),
  validate: (id, data) => api.patch(`/analysis/${id}/validate`, data),
}

export const appointmentsApi = {
  list:             (params)   => api.get('/appointments/', { params }),
  get:              (id)       => api.get(`/appointments/${id}`),
  book:             (data)     => api.post('/appointments/', data),
  update:           (id, data) => api.patch(`/appointments/${id}`, data),
  availableDoctors: ()         => api.get('/appointments/doctors/available'),
}

export const recordsApi = {
  my:               ()         => api.get('/records/my'),
  patient:          (id)       => api.get(`/records/patient/${id}`),
  createNote:       (data)     => api.post('/records/notes', data),
  createPrescription:(data)    => api.post('/records/prescriptions', data),
}

export const treatmentsApi = {
  my:           ()              => api.get('/treatments/my'),
  forPatient:   (id)            => api.get(`/treatments/patient/${id}`),
  create:       (data)          => api.post('/treatments/', data),
  update:       (id, data)      => api.patch(`/treatments/${id}`, data),
  addProgress:  (id, data)      => api.post(`/treatments/${id}/progress`, data),
}

export const usersApi = {
  updateProfile:   (data) => api.patch('/users/profile', data),
  dermatologists:  ()     => api.get('/users/dermatologists'),
}

export const adminApi = {
  stats:              ()          => api.get('/admin/stats'),
  users:              (params)    => api.get('/admin/users', { params }),
  toggleUser:         (id)        => api.patch(`/admin/users/${id}/toggle`),
  pendingAppointments:()          => api.get('/admin/appointments/pending'),
}
