# Phase 3: Amazon Data Integration & Sync Engine

**Goal**: Enable users to connect real Amazon Accounts (Seller, Vendor, Ads) and fetch live data (Campaigns, Orders, Keywords) into the dashboard.

## User Review Required
> [!IMPORTANT]
> **Local Sync Strategy**: Since you are running locally without Docker (and likely without Redis), I will implement an **"In-Memory Sync Engine"** for development. In production, this can easily be switched to a Redis-based queue (BullMQ).
> This means if you stop the server, pending sync jobs will be lost (acceptable for dev).

## Proposed Changes

### 1. Backend: Data Fetching Services (The "Backbone")
We need to implement the actual API clients that talk to Amazon.

#### [NEW] `backend/src/services/amazon/`
*   `SPAPIClient.ts`: Wrapper for Selling Partner API (Orders, Inventory).
*   `AdsAPIClient.ts`: Wrapper for Amazon Advertising API (Campaigns, Keywords).
*   `ReportManager.ts`: Handles the complex "Request Report -> Wait -> Download -> Parse" flow.

### 2. Backend: Sync Endpoints
Triggers for the frontend to start fetching data.

#### [MODIFY] `backend/src/routes/sync.ts` (New File)
*   `POST /api/sync/:accountId/campaigns`: Trigger campaign sync.
*   `POST /api/sync/:accountId/reports`: Trigger daily performance report sync.
*   `GET  /api/sync/status/:jobId`: Check progress.

### 3. Frontend: "Sync Now" & Status UI
Updating the Settings/Profile page to show real feedback.

#### [MODIFY] `frontend/src/pages/Settings.tsx`
*   Connect "Sync Now" button to the new API.
*   Show a progress indicator (Spinner/ProgressBar) during sync.
*   Handle "Token Expired" states with a "Reconnect" prompt.

## Verification Plan

### Automated Tests
*   **Unit Tests**: Mock Amazon API responses to verify parsing logic (e.g., "Does the CSV parser correctly read the report?").
*   **Integration Tests**: N/A for independent API calls (requires real Amazon credentials).

### Manual Verification (Walkthrough)
1.  **Connect Account**: Use the "Add Account" button to initiate OAuth (User will need their own Amazon credentials, or we test the flow up to the Amazon Login page).
2.  **Trigger Sync**: Click "Sync Now" on the Settings page.
3.  **Monitor Logs**: Watch the backend terminal for "Fetching Campaign Data..." logs.
4.  **View Data**: Verify that the Dashboard numbers change from "Mock Data" to "Real Data" (or empty real data).
