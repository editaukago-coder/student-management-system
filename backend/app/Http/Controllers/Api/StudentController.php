<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::query()
            ->latest()
            ->get();

        return response()->json([
            'data' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateStudent($request);

        $student = Student::create($validated);

        return response()->json([
            'message' => 'Data mahasiswa berhasil ditambahkan.',
            'data' => $student,
        ], 201);
    }

    public function show(Student $student)
    {
        return response()->json([
            'data' => $student,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $this->validateStudent($request, $student->id);

        $student->update($validated);

        return response()->json([
            'message' => 'Data mahasiswa berhasil diperbarui.',
            'data' => $student,
        ]);
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json([
            'message' => 'Data mahasiswa berhasil dihapus.',
        ]);
    }

    private function validateStudent(Request $request, ?int $studentId = null): array
    {
        return $request->validate([
            'nim' => ['required', 'string', 'max:30', Rule::unique('students', 'nim')->ignore($studentId)],
            'name' => ['required', 'string', 'max:120'],
            'major' => ['required', 'string', 'max:120'],
            'semester' => ['required', 'integer', 'min:1', 'max:14'],
            'email' => ['required', 'email', 'max:120', Rule::unique('students', 'email')->ignore($studentId)],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(['Aktif', 'Cuti', 'Lulus', 'Nonaktif'])],
        ]);
    }
}
