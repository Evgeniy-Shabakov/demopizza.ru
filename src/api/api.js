import axios from 'axios'

export const serverOrigin = window.location.hostname === 'localhost'
   ? 'http://localhost:5000'
   : `https://${window.location.hostname}`

export const api = axios.create({
  baseURL: `${serverOrigin}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})