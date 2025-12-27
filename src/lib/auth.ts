import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { refreshAccessToken } from "./google";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/drive",
                    access_type: "offline",
                    prompt: "consent",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Initial sign in
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at ? account.expires_at * 1000 : 0;
                return token;
            }

            // Token is still valid
            if (token.expiresAt && Date.now() < (token.expiresAt as number)) {
                return token;
            }

            // Token has expired, refresh it
            if (token.refreshToken) {
                try {
                    const refreshedTokens = await refreshAccessToken(token.refreshToken as string);
                    token.accessToken = refreshedTokens.accessToken!;
                    token.refreshToken = refreshedTokens.refreshToken;
                    token.expiresAt = refreshedTokens.expiresAt!;
                    return token;
                } catch (error) {
                    console.error("Error refreshing access token:", error);
                    token.error = "RefreshAccessTokenError";
                    return token;
                }
            }

            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            return session;
        },
    },
    pages: {
        signIn: "/",
    },
};
