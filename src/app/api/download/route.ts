import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDriveClient } from "@/lib/google";

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
        const fileId = searchParams.get("fileId");

        if (!fileId) {
            return NextResponse.json(
                { success: false, message: "Missing fileId" },
                { status: 400 }
            );
        }

        const drive = getDriveClient(session.accessToken);

        // Get file metadata
        const file = await drive.files.get({
            fileId: fileId,
            fields: "id, name, mimeType, webContentLink, webViewLink",
        });

        // Return the download/view link
        return NextResponse.json({
            success: true,
            webViewLink: file.data.webViewLink,
            webContentLink: file.data.webContentLink,
            name: file.data.name,
        });
    } catch (error: any) {
        console.error("Error getting file:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to get file",
            },
            { status: 500 }
        );
    }
}
