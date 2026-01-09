import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import db from '../lib/instant'
import { getCurrentAdmin } from '../utils/auth'

function FeedbackDetailModal({ feedback, onClose, onUpdate }) {
  const [adminNotes, setAdminNotes] = useState(feedback.adminNotes || '')
  const [saving, setSaving] = useState(false)
  const [archiving, setArchiving] = useState(false)
  const currentAdmin = getCurrentAdmin()

  useEffect(() => {
    setAdminNotes(feedback.adminNotes || '')
  }, [feedback])

  const handleSaveNotes = async () => {
    setSaving(true)
    try {
      await db.transact([
        db.tx.feedback[feedback.id].update({
          adminNotes,
          updatedAt: Date.now()
        })
      ])
      onUpdate && onUpdate()
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('Failed to save notes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleArchive = async () => {
    if (!confirm('Archive this feedback submission?')) {
      return
    }

    setArchiving(true)
    try {
      await db.transact([
        db.tx.feedback[feedback.id].update({
          status: 'archived',
          archivedAt: Date.now(),
          archivedBy: currentAdmin?.email || 'Unknown',
          updatedAt: Date.now()
        })
      ])
      onUpdate && onUpdate()
      onClose()
    } catch (error) {
      console.error('Error archiving feedback:', error)
      alert('Failed to archive feedback. Please try again.')
    } finally {
      setArchiving(false)
    }
  }

  const handleUnarchive = async () => {
    setArchiving(true)
    try {
      await db.transact([
        db.tx.feedback[feedback.id].update({
          status: 'new',
          archivedAt: null,
          archivedBy: null,
          updatedAt: Date.now()
        })
      ])
      onUpdate && onUpdate()
      onClose()
    } catch (error) {
      console.error('Error unarchiving feedback:', error)
      alert('Failed to unarchive feedback. Please try again.')
    } finally {
      setArchiving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-deroyal-blue to-deroyal-light px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white" id="modal-title">
                Feedback Details
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="space-y-6">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500">Submission ID</p>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{feedback.id.substring(0, 8)}...</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Submitted</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {format(new Date(feedback.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="mt-1 text-sm text-gray-900">{feedback.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    feedback.status === 'new' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {feedback.status === 'new' ? 'New' : 'Archived'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                <div 
                  className="prose prose-sm max-w-none bg-white border border-gray-200 rounded-lg p-4"
                  dangerouslySetInnerHTML={{ __html: feedback.description }}
                />
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  {feedback.isAnonymous ? (
                    <p className="text-sm text-gray-500 italic">Submitted anonymously</p>
                  ) : (
                    <dl className="grid grid-cols-2 gap-4">
                      {feedback.email && (
                        <>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="text-sm text-gray-900">{feedback.email}</dd>
                        </>
                      )}
                      {feedback.name && (
                        <>
                          <dt className="text-sm font-medium text-gray-500">Name</dt>
                          <dd className="text-sm text-gray-900">{feedback.name}</dd>
                        </>
                      )}
                      {feedback.title && (
                        <>
                          <dt className="text-sm font-medium text-gray-500">Title</dt>
                          <dd className="text-sm text-gray-900">{feedback.title}</dd>
                        </>
                      )}
                      {feedback.location && (
                        <>
                          <dt className="text-sm font-medium text-gray-500">Location</dt>
                          <dd className="text-sm text-gray-900">{feedback.location}</dd>
                        </>
                      )}
                    </dl>
                  )}
                </div>
              </div>

              {/* Attachment */}
              {feedback.attachmentName && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Attachment</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span className="text-sm text-gray-900">{feedback.attachmentName}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Admin Notes</h4>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deroyal-blue focus:border-transparent"
                  placeholder="Add notes about actions taken to address this feedback..."
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={saving || adminNotes === (feedback.adminNotes || '')}
                  className="mt-2 px-4 py-2 bg-deroyal-blue text-white rounded-lg hover:bg-deroyal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>

              {/* Archive Info */}
              {feedback.status === 'archived' && feedback.archivedBy && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Archived by <span className="font-medium">{feedback.archivedBy}</span> on{' '}
                    {format(new Date(feedback.archivedAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Close
            </button>
            <div className="space-x-2">
              {feedback.status === 'new' ? (
                <button
                  onClick={handleArchive}
                  disabled={archiving}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {archiving ? 'Archiving...' : 'Archive'}
                </button>
              ) : (
                <button
                  onClick={handleUnarchive}
                  disabled={archiving}
                  className="px-6 py-2 bg-deroyal-blue text-white rounded-lg hover:bg-deroyal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {archiving ? 'Unarchiving...' : 'Unarchive'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackDetailModal
