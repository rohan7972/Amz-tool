# 🔗 OAuth Redirect URIs Configuration

## ⚠️ IMPORTANT: You MUST update these in your OAuth providers!

Your application is now running on **HTTPS** with domain **app.sellerai.in**.

All OAuth redirect URIs must be updated to use the new HTTPS domain.

---

## 🔐 Google OAuth Console

### Where to Update
https://console.cloud.google.com/apis/credentials

### Steps
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Find your OAuth 2.0 Client ID (the one you're currently using)
3. Click on it to edit
4. Find the "Authorized redirect URIs" section
5. **Add** or **Update** to:

### ✅ Authorised Redirect URI

```
https://app.sellerai.in/api/auth/google/callback
```

**Important Notes**:
- ✅ Use `https://` (not `http://`)
- ✅ No trailing slash
- ✅ Exact match required
- ❌ Remove old IP-based URI: `http://13.204.41.42/api/auth/google/callback`

### Current Google OAuth Configuration

From your `.env.production`:
```bash
GOOGLE_CLIENT_ID=154300671328-cpr8nt4gfi913dk6fkrnkd7bm9r2h9hj.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://app.sellerai.in/api/auth/google/callback
```

**Action Required**: Update the redirect URI in Google Console to match `GOOGLE_CALLBACK_URL`

---

## 🛒 Amazon Seller Central

### Where to Update
https://sellercentral.amazon.com/apps/manage

### Steps
1. Go to Amazon Seller Central
2. Navigate to **Apps & Services** → **Develop Apps**
3. Click on your application (or register new one if not done)
4. Find **OAuth Redirect URIs** section
5. **Add** or **Update** to:

### ✅ OAuth Redirect URI

```
https://app.sellerai.in/api/oauth/callback/sp-api
```

**Important Notes**:
- ✅ Use `https://` (not `http://`)
- ✅ No trailing slash
- ✅ Exact match required
- ❌ Remove old IP-based URI: `http://13.204.41.42/api/oauth/callback/sp-api`

### Current Amazon SP-API Configuration

From your `.env.production`:
```bash
SP_API_LWA_APP_ID=amzn1.application-oa2-client.b53399e910e548f5b067535def20a99b
SP_API_LWA_CLIENT_SECRET=Atzr|IwEBIFcEsj9o7w-q-XZPslQQ80cfbEIm7Jx1...
AMAZON_SANDBOX_MODE=true
```

**Action Required**: 
1. Update the redirect URI in Amazon Seller Central to match the HTTPS domain
2. When ready for production OAuth testing, register production app and update credentials

---

## 📋 Quick Reference Table

| Provider | Redirect URI | Status |
|----------|--------------|--------|
| **Google OAuth** | `https://app.sellerai.in/api/auth/google/callback` | ⚠️ **UPDATE REQUIRED** |
| **Amazon SP-API** | `https://app.sellerai.in/api/oauth/callback/sp-api` | ⚠️ **UPDATE REQUIRED** |

---

## 🧪 Testing After Update

### Test Google OAuth

1. Open: https://app.sellerai.in
2. Click "Login with Google"
3. You should be redirected to Google login
4. After login, you should be redirected back to your app
5. ✅ Success: You're logged in

**If it fails**:
- Check browser console for errors
- Verify redirect URI matches exactly
- Check backend logs: `sudo docker logs -f amazon-fdc-backend`

### Test Amazon OAuth

1. Open: https://app.sellerai.in/settings
2. Click "Connect New Account"
3. Select "Seller Account"
4. Click "Connect to Amazon"
5. **If in sandbox mode**: No consent screen (sandbox limitation)
6. **If in production mode**: Consent screen appears → grant access
7. ✅ Success: Redirected back with account connected

**If it fails**:
- Verify redirect URI in Amazon Seller Central
- Check if using production mode for OAuth testing
- Check backend logs: `sudo docker logs -f amazon-fdc-backend`

---

## 🔍 How to Verify Configuration

### Check Current Environment Variables

SSH to server and check:

```bash
ssh -i Rohan.pem ubuntu@ec2-13-204-41-42.ap-south-1.compute.amazonaws.com
cd /opt/amazon-fdc-tool
sudo cat .env.production | grep -E "FRONTEND_URL|BACKEND_URL|CALLBACK|REDIRECT"
```

Expected output:
```bash
FRONTEND_URL=https://app.sellerai.in
BACKEND_URL=https://app.sellerai.in
GOOGLE_CALLBACK_URL=https://app.sellerai.in/api/auth/google/callback
```

### Check Backend Logs for OAuth

```bash
sudo docker logs -f amazon-fdc-backend | grep -i oauth
```

Look for:
```
=== SP-API OAuth Callback Received ===
Query params: { code: '...', state: '...', ... }
```

---

## 🛠️ Troubleshooting

### Error: `redirect_uri_mismatch`

**Cause**: The redirect URI in your OAuth request doesn't match what's registered in the provider's console.

**Fix**:
1. Check the exact URI in provider's console
2. Must match **exactly** (including https://, path, no trailing slash)
3. Wait a few minutes after updating (propagation)
4. Restart backend container:
   ```bash
   sudo docker-compose -f docker-compose.prod.yml --env-file .env.production restart backend
   ```

### Error: `invalid_request` or `unauthorized_client`

**Cause**: OAuth client credentials might be incorrect or not set.

**Fix**:
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.production`
2. Verify `SP_API_LWA_APP_ID` and `SP_API_LWA_CLIENT_SECRET` in `.env.production`
3. Make sure credentials match those in the OAuth provider's console

### Error: `CORS` or `blocked by CORS policy`

**Cause**: CORS origin not matching.

**Fix**:
1. Check `CORS_ORIGIN` in `.env.production`:
   ```bash
   CORS_ORIGIN=https://app.sellerai.in
   ```
2. Restart backend container

### Amazon Consent Screen Not Appearing

**Cause**: Amazon Sandbox mode doesn't support full OAuth flow.

**Solution**: Switch to production mode when ready to test OAuth:
```bash
# Edit .env.production
AMAZON_SANDBOX_MODE=false

# Update with production credentials
SP_API_LWA_APP_ID=your_production_client_id
SP_API_LWA_CLIENT_SECRET=your_production_secret

# Restart
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production restart
```

---

## 📸 Visual Guides

### Google OAuth Console

1. **Navigate to Credentials**:
   - Google Cloud Console → APIs & Services → Credentials

2. **Click on OAuth 2.0 Client ID**:
   - Find your client ID (starts with numbers)
   - Click to edit

3. **Authorized redirect URIs section**:
   ```
   ┌─────────────────────────────────────────────────┐
   │ Authorized redirect URIs                        │
   ├─────────────────────────────────────────────────┤
   │ https://app.sellerai.in/api/auth/google/callback│
   │ [+ ADD URI]                                     │
   └─────────────────────────────────────────────────┘
   ```

4. **Save changes**

### Amazon Seller Central

1. **Navigate to Apps**:
   - Seller Central → Apps & Services → Develop Apps

2. **Click your app or "Add new app client"**

3. **OAuth Redirect URI section**:
   ```
   ┌─────────────────────────────────────────────────┐
   │ OAuth Redirect URI                              │
   ├─────────────────────────────────────────────────┤
   │ https://app.sellerai.in/api/oauth/callback/sp-api│
   └─────────────────────────────────────────────────┘
   ```

4. **Save changes**

---

## ✅ Checklist

Before testing OAuth flows:

- [ ] Updated Google OAuth redirect URI to `https://app.sellerai.in/api/auth/google/callback`
- [ ] Updated Amazon OAuth redirect URI to `https://app.sellerai.in/api/oauth/callback/sp-api`
- [ ] Verified `.env.production` has `FRONTEND_URL=https://app.sellerai.in`
- [ ] Verified `.env.production` has `BACKEND_URL=https://app.sellerai.in`
- [ ] Restarted Docker containers after any changes
- [ ] Tested Google login at https://app.sellerai.in
- [ ] Tested Amazon connection at https://app.sellerai.in/settings
- [ ] Checked backend logs for any OAuth errors

---

## 🎯 Summary

**Current Status**: Application is live with HTTPS at **app.sellerai.in**

**Required Actions**:
1. ⚠️ Update Google OAuth redirect URI in Google Console
2. ⚠️ Update Amazon OAuth redirect URI in Seller Central
3. ✅ Test both OAuth flows
4. ✅ Switch Amazon to production mode when ready

**All OAuth redirect URIs MUST use**:
- ✅ `https://` protocol
- ✅ Domain: `app.sellerai.in`
- ✅ Exact paths as specified above
- ❌ NO trailing slashes

---

## 📞 Need Help?

If OAuth still doesn't work after updating:

1. **Check Backend Logs**:
   ```bash
   sudo docker logs -f amazon-fdc-backend | grep -i oauth
   ```

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

3. **Verify Configuration**:
   ```bash
   cd /opt/amazon-fdc-tool
   sudo cat .env.production | grep -E "URL|CALLBACK|CLIENT"
   ```

4. **Restart Everything**:
   ```bash
   cd /opt/amazon-fdc-tool
   sudo docker-compose -f docker-compose.prod.yml --env-file .env.production restart
   sudo systemctl restart nginx
   ```

---

**Document Updated**: December 29, 2025  
**Application URL**: https://app.sellerai.in  
**Status**: 🟢 Live and Ready for OAuth Configuration
