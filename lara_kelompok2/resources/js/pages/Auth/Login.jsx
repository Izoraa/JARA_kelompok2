import { useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    function submit(e) {
        e.preventDefault();

        post('/login');
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-96 rounded-xl bg-white p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold">
                    Login JARA
                </h1>

                <form onSubmit={submit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="mb-1 w-full rounded border p-3"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    {errors.email && (
                        <p className="mb-3 text-sm text-red-500">
                            {errors.email}
                        </p>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        className="mb-1 w-full rounded border p-3"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    {errors.password && (
                        <p className="mb-3 text-sm text-red-500">
                            {errors.password}
                        </p>
                    )}

                    <button
                        disabled={processing}
                        className="w-full rounded bg-blue-600 py-3 text-white"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
