import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDriveClient } from "@/lib/google";

export async function DELETE(req: NextRequest) {
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

        // Delete the file or folder
        await drive.files.delete({
            fileId: fileId,
        });

        return NextResponse.json({
            success: true,
            message: "File deleted successfully",
        });
    } catch (error: any) {
        console.error("Error deleting file:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to delete file",
            },
            { status: 500 }
        );
    }
}
