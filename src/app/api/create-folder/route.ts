import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDriveClient } from "@/lib/google";
import { CreateFolderRequest, CreateFolderResponse } from "@/types/drive";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.accessToken) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body: CreateFolderRequest = await req.json();
        const { parentFolderId, name } = body;

        if (!name || !parentFolderId) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const drive = getDriveClient(session.accessToken);

        const folderMetadata = {
            name: name.trim(),
            mimeType: "application/vnd.google-apps.folder",
            parents: [parentFolderId],
        };

        const folder = await drive.files.create({
            requestBody: folderMetadata,
            fields: "id, name, mimeType, modifiedTime, parents",
        });

        const response: CreateFolderResponse = {
            folder: {
                id: folder.data.id!,
                name: folder.data.name!,
                mimeType: folder.data.mimeType!,
                modifiedTime: folder.data.modifiedTime || undefined,
                parents: folder.data.parents || undefined,
            },
            success: true,
            message: "Folder created successfully",
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error("Error creating folder:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to create folder",
            },
            { status: 500 }
        );
    }
}
