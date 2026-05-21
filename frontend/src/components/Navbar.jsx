import { GraduationCap, LogOut } from 'lucide-react'

export default function Navbar({ admin, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-600 p-2 text-white">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Sistem Manajemen Mahasiswa</h1>
            <p className="text-xs text-slate-500">CRUD, React, Laravel API, MySQL</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 sm:inline">
            {admin?.name || 'Admin'}
          </span>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
