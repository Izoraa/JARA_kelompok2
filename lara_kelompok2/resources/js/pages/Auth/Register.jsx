import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();

        post('/register');
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-96 rounded-xl bg-white p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold">
                    Register JARA
                </h1>

                <form onSubmit={submit}>
                    <input
                        type="text"
                        placeholder="Nama"
                        className="mb-3 w-full rounded border p-3"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />

                    {errors.name && (
                        <p className="text-red-500">{errors.name}</p>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        className="mb-3 w-full rounded border p-3"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    {errors.email && (
                        <p className="text-red-500">{errors.email}</p>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        className="mb-3 w-full rounded border p-3"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Konfirmasi Password"
                        className="mb-5 w-full rounded border p-3"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />

                    <button
                        disabled={processing}
                        className="w-full rounded-lg bg-blue-600 py-3 text-white"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-5 text-center">
                    Sudah punya akun?
                    <Link href="/login" className="ml-1 text-blue-600">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
