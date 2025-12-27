import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDriveClient } from "@/lib/google";
import { UploadFileResponse } from "@/types/drive";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.accessToken) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const parentFolderId = formData.get("parentFolderId") as string;

        if (!file || !parentFolderId) {
            return NextResponse.json(
                { success: false, message: "Missing file or parentFolderId" },
                { status: 400 }
            );
        }

        const drive = getDriveClient(session.accessToken);

        // Convert File to buffer then to stream
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a readable stream from buffer
        const stream = Readable.from(buffer);

        const fileMetadata = {
            name: file.name,
            parents: [parentFolderId],
        };

        const media = {
            mimeType: file.type || "application/octet-stream",
            body: stream,
        };

        const uploadedFile = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: "id, name, mimeType, size, modifiedTime, parents",
        });

        const response: UploadFileResponse = {
            file: {
                id: uploadedFile.data.id!,
                name: uploadedFile.data.name!,
                mimeType: uploadedFile.data.mimeType!,
                size: uploadedFile.data.size || undefined,
                modifiedTime: uploadedFile.data.modifiedTime || undefined,
                parents: uploadedFile.data.parents || undefined,
            },
            success: true,
            message: "File uploaded successfully",
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to upload file",
            },
            { status: 500 }
        );
    }
}

