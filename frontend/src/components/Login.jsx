import { useState } from 'react'
import { Lock } from 'lucide-react'
import { authApi, setToken } from '../services/api'
import { toast } from 'react-hot-toast'

export default function Login({ onAuthenticated }) {
  const [form, setForm] = useState({ email: 'admin@student.test', password: 'password' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await authApi.login(form)
      setToken(result.token)
      onAuthenticated(result.user)
      toast.success('Login berhasil.')
    } catch (err) {
      setError(err.message)
      toast.error(err.message || 'Login gagal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-white to-slate-100 px-4">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Login Admin</h1>
          <p className="mt-2 text-sm text-slate-500">Masuk untuk mengelola data mahasiswa.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="mt-6 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          Demo admin: admin@student.test / password
        </p>
      </section>
    </main>
  )
}
