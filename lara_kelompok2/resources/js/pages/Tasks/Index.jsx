import { router, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Index({
    project,
    tasks = [],
    progress = { total: 0, completed: 0, pending: 0, percentage: 0 },
    assignableUsers = [],
    isOwner = true,
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [deadline, setDeadline] = useState("");

    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPriority, setEditPriority] = useState("medium");
    const [editDeadline, setEditDeadline] = useState("");

    // State untuk Modal Penugasan Anggota (SRS-COL-02)
    const [assignModalTask, setAssignModalTask] = useState(null);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [isAssigning, setIsAssigning] = useState(false);

    const tambahTask = (e) => {
        e.preventDefault();

        router.post(`/projects/${project.id}/tasks`, {
            title: title,
            description: description,
            priority: priority,
            deadline: deadline,
        });

        setTitle("");
        setDescription("");
        setPriority("medium");
        setDeadline("");
    };

    const mulaiEdit = (task) => {
        setEditId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description || "");
        setEditPriority(task.priority);
        setEditDeadline(task.deadline ? task.deadline.substring(0, 10) : "");
    };

    const simpanEdit = (e) => {
        e.preventDefault();

        router.put(`/tasks/${editId}`, {
            title: editTitle,
            description: editDescription,
            priority: editPriority,
            deadline: editDeadline,
        });

        setEditId(null);
    };

    const hapusTask = (id) => {
        if (confirm("Yakin ingin menghapus task ini?")) {
            router.delete(`/tasks/${id}`);
        }
    };

    const ubahStatus = (id) => {
        router.patch(`/tasks/${id}/complete`);
    };

    // Buka dialog penugasan anggota untuk suatu task (SRS-COL-02)
    const bukaModalAssign = (task) => {
        setAssignModalTask(task);
        // Default checklist berisi user id yang sudah di-assign ke task ini
        const currentIds = task.users ? task.users.map((u) => u.id) : [];
        setSelectedUserIds(currentIds);
    };

    const toggleUserSelection = (userId) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const simpanPenugasan = (e) => {
        e.preventDefault();
        if (!assignModalTask) return;

        setIsAssigning(true);
        router.post(
            `/tasks/${assignModalTask.id}/assign`,
            {
                users: selectedUserIds,
            },
            {
                onSuccess: () => {
                    setAssignModalTask(null);
                    setIsAssigning(false);
                },
                onError: () => {
                    setIsAssigning(false);
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header & Navigasi */}
                <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/projects"
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                &larr; Semua Project
                            </Link>
                            <span className="text-gray-400">/</span>
                            <span className="text-sm text-gray-500 font-medium">
                                Daftar Tugas
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mt-1">{project.name}</h1>
                        <p className="text-gray-600 text-sm mt-1">{project.description || "Tidak ada deskripsi"}</p>
                    </div>

                    {/* SRS-COL-01: Akses Cepat Kelola Anggota Tim */}
                    <div className="flex gap-2">
                        <Link
                            href={`/projects/${project.id}`}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-2"
                        >
                            <span>👥</span>
                            <span>Kelola Anggota Tim ({project.members?.length || 0})</span>
                        </Link>
                    </div>
                </div>

                {/* SRS-COL-03: KARTU PEMANTAUAN PROGRES PENYELESAIAN TUGAS */}
                <div className="bg-white p-6 rounded-lg shadow mb-6 border-l-4 border-blue-600">
                    <div className="flex flex-wrap justify-between items-center mb-3">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span>📊</span> Pemantauan Progres Daftar (SRS-COL-03)
                        </h2>
                        <span className="text-2xl font-black text-blue-600">
                            {progress.percentage}% Selesai
                        </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
                        <div
                            className={`h-4 rounded-full transition-all duration-700 ${
                                progress.percentage === 100
                                    ? "bg-green-600"
                                    : progress.percentage >= 50
                                    ? "bg-blue-600"
                                    : "bg-amber-500"
                            }`}
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>

                    {/* Ringkasan Metrik */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-gray-50 p-3 rounded border border-gray-100">
                            <span className="text-xs text-gray-500 font-semibold uppercase">Total Tugas</span>
                            <p className="text-xl font-bold text-gray-800">{progress.total}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded border border-green-100">
                            <span className="text-xs text-green-700 font-semibold uppercase">Tugas Selesai</span>
                            <p className="text-xl font-bold text-green-700">{progress.completed}</p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded border border-amber-100">
                            <span className="text-xs text-amber-700 font-semibold uppercase">Belum Selesai</span>
                            <p className="text-xl font-bold text-amber-700">{progress.pending}</p>
                        </div>
                    </div>
                </div>

                {/* FORM TAMBAH TASK */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Tambah Task Baru</h2>

                    <form onSubmit={tambahTask}>
                        <input
                            type="text"
                            placeholder="Nama task..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <textarea
                            placeholder="Deskripsi task..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Prioritas
                                </label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Deadline
                                </label>
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded text-sm transition"
                        >
                            + Tambah Task
                        </button>
                    </form>
                </div>

                {/* DAFTAR TASK */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        Daftar Tugas ({tasks.length})
                    </h2>

                    {tasks.length === 0 && (
                        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                            Belum ada task di dalam project ini.
                        </div>
                    )}

                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`bg-white p-5 rounded-lg shadow transition border-l-4 ${
                                task.is_completed ? "border-green-500 bg-gray-50" : "border-gray-300"
                            }`}
                        >
                            {editId === task.id ? (
                                // FORM EDIT
                                <form onSubmit={simpanEdit}>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded mb-3 text-sm"
                                        required
                                    />

                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded mb-3 text-sm"
                                        rows={2}
                                    />

                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <select
                                            value={editPriority}
                                            onChange={(e) => setEditPriority(e.target.value)}
                                            className="w-full border border-gray-300 p-2 rounded text-sm"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>

                                        <input
                                            type="date"
                                            value={editDeadline}
                                            onChange={(e) => setEditDeadline(e.target.value)}
                                            className="w-full border border-gray-300 p-2 rounded text-sm"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded text-sm transition"
                                        >
                                            Simpan
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditId(null)}
                                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm transition"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // TAMPIL TASK
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3
                                                className={`text-lg font-bold ${
                                                    task.is_completed
                                                        ? "line-through text-gray-400"
                                                        : "text-gray-800"
                                                }`}
                                            >
                                                {task.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                {task.description || "Tidak ada deskripsi"}
                                            </p>
                                        </div>

                                        <span
                                            className={`text-xs px-2.5 py-1 rounded font-semibold uppercase ${
                                                task.priority === "high"
                                                    ? "bg-red-100 text-red-700"
                                                    : task.priority === "medium"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}
                                        >
                                            {task.priority}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-3">
                                        <span>
                                            📅 Deadline:{" "}
                                            <strong>
                                                {task.deadline
                                                    ? task.deadline.substring(0, 10)
                                                    : "Tidak ada"}
                                            </strong>
                                        </span>
                                        <span>•</span>
                                        <span>
                                            Status:{" "}
                                            <strong
                                                className={
                                                    task.is_completed
                                                        ? "text-green-600"
                                                        : "text-amber-600"
                                                }
                                            >
                                                {task.is_completed ? "✓ Selesai" : "⏳ Belum selesai"}
                                            </strong>
                                        </span>
                                    </div>

                                    {/* SRS-COL-02: ANGGOTA YANG MENGERJAKAN TASK */}
                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-xs font-bold text-gray-700 flex items-center gap-1">
                                                <span>👥</span> Anggota yang ditugaskan (SRS-COL-02):
                                            </p>
                                            <button
                                                onClick={() => bukaModalAssign(task)}
                                                className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1 rounded border border-indigo-200 transition"
                                            >
                                                + Atur / Tugaskan Anggota
                                            </button>
                                        </div>

                                        {task.users && task.users.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {task.users.map((user) => (
                                                    <span
                                                        key={user.id}
                                                        className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                                                    >
                                                        <span>👤</span>
                                                        <span>{user.name}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-xs italic">
                                                Belum ada anggota tim yang ditugaskan ke task ini.
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button
                                            onClick={() => ubahStatus(task.id)}
                                            className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                                                task.is_completed
                                                    ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                                    : "bg-green-600 hover:bg-green-700 text-white"
                                            }`}
                                        >
                                            {task.is_completed ? "Batal Selesai" : "Tandai Selesai"}
                                        </button>

                                        <button
                                            onClick={() => mulaiEdit(task)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded text-xs font-semibold transition"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => hapusTask(task.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-semibold transition"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* SRS-COL-02: MODAL PENUGASAN BANYAK ANGGOTA KE SATU TUGAS */}
            {assignModalTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                    Tugaskan Anggota Tim (SRS-COL-02)
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Tugas: <span className="font-semibold text-gray-700">{assignModalTask.title}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setAssignModalTask(null)}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        <p className="text-xs text-gray-600 mb-3">
                            Pilih satu atau lebih anggota tim di bawah ini agar beban kerja terdistribusi bersama:
                        </p>

                        <form onSubmit={simpanPenugasan}>
                            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded p-3 divide-y divide-gray-100 mb-4">
                                {assignableUsers && assignableUsers.length > 0 ? (
                                    assignableUsers.map((user) => {
                                        const isChecked = selectedUserIds.includes(user.id);
                                        return (
                                            <label
                                                key={user.id}
                                                className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => toggleUserSelection(user.id)}
                                                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                                    />
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {user.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500 block">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                                {user.id === project.user_id && (
                                                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-semibold">
                                                        Owner
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500 text-xs text-center py-4">
                                        Tidak ada anggota yang dapat ditugaskan.
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAssignModalTask(null)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold px-4 py-2 rounded transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isAssigning}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded transition disabled:opacity-50"
                                >
                                    {isAssigning ? "Menyimpan..." : "Simpan Penugasan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
