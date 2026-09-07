import { api } from './api'
import { authUser } from '@/composables/useAuthUser'

let isRefreshing = false
let failedQueue = []

function processQueue(error) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve()
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.data?.code !== 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
      return Promise.reject(error)
    }

    if (originalRequest.url === '/auth/refresh') {
      authUser.value = null
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(() => api(originalRequest))
    }

    isRefreshing = true

    try {
      await api.post('/auth/refresh')
    } catch (refreshError) {
      isRefreshing = false
      processQueue(refreshError)
      authUser.value = null
      return Promise.reject(refreshError)
    }

    isRefreshing = false
    processQueue(null)
    return api(originalRequest)
  }
)