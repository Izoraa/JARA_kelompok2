# 📄 Dokumentasi Fitur — JARA Kelompok 2
### Programmer C (Hasta)
---

## Daftar Fitur

| No | Kode SRS | Nama Fitur | Branch | Status |
|---|---|---|---|---|
| 1 | SRS-05 | Tambah Anggota ke Project | `fitur_tambah_pengguna_sbg_anggota_by_hasta` | ✅ Selesai |
| 2 | SRS-06 | Assign Task & Atur Status | `fitur/assign_task_dan_status` | ✅ Selesai |
| 3 | SRS-TSK-01 | Buat Task Baru ke Project | `fitur/manajemen_tugas_dan_alur_kerja` | ✅ Selesai |
| 4 | SRS-TSK-02 | Atur Prioritas & Deadline Task | `fitur/manajemen_tugas_dan_alur_kerja` | ✅ Selesai |
| 5 | SRS-TSK-03 | Tandai Task Selesai | `fitur/manajemen_tugas_dan_alur_kerja` | ✅ Selesai |

---

## 1. SRS-05 — Tambah Pengguna sebagai Anggota Project

### Deskripsi
Sebagai pemilik project, saya dapat menambahkan pengguna lain sebagai anggota project agar mereka dapat berkolaborasi dalam project tersebut.

### Alur Kerja
1. Pemilik project membuka halaman detail project (`/projects/{id}`).
2. Pemilik memasukkan **nama** atau **email** pengguna di form input.
3. Sistem mencari pengguna berdasarkan `name` atau `email`.
4. Jika ditemukan → pengguna ditambahkan ke tabel pivot `project_user`.
5. Daftar anggota project diperbarui secara otomatis.

### Endpoint API
| Method | URL | Controller | Keterangan |
|---|---|---|---|
| `POST` | `/projects/{project}/members` | `ProjectMemberController@store` | Tambah anggota ke project |

### Validasi
- Pengguna harus ditemukan (berdasarkan `name` atau `email`).
- Pengguna tidak boleh sudah menjadi anggota project.
- Pemilik project tidak bisa menambahkan dirinya sendiri.

### File Terkait
| File | Keterangan |
|---|---|
| `app/Http/Controllers/ProjectMemberController.php` | Controller untuk menambah anggota |
| `app/Models/Project.php` | Relasi `members()` (BelongsToMany) |
| `database/migrations/..._create_project_user_table.php` | Tabel pivot `project_user` |
| `resources/js/pages/Projects/Show.tsx` | UI form tambah anggota & daftar anggota |
| `routes/web.php` | Route `projects.members.store` |

---

## 2. SRS-06 — Assign Task & Atur Status Task

### Deskripsi
- **SRS-06A**: Sebagai pemilik project, saya dapat meng-assign task ke anggota project.
- **SRS-06B**: Sebagai pengguna, saya dapat mengubah status task (Todo → In Progress → Done).

### Alur Kerja

**6A — Assign Task:**
1. Di halaman detail project, setiap task memiliki dropdown "Assign To".
2. Dropdown berisi daftar anggota project.
3. Pemilik memilih anggota → kolom `assigned_to` di tabel `tasks` diperbarui.

**6B — Ubah Status:**
1. Setiap task memiliki dropdown status.
2. Pengguna memilih status baru (Todo / In Progress / Done).
3. Kolom `status` di tabel `tasks` diperbarui.
4. Dropdown berubah warna sesuai status (Abu-abu = Todo, Kuning = In Progress, Hijau = Done).

### Endpoint API
| Method | URL | Controller | Keterangan |
|---|---|---|---|
| `PATCH` | `/tasks/{task}/assign` | `TaskController@assign` | Assign task ke user |
| `PATCH` | `/tasks/{task}/status` | `TaskController@updateStatus` | Ubah status task |

### Validasi
- `user_id` harus valid (ada di tabel `users`).
- `status` harus salah satu dari: `Todo`, `In Progress`, `Done`.

### File Terkait
| File | Keterangan |
|---|---|
| `app/Http/Controllers/TaskController.php` | Method `assign()` dan `updateStatus()` |
| `app/Models/Task.php` | Model Task dengan relasi `assignee()` |
| `database/migrations/..._add_assigned_to_and_status_to_tasks_table.php` | Migrasi tambah kolom `assigned_to` & `status` |
| `resources/js/pages/Projects/Show.tsx` | Dropdown assign & dropdown status |
| `routes/web.php` | Route `tasks.assign` & `tasks.update-status` |

---

## 3. SRS-TSK-01 — Membuat Task Baru ke dalam Project

### Deskripsi
Sebagai pengguna, saya dapat membuat tugas baru dan memasukkannya ke dalam project tertentu, lengkap dengan judul, deskripsi, prioritas, dan deadline.

### Alur Kerja
1. Pengguna membuka halaman detail project.
2. Pengguna mengisi form: **Judul** (wajib), **Deskripsi** (opsional), **Priority** (dropdown), **Deadline** (date picker).
3. Klik tombol "Tambah Task".
4. Sistem memvalidasi input (judul wajib diisi, deadline tidak boleh di masa lampau).
5. Task baru disimpan ke database dengan `project_id` yang sesuai.
6. Daftar task diperbarui otomatis.

### Endpoint API
| Method | URL | Controller | Keterangan |
|---|---|---|---|
| `POST` | `/tasks` | `TaskController@store` | Buat task baru |

### Validasi
- `project_id` wajib dan harus valid.
- `title` wajib, string, maks 255 karakter.
- `description` opsional.
- `priority` wajib, salah satu dari: `Low`, `Medium`, `High`.
- `deadline` opsional, harus tanggal ≥ hari ini.

### File Terkait
| File | Keterangan |
|---|---|
| `app/Http/Controllers/TaskController.php` | Method `store()` |
| `app/Models/Task.php` | Model Task dengan `$fillable` |
| `resources/js/pages/Projects/Show.tsx` | Form tambah task (TSK-01 section) |
| `routes/web.php` | Route `tasks.store` |

---

## 4. SRS-TSK-02 — Menetapkan Prioritas & Deadline Task

### Deskripsi
Sebagai pengguna, saya dapat menetapkan prioritas (Low/Medium/High) dan tenggat waktu (deadline) pada setiap tugas agar urutan pekerjaan menjadi jelas.

### Alur Kerja
1. Di daftar task, setiap baris memiliki **dropdown priority** dan **date picker deadline**.
2. Pengguna mengubah priority → dropdown berubah warna:
   - Abu-abu = Low
   - Kuning = Medium
   - Merah = High
3. Pengguna memilih tanggal deadline dari date picker.
4. Perubahan langsung tersimpan ke database (tanpa tombol "Save" terpisah).

### Endpoint API
| Method | URL | Controller | Keterangan |
|---|---|---|---|
| `PATCH` | `/tasks/{task}` | `TaskController@update` | Update priority & deadline |

### Validasi
- `priority` wajib, salah satu dari: `Low`, `Medium`, `High`.
- `deadline` opsional, harus tanggal ≥ hari ini.

### File Terkait
| File | Keterangan |
|---|---|
| `app/Http/Controllers/TaskController.php` | Method `update()` |
| `resources/js/pages/Projects/Show.tsx` | Dropdown priority + date picker per task |
| `routes/web.php` | Route `tasks.update` |

---

## 5. SRS-TSK-03 — Menandai Tugas Selesai

### Deskripsi
Sebagai pengguna, saya dapat menandai tugas yang sudah tuntas menjadi berstatus selesai, sehingga progress pekerjaan terlihat jelas.

### Alur Kerja
1. Di daftar task, setiap baris memiliki **checkbox** di kolom paling kiri.
2. Pengguna mencentang checkbox → task ditandai selesai (`is_completed = true`).
3. Visual berubah:
   - Judul task menjadi **strikethrough** (tercoret).
   - Baris task menjadi **transparan** (opacity 0.6).
   - Background baris menjadi **hijau muda**.
4. Jika checkbox di-uncheck → task kembali ke status belum selesai.

### Endpoint API
| Method | URL | Controller | Keterangan |
|---|---|---|---|
| `PATCH` | `/tasks/{task}/toggle-complete` | `TaskController@toggleComplete` | Toggle status selesai |

### Validasi
- Tidak memerlukan input dari pengguna (toggle otomatis berdasarkan nilai `is_completed` saat ini).

### File Terkait
| File | Keterangan |
|---|---|
| `app/Http/Controllers/TaskController.php` | Method `toggleComplete()` |
| `resources/js/pages/Projects/Show.tsx` | Checkbox + visual feedback (strikethrough, opacity) |
| `routes/web.php` | Route `tasks.toggle-complete` |

---

## Ringkasan Teknis

### Database Schema

```
tasks
├── id (PK)
├── project_id (FK → projects.id)
├── assigned_to (FK → users.id, nullable) ← SRS-06
├── title
├── description (nullable)
├── priority (Low/Medium/High) ← TSK-02
├── deadline (date, nullable) ← TSK-02
├── is_completed (boolean) ← TSK-03
├── status (Todo/In Progress/Done) ← SRS-06
├── created_at
└── updated_at

project_user (pivot) ← SRS-05
├── project_id (FK → projects.id)
├── user_id (FK → users.id)
├── created_at
└── updated_at
```

### Semua Route yang Ditambahkan

```php
// SRS-05: Tambah Anggota
Route::post('/projects/{project}/members', [ProjectMemberController::class, 'store']);

// SRS-06: Assign Task & Ubah Status
Route::patch('/tasks/{task}/assign', [TaskController::class, 'assign']);
Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus']);

// TSK-01: Buat Task Baru
Route::post('/tasks', [TaskController::class, 'store']);

// TSK-02: Update Priority & Deadline
Route::patch('/tasks/{task}', [TaskController::class, 'update']);

// TSK-03: Toggle Selesai
Route::patch('/tasks/{task}/toggle-complete', [TaskController::class, 'toggleComplete']);
```

### Tech Stack
- **Backend**: Laravel 11 + PHP 8.x
- **Frontend**: React + TypeScript + Inertia.js
- **Database**: MySQL (Remote)
- **Version Control**: Git + GitHub
