export const FEEDBACK_TYPES = [
  'Suggestion',
  'Concern',
  'Safety Issue',
  'Process Improvement',
  'Other'
]

export const MAX_DESCRIPTION_LENGTH = 5000
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

export const ALLOWED_FILE_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.txt',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif'
]

export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
