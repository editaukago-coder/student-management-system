import { Edit, Trash2, Search, SlidersHorizontal } from 'lucide-react'

export default function StudentTable({
  students,
  search,
  setSearch,
  selectedMajor,
  setSelectedMajor,
  selectedStatus,
  setSelectedStatus,
  sortOrder,
  setSortOrder,
  majors,
  onEdit,
  onDelete,
}) {
  const hasActiveFilters = Boolean(search || selectedMajor || selectedStatus || sortOrder)

  function handleResetFilters() {
    setSearch('')
    setSelectedMajor('')
    setSelectedStatus('')
    setSortOrder('')
  }

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Data Mahasiswa</h2>
          <p className="text-sm text-slate-500">{students.length} data ditampilkan</p>
        </div>

        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIM, jurusan..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-700">
            <SlidersHorizontal size={18} className="text-blue-600" />
            <span className="text-sm font-bold tracking-wide uppercase text-slate-700">Filter & Urutan</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              Bersihkan Filter
            </button>
          )}
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">
              Jurusan
            </label>
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Semua Jurusan</option>
              {majors.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Cuti">Cuti</option>
              <option value="Lulus">Lulus</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">
              Urutkan Semester
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Bawaan</option>
              <option value="asc">Semester: Terendah ke Tertinggi</option>
              <option value="desc">Semester: Tertinggi ke Terendah</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[900px] border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">NIM</th>
              <th className="px-3 py-2">Nama</th>
              <th className="px-3 py-2">Jurusan</th>
              <th className="px-3 py-2">Semester</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="rounded-2xl bg-slate-50 text-slate-700">
                <td className="rounded-l-2xl px-3 py-4 font-semibold">{student.nim}</td>
                <td className="px-3 py-4">{student.name}</td>
                <td className="px-3 py-4">{student.major}</td>
                <td className="px-3 py-4">{student.semester}</td>
                <td className="px-3 py-4">{student.email}</td>
                <td className="px-3 py-4">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {student.status}
                  </span>
                </td>
                <td className="rounded-r-2xl px-3 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="rounded-xl bg-amber-100 p-2 text-amber-700 transition hover:bg-amber-200"
                      aria-label="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="rounded-xl bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
                      aria-label="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan="7" className="py-10 text-center">
                  {hasActiveFilters ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <p className="font-semibold text-slate-700">Tidak ada hasil yang cocok</p>
                      <p className="mt-1 text-sm text-slate-500">Coba ubah kata kunci pencarian atau bersihkan filter.</p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-4 rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                      >
                        Bersihkan Filter
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-500">Tidak ada data mahasiswa.</span>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
