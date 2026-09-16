import { router, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ projects }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const tambahProject = (e) => {
        e.preventDefault();

        router.post("/projects", {
            name: name,
            description: description,
        });

        setName("");
        setDescription("");
    };

    const hapusProject = (id) => {
        if (confirm("Yakin ingin menghapus project ini?")) {
            router.delete(`/projects/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Daftar Project</h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Kelola daftar tugas, anggota tim (SRS-COL-01), dan pantau progres kerja sama (SRS-COL-03).
                        </p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium transition"
                    >
                        &larr; Dashboard
                    </Link>
                </div>

                {/* Form tambah project */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        Buat Daftar Tugas / Project Baru
                    </h2>

                    <form onSubmit={tambahProject}>
                        <input
                            type="text"
                            placeholder="Nama project..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            required
                        />

                        <textarea
                            placeholder="Deskripsi project..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            rows={3}
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded text-sm transition"
                        >
                            + Simpan Project
                        </button>
                    </form>
                </div>

                {/* Daftar project */}
                <div className="space-y-4">
                    {projects.length === 0 && (
                        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                            Belum ada project yang dibuat atau diikuti.
                        </div>
                    )}

                    {projects.map((project) => {
                        const progress = project.progress_percentage || 0;
                        const total = project.tasks_count || 0;
                        const completed = project.completed_tasks_count || 0;

                        return (
                            <div
                                key={project.id}
                                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-bold text-gray-800">
                                                {project.name}
                                            </h2>
                                            {project.is_owner ? (
                                                <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                                                    Pemilik
                                                </span>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                                    Anggota Tim
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {project.description || "Tidak ada deskripsi"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Owner: {project.user?.name || "User"} • Anggota: {project.members?.length || 0} orang
                                        </p>
                                    </div>
                                </div>

                                {/* SRS-COL-03: Bar Progres Penyelesaian */}
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    <div className="flex justify-between text-xs text-gray-600 font-medium mb-1">
                                        <span>Progres Penyelesaian Tugas (SRS-COL-03)</span>
                                        <span>{completed} / {total} Selesai ({progress}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`h-2.5 rounded-full transition-all duration-500 ${
                                                progress === 100
                                                    ? "bg-green-600"
                                                    : progress > 50
                                                    ? "bg-blue-600"
                                                    : "bg-yellow-500"
                                            }`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.get(`/projects/${project.id}/tasks`)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded transition"
                                        >
                                            Buka Tugas & Progres
                                        </button>

                                        {/* SRS-COL-01: Navigasi cepat Kelola Anggota */}
                                        <button
                                            onClick={() => router.get(`/projects/${project.id}`)}
                                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-medium px-4 py-2 rounded transition"
                                        >
                                            👥 Kelola Anggota
                                        </button>
                                    </div>

                                    {project.is_owner && (
                                        <button
                                            onClick={() => hapusProject(project.id)}
                                            className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 transition"
                                        >
                                            Hapus Project
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}