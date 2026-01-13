import { useState } from 'react'
import { isValidDeRoyalEmail } from '../utils/auth'
import db from '../lib/instant'

function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [sentEmail, setSentEmail] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendCode = async (e) => {
    e.preventDefault()
    setError('')

    // Validate email domain
    if (!isValidDeRoyalEmail(email)) {
      setError('Only @deroyal.com email addresses are allowed')
      return
    }

    setLoading(true)

    try {
      // Use InstantDB's auth.sendMagicCode directly on db instance
      await db.auth.sendMagicCode({ email })
      setSentEmail(true)
    } catch (err) {
      console.error('Send magic code error:', err)
      setError(err.message || 'Failed to send code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Use InstantDB's auth.signInWithMagicCode directly on db instance
      await db.auth.signInWithMagicCode({ email, code })
      // Auth state will update automatically and parent component will redirect
    } catch (err) {
      console.error('Verify code error:', err)
      setError('Invalid code. Please try again.')
      setCode('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            {/* DeRoyal Logo */}
            <div className="mb-6 flex justify-center">
              <img 
                src="/assets/deroyal-logo-blue.png" 
                alt="DeRoyal" 
                className="h-12 md:h-14 object-contain"
              />
            </div>
            <div className="inline-block p-4 bg-deroyal-blue/10 rounded-full mb-4">
              <svg className="w-12 h-12 text-deroyal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Access</h1>
            <p className="text-gray-600">Feedback System</p>
          </div>

          {!sentEmail ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deroyal-blue focus:border-transparent transition duration-200"
                  placeholder="your.name@deroyal.com"
                  required
                  disabled={loading}
                  autoFocus
                />
                <p className="mt-2 text-sm text-gray-500">
                  Only @deroyal.com email addresses are allowed
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-deroyal-blue to-deroyal-light text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  We've sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deroyal-blue focus:border-transparent transition duration-200 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  required
                  disabled={loading}
                  autoFocus
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full bg-gradient-to-r from-deroyal-blue to-deroyal-light text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSentEmail(false)
                  setCode('')
                  setError('')
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-800 transition duration-200"
              >
                ← Use a different email
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Secure admin access for DeRoyal management only</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
