import { useEffect, useMemo, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import Swal from 'sweetalert2'
import Navbar from './components/Navbar'
import Login from './components/Login'
import StudentForm from './components/StudentForm'
import StudentTable from './components/StudentTable'
import ExternalUsers from './components/ExternalUsers'
import { Users, UserCheck, UserX, GraduationCap, BarChart3, PieChart } from 'lucide-react'
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

  const stats = useMemo(() => {
    const total = students.length
    const active = students.filter((s) => s.status === 'Aktif').length
    const inactive = students.filter((s) => s.status === 'Cuti' || s.status === 'Nonaktif').length
    const totalMajors = new Set(students.map((s) => s.major).filter(Boolean)).size

    const semesters = students.map((s) => Number(s.semester)).filter((sem) => !isNaN(sem) && sem > 0)
    const avgSemester = semesters.length > 0 ? (semesters.reduce((sum, s) => sum + s, 0) / semesters.length).toFixed(1) : '0.0'

    const majorCounts = {}
    students.forEach((s) => {
      if (s.major) {
        majorCounts[s.major] = (majorCounts[s.major] || 0) + 1
      }
    })
    const majorsData = Object.entries(majorCounts)
      .map(([name, count]) => ({ name, count, percentage: total > 0 ? ((count / total) * 100).toFixed(0) : 0 }))
      .sort((a, b) => b.count - a.count)

    const semCounts = {}
    students.forEach((s) => {
      const sem = Number(s.semester)
      if (!isNaN(sem) && sem > 0) {
        semCounts[sem] = (semCounts[sem] || 0) + 1
      }
    })

    return {
      total,
      active,
      inactive,
      totalMajors,
      avgSemester,
      majorsData,
      semCounts,
    }
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
        <section className="rounded-3xl bg-linear-to-r from-blue-600 to-slate-900 p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold">Dashboard Mahasiswa</h2>
          <p className="mt-2 max-w-2xl text-sm text-blue-100">
            Kelola data mahasiswa dengan fitur tambah, tampil, edit, hapus, pencarian, validasi input, dan integrasi API eksternal.
          </p>
        </section>

        <section className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <StatCard
            label="Total Mahasiswa"
            value={stats.total}
            description="Semua data terdaftar"
            icon={Users}
            color="from-blue-500 to-indigo-600"
          />
          <StatCard
            label="Mahasiswa Aktif"
            value={stats.active}
            description={`${stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(0) : 0}% dari total`}
            icon={UserCheck}
            color="from-emerald-500 to-teal-600"
          />
          <StatCard
            label="Cuti / Nonaktif"
            value={stats.inactive}
            description={`${stats.total > 0 ? ((stats.inactive / stats.total) * 100).toFixed(0) : 0}% dari total`}
            icon={UserX}
            color="from-rose-500 to-orange-600"
          />
          <StatCard
            label="Rata-rata Semester"
            value={`Sem. ${stats.avgSemester}`}
            description="Tingkat studi mahasiswa"
            icon={GraduationCap}
            color="from-amber-500 to-yellow-600"
          />
          <StatCard
            label="Jumlah Jurusan"
            value={stats.totalMajors}
            description="Bidang studi aktif"
            icon={BarChart3}
            color="from-purple-500 to-fuchsia-600"
          />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <BarChart3 className="text-blue-600" size={20} />
              <h3 className="text-base font-bold text-slate-900">Distribusi Semester</h3>
            </div>
            {stats.total === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-slate-400">
                Tidak ada data mahasiswa untuk ditampilkan.
              </div>
            ) : (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                  const count = stats.semCounts[sem] || 0
                  const percent = stats.total > 0 ? (count / stats.total) * 100 : 0
                  return (
                    <div key={sem} className="flex items-center gap-3">
                      <span className="w-12 text-xs font-semibold text-slate-600">Sem. {sem}</span>
                      <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-xs font-bold text-slate-700">{count} mhs</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <PieChart className="text-blue-600" size={20} />
              <h3 className="text-base font-bold text-slate-900">Penyebaran Jurusan</h3>
            </div>
            {stats.total === 0 || stats.majorsData.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-slate-400">
                Tidak ada data jurusan untuk ditampilkan.
              </div>
            ) : (
              <div className="space-y-4 max-h-[256px] overflow-y-auto pr-1">
                {stats.majorsData.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.name}</span>
                      <span className="font-bold text-slate-600">{item.count} mhs ({item.percentage}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
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

function StatCard({ label, value, description, icon: Icon, color }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>
        <div className={`rounded-2xl bg-linear-to-br ${color} p-3 text-white shadow-sm`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}
