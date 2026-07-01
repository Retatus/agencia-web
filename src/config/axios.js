// config/axios.js
import axios from 'axios'
//import { getToken } from '@/services/auth.service'
import { useUserStore } from '../stores/user'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// api.interceptors.request.use((config) => {
//   const token = getToken()

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }

//   return config
// })

api.interceptors.request.use((config) => {
  const userStore = useUserStore()

  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }

  return config
})

export default api
