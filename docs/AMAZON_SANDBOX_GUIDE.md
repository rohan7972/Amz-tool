# Amazon SP-API Sandbox Guide

This guide describes how to configure and use the Amazon Selling Partner API (SP-API) Sandbox environment with this application.

## Overview

The Amazon SP-API Sandbox allows developers to test their applications without affecting production data or incurring costs. It provides a separate endpoint that mimics the behavior of the production API.

## Configuration

To enable Sandbox mode, the following environment variables must be set in your `backend/.env` file:

```env
AMAZON_SANDBOX_MODE=true
SP_API_PROD_ENDPOINT=https://sellingpartnerapi-na.amazon.com
SP_API_SANDBOX_ENDPOINT=https://sandbox.sellingpartnerapi-na.amazon.com
```

### Credentials

The Sandbox uses the same Login with Amazon (LWA) credentials as your production application. You do **not** need separate LWA credentials.

Ensure your `backend/.env` contains your LWA details:

```env
SP_API_LWA_APP_ID=your-lwa-app-id
SP_API_LWA_CLIENT_SECRET=your-lwa-client-secret
SP_API_REFRESH_TOKEN=your-refresh-token
```

## How It Works

1.  **Authentication**: The application uses the standard LWA endpoint (`https://api.amazon.com/auth/o2/token`) to exchange your Refresh Token for an Access Token. This process is identical for both Production and Sandbox.
2.  **API Requests**: When `AMAZON_SANDBOX_MODE=true`, the application automatically directs all SP-API requests to `https://sandbox.sellingpartnerapi-na.amazon.com`.
3.  **Data**: The Sandbox API returns static or dynamic mock data depending on the specific API operation. It does not access your real Seller Central data.

## Verification

To verify that the application is using the Sandbox:
1.  Check the application logs on startup. You should see a message: `SPAPIClient initialized in SANDBOX mode`.
2.  Any API errors (e.g., 400 Bad Request) typically return detailed error messages from the Sandbox environment, confirming connectivity.

## Troubleshooting

-   **403 Forbidden**: Ensure your LWA credentials are correct and that your application is authorized by a Seller account (even for Sandbox, you need a valid refresh token).
-   **Invalid Parameter**: Sandbox endpoints often have stricter validation usage (or specific static values required for success). Consult the [SP-API Sandbox Documentation](https://developer-docs.amazon.com/sp-api/docs/the-selling-partner-api-sandbox).
