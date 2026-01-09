// Test mode email - logs to console instead of sending
export const sendFeedbackEmailTest = async (feedbackData) => {
  console.log('\n' + '='.repeat(60))
  console.log('📧 TEST MODE: Email would be sent with this content:')
  console.log('='.repeat(60))
  console.log(`To: ${process.env.EMAIL_TO || 'bparish@deroyal.com'}`)
  console.log(`Subject: New Employee Feedback Submission - ${feedbackData.type}`)
  console.log('\n📋 Submission Details:')
  console.log(`  Type: ${feedbackData.type}`)
  console.log(`  Description: ${feedbackData.description.substring(0, 100)}...`)
  console.log(`  Anonymous: ${feedbackData.isAnonymous ? 'Yes' : 'No'}`)
  
  if (!feedbackData.isAnonymous) {
    console.log(`\n👤 Contact Information:`)
    console.log(`  Email: ${feedbackData.email || 'Not provided'}`)
    if (feedbackData.name) console.log(`  Name: ${feedbackData.name}`)
    if (feedbackData.title) console.log(`  Title: ${feedbackData.title}`)
    if (feedbackData.location) console.log(`  Location: ${feedbackData.location}`)
  }
  
  if (feedbackData.attachment) {
    console.log(`\n📎 Attachment: ${feedbackData.attachment.originalname} (${feedbackData.attachment.size} bytes)`)
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('✅ TEST MODE: Form submission successful!')
  console.log('='.repeat(60) + '\n')
  
  // Simulate successful send
  return Promise.resolve()
}
