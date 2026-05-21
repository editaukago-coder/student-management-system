import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Login from './components/Login'
import StudentForm from './components/StudentForm'
import StudentTable from './components/StudentTable'
import ExternalUsers from './components/ExternalUsers'
import { authApi, clearToken, getToken, studentApi } from './services/api'

export default function App() {
  const [admin, setAdmin] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function checkSession() {
      if (!getToken()) {
        setAuthLoading(false)
        return
      }

      try {
        const result = await authApi.me()
        setAdmin(result.user)
      } catch {
        clearToken()
      } finally {
        setAuthLoading(false)
      }
    }

    checkSession()
  }, [])

  useEffect(() => {
    if (admin) loadStudents()
  }, [admin])

  async function loadStudents() {
    try {
      setError('')
      setLoading(true)
      const result = await studentApi.getAll()
      setStudents(result.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(student) {
    try {
      setLoading(true)
      setError('')
      setMessage('')

      if (selectedStudent) {
        await studentApi.update(selectedStudent.id, student.toPayload())
        setMessage('Data mahasiswa berhasil diperbarui.')
      } else {
        await studentApi.create(student.toPayload())
        setMessage('Data mahasiswa berhasil ditambahkan.')
      }

      setSelectedStudent(null)
      await loadStudents()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Yakin ingin menghapus data mahasiswa ini?')
    if (!confirmed) return

    try {
      setLoading(true)
      setError('')
      setMessage('')
      await studentApi.remove(id)
      setMessage('Data mahasiswa berhasil dihapus.')
      await loadStudents()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await authApi.logout()
    } catch {
      // token tetap dihapus di client
    } finally {
      clearToken()
      setAdmin(null)
      setStudents([])
    }
  }

  const filteredStudents = useMemo(() => {
    const keyword = search.toLowerCase()
    return students.filter((student) => {
      return [student.nim, student.name, student.major, student.email, student.status]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    })
  }, [students, search])

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">Memuat aplikasi...</div>
  }

  if (!admin) {
    return <Login onAuthenticated={setAdmin} />
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar admin={admin} onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-slate-900 p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold">Dashboard Mahasiswa</h2>
          <p className="mt-2 max-w-2xl text-sm text-blue-100">
            Kelola data mahasiswa dengan fitur tambah, tampil, edit, hapus, pencarian, validasi input, dan integrasi API eksternal.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Stat label="Total Mahasiswa" value={students.length} />
            <Stat label="Mahasiswa Aktif" value={students.filter((item) => item.status === 'Aktif').length} />
            <Stat label="Jumlah Jurusan" value={new Set(students.map((item) => item.major)).size} />
          </div>
        </section>

        {message && <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">{message}</div>}
        {error && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <StudentForm
          selectedStudent={selectedStudent}
          onSubmit={handleSave}
          onCancel={() => setSelectedStudent(null)}
          loading={loading}
        />

        {loading && <p className="text-sm text-slate-500">Loading data...</p>}

        <StudentTable
          students={filteredStudents}
          search={search}
          setSearch={setSearch}
          onEdit={setSelectedStudent}
          onDelete={handleDelete}
        />

        <ExternalUsers />
      </main>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20">
      <p className="text-sm text-blue-100">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}
