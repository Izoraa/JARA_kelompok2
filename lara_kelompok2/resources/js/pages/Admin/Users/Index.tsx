import React from 'react';
import { useForm, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export default function Index({ users }: { users: User[] }) {
    // Form untuk Tambah User (SRS-07)
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => reset(),
        });
    };

    const handleDeleteUser = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <div
            style={{
                maxWidth: '900px',
                margin: '40px auto',
                fontFamily: 'sans-serif',
                padding: '20px',
            }}
        >
            {/* Header */}
            <div
                style={{
                    borderBottom: '1px solid #ddd',
                    paddingBottom: '15px',
                    marginBottom: '20px',
                }}
            >
                <h1 style={{ margin: '0 0 10px 0' }}>
                    Manajemen Pengguna (Admin)
                </h1>
                <p style={{ color: '#666', margin: 0 }}>
                    Kelola akun pengguna di sistem JARA. (SRS-07, SRS-08)
                </p>
                <a
                    href="/dashboard"
                    style={{
                        color: '#0070f3',
                        textDecoration: 'none',
                        display: 'inline-block',
                        marginTop: '10px',
                    }}
                >
                    &larr; Kembali ke Dashboard
                </a>
            </div>

            {/* SRS-07: FORM TAMBAH PENGGUNA */}
            <div
                style={{
                    background: '#f9f9f9',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '30px',
                }}
            >
                <h2 style={{ marginTop: 0 }}>
                    ➕ Tambah Pengguna Baru (SRS-07)
                </h2>

                <form
                    onSubmit={handleAddUser}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px',
                        marginBottom: '15px',
                    }}
                >
                    <div>
                        <label
                            style={{ display: 'block', marginBottom: '5px' }}
                        >
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                boxSizing: 'border-box',
                            }}
                            required
                        />
                        {errors.name && (
                            <div
                                style={{
                                    color: 'red',
                                    fontSize: '13px',
                                    marginTop: '5px',
                                }}
                            >
                                {errors.name}
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            style={{ display: 'block', marginBottom: '5px' }}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                boxSizing: 'border-box',
                            }}
                            required
                        />
                        {errors.email && (
                            <div
                                style={{
                                    color: 'red',
                                    fontSize: '13px',
                                    marginTop: '5px',
                                }}
                            >
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            style={{ display: 'block', marginBottom: '5px' }}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                boxSizing: 'border-box',
                            }}
                            required
                        />
                        {errors.password && (
                            <div
                                style={{
                                    color: 'red',
                                    fontSize: '13px',
                                    marginTop: '5px',
                                }}
                            >
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            style={{ display: 'block', marginBottom: '5px' }}
                        >
                            Role
                        </label>
                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                boxSizing: 'border-box',
                            }}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && (
                            <div
                                style={{
                                    color: 'red',
                                    fontSize: '13px',
                                    marginTop: '5px',
                                }}
                            >
                                {errors.role}
                            </div>
                        )}
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                padding: '10px 20px',
                                background: '#28a745',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                        </button>
                    </div>
                </form>
            </div>

            {/* SRS-07 & SRS-08: DAFTAR PENGGUNA */}
            <div>
                <h2>Daftar Pengguna</h2>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginTop: '15px',
                    }}
                >
                    <thead>
                        <tr
                            style={{ background: '#f1f1f1', textAlign: 'left' }}
                        >
                            <th
                                style={{
                                    padding: '10px',
                                    borderBottom: '2px solid #ddd',
                                }}
                            >
                                Nama
                            </th>
                            <th
                                style={{
                                    padding: '10px',
                                    borderBottom: '2px solid #ddd',
                                }}
                            >
                                Email
                            </th>
                            <th
                                style={{
                                    padding: '10px',
                                    borderBottom: '2px solid #ddd',
                                }}
                            >
                                Role
                            </th>
                            <th
                                style={{
                                    padding: '10px',
                                    borderBottom: '2px solid #ddd',
                                    textAlign: 'center',
                                }}
                            >
                                Aksi (SRS-08)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                style={{ borderBottom: '1px solid #eee' }}
                            >
                                <td style={{ padding: '10px' }}>{user.name}</td>
                                <td style={{ padding: '10px' }}>
                                    {user.email}
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <span
                                        style={{
                                            background:
                                                user.role === 'admin'
                                                    ? '#007bff'
                                                    : '#6c757d',
                                            color: '#fff',
                                            padding: '3px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td
                                    style={{
                                        padding: '10px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            handleDeleteUser(user.id)
                                        }
                                        style={{
                                            padding: '5px 10px',
                                            background: '#dc3545',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                        }}
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <p
                        style={{
                            textAlign: 'center',
                            padding: '20px',
                            color: '#888',
                        }}
                    >
                        Belum ada pengguna terdaftar.
                    </p>
                )}
            </div>
        </div>
    );
}
