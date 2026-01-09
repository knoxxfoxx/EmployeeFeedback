import { init, tx, id } from '@instantdb/admin'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from root directory (two levels up from db/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// For development: bypass SSL certificate verification
// This fixes "unable to get local issuer certificate" errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const APP_ID = process.env.INSTANT_APP_ID
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN

if (!APP_ID) {
  console.error('❌ Missing INSTANT_APP_ID environment variable')
  console.error('Please add INSTANT_APP_ID to your .env file')
}

if (!ADMIN_TOKEN) {
  console.error('❌ Missing INSTANT_ADMIN_TOKEN environment variable')
  console.error('Please add INSTANT_ADMIN_TOKEN to your .env file')
}

// Initialize InstantDB admin SDK
const db = init({
  appId: APP_ID,
  adminToken: ADMIN_TOKEN
})

console.log('✅ InstantDB initialized with App ID:', APP_ID ? APP_ID.substring(0, 8) + '...' : 'MISSING')

// Helper function to save feedback to database
export async function saveFeedback(feedbackData) {
  const now = Date.now()
  
  const feedback = {
    id: id(),
    type: feedbackData.type,
    description: feedbackData.description,
    isAnonymous: feedbackData.isAnonymous,
    email: feedbackData.email || null,
    name: feedbackData.name || null,
    title: feedbackData.title || null,
    location: feedbackData.location || null,
    attachmentUrl: feedbackData.attachmentUrl || null,
    attachmentName: feedbackData.attachment?.originalname || null,
    status: 'new',
    adminNotes: null,
    createdAt: now,
    updatedAt: now,
    archivedAt: null,
    archivedBy: null
  }

  // Save to InstantDB
  await db.transact([
    tx.feedback[feedback.id].update(feedback)
  ])

  return feedback
}

export { db }
export default db
