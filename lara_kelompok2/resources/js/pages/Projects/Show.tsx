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
    priority: 'Low' | 'Medium' | 'High';
    deadline: string | null;
    is_completed: boolean;
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
    const memberForm = useForm({ username: '' });

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        memberForm.post(`/projects/${project.id}/members`, {
            onSuccess: () => memberForm.reset(),
        });
    };

    // Form TSK-01 (Tambah Task Baru)
    const taskForm = useForm({
        project_id: project.id,
        title: '',
        description: '',
        priority: 'Medium' as string,
        deadline: '',
    });

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        taskForm.post('/tasks', {
            onSuccess: () => taskForm.reset('title', 'description', 'priority', 'deadline'),
            preserveScroll: true,
        });
    };

    // TSK-02: Update Priority & Deadline
    const handleUpdateTask = (taskId: number, priority: string, deadline: string | null) => {
        router.patch(`/tasks/${taskId}`, {
            priority,
            deadline: deadline || '',
        }, { preserveScroll: true });
    };

    // TSK-03: Toggle Selesai
    const handleToggleComplete = (taskId: number) => {
        router.patch(`/tasks/${taskId}/toggle-complete`, {}, { preserveScroll: true });
    };

    // SRS-06A: Assign Task
    const handleAssign = (taskId: number, userId: string) => {
        router.patch(`/tasks/${taskId}/assign`, { user_id: userId }, { preserveScroll: true });
    };

    // SRS-06B: Ubah Status
    const handleStatusChange = (taskId: number, status: string) => {
        router.patch(`/tasks/${taskId}/status`, { status }, { preserveScroll: true });
    };

    const priorityColors: Record<string, string> = {
        'Low': '#6b7280',
        'Medium': '#f59e0b',
        'High': '#ef4444',
    };

    const statusColors: Record<string, string> = {
        'Todo': '#6b7280',
        'In Progress': '#f59e0b',
        'Done': '#10b981',
    };

    return (
        <div style={{ maxWidth: '950px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
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
                        value={memberForm.data.username}
                        onChange={(e) => memberForm.setData('username', e.target.value)}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" disabled={memberForm.processing}
                        style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {memberForm.processing ? 'Menambahkan...' : 'Tambah Anggota'}
                    </button>
                </form>
                {memberForm.errors.username && (
                    <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{memberForm.errors.username}</div>
                )}
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                    {project.members && project.members.length > 0 ? (
                        project.members.map((m) => (
                            <li key={m.id} style={{ marginBottom: '5px' }}><strong>{m.name}</strong> ({m.email})</li>
                        ))
                    ) : (
                        <p style={{ color: '#888', margin: 0 }}>Belum ada anggota.</p>
                    )}
                </ul>
            </div>

            {/* ========== TSK-01: FORM TAMBAH TASK ========== */}
            <div style={{ background: '#fff7ed', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #fed7aa' }}>
                <h2 style={{ marginTop: 0 }}>➕ Tambah Task Baru (TSK-01)</h2>
                <form onSubmit={handleAddTask}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Judul task *"
                            value={taskForm.data.title}
                            onChange={(e) => taskForm.setData('title', e.target.value)}
                            style={{ flex: 2, padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <select
                            value={taskForm.data.priority}
                            onChange={(e) => taskForm.setData('priority', e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <input
                            type="date"
                            value={taskForm.data.deadline}
                            onChange={(e) => taskForm.setData('deadline', e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Deskripsi (opsional)"
                            value={taskForm.data.description}
                            onChange={(e) => taskForm.setData('description', e.target.value)}
                            style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <button type="submit" disabled={taskForm.processing}
                            style={{ padding: '8px 20px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {taskForm.processing ? 'Menyimpan...' : 'Tambah Task'}
                        </button>
                    </div>
                    {taskForm.errors.title && <div style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>{taskForm.errors.title}</div>}
                    {taskForm.errors.deadline && <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{taskForm.errors.deadline}</div>}
                </form>
            </div>

            {/* ========== DAFTAR TASK (SRS-06 + TSK-02 + TSK-03) ========== */}
            <div style={{ background: '#f0f4ff', padding: '20px', borderRadius: '8px' }}>
                <h2 style={{ marginTop: 0 }}>📌 Daftar Task</h2>

                {project.tasks && project.tasks.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                                <th style={{ padding: '8px', width: '40px' }}>✓</th>
                                <th style={{ padding: '8px' }}>Task</th>
                                <th style={{ padding: '8px' }}>Priority</th>
                                <th style={{ padding: '8px' }}>Deadline</th>
                                <th style={{ padding: '8px' }}>Assign To</th>
                                <th style={{ padding: '8px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {project.tasks.map((task) => (
                                <tr key={task.id} style={{
                                    borderBottom: '1px solid #e5e7eb',
                                    opacity: task.is_completed ? 0.6 : 1,
                                    backgroundColor: task.is_completed ? '#f0fdf4' : 'transparent',
                                }}>
                                    {/* TSK-03: Checkbox Selesai */}
                                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={task.is_completed}
                                            onChange={() => handleToggleComplete(task.id)}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                    </td>

                                    {/* Judul Task */}
                                    <td style={{ padding: '10px 8px' }}>
                                        <strong style={{ textDecoration: task.is_completed ? 'line-through' : 'none' }}>
                                            {task.title}
                                        </strong>
                                        {task.description && (
                                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>{task.description}</p>
                                        )}
                                    </td>

                                    {/* TSK-02: Dropdown Priority */}
                                    <td style={{ padding: '10px 8px' }}>
                                        <select
                                            value={task.priority}
                                            onChange={(e) => handleUpdateTask(task.id, e.target.value, task.deadline)}
                                            style={{
                                                padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc',
                                                backgroundColor: priorityColors[task.priority] || '#fff',
                                                color: '#fff', fontWeight: 'bold', fontSize: '12px',
                                            }}
                                        >
                                            <option value="Low" style={{ background: '#fff', color: '#000' }}>Low</option>
                                            <option value="Medium" style={{ background: '#fff', color: '#000' }}>Medium</option>
                                            <option value="High" style={{ background: '#fff', color: '#000' }}>High</option>
                                        </select>
                                    </td>

                                    {/* TSK-02: Date Picker Deadline */}
                                    <td style={{ padding: '10px 8px' }}>
                                        <input
                                            type="date"
                                            value={task.deadline || ''}
                                            onChange={(e) => handleUpdateTask(task.id, task.priority, e.target.value)}
                                            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
                                        />
                                    </td>

                                    {/* SRS-06A: Dropdown Assign */}
                                    <td style={{ padding: '10px 8px' }}>
                                        <select
                                            value={task.assigned_to ?? ''}
                                            onChange={(e) => handleAssign(task.id, e.target.value)}
                                            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontSize: '12px' }}
                                        >
                                            <option value="">-- Belum --</option>
                                            {project.members.map((member) => (
                                                <option key={member.id} value={member.id}>{member.name}</option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* SRS-06B: Dropdown Status */}
                                    <td style={{ padding: '10px 8px' }}>
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            style={{
                                                padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc',
                                                backgroundColor: statusColors[task.status] || '#fff',
                                                color: '#fff', fontWeight: 'bold', fontSize: '12px',
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
                    <p style={{ color: '#888' }}>Belum ada task di project ini. Tambahkan task baru di atas!</p>
                )}
            </div>
        </div>
    );
}
