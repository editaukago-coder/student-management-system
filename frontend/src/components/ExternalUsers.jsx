import { useEffect, useState } from 'react'
import { externalApi } from '../services/api'

export default function ExternalUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        const data = await externalApi.getUsers()
        setUsers(data.slice(0, 5))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-bold text-slate-900">Data Eksternal API</h2>
      <p className="mt-1 text-sm text-slate-500">Contoh data dari jsonplaceholder menggunakan Fetch API dan async/await.</p>

      {loading && <p className="mt-4 text-sm text-slate-500">Loading data eksternal...</p>}
      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        {users.map((user) => (
          <article key={user.id} className="rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">{user.name}</h3>
            <p className="mt-1 text-xs text-slate-500">{user.email}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
