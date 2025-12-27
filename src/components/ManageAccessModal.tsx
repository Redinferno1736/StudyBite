"use client";

import { useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";

interface ManageAccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    driveId: string;
}

export default function ManageAccessModal({ isOpen, onClose, driveId }: ManageAccessModalProps) {
    const [emails, setEmails] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    if (!isOpen) return null;

    const handleAddPeople = async () => {
        if (!emails.trim()) return;

        setIsAdding(true);
        setMessage(null);

        try {
            // Parse emails
            const emailList = emails
                .split(/[,;\n]/)
                .map((email) => email.trim())
                .filter((email) => email.length > 0);

            if (emailList.length === 0) {
                setMessage({ type: 'error', text: 'Please enter at least one email' });
                setIsAdding(false);
                return;
            }

            const response = await fetch("/api/add-collaborators", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    driveId,
                    emails: emailList,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: `Successfully added ${emailList.length} collaborator(s)!` });
                setEmails("");
                setTimeout(() => {
                    onClose();
                    setMessage(null);
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.message || "Failed to add collaborators" });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "An error occurred" });
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full elevation-4 animate-fade-in max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-turquoise flex items-center gap-2">
                        <PersonAddIcon sx={{ fontSize: 24 }} className="sm:text-[28px]" />
                        <span className="hidden sm:inline">Manage Access</span>
                        <span className="sm:hidden">Add People</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-smooth"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <p className="text-gray-600 mb-4 text-xs sm:text-sm">
                    Add more people to collaborate on this shared folder. Enter their email addresses below.
                </p>

                <textarea
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-turquoise focus:outline-none transition-smooth text-black min-h-[100px] sm:min-h-[120px] mb-4 text-sm"
                    placeholder="friend1@gmail.com&#10;friend2@gmail.com&#10;&#10;Or separate with commas"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    disabled={isAdding}
                />

                {message && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success'
                        ? 'bg-green-100 text-green-700 border border-green-400'
                        : 'bg-red-100 text-red-700 border border-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={handleAddPeople}
                        disabled={isAdding || !emails.trim()}
                        className="flex-1 bg-turquoise hover:bg-turquoise/90 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-smooth elevation-2 hover:elevation-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                        {isAdding ? "Adding..." : "Add Collaborators"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-lg transition-smooth text-sm sm:text-base"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
