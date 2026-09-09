import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Task {
    id: number;
    title: string;
    status: 'Todo' | 'In Progress' | 'Done';
    assigned_to: number | null;
    assignee?: User;
}

interface Project {
    id: number;
    name: string;
    description: string;
    owner: User;
    members: User[];
    tasks: Task[];
}

export default function Show({ project }: { project: Project }) {
    // Form untuk SRS-05 (Tambah Anggota)
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
    });

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/projects/${project.id}/members`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
            {/* Header Project */}
            <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '15px', marginBottom: '20px' }}>
                <h1 style={{ margin: '0 0 10px 0' }}>{project.name}</h1>
                <p style={{ color: '#666', margin: 0 }}>{project.description}</p>
                <p style={{ fontSize: '13px', color: '#888', marginTop: '5px' }}>
                    Owner: <strong>{project.owner?.name}</strong>
                </p>
            </div>

            {/* SRS-05: DAFTAR & FORM TAMBAH ANGGOTA */}
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h2 style={{ marginTop: 0 }}>👥 Anggota Project (SRS-05)</h2>

                {/* Form Input Tambah Anggota */}
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
                        style={{
                            padding: '8px 16px',
                            background: '#0070f3',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        {processing ? 'Menambahkan...' : 'Tambah Anggota'}
                    </button>
                </form>

                {/* Pesan Error Validasi */}
                {errors.username && (
                    <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>
                        {errors.username}
                    </div>
                )}

                {/* List Anggota Terdaftar */}
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                    {project.members && project.members.length > 0 ? (
                        project.members.map((member) => (
                            <li key={member.id} style={{ marginBottom: '5px' }}>
                                <strong>{member.name}</strong> ({member.email})
                            </li>
                        ))
                    ) : (
                        <p style={{ color: '#888', margin: 0 }}>Belum ada anggota di project ini.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}
