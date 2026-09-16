import { router, usePage, Link } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="rounded-lg bg-white p-8 text-center shadow-md">
                <h1 className="mb-4 text-3xl font-bold">Dashboard JARA</h1>
                <p className="mb-6">Selamat datang, {user.name}!</p>

                {user.role === 'admin' && (
                    <div className="mb-6">
                        <Link
                            href="/admin/users"
                            className="rounded bg-blue-500 px-5 py-2 text-white transition hover:bg-blue-600"
                        >
                            Manajemen Pengguna (Admin)
                        </Link>
                    </div>
                )}

                <button
                    onClick={() => router.post('/logout')}
                    className="rounded bg-red-500 px-5 py-2 text-white transition hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
