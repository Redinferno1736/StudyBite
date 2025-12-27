"use client";

import { DriveFile } from "@/types/drive";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

interface FileCardProps {
    file: DriveFile;
    onClick?: () => void;
    onDelete?: (fileId: string) => void;
}

export default function FileCard({ file, onClick, onDelete }: FileCardProps) {
    const isFolder = file.mimeType === "application/vnd.google-apps.folder";
    const [isHovered, setIsHovered] = useState(false);

    // Handle delete with confirmation
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering onClick

        const confirmMessage = isFolder
            ? `Delete folder "${file.name}" and all its contents?`
            : `Delete file "${file.name}"?`;

        if (window.confirm(confirmMessage)) {
            onDelete?.(file.id);
        }
    };

    // Get icon based on file type
    const getIcon = () => {
        if (isFolder) {
            return <FolderIcon sx={{ fontSize: 48, color: "#40E0D0" }} />;
        }

        // Check file type
        if (file.mimeType.startsWith("image/")) {
            return <ImageIcon sx={{ fontSize: 48, color: "#4169E1" }} />;
        } else if (file.mimeType === "application/pdf") {
            return <PictureAsPdfIcon sx={{ fontSize: 48, color: "#E74C3C" }} />;
        } else if (
            file.mimeType.includes("document") ||
            file.mimeType.includes("text")
        ) {
            return <DescriptionIcon sx={{ fontSize: 48, color: "#40E0D0" }} />;
        }

        return <InsertDriveFileIcon sx={{ fontSize: 48, color: "#B0E0E6" }} />;
    };

    // Format file size
    const formatSize = (bytes?: string) => {
        if (!bytes) return "";
        const size = parseInt(bytes);
        if (size < 1024) return size + " B";
        if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
        if (size < 1024 * 1024 * 1024)
            return (size / (1024 * 1024)).toFixed(1) + " MB";
        return (size / (1024 * 1024 * 1024)).toFixed(1) + " GB";
    };

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Handle click - open file in new tab or navigate to folder
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (!isFolder) {
            // Open file in Google Drive viewer
            window.open(`https://drive.google.com/file/d/${file.id}/view`, '_blank');
        }
    };

    return (
        <div
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`bg-white rounded-xl p-6 elevation-2 card-hover cursor-pointer border-2 border-transparent hover:border-turquoise transition-all relative`}
        >
            {/* Delete button */}
            {onDelete && isHovered && (
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all elevation-3 z-10"
                    title="Delete"
                >
                    <DeleteIcon sx={{ fontSize: 20 }} />
                </button>
            )}

            <div className="flex flex-col items-center text-center">
                <div className="mb-3">{getIcon()}</div>

                <h3 className="text-base font-semibold text-black mb-2 line-clamp-2 w-full break-words">
                    {file.name}
                </h3>

                <div className="text-xs text-gray-500 space-y-1">
                    {!isFolder && file.size && (
                        <p className="font-medium">{formatSize(file.size)}</p>
                    )}
                    {file.modifiedTime && (
                        <p>{formatDate(file.modifiedTime)}</p>
                    )}
                    <p className="text-turquoise font-medium">
                        {isFolder ? "Folder" : "File"}
                    </p>
                </div>
            </div>
        </div>
    );
}
