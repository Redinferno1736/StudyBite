"use client";

import { useState } from "react";
import { SetupDriveResponse } from "@/types/drive";

interface SetupCardProps {
    onSetupComplete: (driveId: string) => void;
}

export default function SetupCard({ onSetupComplete }: SetupCardProps) {
    const [friendEmails, setFriendEmails] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSetup = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Parse emails (split by comma, newline, or semicolon)
            const emailList = friendEmails
                .split(/[,;\n]/)
                .map((email) => email.trim())
                .filter((email) => email.length > 0);

            const response = await fetch("/api/setup-drive", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    friendsEmails: emailList,
                }),
            });

            const data: SetupDriveResponse = await response.json();

            if (data.success && data.driveId) {
                // Save drive ID to localStorage
                localStorage.setItem("studybite_drive_id", data.driveId);
                onSetupComplete(data.driveId);
            } else {
                setError(data.message || "Failed to setup shared drive");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-turquoise/10 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-md w-full elevation-3 animate-fade-in">
                <div className="text-center mb-6">
                    <div className="text-6xl sm:text-7xl mb-4">📚</div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-black">StudyBite</h1>
                    <p className="text-gray-600 text-base sm:text-lg">Share study files with friends</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black">
                        Setup Shared Drive
                    </h2>
                    <p className="text-gray-600 mb-4 text-sm">
                        Enter your friends' email addresses (one per line, or separated by commas).
                        They'll receive access to the shared folder.
                    </p>

                    <textarea
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-turquoise focus:outline-none transition-smooth text-black min-h-[120px]"
                        placeholder="friend1@gmail.com&#10;friend2@gmail.com"
                        value={friendEmails}
                        onChange={(e) => setFriendEmails(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleSetup}
                    disabled={isLoading}
                    className="w-full bg-turquoise hover:bg-turquoise/90 text-white font-semibold py-3 px-6 rounded-lg transition-smooth elevation-2 hover:elevation-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Setting up...
                        </span>
                    ) : (
                        "Create Shared Drive"
                    )}
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                    You can skip adding emails and do it later if you want to use this alone.
                </p>
            </div>
        </div>
    );
}
