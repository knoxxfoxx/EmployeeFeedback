import { init } from '@instantdb/react'

// Initialize InstantDB
const APP_ID = import.meta.env.VITE_INSTANT_APP_ID

console.log('Initializing InstantDB...')
console.log('APP_ID from env:', APP_ID)
console.log('All env vars:', import.meta.env)

if (!APP_ID) {
  console.error('❌ Missing VITE_INSTANT_APP_ID environment variable')
  throw new Error('VITE_INSTANT_APP_ID is required')
}

console.log('✅ Initializing InstantDB with App ID:', APP_ID)

const db = init({
  appId: APP_ID
})

console.log('✅ InstantDB initialized successfully')
console.log('db.auth available:', !!db.auth)

// Schema definition for type safety
export const schema = {
  feedback: {
    type: 'object',
    properties: {
      type: { type: 'string' },
      description: { type: 'string' },
      isAnonymous: { type: 'boolean' },
      email: { type: 'string', nullable: true },
      name: { type: 'string', nullable: true },
      title: { type: 'string', nullable: true },
      location: { type: 'string', nullable: true },
      attachmentUrl: { type: 'string', nullable: true },
      attachmentName: { type: 'string', nullable: true },
      status: { type: 'string', default: 'new' },
      adminNotes: { type: 'string', nullable: true },
      createdAt: { type: 'number' },
      updatedAt: { type: 'number' },
      archivedAt: { type: 'number', nullable: true },
      archivedBy: { type: 'string', nullable: true }
    }
  }
}

export { db }
export default db
