import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDriveClient } from "@/lib/google";
import { DriveFile, ListFilesResponse } from "@/types/drive";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.accessToken) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const folderId = searchParams.get("folderId");

        const drive = getDriveClient(session.accessToken);

        // Build query to list files in the folder
        let query = "trashed = false";
        if (folderId) {
            query += ` and '${folderId}' in parents`;
        }

        const response = await drive.files.list({
            q: query,
            fields: "files(id, name, mimeType, size, modifiedTime, thumbnailLink, parents)",
            orderBy: "folder,name",
            pageSize: 100,
        });

        const allFiles = response.data.files || [];

        // Separate folders from files
        const folders: DriveFile[] = [];
        const files: DriveFile[] = [];

        allFiles.forEach((file) => {
            const driveFile: DriveFile = {
                id: file.id!,
                name: file.name!,
                mimeType: file.mimeType!,
                size: file.size || undefined,
                modifiedTime: file.modifiedTime || undefined,
                thumbnailLink: file.thumbnailLink || undefined,
                parents: file.parents || undefined,
            };

            if (file.mimeType === "application/vnd.google-apps.folder") {
                folders.push(driveFile);
            } else {
                files.push(driveFile);
            }
        });

        const result: ListFilesResponse = {
            folders,
            files,
            success: true,
        };

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error listing files:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to list files",
                folders: [],
                files: [],
            },
            { status: 500 }
        );
    }
}
