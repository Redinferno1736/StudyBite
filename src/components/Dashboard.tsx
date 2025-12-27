"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import FileCard from "./FileCard";
import ManageAccessModal from "./ManageAccessModal";
import { DriveFile, ListFilesResponse, CreateFolderResponse, UploadFileResponse } from "@/types/drive";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import RefreshIcon from "@mui/icons-material/Refresh";

interface DashboardProps {
    driveId: string;
}

interface FolderHistory {
    id: string;
    name: string;
}

export default function Dashboard({ driveId }: DashboardProps) {
    const [folders, setFolders] = useState<DriveFile[]>([]);
    const [files, setFiles] = useState<DriveFile[]>([]);
    const [currentFolderId, setCurrentFolderId] = useState<string>(driveId);
    const [folderHistory, setFolderHistory] = useState<FolderHistory[]>([
        { id: driveId, name: "Main Folder" },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newFolderName, setNewFolderName] = useState("");
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showAccessModal, setShowAccessModal] = useState(false);

    // Fetch files and folders
    const fetchFiles = async (folderId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/files?folderId=${folderId}`);
            const data: ListFilesResponse = await response.json();

            if (data.success) {
                setFolders(data.folders);
                setFiles(data.files);
            } else {
                setError(data.message || "Failed to load files");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchFiles(currentFolderId);
    }, [currentFolderId]);

    // Navigate into folder
    const handleFolderClick = (folder: DriveFile) => {
        setCurrentFolderId(folder.id);
        setFolderHistory([...folderHistory, { id: folder.id, name: folder.name }]);
    };

    // Navigate to home
    const handleNavigateHome = () => {
        setCurrentFolderId(driveId);
        setFolderHistory([{ id: driveId, name: "Main Folder" }]);
    };

    // Create new folder
    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;

        setIsCreatingFolder(true);
        setError(null);

        try {
            const response = await fetch("/api/create-folder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    parentFolderId: currentFolderId,
                    name: newFolderName.trim(),
                }),
            });

            const data: CreateFolderResponse = await response.json();

            if (data.success) {
                setNewFolderName("");
                fetchFiles(currentFolderId); // Refresh the list
            } else {
                setError(data.message || "Failed to create folder");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsCreatingFolder(false);
        }
    };

    // Handle file upload
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        setIsUploading(true);
        setError(null);

        try {
            // Upload files one by one
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const formData = new FormData();
                formData.append("file", file);
                formData.append("parentFolderId", currentFolderId);

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const data: UploadFileResponse = await response.json();

                if (!data.success) {
                    setError(data.message || `Failed to upload ${file.name}`);
                    break;
                }
            }

            // Refresh the file list
            fetchFiles(currentFolderId);

            // Clear the file input
            event.target.value = "";
        } catch (err: any) {
            setError(err.message || "An error occurred during upload");
        } finally {
            setIsUploading(false);
        }
    };

    // Handle file/folder deletion
    const handleDelete = async (fileId: string) => {
        setError(null);

        try {
            const response = await fetch(`/api/delete?fileId=${fileId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                // Refresh the file list
                fetchFiles(currentFolderId);
            } else {
                setError(data.message || "Failed to delete");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during deletion");
        }
    };

    const currentFolderName = folderHistory[folderHistory.length - 1]?.name || "Main Folder";

    return (
        <div className="min-h-screen bg-turquoise/10">
            <Header
                currentFolderName={currentFolderName}
                onNavigateHome={currentFolderId !== driveId ? handleNavigateHome : undefined}
                onManageAccess={() => setShowAccessModal(true)}
            />

            <ManageAccessModal
                isOpen={showAccessModal}
                onClose={() => setShowAccessModal(false)}
                driveId={driveId}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Action Bar */}
                <div className="mb-6 bg-white rounded-xl p-4 shadow-md elevation-2">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Create Folder */}
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                placeholder="New folder name..."
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-turquoise focus:outline-none transition-smooth text-black"
                                disabled={isCreatingFolder}
                            />
                            <button
                                onClick={handleCreateFolder}
                                disabled={isCreatingFolder || !newFolderName.trim()}
                                className="px-4 py-2 bg-royalGreen hover:bg-royalGreen/90 text-white rounded-lg font-medium transition-smooth elevation-2 hover:elevation-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <CreateNewFolderIcon />
                                <span className="hidden sm:inline">Create</span>
                            </button>
                        </div>

                        {/* Upload Files */}
                        <div className="flex gap-2">
                            <label className="px-4 py-2 bg-turquoise hover:bg-turquoise/90 text-white rounded-lg font-medium transition-smooth elevation-2 hover:elevation-3 cursor-pointer flex items-center gap-2">
                                <CloudUploadIcon />
                                <span>{isUploading ? "Uploading..." : "Upload Files"}</span>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                            </label>

                            <button
                                onClick={() => fetchFiles(currentFolderId)}
                                disabled={isLoading}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-lg font-medium transition-smooth flex items-center gap-2"
                                title="Refresh"
                            >
                                <RefreshIcon className={isLoading ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Breadcrumb */}
                {folderHistory.length > 1 && (
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
                        {folderHistory.map((folder, index) => (
                            <div key={folder.id} className="flex items-center gap-2">
                                {index > 0 && <span>/</span>}
                                <button
                                    onClick={() => {
                                        setCurrentFolderId(folder.id);
                                        setFolderHistory(folderHistory.slice(0, index + 1));
                                    }}
                                    className={`hover:text-turquoise transition-smooth ${index === folderHistory.length - 1
                                        ? "font-semibold text-black"
                                        : ""
                                        }`}
                                >
                                    {folder.name}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-turquoise border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">Loading files...</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && folders.length === 0 && files.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📂</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No files or folders yet
                        </h3>
                        <p className="text-gray-500">
                            Upload some files or create folders to get started!
                        </p>
                    </div>
                )}

                {/* Files and Folders Grid */}
                {!isLoading && (folders.length > 0 || files.length > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
                        {/* Render folders first */}
                        {folders.map((folder) => (
                            <FileCard
                                key={folder.id}
                                file={folder}
                                onClick={() => handleFolderClick(folder)}
                                onDelete={handleDelete}
                            />
                        ))}

                        {/* Render files */}
                        {files.map((file) => (
                            <FileCard
                                key={file.id}
                                file={file}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
