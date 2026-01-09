// Simple in-memory storage for magic codes
// In production, you'd want to use Redis or a database
const magicCodes = new Map()

// Generate a random 6-digit code
export function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store a code for an email (expires in 10 minutes)
export function storeCode(email, code) {
  const expiresAt = Date.now() + (10 * 60 * 1000) // 10 minutes
  magicCodes.set(email, { code, expiresAt })
  
  // Clean up expired codes
  setTimeout(() => {
    const stored = magicCodes.get(email)
    if (stored && stored.code === code) {
      magicCodes.delete(email)
    }
  }, 10 * 60 * 1000)
}

// Verify a code for an email
export function verifyCode(email, code) {
  const stored = magicCodes.get(email)
  
  if (!stored) {
    return false
  }
  
  if (Date.now() > stored.expiresAt) {
    magicCodes.delete(email)
    return false
  }
  
  if (stored.code === code) {
    magicCodes.delete(email)
    return true
  }
  
  return false
}

// Generate a simple session token
export function generateSessionToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
