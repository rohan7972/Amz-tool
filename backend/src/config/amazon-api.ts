/**
 * Amazon Advertising API Configuration
 * Supports both sandbox (test) mode and production mode
 */

export interface AmazonApiConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  sandbox: boolean;
  region: string;
  profileId?: string;
}

export const amazonApiConfig: AmazonApiConfig = {
  // Test credentials - Replace with real credentials when available
  clientId: process.env.AMAZON_CLIENT_ID || 'amzn1.application-oa2-client.test123',
  clientSecret: process.env.AMAZON_CLIENT_SECRET || 'test_secret_key_placeholder',
  refreshToken: process.env.AMAZON_REFRESH_TOKEN || 'Atzr|test_refresh_token_placeholder',
  
  // Sandbox mode for testing without real API calls
  sandbox: process.env.AMAZON_SANDBOX !== 'false', // Default to sandbox mode
  
  // Region: NA (North America), EU (Europe), FE (Far East)
  region: process.env.AMAZON_REGION || 'NA',
  
  // Profile ID (Advertising Account ID)
  profileId: process.env.AMAZON_PROFILE_ID,
};

export const amazonApiEndpoints = {
  production: {
    NA: 'https://advertising-api.amazon.com',
    EU: 'https://advertising-api-eu.amazon.com',
    FE: 'https://advertising-api-fe.amazon.com',
  },
  sandbox: {
    NA: 'https://advertising-api-test.amazon.com',
    EU: 'https://advertising-api-test.amazon.com',
    FE: 'https://advertising-api-test.amazon.com',
  },
  auth: 'https://api.amazon.com/auth/o2/token',
};

/**
 * Get the appropriate API endpoint based on configuration
 */
export function getApiEndpoint(config: AmazonApiConfig): string {
  const endpoints = config.sandbox ? amazonApiEndpoints.sandbox : amazonApiEndpoints.production;
  return endpoints[config.region as keyof typeof endpoints] || endpoints.NA;
}

/**
 * API rate limits (per second)
 */
export const rateLimits = {
  // Sponsored Products API
  campaigns: 2,
  adGroups: 2,
  keywords: 2,
  productAds: 2,
  
  // Reporting API
  reports: 1,
  
  // Profiles API
  profiles: 2,
};

/**
 * Cache TTL (Time To Live) in seconds
 */
export const cacheTTL = {
  campaigns: 300,      // 5 minutes
  adGroups: 300,       // 5 minutes
  keywords: 300,       // 5 minutes
  productAds: 300,     // 5 minutes
  performance: 900,    // 15 minutes
  profiles: 3600,      // 1 hour
};
