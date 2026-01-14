import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import db from './lib/instant'

// Employee pages
import LandingPage from './pages/LandingPage'
import FeedbackForm from './pages/FeedbackForm'
import SuccessPage from './pages/SuccessPage'

// Admin pages
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

// Employee Flow Component
function EmployeeFlow() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    const authToken = sessionStorage.getItem('feedbackAuthToken')
    if (authToken) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleAuthenticated = () => {
    setIsAuthenticated(true)
  }

  const handleSubmitSuccess = () => {
    setIsSubmitted(true)
  }

  const handleReset = () => {
    // Only reset the submission state, keep the authentication
    // This allows users to submit more feedback without re-entering the passphrase
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return <SuccessPage onReset={handleReset} />
  }

  if (!isAuthenticated) {
    return <LandingPage onAuthenticated={handleAuthenticated} />
  }

  return <FeedbackForm onSubmitSuccess={handleSubmitSuccess} />
}

// Protected Admin Route Component
function ProtectedAdminRoute({ children }) {
  const { isLoading, user } = db.useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deroyal-blue"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin" replace />
  }

  return children
}

// Admin Flow Component
function AdminFlow() {
  const { isLoading, user, error } = db.useAuth()

  const handleLogout = () => {
    db.auth.signOut()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deroyal-blue"></div>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin />
  }

  return <AdminDashboard onLogout={handleLogout} />
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Employee routes */}
        <Route path="/" element={<EmployeeFlow />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminFlow />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedAdminRoute>
              <AdminFlow />
            </ProtectedAdminRoute>
          } 
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
