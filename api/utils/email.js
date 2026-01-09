import nodemailer from 'nodemailer'

export const sendFeedbackEmail = async (feedbackData) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // Use SSL for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    }
  })

  // Build email HTML
  let emailHTML = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #003087; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
          .field { margin-bottom: 15px; }
          .field-label { font-weight: bold; color: #003087; }
          .field-value { margin-top: 5px; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Employee Feedback Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">Type of Submission:</div>
              <div class="field-value">${feedbackData.type}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Description:</div>
              <div class="field-value">${feedbackData.description}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Submission Type:</div>
              <div class="field-value">${feedbackData.isAnonymous ? 'Anonymous' : 'Not Anonymous'}</div>
            </div>
  `

  if (!feedbackData.isAnonymous) {
    emailHTML += `
            <div class="field">
              <div class="field-label">Contact Information:</div>
              <div class="field-value">
                <strong>Email:</strong> ${feedbackData.email || 'Not provided'}<br>
                ${feedbackData.name ? `<strong>Name:</strong> ${feedbackData.name}<br>` : ''}
                ${feedbackData.title ? `<strong>Title:</strong> ${feedbackData.title}<br>` : ''}
                ${feedbackData.location ? `<strong>Location:</strong> ${feedbackData.location}` : ''}
              </div>
            </div>
    `
  }

  emailHTML += `
          </div>
          <div class="footer">
            <p>This submission was made through the DeRoyal Employee Feedback System</p>
            <p>Timestamp: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
    </html>
  `

  // Prepare email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO || 'bparish@deroyal.com',
    subject: `New Employee Feedback Submission - ${feedbackData.type}`,
    html: emailHTML,
    attachments: []
  }

  // Add attachment if present
  if (feedbackData.attachment) {
    mailOptions.attachments.push({
      filename: feedbackData.attachment.originalname,
      content: feedbackData.attachment.buffer
    })
  }

  // Send email
  await transporter.sendMail(mailOptions)
}
