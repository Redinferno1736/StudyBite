import { google } from "googleapis";

/**
 * Creates an authenticated Google Drive client
 * @param accessToken - OAuth access token from NextAuth session
 * @returns Authenticated Google Drive v3 client
 */
export function getDriveClient(accessToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    return google.drive({ version: "v3", auth });
}

/**
 * Refreshes an expired access token using the refresh token
 * @param refreshToken - OAuth refresh token
 * @returns New access token and expiry time
 */
export async function refreshAccessToken(refreshToken: string) {
    try {
        const auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        auth.setCredentials({
            refresh_token: refreshToken,
        });

        const { credentials } = await auth.refreshAccessToken();

        return {
            accessToken: credentials.access_token,
            expiresAt: credentials.expiry_date,
            refreshToken: credentials.refresh_token ?? refreshToken,
        };
    } catch (error) {
        console.error("Error refreshing access token:", error);
        throw error;
    }
}
