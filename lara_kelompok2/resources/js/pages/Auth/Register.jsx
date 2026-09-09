import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    function submit(e) {
        e.preventDefault();

        post("/register");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Register JARA
                </h1>

                <form onSubmit={submit}>
                    <input
                        type="text"
                        placeholder="Nama"
                        className="w-full border p-3 rounded mb-3"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />

                    {errors.name && (
                        <p className="text-red-500">{errors.name}</p>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border p-3 rounded mb-3"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    {errors.email && (
                        <p className="text-red-500">{errors.email}</p>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border p-3 rounded mb-3"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Konfirmasi Password"
                        className="w-full border p-3 rounded mb-5"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />

                    <button
                        disabled={processing}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center mt-5">
                    Sudah punya akun?
                    <Link href="/login" className="text-blue-600 ml-1">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
