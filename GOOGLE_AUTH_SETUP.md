# Google Authentication Setup Guide

The "Sign in with Google" button is failing because Google's security settings do not match your current local environment. You need to tell Google, "It's okay to accept login requests from `http://localhost:3000`".

## Step-by-Step Instructions

1.  **Go to Google Cloud Console**:
    *   Open [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials).
    *   Ensure you are selected on the correct project (matching Client ID: `743248020608-...`).

2.  **Find your OAuth Client**:
    *   Under "OAuth 2.0 Client IDs", look for the client entry that corresponds to your application (likely named "Web client 1" or "Amazon FDC Tool").
    *   Click on the **pencil icon** (Edit) or the name of the client to edit settings.

3.  **Add Authorized JavaScript Origins**:
    *   Find the section **"Authorized JavaScript origins"**.
    *   Click **"ADD URI"**.
    *   Enter: `http://localhost:3000`
    *   *(Note: Ensure there are no trailing slashes, just exactly `http://localhost:3000`)*

4.  **Add Authorized Redirect URIs** (Optional but recommended):
    *   Find the section **"Authorized redirect URIs"**.
    *   Click **"ADD URI"**.
    *   Enter: `http://localhost:3000`
    *   Enter: `http://localhost:3000/login`

5.  **Save Changes**:
    *   Click the **SAVE** button at the bottom of the page.

## Testing
1.  Wait a few minutes (Google says it can take minutes to hours, but usually it's instant for local dev).
2.  Refresh your application at [http://localhost:3000/login](http://localhost:3000/login).
3.  Click "Sign in with Google" again.
4.  The popup should now appear without error.
