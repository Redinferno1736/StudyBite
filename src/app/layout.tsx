import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "StudyBite",
    description: "Share study files with friends",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SessionProviderWrapper>
                    {children}
                </SessionProviderWrapper>
            </body>
        </html>
    );
}
