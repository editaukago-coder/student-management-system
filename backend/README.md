# Backend - Laravel API

## Setup yang disarankan
Karena folder ini berisi kode inti, cara paling aman adalah membuat Laravel fresh project lalu salin file-file dari folder ini.

```bash
composer create-project laravel/laravel backend
cd backend
composer require laravel/sanctum
php artisan install:api
```

Salin folder/file berikut dari paket ini ke project Laravel fresh:
- app/Models/User.php
- app/Models/Student.php
- app/Http/Controllers/Api/AuthController.php
- app/Http/Controllers/Api/StudentController.php
- routes/api.php
- database/migrations/*
- database/seeders/DatabaseSeeder.php

Lalu jalankan:
```bash
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

Login admin:
- Email: admin@student.test
- Password: password
