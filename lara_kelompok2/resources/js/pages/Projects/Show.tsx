import React from 'react';
import { useForm, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Task {
    id: number;
    title: string;
    description: string;
    status: 'Todo' | 'In Progress' | 'Done';
    assigned_to: number | null;
    assignee?: User;
}

interface Project {
    id: number;
    name: string;
    description: string;
    user: User;
    members: User[];
    tasks: Task[];
}

export default function Show({ project }: { project: Project }) {
    // Form SRS-05 (Tambah Anggota)
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
    });

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/projects/${project.id}/members`, {
            onSuccess: () => reset(),
        });
    };

    // SRS-06A: Assign Task
    const handleAssign = (taskId: number, userId: string) => {
        router.patch(`/tasks/${taskId}/assign`, {
            user_id: userId,
        }, { preserveScroll: true });
    };

    // SRS-06B: Ubah Status
    const handleStatusChange = (taskId: number, status: string) => {
        router.patch(`/tasks/${taskId}/status`, {
            status: status,
        }, { preserveScroll: true });
    };

    const statusColors: Record<string, string> = {
        'Todo': '#6b7280',
        'In Progress': '#f59e0b',
        'Done': '#10b981',
    };

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
            {/* Header Project */}
            <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '15px', marginBottom: '20px' }}>
                <h1 style={{ margin: '0 0 10px 0' }}>{project.name}</h1>
                <p style={{ color: '#666', margin: 0 }}>{project.description}</p>
                <p style={{ fontSize: '13px', color: '#888', marginTop: '5px' }}>
                    Owner: <strong>{project.user?.name}</strong>
                </p>
            </div>

            {/* ========== SRS-05: ANGGOTA ========== */}
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h2 style={{ marginTop: 0 }}>👥 Anggota Project (SRS-05)</h2>

                <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input
                        type="text"
                        placeholder="Nama atau Email anggota..."
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button
                        type="submit"
                        disabled={processing}
                        style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {processing ? 'Menambahkan...' : 'Tambah Anggota'}
                    </button>
                </form>

                {errors.username && (
                    <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{errors.username}</div>
                )}

                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                    {project.members && project.members.length > 0 ? (
                        project.members.map((member) => (
                            <li key={member.id} style={{ marginBottom: '5px' }}>
                                <strong>{member.name}</strong> ({member.email})
                            </li>
                        ))
                    ) : (
                        <p style={{ color: '#888', margin: 0 }}>Belum ada anggota.</p>
                    )}
                </ul>
            </div>

            {/* ========== SRS-06: TASKS ========== */}
            <div style={{ background: '#f0f4ff', padding: '20px', borderRadius: '8px' }}>
                <h2 style={{ marginTop: 0 }}>📌 Daftar Task (SRS-06)</h2>

                {project.tasks && project.tasks.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                                <th style={{ padding: '8px' }}>Task</th>
                                <th style={{ padding: '8px' }}>Assign To</th>
                                <th style={{ padding: '8px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {project.tasks.map((task) => (
                                <tr key={task.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '10px 8px' }}>
                                        <strong>{task.title}</strong>
                                        {task.description && (
                                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>{task.description}</p>
                                        )}
                                    </td>

                                    {/* SRS-06A: Dropdown Assign */}
                                    <td style={{ padding: '10px 8px' }}>
                                        <select
                                            value={task.assigned_to ?? ''}
                                            onChange={(e) => handleAssign(task.id, e.target.value)}
                                            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                                        >
                                            <option value="">-- Belum di-assign --</option>
                                            {project.members.map((member) => (
                                                <option key={member.id} value={member.id}>
                                                    {member.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* SRS-06B: Dropdown Status */}
                                    <td style={{ padding: '10px 8px' }}>
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            style={{
                                                padding: '6px 10px',
                                                borderRadius: '4px',
                                                border: '1px solid #ccc',
                                                backgroundColor: statusColors[task.status] || '#fff',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            <option value="Todo" style={{ background: '#fff', color: '#000' }}>Todo</option>
                                            <option value="In Progress" style={{ background: '#fff', color: '#000' }}>In Progress</option>
                                            <option value="Done" style={{ background: '#fff', color: '#000' }}>Done</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ color: '#888' }}>Belum ada task di project ini.</p>
                )}
            </div>
        </div>
    );
}
