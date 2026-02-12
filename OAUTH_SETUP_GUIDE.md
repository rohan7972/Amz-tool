# Amazon SP-API OAuth Setup Guide

## Problem: No Consent Screen in Sandbox Mode

Amazon SP-API **sandbox mode** has limited OAuth functionality:
- ❌ No consent screen shown
- ❌ Redirect doesn't work properly
- ❌ Can't test full OAuth flow

## Solution: Use Production Mode

### Step 1: Register Your Application in Amazon Seller Central

1. Go to: https://developer.amazonservices.com/ or https://sellercentral.amazon.com/apps/manage
2. Log in with your Amazon seller account
3. Click "Add new app client"
4. Fill in details:
   - **App Name**: Amazon FDC Tool
   - **OAuth Redirect URI**: `http://13.204.41.42/api/oauth/callback/sp-api`
   - **API Type**: SP-API
5. Save and note down:
   - **LWA Client ID** (App ID)
   - **LWA Client Secret**

### Step 2: Update Environment Variables

Update your `.env.production` file:

```bash
# Switch to Production Mode
AMAZON_SANDBOX_MODE=false

# Your SP-API Credentials
SP_API_LWA_APP_ID=amzn1.application-oa2-client.YOUR_CLIENT_ID
SP_API_LWA_CLIENT_SECRET=YOUR_CLIENT_SECRET

# API Endpoints
SP_API_PROD_ENDPOINT=https://sellingpartnerapi-na.amazon.com
SP_API_SANDBOX_ENDPOINT=https://sandbox.sellingpartnerapi-na.amazon.com

# Application URLs (MUST match registered redirect URI)
BACKEND_URL=http://13.204.41.42
FRONTEND_URL=http://13.204.41.42
```

### Step 3: Verify Redirect URI Configuration

The redirect URI must match EXACTLY:
- **Registered in Amazon**: `http://13.204.41.42/api/oauth/callback/sp-api`
- **Used in app**: `http://13.204.41.42/api/oauth/callback/sp-api`

### Step 4: Restart Services

```bash
ssh -i Rohan.pem ubuntu@ec2-13-204-41-42.ap-south-1.compute.amazonaws.com
cd /opt/amazon-fdc-tool
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production down
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

## Alternative: Test with Sandbox (Limited)

If you must use sandbox mode:

### Step 1: Use Amazon's Test Seller Account

Amazon provides test seller accounts for sandbox:
- Username: Usually provided by Amazon when you register for SP-API
- No real consent screen will be shown

### Step 2: Direct Token Generation

In sandbox, you may need to generate tokens directly instead of using OAuth:

```typescript
// Use your refresh token directly
const params = {
  grant_type: 'refresh_token',
  refresh_token: process.env.SP_API_REFRESH_TOKEN,
  client_id: process.env.SP_API_LWA_APP_ID,
  client_secret: process.env.SP_API_LWA_CLIENT_SECRET
};
```

## Testing the OAuth Flow

### 1. Login to Your App
Navigate to: http://13.204.41.42/login

### 2. Go to Settings
Navigate to: http://13.204.41.42/settings

### 3. Click "Connect New Account"
- Select "Seller Account"
- Choose region (United States)
- Click "Connect to Amazon"

### 4. Authorize on Amazon
You should see:
- ✅ Amazon login page (if not logged in)
- ✅ Consent screen showing permissions requested
- ✅ "Grant Access" button
- ✅ Redirect back to your app

### 5. Verify Connection
- Check dashboard for connected account
- Account should show as "Active"

## Troubleshooting

### Issue: "Invalid redirect_uri"
**Cause**: Redirect URI doesn't match what's registered in Amazon Seller Central

**Fix**: 
1. Check registered URI in Amazon Developer Console
2. Update environment variable to match exactly
3. Include protocol (http/https), domain, and path

### Issue: "Invalid client_id"
**Cause**: Wrong LWA Client ID or not registered

**Fix**:
1. Verify Client ID in Amazon Developer Console
2. Copy exact value to `.env.production`
3. Restart backend container

### Issue: No consent screen in sandbox
**Cause**: This is expected behavior in sandbox mode

**Fix**: Switch to production mode for full OAuth testing

### Issue: Redirect takes too long
**Cause**: Nginx timeout or network issue

**Fix**:
1. Check nginx proxy timeout settings
2. Verify backend is accessible: `curl http://localhost:3001/health`
3. Check Docker logs: `docker logs amazon-fdc-backend`

## Important Notes

### Redirect URI Must Match
Amazon is **very strict** about redirect URI matching:
- ✅ `http://13.204.41.42/api/oauth/callback/sp-api`
- ❌ `http://13.204.41.42:3001/api/oauth/callback/sp-api` (wrong port)
- ❌ `https://13.204.41.42/api/oauth/callback/sp-api` (wrong protocol)
- ❌ `http://13.204.41.42/api/oauth/callback/sp-api/` (trailing slash)

### Multiple Redirect URIs
You can register multiple redirect URIs in Amazon:
- Development: `http://localhost:3001/api/oauth/callback/sp-api`
- Production: `http://13.204.41.42/api/oauth/callback/sp-api`

### Security Considerations
- Use HTTPS in production (get SSL certificate)
- Never commit `.env.production` to Git
- Rotate client secrets regularly
- Monitor failed OAuth attempts

## Current Status

Your app configuration:
- ✅ OAuth flow implemented
- ✅ Token encryption working
- ✅ Callback endpoint configured
- ⚠️ Sandbox mode enabled (limited functionality)
- ⚠️ Need to register redirect URI in Amazon
- ⚠️ Need to test in production mode

## Next Steps

1. **Register app in Amazon Seller Central** with your redirect URI
2. **Get production credentials** (Client ID & Secret)
3. **Update `.env.production`** with new credentials
4. **Set `AMAZON_SANDBOX_MODE=false`**
5. **Restart services** on server
6. **Test OAuth flow** with real Amazon seller account

## Resources

- Amazon SP-API Documentation: https://developer-docs.amazon.com/sp-api/
- Seller Central Apps: https://sellercentral.amazon.com/apps/manage
- LWA Documentation: https://developer.amazon.com/docs/login-with-amazon/
