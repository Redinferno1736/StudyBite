import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDriveClient } from "@/lib/google";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.accessToken) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { driveId, emails } = body;

        if (!driveId || !emails || emails.length === 0) {
            return NextResponse.json(
                { success: false, message: "Missing driveId or emails" },
                { status: 400 }
            );
        }

        const drive = getDriveClient(session.accessToken);

        // Add permissions for each email
        const results = [];
        for (const email of emails) {
            try {
                await drive.permissions.create({
                    fileId: driveId,
                    requestBody: {
                        type: "user",
                        role: "writer",
                        emailAddress: email.trim(),
                    },
                    sendNotificationEmail: true,
                });
                results.push({ email, success: true });
            } catch (error: any) {
                console.error(`Error adding permission for ${email}:`, error);
                results.push({ email, success: false, error: error.message });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;

        return NextResponse.json({
            success: successCount > 0,
            message: failCount === 0
                ? `Successfully added ${successCount} collaborator(s)`
                : `Added ${successCount} collaborator(s), ${failCount} failed`,
            results,
        });
    } catch (error: any) {
        console.error("Error adding collaborators:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to add collaborators",
            },
            { status: 500 }
        );
    }
}
