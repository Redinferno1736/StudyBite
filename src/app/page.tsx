"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import SetupCard from "@/components/SetupCard";
import Dashboard from "@/components/Dashboard";

export default function Home() {
    const { data: session, status } = useSession();
    const [driveId, setDriveId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if drive is already set up (stored in localStorage)
        const storedDriveId = localStorage.getItem("studybite_drive_id");
        if (storedDriveId) {
            setDriveId(storedDriveId);
        }
        setIsLoading(false);
    }, []);

    // Show loading state
    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-turquoise/10">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-turquoise border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to sign in if not authenticated
    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-turquoise/10 p-4">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-md w-full text-center elevation-3">
                    <div className="text-5xl sm:text-6xl mb-4">📚</div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-black">StudyBite</h1>
                    <p className="text-gray-600 mb-6 text-sm sm:text-base">Share study files with friends</p>
                    <button
                        onClick={() => signIn("google")}
                        className="w-full bg-turquoise hover:bg-turquoise/90 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-lg transition-smooth elevation-2 hover:elevation-3 text-sm sm:text-base"
                    >
                        Sign in with Google
                    </button>
                </div>
            </div>
        );
    }

    // Show setup if no drive is configured
    if (!driveId) {
        return <SetupCard onSetupComplete={setDriveId} />;
    }

    // Show main dashboard
    return <Dashboard driveId={driveId} />;
}
