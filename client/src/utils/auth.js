// Admin authentication utilities

export function isValidDeRoyalEmail(email) {
  return email && email.toLowerCase().endsWith('@deroyal.com')
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
