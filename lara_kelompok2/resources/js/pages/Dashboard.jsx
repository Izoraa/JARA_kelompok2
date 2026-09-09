import { router } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div>
                <h1 className="text-3xl font-bold">Dashboard JARA</h1>

                <button
                    onClick={() => router.post("/logout")}
                    className="mt-5 bg-red-500 text-white px-5 py-2 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
