# How to Allow ANYONE to Log In with Google

Currently, your Google Cloud project is likely in **"Testing"** mode. In this mode, Google only allows specific email addresses you've manually added to a "Test Users" list to log in. Everyone else sees an "Access Blocked" or "Error 403" screen.

To allow **any** user with a Google account to log in, you must switch your application to **"Production"** mode.

## Step-by-Step Instructions

1.  **Go to Google Cloud Console**:
    *   Open [https://console.cloud.google.com/apis/credentials/consent](https://console.cloud.google.com/apis/credentials/consent).
    *   Select your project from the top dropdown.

2.  **Check Publishing Status**:
    *   Look for the section **"Publishing status"**.
    *   If it says **"Testing"**, this is why random users cannot log in.

3.  **Publish App**:
    *   Click the button that says **"PUBLISH APP"**.
    *   A confirmation popup will appear asking if you want to push to production.
    *   Click **"CONFIRM"**.

4.  **Verification (Likely Not Needed)**:
    *   Since your app only asks for basic permissions (name, email, profile picture), verification is usually not required for personal/internal use, although you might see a "Unverified App" warning screen initially.
    *   **"Unverified App" Screen**: If users see a screen saying "Google hasn't verified this app", they can still proceed by clicking "Advanced" -> "Go to [App Name] (unsafe)".
    *   To remove that warning entirely, you would need to submit a verification request to Google (process takes days/weeks), but strictly speaking, **it is not required just to let people log in**.

## Summary of Changes
| Mode | Who can log in? |
| :--- | :--- |
| **Testing** | Only emails you explicitly listed in "Test Users". |
| **Production** | **Anyone** with a Google account. |

## ⚠️ Important Note
Your backend code (`backend/src/routes/auth.ts`) is **already configured** to automatically create a new account for anyone who logs in successfully with Google. You do not need to change any code!
