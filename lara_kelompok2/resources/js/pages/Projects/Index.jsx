import { router } from "@inertiajs/react";
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

                <h1 className="text-3xl font-bold mb-6">
                    Project JARA
                </h1>

                {/* Form tambah project */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-bold mb-4">
                        Tambah Project
                    </h2>

                    <form onSubmit={tambahProject}>

                        <input
                            type="text"
                            placeholder="Nama project"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border p-2 rounded mb-3"
                        />

                        <textarea
                            placeholder="Deskripsi project"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border p-2 rounded mb-3"
                        />

                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Tambah Project
                        </button>

                    </form>
                </div>

                {/* Daftar project */}
                <div className="space-y-4">

                    {projects.length === 0 && (
                        <div className="bg-white p-5 rounded-lg shadow">
                            Belum ada project.
                        </div>
                    )}

                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white p-5 rounded-lg shadow"
                        >
                            <h2 className="text-xl font-bold">
                                {project.name}
                            </h2>

                            <p className="text-gray-600 mt-2">
                                {project.description}
                            </p>

                            <p className="mt-2">
                                Jumlah Task: {project.tasks_count}
                            </p>

                            <div className="mt-4 flex gap-2">

                                <button
                                    onClick={() =>
                                        router.get(
                                            `/projects/${project.id}/tasks`
                                        )
                                    }
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Lihat Task
                                </button>

                                <button
                                    onClick={() =>
                                        hapusProject(project.id)
                                    }
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Hapus
                                </button>

                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
}