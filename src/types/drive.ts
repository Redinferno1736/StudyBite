export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    size?: string;
    modifiedTime?: string;
    thumbnailLink?: string;
    parents?: string[];
}

export interface SetupDriveRequest {
    friendsEmails: string[];
}

export interface SetupDriveResponse {
    driveId: string;
    success: boolean;
    message?: string;
}

export interface CreateFolderRequest {
    parentFolderId: string;
    name: string;
    driveId?: string;
}

export interface CreateFolderResponse {
    folder: DriveFile;
    success: boolean;
    message?: string;
}

export interface ListFilesResponse {
    files: DriveFile[];
    folders: DriveFile[];
    success: boolean;
    message?: string;
}

export interface UploadFileResponse {
    file: DriveFile;
    success: boolean;
    message?: string;
}
