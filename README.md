# Sistem Manajemen Mahasiswa

Stack:
- Frontend: React + Vite + Tailwind CSS
- Backend: Laravel REST API + Sanctum
- Database: MySQL

Fitur:
- Login admin
- CRUD mahasiswa
- Search/filter mahasiswa
- Validasi form
- JavaScript OOP melalui class Student
- Fetch API + async/await
- Loading state
- Error handling
- API eksternal jsonplaceholder
- Responsive UI

## Menjalankan Backend

Disarankan buat Laravel fresh project agar vendor dan struktur framework lengkap:

```bash
composer create-project laravel/laravel backend
cd backend
composer require laravel/sanctum
php artisan install:api
```

Kemudian salin isi folder `backend` dari paket ini ke project Laravel tersebut.

Buat database MySQL:
```sql
CREATE DATABASE student_management;
```

Konfigurasi `.env`:
```env
DB_DATABASE=student_management
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan:
```bash
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

## Menjalankan Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Login admin:
- Email: admin@student.test
- Password: password
