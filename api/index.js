import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { body, validationResult } from 'express-validator'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { sendFeedbackEmail } from './utils/email.js'
import { sendFeedbackEmailTest } from './utils/email-test.js'
import { verifyCaptcha } from './utils/captcha.js'
import { saveFeedback } from './db/instantdb-config.js'

// Toggle test mode - set to true to skip actual email sending
const EMAIL_TEST_MODE = true // TEMPORARILY FORCING TEST MODE
const USE_DATABASE = true // Use InstantDB for storage

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from root directory (one level up from api/)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Validate passphrase endpoint
app.post('/api/validate-passphrase', 
  body('passphrase').notEmpty().withMessage('Passphrase is required'),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { passphrase } = req.body
    const correctPassphrase = process.env.PASSPHRASE

    if (passphrase === correctPassphrase) {
      return res.json({ 
        success: true, 
        token: 'authenticated',
        message: 'Access granted' 
      })
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid passphrase' 
      })
    }
  }
)

// Submit feedback endpoint
app.post('/api/submit-feedback',
  upload.single('attachment'),
  [
    body('type').notEmpty().withMessage('Type is required'),
    body('description').notEmpty().withMessage('Description is required')
      .isLength({ max: 5000 }).withMessage('Description must not exceed 5000 characters'),
    body('isAnonymous').isBoolean(),
    body('email').if(body('isAnonymous').equals('false'))
      .notEmpty().withMessage('Email is required when not anonymous')
      .isEmail().withMessage('Valid email is required'),
    body('honeypot').isEmpty().withMessage('Bot detected')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      // Check honeypot
      if (req.body.honeypot) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid submission' 
        })
      }

      // Verify CAPTCHA
      const captchaToken = req.body.captchaToken
      if (!captchaToken) {
        return res.status(400).json({ 
          success: false, 
          message: 'CAPTCHA verification required' 
        })
      }

      const captchaValid = await verifyCaptcha(captchaToken)
      if (!captchaValid) {
        return res.status(400).json({ 
          success: false, 
          message: 'CAPTCHA verification failed' 
        })
      }

      // Prepare feedback data
      const feedbackData = {
        type: req.body.type,
        description: req.body.description,
        isAnonymous: req.body.isAnonymous === 'true',
        email: req.body.email || null,
        name: req.body.name || null,
        title: req.body.title || null,
        location: req.body.location || null,
        attachment: req.file || null
      }

      // Save to database
      if (USE_DATABASE) {
        console.log('💾 Saving feedback to InstantDB...')
        const savedFeedback = await saveFeedback(feedbackData)
        console.log(`✅ Feedback saved with ID: ${savedFeedback.id}`)
        
        res.json({ 
          success: true, 
          message: 'Feedback submitted successfully',
          feedbackId: savedFeedback.id
        })
      } else {
        // Send email (or log in test mode)
        if (EMAIL_TEST_MODE) {
          console.log('⚠️  EMAIL_TEST_MODE is enabled - not sending real email')
          await sendFeedbackEmailTest(feedbackData)
        } else {
          await sendFeedbackEmail(feedbackData)
        }

        res.json({ 
          success: true, 
          message: 'Feedback submitted successfully' 
        })
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      res.status(500).json({ 
        success: false, 
        message: 'Failed to submit feedback. Please try again.' 
      })
    }
  }
)

// Admin authentication endpoints
import { generateCode, storeCode, verifyCode, generateSessionToken } from './utils/auth-codes.js'

// Send magic code to admin email
app.post('/api/send-magic-code', [
  body('email').isEmail().withMessage('Invalid email address'),
  body('email').custom(email => {
    if (!email.toLowerCase().endsWith('@deroyal.com')) {
      throw new Error('Only @deroyal.com email addresses are allowed')
    }
    return true
  })
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }

  const { email } = req.body
  const code = generateCode()
  
  // Store the code
  storeCode(email, code)
  
  // In production, send email here
  // For now, just log it to console
  console.log('\n📧 ==========================================')
  console.log('   Magic Code for Admin Login')
  console.log('==========================================')
  console.log('   Email:', email)
  console.log('   Code:', code)
  console.log('   Valid for: 10 minutes')
  console.log('==========================================\n')
  
  res.status(200).json({ 
    success: true, 
    message: 'Code sent successfully',
    // REMOVE THIS IN PRODUCTION - only for testing
    testCode: code 
  })
})

// Verify magic code
app.post('/api/verify-magic-code', [
  body('email').isEmail().withMessage('Invalid email address'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }

  const { email, code } = req.body
  
  if (verifyCode(email, code)) {
    const sessionToken = generateSessionToken()
    console.log('✅ Admin authenticated:', email)
    res.status(200).json({ 
      success: true, 
      message: 'Authentication successful',
      sessionToken,
      user: { email }
    })
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired code' 
    })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File size exceeds 5MB limit' 
      })
    }
    return res.status(400).json({ 
      success: false, 
      message: 'File upload error: ' + err.message 
    })
  }
  
  if (err.message === 'Invalid file type') {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid file type. Please upload PDF, DOC, XLS, or image files.' 
    })
  }
  
  res.status(500).json({ 
    success: false, 
    message: 'An unexpected error occurred. Please try again.' 
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  })
})

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app
