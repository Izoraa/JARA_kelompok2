import { router } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">

                <h1 className="text-3xl font-bold">
                    Dashboard JARA
                </h1>

                <button
                    onClick={() => router.get("/projects")}
                    className="mt-5 bg-blue-500 text-white px-5 py-2 rounded"
                >
                    Kelola Project
                </button>

                <br />

                <button
                    onClick={() => router.post("/logout")}
                    className="mt-3 bg-red-500 text-white px-5 py-2 rounded"
                >
                    Logout
                </button>

            </div>
        </div>
    );
}