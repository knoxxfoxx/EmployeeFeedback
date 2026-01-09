import { format } from 'date-fns'

// Strip HTML tags from rich text
export function stripHtml(html) {
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

// Escape CSV special characters
function escapeCsvValue(value) {
  if (value === null || value === undefined) {
    return ''
  }
  
  const stringValue = String(value)
  
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return '"' + stringValue.replace(/"/g, '""') + '"'
  }
  
  return stringValue
}

// Convert feedback array to CSV
export function feedbackToCSV(feedbackArray) {
  if (!feedbackArray || feedbackArray.length === 0) {
    return ''
  }

  // Define CSV headers
  const headers = [
    'Submission ID',
    'Date',
    'Type',
    'Description',
    'Anonymous',
    'Email',
    'Name',
    'Title',
    'Location',
    'Attachment',
    'Status',
    'Admin Notes',
    'Archived Date',
    'Archived By'
  ]

  // Convert feedback to rows
  const rows = feedbackArray.map(feedback => {
    return [
      feedback.id,
      format(new Date(feedback.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      feedback.type,
      stripHtml(feedback.description),
      feedback.isAnonymous ? 'Yes' : 'No',
      feedback.isAnonymous ? 'Anonymous' : (feedback.email || ''),
      feedback.isAnonymous ? 'Anonymous' : (feedback.name || ''),
      feedback.isAnonymous ? 'Anonymous' : (feedback.title || ''),
      feedback.isAnonymous ? 'Anonymous' : (feedback.location || ''),
      feedback.attachmentName || '',
      feedback.status === 'new' ? 'New' : 'Archived',
      feedback.adminNotes || '',
      feedback.archivedAt ? format(new Date(feedback.archivedAt), 'yyyy-MM-dd HH:mm:ss') : '',
      feedback.archivedBy || ''
    ].map(escapeCsvValue)
  })

  // Combine headers and rows
  const csvContent = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  return csvContent
}

// Download CSV file
export function downloadCSV(csvContent, filename = 'feedback-export.csv') {
  // Add BOM for Excel compatibility with special characters
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

// Main export function
export function exportFeedbackToCSV(feedbackArray, filename) {
  const csv = feedbackToCSV(feedbackArray)
  
  if (!csv) {
    alert('No data to export')
    return false
  }
  
  const timestamp = format(new Date(), 'yyyy-MM-dd_HHmmss')
  const finalFilename = filename || `deroyal-feedback-export_${timestamp}.csv`
  
  downloadCSV(csv, finalFilename)
  return true
}
