"use client";

import { useSession, signOut } from "next-auth/react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

interface HeaderProps {
    currentFolderName: string;
    onNavigateHome?: () => void;
    onManageAccess?: () => void;
}

export default function Header({ currentFolderName, onNavigateHome, onManageAccess }: HeaderProps) {
    const { data: session } = useSession();

    return (
        <header className="bg-turquoise shadow-md elevation-2 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-3">
                        <MenuBookIcon sx={{ fontSize: 32, color: "#FFFFFF" }} />
                        <div>
                            <h1 className="text-2xl font-bold text-white">StudyBite</h1>
                            {currentFolderName && (
                                <p className="text-xs text-white/80">{currentFolderName}</p>
                            )}
                        </div>
                    </div>

                    {/* User Info and Actions */}
                    <div className="flex items-center space-x-3">
                        {onNavigateHome && currentFolderName !== "Main Folder" && (
                            <button
                                onClick={onNavigateHome}
                                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-smooth"
                                title="Go to Main Folder"
                            >
                                <HomeIcon sx={{ fontSize: 20 }} />
                                <span className="hidden sm:inline text-sm font-medium">Home</span>
                            </button>
                        )}

                        {onManageAccess && (
                            <button
                                onClick={onManageAccess}
                                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-smooth"
                                title="Manage Access"
                            >
                                <GroupAddIcon sx={{ fontSize: 20 }} />
                                <span className="hidden md:inline text-sm font-medium">Manage Access</span>
                            </button>
                        )}

                        {session?.user && (
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-white">{session.user.name}</p>
                                <p className="text-xs text-white/70">{session.user.email}</p>
                            </div>
                        )}

                        <button
                            onClick={() => signOut()}
                            className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-smooth"
                            title="Sign Out"
                        >
                            <LogoutIcon sx={{ fontSize: 20 }} />
                            <span className="hidden sm:inline text-sm font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
