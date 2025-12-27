# StudyBite

A web application for sharing study files among friends using Google Drive as storage.

## Features

- 🔐 Google OAuth authentication
- 📁 Create and navigate folders
- 📤 Upload files to Google Drive
- 👥 Share with friends via email
- 📱 Mobile-first responsive design
- 🎨 Material 3 design principles

## Prerequisites

Before running this application, you need to:

1. **Google Cloud Console Setup:**
   - Create a project at [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Google Drive API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - Your production URL when deployed

2. **Environment Variables:**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Google OAuth credentials:
     ```
     GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=your-client-secret
     NEXTAUTH_SECRET=your-nextauth-secret-here
     NEXTAUTH_URL=http://localhost:3000
     ```
   - Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`

## Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### First Time Setup

1. **Sign in** with your Google account
2. **Setup Shared Drive:**
   - Enter friend email addresses (one per line or comma-separated)
   - Click "Create Shared Drive"
   - This creates a shared folder in your Google Drive and grants access to your friends

### Using the App

- **Create Folders:** Type a folder name and click "Create"
- **Upload Files:** Click "Upload Files" and select files from your device
- **Navigate:** Click on folders to open them, use breadcrumbs to navigate back
- **Refresh:** Click the refresh icon to reload the file list

### For Friends

1. Friends receive an email invitation to access the shared folder
2. They sign in to StudyBite with their Google account
3. They can immediately see and interact with the same files and folders

## Technology Stack

- **Frontend & Backend:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js with Google OAuth
- **Storage:** Google Drive API
- **UI Components:** Material UI Icons

## Project Structure

```
src/
├── app/
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth configuration
│   │   ├── setup-drive/  # Create shared folder
│   │   ├── files/        # List files
│   │   ├── create-folder/# Create folders
│   │   └── upload/       # Upload files
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── Dashboard.tsx     # Main file browser
│   ├── FileCard.tsx      # File/folder card
│   ├── Header.tsx        # App header
│   ├── SetupCard.tsx     # Initial setup
│   └── SessionProviderWrapper.tsx
├── lib/
│   └── google.ts         # Google Drive client
└── types/
    ├── drive.ts          # Type definitions
    └── next-auth.d.ts    # NextAuth types
```

## Color Scheme

- **Turquoise (#40E0D0):** Primary actions and selected states
- **Light Blue (#B0E0E6):** Secondary elements and backgrounds
- **Royal Blue-Green (#4169E1):** Accent color for highlights
- **Black:** Primary text
- **White:** Card backgrounds

## Security Notes

- The app requires full Google Drive access to create folders and manage permissions
- Access tokens are stored in secure HTTP-only cookies via NextAuth
- Tokens are automatically refreshed when expired
- Always keep your `.env.local` file secure and never commit it to version control

## License

MIT

## Support

For issues or questions, please contact the development team.
