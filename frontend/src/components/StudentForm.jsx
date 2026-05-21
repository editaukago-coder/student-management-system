import { useEffect, useState } from 'react'
import { Student } from '../models/Student'

const initialForm = {
  nim: '',
  name: '',
  major: '',
  semester: 1,
  email: '',
  phone: '',
  address: '',
  status: 'Aktif',
}

export default function StudentForm({ selectedStudent, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(selectedStudent || initialForm)
    setError('')
  }, [selectedStudent])

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const student = new Student(form)

    if (!student.isValid()) {
      setError('Mohon isi semua data dengan benar. Semester harus 1-14 dan email harus valid.')
      return
    }

    onSubmit(student)
    setForm(initialForm)
    setError('')
  }

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-bold text-slate-900">
        {selectedStudent ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}
      </h2>
      <p className="mt-1 text-sm text-slate-500">Kelola data mahasiswa melalui form berikut.</p>

      {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
        <Input label="NIM" value={form.nim} onChange={(value) => updateField('nim', value)} />
        <Input label="Nama" value={form.name} onChange={(value) => updateField('name', value)} />
        <Input label="Jurusan" value={form.major} onChange={(value) => updateField('major', value)} />
        <Input label="Semester" type="number" value={form.semester} onChange={(value) => updateField('semester', value)} />
        <Input label="Email" type="email" value={form.email} onChange={(value) => updateField('email', value)} />
        <Input label="No HP" value={form.phone} onChange={(value) => updateField('phone', value)} />

        <label className="md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Alamat</span>
          <textarea
            value={form.address}
            onChange={(e) => updateField('address', e.target.value)}
            className="mt-1 min-h-24 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            required
          />
        </label>

        <label>
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            value={form.status}
            onChange={(e) => updateField('status', e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option>Aktif</option>
            <option>Cuti</option>
            <option>Lulus</option>
            <option>Nonaktif</option>
          </select>
        </label>

        <div className="flex items-end gap-3">
          <button
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Menyimpan...' : selectedStudent ? 'Update' : 'Simpan'}
          </button>
          {selectedStudent && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

function Input({ label, value, onChange, type = 'text' }) {
  return (
    <label>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        min={type === 'number' ? 1 : undefined}
        max={type === 'number' ? 14 : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        required
      />
    </label>
  )
}
