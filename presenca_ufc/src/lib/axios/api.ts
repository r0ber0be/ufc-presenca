import axios from 'axios'

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
  baseURL: NEXT_PUBLIC_API_URL ?? '/api',
})