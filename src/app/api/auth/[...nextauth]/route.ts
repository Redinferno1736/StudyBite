import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { refreshAccessToken } from "@/lib/google";

export const authOptions: NextAuthOptions = {
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
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    expiresAt: account.expires_at ? account.expires_at * 1000 : 0,
                };
            }

            // Token is still valid
            if (token.expiresAt && Date.now() < token.expiresAt) {
                return token;
            }

            // Token has expired, refresh it
            if (token.refreshToken) {
                try {
                    const refreshedTokens = await refreshAccessToken(token.refreshToken as string);
                    return {
                        ...token,
                        accessToken: refreshedTokens.accessToken,
                        refreshToken: refreshedTokens.refreshToken,
                        expiresAt: refreshedTokens.expiresAt,
                    };
                } catch (error) {
                    console.error("Error refreshing access token:", error);
                    return {
                        ...token,
                        error: "RefreshAccessTokenError",
                    };
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
