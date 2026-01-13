import { useState, useEffect } from 'react'
import db from '../lib/instant'
import FeedbackTable from '../components/FeedbackTable'
import FeedbackDetailModal from '../components/FeedbackDetailModal'
import FilterBar from '../components/FilterBar'
import { getCurrentAdmin } from '../utils/auth'
import { exportFeedbackToCSV } from '../utils/export'

function AdminDashboard({ onLogout }) {
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: '',
    dateFrom: null,
    dateTo: null
  })

  // Get current user from auth
  const { user } = db.useAuth()
  const currentAdmin = user || getCurrentAdmin()

  // Query feedback from InstantDB
  const { isLoading, error, data } = db.useQuery({
    feedback: {}
  })

  const feedback = data?.feedback || []

  // Apply filters
  const filteredFeedback = feedback.filter(item => {
    // Status filter
    if (filters.status !== 'all' && item.status !== filters.status) {
      return false
    }

    // Type filter
    if (filters.type !== 'all' && item.type !== filters.type) {
      return false
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const searchIn = [
        item.description,
        item.type,
        item.email || '',
        item.name || '',
        item.adminNotes || ''
      ].join(' ').toLowerCase()

      if (!searchIn.includes(searchLower)) {
        return false
      }
    }

    // Date range filter
    if (filters.dateFrom && item.createdAt < filters.dateFrom) {
      return false
    }
    if (filters.dateTo && item.createdAt > filters.dateTo) {
      return false
    }

    return true
  })

  // Sort by date (newest first)
  const sortedFeedback = [...filteredFeedback].sort((a, b) => b.createdAt - a.createdAt)

  // Calculate statistics
  const stats = {
    total: feedback.length,
    new: feedback.filter(f => f.status === 'new').length,
    archived: feedback.filter(f => f.status === 'archived').length
  }

  const handleViewDetails = (item) => {
    setSelectedFeedback(item)
  }

  const handleCloseModal = () => {
    setSelectedFeedback(null)
  }

  const handleUpdate = () => {
    // Data will automatically update via InstantDB reactivity
  }

  const handleExport = () => {
    const success = exportFeedbackToCSV(sortedFeedback)
    if (success) {
      // Optional: Show success message
      console.log('Export successful')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Error Loading Data</h3>
            <p className="mt-1 text-sm text-gray-500">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-deroyal-blue text-white rounded-lg hover:bg-deroyal-dark transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* DeRoyal Logo */}
              <img 
                src="/assets/deroyal-logo-blue.png" 
                alt="DeRoyal" 
                className="h-10 object-contain"
              />
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Welcome, {currentAdmin?.email || 'Admin'}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-deroyal-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">New Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gray-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Archived</p>
                <p className="text-2xl font-bold text-gray-900">{stats.archived}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          feedback={feedback}
          resultCount={sortedFeedback.length}
        />

        {/* Export Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleExport}
            disabled={sortedFeedback.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-deroyal-blue hover:bg-deroyal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deroyal-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to CSV
          </button>
        </div>

        {/* Feedback Table */}
        <FeedbackTable
          feedback={sortedFeedback}
          onViewDetails={handleViewDetails}
          loading={isLoading}
        />
      </main>

      {/* Detail Modal */}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}

export default AdminDashboard
