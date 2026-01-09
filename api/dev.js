import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import app from './index.js'
import { validateConfig } from './utils/config.js'

const PORT = process.env.PORT || 3001

console.log('═══════════════════════════════════════════════════')
console.log('   DeRoyal Employee Feedback System - API Server')
console.log('═══════════════════════════════════════════════════')

const configValid = validateConfig()

app.listen(PORT, () => {
  console.log(`\n🚀 API Server running on http://localhost:${PORT}`)
  console.log(`\n📋 Configuration Status:`)
  console.log(`   📧 Email: ${process.env.EMAIL_USER || '❌ Not configured'}`)
  console.log(`   🔐 Passphrase: ${process.env.PASSPHRASE ? '✅ Configured' : '❌ Not configured'}`)
  console.log(`   🤖 reCAPTCHA: ${process.env.RECAPTCHA_SECRET_KEY ? '✅ Configured' : '❌ Not configured'}`)
  
  if (!configValid) {
    console.log(`\n⚠️  WARNING: Some required configuration is missing!`)
    console.log(`   Please check your .env file and restart the server.`)
  } else {
    console.log(`\n✅ All configuration valid - Ready to accept requests!`)
  }
  
  console.log(`\n📚 API Endpoints:`)
  console.log(`   POST /api/validate-passphrase`)
  console.log(`   POST /api/submit-feedback`)
  console.log(`   GET  /api/health`)
  console.log('\n═══════════════════════════════════════════════════\n')
})
