// Admin authentication utilities

// Whitelist of authorized admin email addresses
const AUTHORIZED_ADMIN_EMAILS = [
  'lbutler@deroyal.com',
  'mcatron@deroyal.com',
  'rharmon@deroyal.com',
  'asewell@deroyal.com',
  'bcdebusk@deroyal.com',
  'cshulze@deroyal.com',
  'bparish@deroyal.com',
  'tknisley@deroyal.com',
  'mkilby@deroyal.com'
]

export function isValidDeRoyalEmail(email) {
  if (!email) return false
  const normalizedEmail = email.toLowerCase().trim()
  return AUTHORIZED_ADMIN_EMAILS.includes(normalizedEmail)
}

export function getStoredAuth() {
  const auth = sessionStorage.getItem('instantAuth')
  return auth ? JSON.parse(auth) : null
}

export function storeAuth(authData) {
  sessionStorage.setItem('instantAuth', JSON.stringify(authData))
}

export function clearAuth() {
  sessionStorage.removeItem('instantAuth')
}

export function isAuthenticated() {
  const auth = getStoredAuth()
  return auth && auth.user && auth.user.email
}

export function getCurrentAdmin() {
  const auth = getStoredAuth()
  return auth?.user || null
}
