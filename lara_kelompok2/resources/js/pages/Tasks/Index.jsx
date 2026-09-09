import { router } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ project, tasks }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [deadline, setDeadline] = useState("");

    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPriority, setEditPriority] = useState("medium");
    const [editDeadline, setEditDeadline] = useState("");

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
        setEditDeadline(task.deadline || "");
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

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">

                <h1 className="text-3xl font-bold">
                    {project.name}
                </h1>

                <p className="text-gray-600 mb-6">
                    {project.description}
                </p>

                {/* FORM TAMBAH TASK */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">

                    <h2 className="text-xl font-bold mb-4">
                        Tambah Task
                    </h2>

                    <form onSubmit={tambahTask}>

                        <input
                            type="text"
                            placeholder="Nama task"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border p-2 rounded mb-3"
                        />

                        <textarea
                            placeholder="Deskripsi task"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            className="w-full border p-2 rounded mb-3"
                        />

                        <select
                            value={priority}
                            onChange={(e) =>
                                setPriority(e.target.value)
                            }
                            className="w-full border p-2 rounded mb-3"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>

                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) =>
                                setDeadline(e.target.value)
                            }
                            className="w-full border p-2 rounded mb-3"
                        />

                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Tambah Task
                        </button>

                    </form>
                </div>

                {/* DAFTAR TASK */}
                <div className="space-y-4">

                    {tasks.length === 0 && (
                        <div className="bg-white p-5 rounded-lg shadow">
                            Belum ada task.
                        </div>
                    )}

                    {tasks.map((task) => (

                        <div
                            key={task.id}
                            className="bg-white p-5 rounded-lg shadow"
                        >

                            {editId === task.id ? (

                                // FORM EDIT
                                <form onSubmit={simpanEdit}>

                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) =>
                                            setEditTitle(e.target.value)
                                        }
                                        className="w-full border p-2 rounded mb-3"
                                    />

                                    <textarea
                                        value={editDescription}
                                        onChange={(e) =>
                                            setEditDescription(
                                                e.target.value
                                            )
                                        }
                                        className="w-full border p-2 rounded mb-3"
                                    />

                                    <select
                                        value={editPriority}
                                        onChange={(e) =>
                                            setEditPriority(
                                                e.target.value
                                            )
                                        }
                                        className="w-full border p-2 rounded mb-3"
                                    >
                                        <option value="low">
                                            Low
                                        </option>

                                        <option value="medium">
                                            Medium
                                        </option>

                                        <option value="high">
                                            High
                                        </option>
                                    </select>

                                    <input
                                        type="date"
                                        value={editDeadline}
                                        onChange={(e) =>
                                            setEditDeadline(
                                                e.target.value
                                            )
                                        }
                                        className="w-full border p-2 rounded mb-3"
                                    />

                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Simpan
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setEditId(null)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                    >
                                        Batal
                                    </button>

                                </form>

                            ) : (

                                // TAMPIL TASK
                                <>
                                    <h2
                                        className={`text-xl font-bold ${
                                            task.is_completed
                                                ? "line-through text-gray-400"
                                                : ""
                                        }`}
                                    >
                                        {task.title}
                                    </h2>

                                    <p className="text-gray-600 mt-2">
                                        {task.description}
                                    </p>

                                    <p className="mt-2">
                                        Priority:{" "}
                                        <b>{task.priority}</b>
                                    </p>

                                    <p>
                                        Deadline:{" "}
                                        {task.deadline || "-"}
                                    </p>

                                    <p>
                                        Status:{" "}
                                        {task.is_completed
                                            ? "Selesai"
                                            : "Belum selesai"}
                                    </p>

                                    <div className="mt-4 flex gap-2">

                                        <button
                                            onClick={() =>
                                                ubahStatus(task.id)
                                            }
                                            className="bg-green-500 text-white px-4 py-2 rounded"
                                        >
                                            {task.is_completed
                                                ? "Batal Selesai"
                                                : "Selesai"}
                                        </button>

                                        <button
                                            onClick={() =>
                                                mulaiEdit(task)
                                            }
                                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                hapusTask(task.id)
                                            }
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                        >
                                            Hapus
                                        </button>

                                    </div>
                                </>
                            )}

                        </div>

                    ))}

                </div>

            </div>
        </div>
    );
}