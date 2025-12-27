# StudyBite - Vercel Deployment Guide

## Quick Deploy to Vercel

### 1. **Push to GitHub** (if not done)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. **Deploy to Vercel**

#### Method 1: Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your `StudyBite` repository
4. Vercel auto-detects Next.js settings ✅
5. **Add Environment Variables** (Critical):
   - `GOOGLE_CLIENT_ID` → Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` → Your Google OAuth client secret
   - `NEXTAUTH_SECRET` → Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` → Your production URL (e.g., `https://studybite.vercel.app`)
6. Click **Deploy** 🚀

#### Method 2: Vercel CLI
```bash
npm i -g vercel
vercel
```
Follow prompts and add environment variables when asked.

### 3. **Update Google OAuth Settings**

After deployment, get your Vercel URL (e.g., `https://studybite.vercel.app`) and:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://your-vercel-url.vercel.app/api/auth/callback/google
   ```
5. Save changes

### 4. **Test Your Deployment**
- Visit your Vercel URL
- Sign in with Google
- Create folders and upload files
- Everything should work! 🎉

## Environment Variables Checklist

Make sure these are set in **Vercel Dashboard** → **Settings** → **Environment Variables**:

- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`  
- ✅ `NEXTAUTH_SECRET`
- ✅ `NEXTAUTH_URL` (production URL)

## Troubleshooting

**Issue: OAuth redirect error**
- ✅ Make sure `NEXTAUTH_URL` matches your Vercel URL exactly
- ✅ Verify redirect URI in Google Cloud Console

**Issue: Build fails**
- ✅ Check Vercel build logs
- ✅ Make sure all dependencies are in `package.json`

**Issue: 500 errors**
- ✅ Check environment variables are set correctly
- ✅ Verify Google Drive API is enabled

## Post-Deployment

Your app is now live! Share the link with friends:
```
https://your-app.vercel.app
```

They can sign in with their Google accounts and start collaborating! 🚀

---

**Need help?** Check Vercel logs or contact support.
