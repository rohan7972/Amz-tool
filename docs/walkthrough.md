# Phase 3: Amazon Data Sync Foundation - Walkthrough

We have successfully implemented the "backbone" for fetching real Amazon data.

## Changes Implemented
1.  **Security Shield**: Added Rate Limiting to prevent API spam (100 req/15min).
2.  **Sync Engine (The "Brain")**:
    *   **DB-Backed Queue**: Jobs are saved to Postgres (`sync_jobs` table) instead of RAM, so they survive server restarts.
    *   **Worker Loop**: The server checks for pending jobs every 30 seconds.
3.  **Amazon API Client**: Created the `SPAPIClient` to securely request reports from Amazon.
4.  **Frontend Connection**: The "Sync Now" button in Profile/Settings is now wired to the backend.

## How to Test (Manual Verification)

### 1. Trigger a Sync
1.  Go to **Settings** > **Connect & Manage Accounts**.
2.  Find an account (e.g., "My Store").
3.  Click the **Three Dots (Menu)** > **Sync Now**.
4.  **Observation**: You should see a notification "Sync Initiated".

### 2. Verify Backend Processing
1.  Check the backend terminal.
2.  Every 30 seconds, you should see:
    > `[INFO] Found 1 pending sync jobs. Starting processing...`
    > `[INFO] Starting Job ... for Account ...`
    > `[INFO] Job ... COMPLETED successfully.`

### 3. Verify Database
Run this SQL query to see the job history:
```sql
SELECT * FROM sync_jobs ORDER BY created_at DESC;
```
You should see a new row with `status = 'COMPLETED'`.
