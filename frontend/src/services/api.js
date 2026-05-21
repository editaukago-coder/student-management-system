const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export function getToken() {
  return localStorage.getItem('admin_token')
}

export function setToken(token) {
  localStorage.setItem('admin_token', token)
}

export function clearToken() {
  localStorage.removeItem('admin_token')
}

async function request(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    const message = data?.message || 'Terjadi kesalahan pada server.'
    throw new Error(message)
  }

  return data
}

export const authApi = {
  login: (payload) => request('/login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/logout', { method: 'POST' }),
  me: () => request('/me'),
}

export const studentApi = {
  getAll: () => request('/students'),
  create: (payload) => request('/students', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => request(`/students/${id}`, { method: 'DELETE' }),
}

export const externalApi = {
  getUsers: async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!response.ok) throw new Error('Gagal mengambil data eksternal.')
    return response.json()
  },
}
