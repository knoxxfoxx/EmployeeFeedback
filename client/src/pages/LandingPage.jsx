import { useState } from 'react'
import { validatePassphrase } from '../services/api'

function LandingPage({ onAuthenticated }) {
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await validatePassphrase(passphrase)
      if (response.success) {
        sessionStorage.setItem('feedbackAuthToken', response.token)
        onAuthenticated()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid passphrase. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-deroyal-blue mb-4">
              Your Voice Matters
            </h1>
            <p className="text-2xl text-gray-600">
              Share your ideas, suggestions, and concerns with management
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-deroyal-blue to-deroyal-light rounded-full opacity-80 animate-pulse"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-60 animate-pulse delay-100"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-deroyal-light to-blue-400 rounded-full opacity-70 animate-pulse delay-200"></div>
          </div>
        </div>

        {/* Passphrase Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-deroyal-blue/10 rounded-full mb-4">
                <svg className="w-12 h-12 text-deroyal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Employee Access
              </h2>
              <p className="text-gray-600">
                Enter your passphrase to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="passphrase" className="block text-sm font-medium text-gray-700 mb-2">
                  Passphrase
                </label>
                <input
                  type="password"
                  id="passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deroyal-blue focus:border-transparent transition duration-200 text-lg"
                  placeholder="Enter passphrase"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !passphrase}
                className="w-full bg-gradient-to-r from-deroyal-blue to-deroyal-light text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Access Feedback System'
                )}
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div className="mt-8 text-center text-gray-600 text-sm">
            <p>This system allows you to submit feedback anonymously or with your contact information.</p>
            <p className="mt-2">Your input helps us improve our workplace.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
