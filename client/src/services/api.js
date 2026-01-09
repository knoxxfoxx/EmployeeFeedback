import axios from 'axios'

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

export const validatePassphrase = async (passphrase) => {
  const response = await axios.post(`${API_BASE_URL}/validate-passphrase`, {
    passphrase
  })
  return response.data
}

export const submitFeedback = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/submit-feedback`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}
