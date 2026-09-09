import { useForm } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    function submit(e) {
        e.preventDefault();

        post("/login");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-xl p-8 w-96">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Login JARA
                </h1>

                <form onSubmit={submit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border p-3 rounded mb-3"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border p-3 rounded mb-5"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <button
                        disabled={processing}
                        className="w-full bg-blue-600 text-white py-3 rounded"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
