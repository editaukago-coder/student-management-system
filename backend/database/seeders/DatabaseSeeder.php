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

        $firstNames = ['Andi', 'Budi', 'Candra', 'Dedi', 'Eko', 'Fajar', 'Guntur', 'Hadi', 'Indra', 'Joko', 'Kurniawan', 'Lukman', 'Maulana', 'Nugroho', 'Pratama', 'Rizky', 'Santoso', 'Taufik', 'Wahyu', 'Yudi', 'Siti', 'Dewi', 'Rini', 'Sari', 'Indah', 'Fitri', 'Wati', 'Sri', 'Lestari', 'Putri', 'Kartika', 'Mega', 'Novi', 'Ayu', 'Dian', 'Ratna', 'Anisa', 'Siska', 'Yanti', 'Bambang'];
        $lastNames = ['Pratama', 'Santoso', 'Hidayat', 'Saputra', 'Kusuma', 'Wibowo', 'Gunawan', 'Setiawan', 'Nugraha', 'Wijaya', 'Siregar', 'Lubis', 'Nasution', 'Simanjuntak', 'Harahap', 'Ginting', 'Sembiring', 'Tarigan', 'Pane', 'Hasibuan', 'Rahma', 'Lestari', 'Putri', 'Sari', 'Fitriani', 'Utami', 'Wulandari', 'Kusumawati', 'Anggraini', 'Sulistiowati'];
        $majors = ['Teknik Informatika', 'Sistem Informasi', 'Teknik Komputer', 'Manajemen Informatika', 'Rekayasa Perangkat Lunak', 'Teknik Elektro'];
        $statuses = ['Aktif', 'Cuti', 'Lulus', 'Nonaktif'];
        $cities = ['Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Medan', 'Makassar', 'Palembang', 'Tangerang', 'Bekasi', 'Depok', 'Bogor', 'Malang', 'Solo', 'Cirebon'];
        $streets = ['Jl. Merdeka', 'Jl. Sudirman', 'Jl. Gajah Mada', 'Jl. Pemuda', 'Jl. Ahmad Yani', 'Jl. Diponegoro', 'Jl. Pahlawan', 'Jl. Gatot Subroto', 'Jl. Asia Afrika', 'Jl. Dago'];
        $prefixes = ['0812', '0813', '0821', '0852', '0878', '0896'];

        for ($i = 1; $i <= 169; $i++) {
            $firstName = $firstNames[($i - 1) % count($firstNames)];
            $lastName = $lastNames[(int)(($i - 1) / count($firstNames)) % count($lastNames)];
            $street = $streets[($i - 1) % count($streets)];
            $number = (($i - 1) % 150) + 1;
            $city = $cities[(int)(($i - 1) / count($streets)) % count($cities)];
            $prefix = $prefixes[($i - 1) % count($prefixes)];

            Student::updateOrCreate(
                ['nim' => sprintf('2024%05d', $i)],
                [
                    'name' => "$firstName $lastName",
                    'major' => $majors[($i - 1) % count($majors)],
                    'semester' => (($i - 1) % 8) + 1,
                    'email' => sprintf('mahasiswa%03d@student.test', $i),
                    'phone' => $prefix . sprintf('%08d', 12345000 + $i),
                    'address' => "$street No. $number, $city",
                    'status' => $statuses[($i - 1) % count($statuses)],
                ]
            );
        }
    }
}
