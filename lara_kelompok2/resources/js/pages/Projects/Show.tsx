import React from 'react';
import { useForm, Link } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Project {
    id: number;
    name: string;
    description: string;
    user_id: number;
    user?: User;
    owner?: User;
    members: User[];
}

export default function Show({
    project,
    isOwner = true,
}: {
    project: Project;
    isOwner?: boolean;
}) {
    // Form untuk SRS-COL-01 (Tambah Anggota)
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        username: '',
    });

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/projects/${project.id}/members`, {
            onSuccess: () => reset(),
        });
    };

    const projectOwner = project.owner || project.user;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-3xl mx-auto">
                {/* Navigasi Breadcrumb / Tombol Kembali */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex gap-3">
                        <Link
                            href="/projects"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            &larr; Daftar Project
                        </Link>
                        <span className="text-gray-400">|</span>
                        <Link
                            href={`/projects/${project.id}/tasks`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Lihat Tugas & Progres &rarr;
                        </Link>
                    </div>
                </div>

                {/* Header Project */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
                            <p className="text-gray-600 mt-2">{project.description || 'Tidak ada deskripsi.'}</p>
                            <p className="text-sm text-gray-500 mt-3">
                                Pemilik Daftar (Owner):{' '}
                                <span className="font-semibold text-gray-700">
                                    {projectOwner?.name || 'Owner'}
                                </span>{' '}
                                ({projectOwner?.email})
                            </p>
                        </div>
                    </div>
                </div>

                {/* SRS-COL-01: DAFTAR & FORM TAMBAH ANGGOTA */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            👥 Anggota Tim Kolaborasi
                        </h2>
                        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                            {project.members?.length || 0} Anggota
                        </span>
                    </div>

                    {/* Notifikasi Sukses */}
                    {wasSuccessful && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-4 text-sm">
                            Anggota berhasil ditambahkan ke daftar tugas!
                        </div>
                    )}

                    {/* Form Input Tambah Anggota (Hanya untuk Pemilik Daftar) */}
                    {isOwner ? (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                            <h3 className="text-sm font-bold text-gray-700 mb-2">
                                Tambahkan Anggota Tim ke Daftar Tugas (SRS-COL-01)
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">
                                Masukkan nama atau alamat email pengguna terdaftar untuk mengajaknya bekerja bersama dalam daftar ini.
                            </p>
                            <form onSubmit={handleAddMember} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ketik username atau email anggota..."
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded text-sm disabled:opacity-50 transition"
                                >
                                    {processing ? 'Menambahkan...' : 'Tambah Anggota'}
                                </button>
                            </form>

                            {/* Pesan Error Validasi */}
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-2 font-medium">
                                    {errors.username}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6 text-sm">
                            Hanya <strong>Pemilik Daftar</strong> yang berhak menambahkan anggota baru.
                        </div>
                    )}

                    {/* List Anggota Terdaftar */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                            Daftar Anggota Saat Ini
                        </h3>
                        <div className="divide-y divide-gray-100">
                            {/* Baris Pemilik */}
                            <div className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {projectOwner?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{projectOwner?.email}</p>
                                </div>
                                <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                                    Pemilik Daftar (Owner)
                                </span>
                            </div>

                            {/* Anggota Tambahan */}
                            {project.members && project.members.length > 0 ? (
                                project.members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="py-3 flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {member.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{member.email}</p>
                                        </div>
                                        <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                            Anggota Tim (Member)
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm py-3 italic">
                                    Belum ada anggota tim lain di daftar tugas ini.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
