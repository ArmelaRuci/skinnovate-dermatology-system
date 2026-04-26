import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#162436',
              color: '#f0ebe2',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.9rem',
            },
            success: { iconTheme: { primary: '#2a9d8f', secondary: '#f0ebe2' } },
            error:   { iconTheme: { primary: '#e74c3c', secondary: '#f0ebe2' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
