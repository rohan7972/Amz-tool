# Amazon SP-API Sandbox Capabilities & Gap Analysis

## What You Can Do Now (Implemented)
With the current **Sandbox Mode** integration (`AMAZON_SANDBOX_MODE=true`), your application is configured to:

1.  **Authenticate Successfully**: 
    - You can perform the full Login with Amazon (LWA) flow.
    - The application exchanges your Refresh Token for a valid Access Token that works with Sandbox endpoints.
    - **Benefit**: Verifies that your credentials and IAM (AWS Signature V4) signing logic are correct.

2.  **Verify API Connectivity**:
    - The application can reach Amazon's servers.
    - Captures and logs raw responses, confirming that network rules (firewalls, proxies) and base URLs are correct.

3.  **Schema Validation**:
    - **Static Responses**: Most Sandbox endpoints return fixed, static JSON responses.
    - **Benefit**: You can verify that your backend models (`interfaces`) correctly map to the JSON structure returned by Amazon (e.g., verifying fields like `amazonOrderId` or `marketplaceId` exist and have the expected types).

4.  **Error Handling Tests**:
    - You can trigger standard errors (like 403 Forbidden or 400 Bad Request) to ensure your application logs and handles them gracefully without crashing.

## What Is Missing / Needs Implementation

To fully "work" with the API and simulate a real-world application, the following items are needed:

### 1. Data Persistence Strategy (Handling Static Data)
-   **The Issue**: The Sandbox often returns the *same* static data (e.g., the same Order ID `123-1234567-1234567`) every time you call it.
-   **Immediate Need**: Your database logic might reject "duplicate keys" if you run the sync job twice.
-   **Solution**: You may need a "Reset/Wipe" script to clear your local database between Sandbox test runs, or update your database logic to `upsert` (update if exists) rather than insert-only.

### 2. Scenario Testing (Dynamic Sandbox)
-   **The Issue**: By default, you only get the "Happy Path" success response.
-   **Immediate Need**: You likely want to test edge cases (e.g., "What happens if an order is cancelled?").
-   **Solution**: Implementing **Sandbox-only parameters**.
    -   Some SP-API endpoints allow you to pass specific parameters (often in the header or body objects) to force specific responses (e.g., forcing a 429 throttling error or a specific order status).
    -   *Action*: We need to identify which specific APIs (Orders, Reports, etc.) you plan to use and verify if they support dynamic inputs.

### 3. Frontend "Sandbox" Indicator
-   **The Issue**: When you run the full app, the UI looks identical to Production. Use risks confusing real data with test data.
-   **Solution**: Add a visual badge (e.g., an orange "SANDBOX MODE" banner) in the Frontend Header when the API returns a "sandbox" status flag.

### 4. End-to-End Sync Workflows
-   **The Issue**: We have the *connection*, but we haven't tested a full *workflow* (e.g., "Download Report -> Parse CSV -> Save to DB").
-   **Action**: We need to run the `SyncService` manually and watch it process the Sandbox's static report data to ensure the parsing logic holds up against the mock CSVs Amazon provides.

## Recommended Next Steps
1.  **Frontend Update**: Add a "Sandbox Mode" indicator to the UI.
2.  **Run a Pilot Sync**: Attempt to run the `campaigns.service.ts` or `orders` sync (whichever is implemented) and check the database to see if the static data saved correctly.
3.  **Database Upsert Check**: Ensure your database code uses `.onConflict('id').merge()` (or equivalent) to handle repeated data fetches from the Sandbox.
