import { useState, useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { tx, id } from '@instantdb/react'
import db from '../lib/instant'
import { FEEDBACK_TYPES, MAX_DESCRIPTION_LENGTH, MAX_FILE_SIZE } from '../utils/constants'
import { validateFileType, formatFileSize } from '../utils/validation'

function FeedbackForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    isAnonymous: true,
    email: '',
    name: '',
    title: '',
    location: '',
    honeypot: '' // Hidden field for bot detection
  })
  const [attachment, setAttachment] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [descriptionLength, setDescriptionLength] = useState(0)
  
  const fileInputRef = useRef(null)

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  }

  const formats = [
    'header', 'size',
    'bold', 'italic', 'underline',
    'color', 'background',
    'list', 'bullet'
  ]

  const handleDescriptionChange = (content, delta, source, editor) => {
    const text = editor.getText()
    const length = text.length - 1 // Subtract 1 for the trailing newline
    
    if (length <= MAX_DESCRIPTION_LENGTH) {
      setFormData(prev => ({ ...prev, description: content }))
      setDescriptionLength(length)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`)
        e.target.value = null
        return
      }
      
      // Check file type
      if (!validateFileType(file)) {
        setError('Invalid file type. Please upload PDF, DOC, XLS, or image files.')
        e.target.value = null
        return
      }
      
      setAttachment(file)
      setError('')
    }
  }

  const handleRemoveFile = () => {
    setAttachment(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.type) {
      setError('Please select a feedback type')
      return
    }

    if (!formData.description || descriptionLength === 0) {
      setError('Please provide a description')
      return
    }

    if (!formData.isAnonymous && !formData.email) {
      setError('Email is required when not submitting anonymously')
      return
    }

    // Check honeypot
    if (formData.honeypot) {
      setError('Invalid submission')
      return
    }

    setLoading(true)

    try {
      const now = Date.now()
      const feedbackId = id()
      
      // Create feedback object
      const feedback = {
        id: feedbackId,
        type: formData.type,
        description: formData.description,
        isAnonymous: formData.isAnonymous,
        email: formData.email || null,
        name: formData.name || null,
        title: formData.title || null,
        location: formData.location || null,
        attachmentUrl: null, // Note: File uploads would need a separate service (e.g., Cloudinary)
        attachmentName: attachment?.name || null,
        status: 'new',
        adminNotes: null,
        createdAt: now,
        updatedAt: now,
        archivedAt: null,
        archivedBy: null
      }

      // Save directly to InstantDB
      await db.transact([
        tx.feedback[feedbackId].update(feedback)
      ])

      onSubmitSuccess()
    } catch (err) {
      console.error('Error submitting feedback:', err)
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with DeRoyal Branding */}
        <div className="bg-gradient-to-r from-deroyal-blue to-deroyal-light text-white rounded-t-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <img 
                src="/assets/deroyal-logo.png" 
                alt="DeRoyal" 
                className="h-12 md:h-14 mb-3 object-contain brightness-0 invert"
              />
              <p className="text-xl">Employee Feedback System</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Dropdown */}
            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                Type of Suggestion/Concern <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deroyal-blue focus:border-transparent transition duration-200"
                required
              >
                <option value="">Select a type...</option>
                {FEEDBACK_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Rich Text Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={modules}
                  formats={formats}
                  placeholder="Describe your suggestion or concern in detail..."
                />
              </div>
              <div className="mt-2 text-sm text-gray-600 text-right">
                {descriptionLength} / {MAX_DESCRIPTION_LENGTH} characters
              </div>
            </div>

            {/* File Attachment */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Attachment (Optional)
              </label>
              {!attachment ? (
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="attachment" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOC, XLS, Images (MAX. 5MB)</p>
                    </div>
                    <input 
                      id="attachment" 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                    />
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <svg className="w-8 h-8 text-deroyal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Anonymous Toggle */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    isAnonymous: e.target.checked,
                    email: e.target.checked ? '' : prev.email,
                    name: e.target.checked ? '' : prev.name,
                    title: e.target.checked ? '' : prev.title,
                    location: e.target.checked ? '' : prev.location
                  }))}
                  className="mt-1 w-4 h-4 text-deroyal-blue border-gray-300 rounded focus:ring-deroyal-blue"
                />
                <div>
                  <label htmlFor="isAnonymous" className="font-semibold text-gray-900 cursor-pointer">
                    Submit Anonymously
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Check this box to submit your feedback without providing contact information
                  </p>
                </div>
              </div>

              {/* Contact Fields (shown when not anonymous) */}
              {!formData.isAnonymous && (
                <div className="mt-6 space-y-4 pt-6 border-t border-gray-200">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deroyal-blue focus:border-transparent transition duration-200"
                      placeholder="your.email@deroyal.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deroyal-blue focus:border-transparent transition duration-200"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deroyal-blue focus:border-transparent transition duration-200"
                        placeholder="Your position"
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deroyal-blue focus:border-transparent transition duration-200"
                        placeholder="Office/Department"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Honeypot (hidden field) */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={(e) => setFormData(prev => ({ ...prev, honeypot: e.target.value }))}
              style={{ display: 'none' }}
              tabIndex="-1"
              autoComplete="off"
            />

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem('feedbackAuthToken')
                  window.location.reload()
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-deroyal-blue to-deroyal-light text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Your feedback is valuable to us. Thank you for taking the time to share your thoughts.</p>
        </div>
      </div>
    </div>
  )
}

export default FeedbackForm
