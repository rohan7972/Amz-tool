# 🔧 Google OAuth 400 Error - Fixed!

## Issue Identified

Google login was showing **400: invalid_request** error.

**Root Cause**: The frontend was missing the `VITE_GOOGLE_CLIENT_ID` environment variable, which is required by the `@react-oauth/google` library to initialize the Google OAuth provider.

---

## What Was Fixed

### 1. Added Google Client ID to Frontend Environment

**File Updated**: `/opt/amazon-fdc-tool/frontend/.env.production`

```bash
VITE_GOOGLE_CLIENT_ID=545308709933-o9pro093kebuh6eq8nin0ahvbvlreq6m.apps.googleusercontent.com
```

### 2. Rebuilt Frontend Container

The frontend container was rebuilt to include the Google Client ID in the build:

```bash
sudo docker-compose -f docker-compose.prod.yml build frontend
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production up -d frontend
```

### 3. Updated Backend Google OAuth Credentials

**File**: `/opt/amazon-fdc-tool/.env.production`

```bash
GOOGLE_CLIENT_ID=545308709933-o9pro093kebuh6eq8nin0ahvbvlreq6m.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://app.sellerai.in/api/auth/google/callback
```

---

## Current Configuration

### Frontend Environment Variables

Location: `/opt/amazon-fdc-tool/frontend/.env.production`

```bash
VITE_API_URL=/api
VITE_API_BASE_URL=/api
VITE_BACKEND_URL=
VITE_APP_NAME=Amazon FDC Tool
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
VITE_GOOGLE_CLIENT_ID=545308709933-o9pro093kebuh6eq8nin0ahvbvlreq6m.apps.googleusercontent.com
```

### Backend Environment Variables

Location: `/opt/amazon-fdc-tool/.env.production`

```bash
GOOGLE_CLIENT_ID=545308709933-o9pro093kebuh6eq8nin0ahvbvlreq6m.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://app.sellerai.in/api/auth/google/callback
```

---

## ⚠️ CRITICAL: Update Google Console Redirect URI

**You MUST update the redirect URI in Google Console for login to work!**

### Steps:

1. **Go to Google Cloud Console**:
   - https://console.cloud.google.com/apis/credentials

2. **Find Your OAuth 2.0 Client ID**:
   - Client ID: `545308709933-o9pro093kebuh6eq8nin0ahvbvlreq6m`
   - Click on it to edit

3. **Add Authorized Redirect URI**:
   - In the "Authorized redirect URIs" section, add:
   ```
   https://app.sellerai.in/api/auth/google/callback
   ```

4. **Save Changes**

**Important**:
- ✅ Must be exactly: `https://app.sellerai.in/api/auth/google/callback`
- ✅ Use `https://` (not `http://`)
- ✅ No trailing slash
- ❌ Remove any old URIs with IP addresses

---

## How Google OAuth Works in This Application

### Frontend Flow

1. **User clicks "Sign in with Google"** on the login page
2. **Google OAuth popup appears** (provided by `@react-oauth/google` library)
3. **User selects Google account** and grants permissions
4. **Google returns a credential token** to the frontend
5. **Frontend sends token to backend** via POST `/api/auth/google`

### Backend Flow

1. **Backend receives credential token** from frontend
2. **Verifies token with Google** using `google-auth-library`
3. **Extracts user info** from verified token (email, name, etc.)
4. **Checks if user exists** in database
5. **Creates new user** if first-time login
6. **Generates JWT tokens** for the application
7. **Returns user data and tokens** to frontend
8. **Frontend stores tokens** and redirects to dashboard

### Code References

**Frontend**: 
- `frontend/src/main.tsx` - GoogleOAuthProvider wrapper
- `frontend/src/components/auth/LoginForm.tsx` - GoogleLogin button
- `frontend/src/services/authService.ts` - googleLogin function

**Backend**:
- `backend/src/routes/auth.ts` - POST `/auth/google` endpoint
- Uses `google-auth-library` OAuth2Client to verify tokens

---

## Testing Google OAuth

### 1. Open Application

Visit: https://app.sellerai.in

### 2. Verify Google Button Appears

You should see:
- "Sign in with Google" button
- Google logo/icon
- No console errors

If the button doesn't appear, check browser console for errors.

### 3. Click "Sign in with Google"

**Expected Behavior**:
- Google popup/modal appears
- Shows your Google accounts
- Allows you to select an account

**If you get errors**:
- `400: redirect_uri_mismatch` → Update redirect URI in Google Console
- `400: invalid_request` → Check that VITE_GOOGLE_CLIENT_ID is set in frontend
- `popup_closed_by_user` → User closed the popup, normal behavior

### 4. Select Google Account and Grant Access

**Expected Behavior**:
- Popup closes
- You're redirected to dashboard
- Logged in successfully

### 5. Check Backend Logs

```bash
sudo docker logs -f amazon-fdc-backend
```

Look for:
```
Login attempt for: your-email@gmail.com
```

Or errors like:
```
Google Token verification failed
Invalid Google Token
```

---

## Troubleshooting

### Error: "popup_blocked"

**Cause**: Browser blocked the Google OAuth popup

**Solution**:
1. Allow popups for app.sellerai.in in your browser
2. Try again

### Error: "400: redirect_uri_mismatch"

**Cause**: Redirect URI in Google Console doesn't match

**Solution**:
1. Check redirect URI in Google Console
2. Must be exactly: `https://app.sellerai.in/api/auth/google/callback`
3. No trailing slash, must use HTTPS
4. Save and wait a few minutes

### Error: Google button not appearing

**Cause**: VITE_GOOGLE_CLIENT_ID not loaded in frontend

**Check**:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `import.meta.env.VITE_GOOGLE_CLIENT_ID`
4. Should show your client ID

**If undefined**, rebuild frontend:
```bash
cd /opt/amazon-fdc-tool
sudo docker-compose -f docker-compose.prod.yml build frontend
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production up -d frontend
```

### Error: "Invalid Google Token"

**Cause**: Backend can't verify the token

**Check**:
1. Verify GOOGLE_CLIENT_ID in backend .env.production
2. Restart backend container:
```bash
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production restart backend
```

### Error: Backend returns 404 for /api/auth/google

**Cause**: Backend auth routes not loaded

**Check**:
1. Verify backend is running: `sudo docker ps`
2. Check backend logs: `sudo docker logs amazon-fdc-backend`
3. Should see: "OAuth module loaded"

---

## Verification Checklist

Before testing Google login:

- [x] ✅ Frontend rebuilt with `VITE_GOOGLE_CLIENT_ID`
- [x] ✅ Frontend container restarted
- [x] ✅ Backend has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- [x] ✅ Backend container restarted
- [x] ✅ Application accessible at https://app.sellerai.in
- [ ] ⚠️ **Redirect URI updated in Google Console** (YOU MUST DO THIS!)

---

## Summary

**Status**: ✅ Fixed and Ready for Testing

**What Changed**:
1. ✅ Added `VITE_GOOGLE_CLIENT_ID` to frontend environment
2. ✅ Rebuilt frontend container with Google OAuth support
3. ✅ Updated backend Google OAuth credentials
4. ✅ Restarted both frontend and backend containers

**Required Action**:
- ⚠️ **Update redirect URI in Google Console**
  - URL: https://console.cloud.google.com/apis/credentials
  - Client ID: `545308709933-o9pro093kebuh6eq8nin0ahvbvlreq6m`
  - Add: `https://app.sellerai.in/api/auth/google/callback`

**Test**:
1. Open https://app.sellerai.in
2. Click "Sign in with Google"
3. Select your Google account
4. ✅ Should log in successfully

---

**Date Fixed**: December 29, 2025  
**Application URL**: https://app.sellerai.in  
**Status**: 🟢 Ready for Google OAuth Testing (after updating redirect URI)
