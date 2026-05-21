import { useEffect, useMemo, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import Swal from 'sweetalert2'
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
  const [selectedMajor, setSelectedMajor] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [sortOrder, setSortOrder] = useState('')
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
        const successMsg = 'Data mahasiswa berhasil diperbarui.'
        setMessage(successMsg)
        toast.success(successMsg)
      } else {
        await studentApi.create(student.toPayload())
        const successMsg = 'Data mahasiswa berhasil ditambahkan.'
        setMessage(successMsg)
        toast.success(successMsg)
      }

      setSelectedStudent(null)
      await loadStudents()
    } catch (err) {
      setError(err.message)
      toast.error(err.message || 'Gagal menyimpan data mahasiswa.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Yakin ingin menghapus data mahasiswa ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-3xl',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true)
          setError('')
          setMessage('')
          await studentApi.remove(id)
          const successMsg = 'Data mahasiswa berhasil dihapus.'
          setMessage(successMsg)
          toast.success(successMsg)
          await loadStudents()
        } catch (err) {
          setError(err.message)
          toast.error(err.message || 'Gagal menghapus data mahasiswa.')
        } finally {
          setLoading(false)
        }
      }
    })
  }

  async function handleLogout() {
    try {
      await authApi.logout()
      toast.success('Logout berhasil.')
    } catch {
      toast.success('Logout berhasil.')
    } finally {
      clearToken()
      setAdmin(null)
      setStudents([])
      setSearch('')
      setSelectedMajor('')
      setSelectedStatus('')
      setSortOrder('')
    }
  }

  const majors = useMemo(() => {
    return Array.from(new Set(students.map((student) => student.major).filter(Boolean))).sort()
  }, [students])

  const filteredStudents = useMemo(() => {
    let result = [...students]

    if (search.trim()) {
      const keyword = search.toLowerCase()
      result = result.filter((student) => {
        return [student.nim, student.name, student.major, student.email, student.status]
          .join(' ')
          .toLowerCase()
          .includes(keyword)
      })
    }

    if (selectedMajor) {
      result = result.filter((student) => student.major === selectedMajor)
    }

    if (selectedStatus) {
      result = result.filter((student) => student.status === selectedStatus)
    }

    if (sortOrder === 'asc') {
      result.sort((a, b) => a.semester - b.semester)
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => b.semester - a.semester)
    }

    return result
  }, [students, search, selectedMajor, selectedStatus, sortOrder])

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">Memuat aplikasi...</div>
  }

  if (!admin) {
    return (
      <>
        <Toaster position="top-right" reverseOrder={false} />
        <Login onAuthenticated={setAdmin} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Toaster position="top-right" reverseOrder={false} />
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
          selectedMajor={selectedMajor}
          setSelectedMajor={setSelectedMajor}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          majors={majors}
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
