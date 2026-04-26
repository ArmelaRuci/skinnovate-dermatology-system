import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) { setLoading(false); return }
    api.get('/auth/me')
      .then(res => setUser(res.data.data))
      .catch(() => { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token') })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { access_token, refresh_token, user: u } = res.data.data
    localStorage.setItem('access_token',  access_token)
    localStorage.setItem('refresh_token', refresh_token)
    setUser(u)
    return u
  }, [])

  const register = useCallback(async (data) => {
    const res = await api.post('/auth/register', data)
    const { access_token, refresh_token, user: u } = res.data.data
    localStorage.setItem('access_token',  access_token)
    localStorage.setItem('refresh_token', refresh_token)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }, [])

  const refreshMe = useCallback(async () => {
    const res = await api.get('/auth/me')
    setUser(res.data.data)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
