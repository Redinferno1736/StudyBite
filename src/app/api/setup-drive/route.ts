import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDriveClient } from "@/lib/google";
import { SetupDriveRequest, SetupDriveResponse } from "@/types/drive";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.accessToken) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body: SetupDriveRequest = await req.json();
        const { friendsEmails } = body;

        const drive = getDriveClient(session.accessToken);

        // Create a folder in Google Drive to act as the shared drive
        const folderMetadata = {
            name: "StudyBite Shared Files",
            mimeType: "application/vnd.google-apps.folder",
        };

        const folder = await drive.files.create({
            requestBody: folderMetadata,
            fields: "id, name",
        });

        const folderId = folder.data.id;

        if (!folderId) {
            return NextResponse.json(
                { success: false, message: "Failed to create folder" },
                { status: 500 }
            );
        }

        // Add permissions for each friend
        if (friendsEmails && friendsEmails.length > 0) {
            for (const email of friendsEmails) {
                try {
                    await drive.permissions.create({
                        fileId: folderId,
                        requestBody: {
                            type: "user",
                            role: "writer",
                            emailAddress: email.trim(),
                        },
                        sendNotificationEmail: true,
                    });
                } catch (error) {
                    console.error(`Error adding permission for ${email}:`, error);
                    // Continue with other emails even if one fails
                }
            }
        }

        const response: SetupDriveResponse = {
            driveId: folderId,
            success: true,
            message: "Shared folder created successfully",
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error("Error setting up drive:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to setup drive",
            },
            { status: 500 }
        );
    }
}
