import axios from 'axios'

export const verifyCaptcha = async (token) => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: token
        }
      }
    )

    return response.data.success
  } catch (error) {
    console.error('CAPTCHA verification error:', error)
    return false
  }
}
