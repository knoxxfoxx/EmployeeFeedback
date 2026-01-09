import { useState } from 'react'

function FilterBar({ filters, onFiltersChange, feedback, resultCount }) {
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Get unique types from feedback
  const uniqueTypes = [...new Set(feedback.map(f => f.type))].sort()

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      type: 'all',
      search: '',
      dateFrom: null,
      dateTo: null
    })
    setShowDatePicker(false)
  }

  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.type !== 'all' || 
    filters.search !== '' || 
    filters.dateFrom !== null || 
    filters.dateTo !== null

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      <div className="space-y-4">
        {/* Top row: Search and action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search feedback..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deroyal-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Bottom row: Filter dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deroyal-blue focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type-filter"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deroyal-blue focus:border-transparent"
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Date Range Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`w-full px-3 py-2 border rounded-lg text-left transition-colors ${
                showDatePicker || filters.dateFrom || filters.dateTo
                  ? 'border-deroyal-blue bg-blue-50'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {filters.dateFrom || filters.dateTo ? 'Custom Range' : 'All Dates'}
                </span>
                <svg className={`h-5 w-5 text-gray-400 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Date Range Picker (expandable) */}
        {showDatePicker && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="date-from"
                value={filters.dateFrom ? new Date(filters.dateFrom).toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value).getTime() : null)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deroyal-blue focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="date-to"
                value={filters.dateTo ? new Date(filters.dateTo).toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value ? new Date(e.target.value).getTime() : null)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deroyal-blue focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{resultCount}</span> of{' '}
            <span className="font-semibold text-gray-900">{feedback.length}</span> submissions
            {hasActiveFilters && (
              <span className="ml-2 text-deroyal-blue">(filtered)</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
