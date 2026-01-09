import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from root directory (two levels up from utils/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const config = {
  passphrase: process.env.PASSPHRASE,
  recaptcha: {
    secretKey: process.env.RECAPTCHA_SECRET_KEY
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    to: process.env.EMAIL_TO || 'bparish@deroyal.com'
  }
}

// Validate required configuration
export const validateConfig = () => {
  const required = [
    { key: 'PASSPHRASE', value: config.passphrase },
    { key: 'RECAPTCHA_SECRET_KEY', value: config.recaptcha.secretKey },
    { key: 'EMAIL_USER', value: config.email.user },
    { key: 'EMAIL_PASSWORD', value: config.email.password }
  ]

  const missing = required.filter(({ value }) => !value).map(({ key }) => key)

  if (missing.length > 0) {
    console.warn(`⚠️  Warning: Missing environment variables: ${missing.join(', ')}`)
    console.warn('Please check your .env file')
  }

  return missing.length === 0
}
