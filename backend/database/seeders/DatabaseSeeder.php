<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@student.test'],
            [
                'name' => 'Admin Edita Ukago',
                'password' => Hash::make('password'),
            ]
        );

        $students = [
            ['nim' => '2301001', 'name' => 'Andi Pratama', 'major' => 'Teknik Informatika', 'semester' => 3, 'email' => 'andi@student.test', 'phone' => '081234567801', 'address' => 'Bandung', 'status' => 'Aktif'],
            ['nim' => '2301002', 'name' => 'Siti Rahma', 'major' => 'Sistem Informasi', 'semester' => 5, 'email' => 'siti@student.test', 'phone' => '081234567802', 'address' => 'Jakarta', 'status' => 'Aktif'],
            ['nim' => '2301003', 'name' => 'Budi Santoso', 'major' => 'Teknik Informatika', 'semester' => 7, 'email' => 'budi@student.test', 'phone' => '081234567803', 'address' => 'Tegal', 'status' => 'Cuti'],
            ['nim' => '2301004', 'name' => 'Dewi Lestari', 'major' => 'Manajemen Informatika', 'semester' => 2, 'email' => 'dewi@student.test', 'phone' => '081234567804', 'address' => 'Cirebon', 'status' => 'Aktif'],
            ['nim' => '2301005', 'name' => 'Rizky Maulana', 'major' => 'Sistem Informasi', 'semester' => 8, 'email' => 'rizky@student.test', 'phone' => '081234567805', 'address' => 'Bekasi', 'status' => 'Lulus'],
        ];

        foreach ($students as $student) {
            Student::updateOrCreate(['nim' => $student['nim']], $student);
        }
    }
}
