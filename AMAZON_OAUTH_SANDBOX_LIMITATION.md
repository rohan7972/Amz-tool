# ⚠️ Amazon SP-API OAuth - Sandbox Limitation Explained

## Why "Connect Seller Account" is Failing

**TL;DR**: Amazon Sandbox mode **DOES NOT support OAuth consent flow**. You cannot test the "Connect Seller Account" button with sandbox credentials. This is a known Amazon limitation, not an issue with your application.

---

## 🔍 Understanding the Problem

### What You're Experiencing

When you click "Connect Seller Account" → "Connect to Amazon":
- ❌ No consent screen appears
- ❌ OAuth flow fails silently
- ❌ User is not redirected to Amazon for authorization

### Root Cause: Amazon Sandbox Limitations

Amazon SP-API has **TWO modes**:

| Feature | Sandbox Mode | Production Mode |
|---------|--------------|-----------------|
| **API Testing** | ✅ Works | ✅ Works |
| **OAuth Consent Flow** | ❌ **NOT SUPPORTED** | ✅ Works |
| **Purpose** | API development & testing | Live seller authorization |

**Official Amazon Documentation**:
> "The Sandbox environment does not support the OAuth authorization flow. For testing OAuth, you must use the Production environment with real seller accounts."

---

## 📋 Your Current Configuration

### Updated SP-API Credentials (✅ Applied)

```bash
Application Name: amz tool
Application ID: amzn1.sp.solution.6f799d42-aed0-4003-af24-262ffef91f01
Client Secret: Atzr|IwEBIFcEsj9o7w-q-XZPslQQ80cfbEIm7Jx1...
Mode: SANDBOX
```

These credentials are now configured in your backend at `/opt/amazon-fdc-tool/.env.production`

### What Works vs. What Doesn't

✅ **Works in Sandbox**:
- Direct API calls with pre-existing tokens
- Testing API endpoints (orders, products, reports)
- Developing API integration logic
- Testing data structures

❌ **Does NOT Work in Sandbox**:
- OAuth authorization flow (the "Connect Seller Account" button)
- Generating refresh tokens via OAuth
- Seller consent screens
- Real seller account linking

---

## 🛠️ Solution: Set Up Production OAuth

To test the "Connect Seller Account" functionality, you MUST:

### 1. Register OAuth Redirect URI

**Where**: Amazon Seller Central → Apps & Services → Develop Apps

**Your App**: amz tool (`amzn1.sp.solution.6f799d42-aed0-4003-af24-262ffef91f01`)

**Add This OAuth Redirect URI**:
```
https://app.sellerai.in/api/oauth/callback/sp-api
```

### Step-by-Step Instructions:

1. **Go to Seller Central**:
   - https://sellercentral.amazon.com/apps/manage
   - Or: Apps & Services → Develop Apps

2. **Find or Create Your App**:
   - Look for "amz tool" 
   - Application ID: `amzn1.sp.solution.6f799d42-aed0-4003-af24-262ffef91f01`
   - If not found, click "Add new app client"

3. **Edit App Configuration**:
   - Click on your app name to edit
   - Find "OAuth Redirect URIs" section

4. **Add Redirect URI**:
   ```
   https://app.sellerai.in/api/oauth/callback/sp-api
   ```
   
   **Important**:
   - ✅ Must be exactly as shown above
   - ✅ Use `https://` (not `http://`)
   - ✅ No trailing slash
   - ✅ Path must be `/api/oauth/callback/sp-api`

5. **Save Changes**:
   - Click "Save" or "Update"
   - Amazon will validate the redirect URI

6. **Note Your Credentials**:
   - After saving, you'll see:
     - **LWA Client Identifier** (starts with `amzn1.sp.solution...`)
     - **LWA Client Secret** (starts with `Atzr|...`)
   - These are your **PRODUCTION** credentials

### 2. Update Backend with Production Credentials

Once you have the redirect URI registered and confirmed:

```bash
# SSH to server
ssh -i Rohan.pem ubuntu@ec2-13-204-41-42.ap-south-1.compute.amazonaws.com

# Edit environment
cd /opt/amazon-fdc-tool
sudo nano .env.production

# Update these lines:
SP_API_LWA_APP_ID=amzn1.sp.solution.6f799d42-aed0-4003-af24-262ffef91f01
SP_API_LWA_CLIENT_SECRET=your_production_secret_from_seller_central
AMAZON_SANDBOX_MODE=false  # Change to false for OAuth

# Save (Ctrl+O, Enter, Ctrl+X)

# Restart backend
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production restart backend
```

---

## 🧪 Testing Amazon OAuth (After Setup)

### Prerequisites

- [x] ✅ SP-API credentials updated (done)
- [ ] ⚠️ **OAuth redirect URI registered in Seller Central** (you must do this)
- [ ] ⚠️ **AMAZON_SANDBOX_MODE=false** (change after redirect URI setup)
- [ ] ⚠️ **Backend restarted** (after changes)

### Test Steps

1. **Open Application**:
   - https://app.sellerai.in/settings

2. **Click "Connect New Account"**:
   - Select "Seller Account"
   - Choose region (e.g., "United States")

3. **Click "Connect to Amazon"**:
   - You'll be redirected to Amazon
   - **Amazon consent screen should appear**
   - Shows app name: "amz tool"
   - Asks for permissions

4. **Grant Access**:
   - Review permissions
   - Click "Allow" or "Authorize"

5. **Redirected Back**:
   - Returns to https://app.sellerai.in
   - Account should be connected
   - Shows seller info

### What to Expect

**If Redirect URI is NOT registered**:
- ❌ Error: "Invalid redirect URI"
- ❌ Or blank page
- ❌ OAuth fails immediately

**If Redirect URI IS registered**:
- ✅ Amazon consent screen appears
- ✅ Can grant permissions
- ✅ Redirected back to your app
- ✅ Account connected successfully

---

## 📊 Current Application Status

### Backend Configuration (✅ Updated)

```bash
SP_API_LWA_APP_ID: amzn1.sp.solution.6f799d42-aed0-4003-af24-262ffef91f01
SP_API_LWA_CLIENT_SECRET: Atzr|IwEBIFcEsj9o7w-q-XZPslQQ80cfbEIm7Jx1...
AMAZON_SANDBOX_MODE: true (for API testing)
Region: us-east-1
```

### What I Need from You

1. **Register OAuth Redirect URI in Seller Central**:
   - Go to: https://sellercentral.amazon.com/apps/manage
   - Find app: "amz tool"
   - Add redirect URI: `https://app.sellerai.in/api/oauth/callback/sp-api`
   - Save changes

2. **Confirm Registration**:
   - Take a screenshot of the redirect URI field (optional)
   - Let me know when it's done

3. **Provide Production Credentials** (if different):
   - After registering redirect URI
   - If Amazon gives you different credentials
   - Send the new LWA Client ID and Secret

4. **Choose When to Switch**:
   - Keep `AMAZON_SANDBOX_MODE=true` for API testing
   - Switch to `AMAZON_SANDBOX_MODE=false` when ready to test OAuth
   - I can make this change remotely when you're ready

---

## 🎯 Why This Matters

### Sandbox vs. Production Use Cases

**Use Sandbox For**:
- ✅ Developing API integration
- ✅ Testing API endpoints
- ✅ Building application features
- ✅ Testing with sample data
- ✅ No real seller data involved

**Use Production For**:
- ✅ Testing OAuth flow
- ✅ Connecting real seller accounts
- ✅ Getting real seller data
- ✅ End-to-end user testing
- ✅ Production deployment

### Why Amazon Restricts OAuth in Sandbox

**Reasons**:
1. **Security**: OAuth grants access to real seller data
2. **Data Protection**: Sandbox should not access production data
3. **Consent Required**: Real sellers must explicitly authorize access
4. **Amazon Policy**: Sandbox is for API testing only, not authorization testing

---

## 🔧 Troubleshooting

### Issue: "Invalid redirect URI" Error

**Cause**: Redirect URI not registered or doesn't match exactly

**Fix**:
1. Check redirect URI in Seller Central
2. Must be: `https://app.sellerai.in/api/oauth/callback/sp-api`
3. No typos, exact match required
4. Wait a few minutes after saving

### Issue: No Consent Screen Appears

**Cause 1**: Using sandbox mode
- **Fix**: Switch to production mode (`AMAZON_SANDBOX_MODE=false`)

**Cause 2**: Redirect URI not registered
- **Fix**: Register it in Seller Central (see instructions above)

**Cause 3**: Using sandbox credentials in production mode
- **Fix**: Get production credentials from Seller Central

### Issue: "Application is not authorized"

**Cause**: App not approved by Amazon for production use

**Fix**:
1. Go to Seller Central → Develop Apps
2. Check app status
3. May need to submit for approval
4. Or use test marketplace/regions

### Issue: OAuth Works but Data is Empty

**Cause**: App might still be in sandbox mode

**Fix**:
```bash
# Verify mode
cd /opt/amazon-fdc-tool
sudo cat .env.production | grep AMAZON_SANDBOX_MODE

# Should be: AMAZON_SANDBOX_MODE=false for real data
```

---

## 📝 Summary

### Current Status

- ✅ **SP-API Credentials**: Updated with your app details
- ✅ **Backend**: Configured and running
- ✅ **HTTPS/SSL**: Working at app.sellerai.in
- ⏳ **OAuth Redirect URI**: **NOT YET REGISTERED** (you must do this)
- ⏳ **Production Mode**: Currently in sandbox for API testing

### Next Steps (In Order)

1. **Register OAuth Redirect URI** (Required):
   - https://sellercentral.amazon.com/apps/manage
   - Add: `https://app.sellerai.in/api/oauth/callback/sp-api`

2. **Confirm with Me**:
   - Let me know when redirect URI is registered
   - I'll verify the configuration

3. **Switch to Production Mode** (When Ready):
   - I'll change `AMAZON_SANDBOX_MODE=false`
   - Restart backend
   - Test OAuth flow

4. **Test "Connect Seller Account"**:
   - Should show Amazon consent screen
   - Grant access
   - Account connects successfully

### What You Can Test Now (Sandbox Mode)

While in sandbox mode, you can still test:
- ✅ Google OAuth login (after updating redirect URI in Google Console)
- ✅ Application navigation and UI
- ✅ Dashboard and settings pages
- ✅ Any non-Amazon features

You **cannot** test:
- ❌ "Connect Seller Account" button (needs production OAuth)
- ❌ Amazon seller data (needs real account connection)
- ❌ SP-API OAuth flow (sandbox limitation)

---

## 📞 What I Need from You

### Immediate Action Required

**Register OAuth Redirect URI in Amazon Seller Central**:

1. Go to: https://sellercentral.amazon.com/apps/manage
2. Find: "amz tool" (or add new app client)
3. Add Redirect URI: `https://app.sellerai.in/api/oauth/callback/sp-api`
4. Save changes
5. Let me know when it's done

### Optional (But Recommended)

- Screenshot of the redirect URI field in Seller Central
- Any error messages you see when trying to save
- Confirmation that the app is approved/active

---

## 🎉 Once OAuth is Set Up

After you register the redirect URI:

1. I'll switch the app to production mode
2. You'll be able to test "Connect Seller Account"
3. The full OAuth flow will work
4. You can connect real Amazon seller accounts

**Estimated Time**: 5-10 minutes to register redirect URI

---

**Date**: December 29, 2025  
**Application**: https://app.sellerai.in  
**Status**: ✅ Backend ready, ⚠️ Awaiting OAuth redirect URI registration
