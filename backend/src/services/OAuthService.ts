import axios from 'axios';
import crypto from 'crypto';
import { AmazonAccount } from '../models/AmazonAccount';

interface LWATokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface SPAPIAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface AdvertisingAPIAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export class OAuthService {
  private readonly LWA_ENDPOINT = 'https://api.amazon.com/auth/o2/token';
  /**
   * Get the SP-API Endpoint (Sandbox or Production)
   */
  public getSpApiEndpoint(): string {
    if (process.env.AMAZON_SANDBOX_MODE === 'true') {
      return process.env.SP_API_SANDBOX_ENDPOINT || 'https://sandbox.sellingpartnerapi-na.amazon.com';
    }
    return 'https://sellingpartnerapi-na.amazon.com';
  }
  private readonly ADVERTISING_API_ENDPOINT = 'https://advertising-api.amazon.com';

  /**
   * Generate OAuth authorization URL for Amazon SP-API
   */
  generateSPAPIAuthUrl(userId: string, redirectUri: string, region: string = 'NA'): string {
    const state = this.generateState(userId, 'sp-api');
    const clientId = process.env.SP_API_LWA_APP_ID!;

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state,
      scope: 'sellingpartnerapi::notifications sellingpartnerapi::migration',
      version: 'beta'
    });

    let authHost = 'sellercentral.amazon.com';

    // Region/Country Mapping
    // NA (North America)
    const naCountries = ['US', 'CA', 'MX', 'BR', 'NA'];

    // EU (Europe + India + Middle East)
    const euCountries = ['UK', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'PL', 'TR', 'BE', 'EG', 'SA', 'AE', 'IN', 'EU'];

    // FE (Far East)
    if (euCountries.includes(region)) {
      authHost = 'sellercentral-europe.amazon.com';
    } else if (region === 'JP' || region === 'FE') {
      authHost = 'sellercentral.amazon.co.jp';
    } else if (region === 'AU') {
      authHost = 'sellercentral.amazon.com.au';
    } else if (region === 'SG') {
      authHost = 'sellercentral.amazon.sg';
    }

    // Default to NA/US for others


    const url = `https://${authHost}/apps/authorize/consent?${params.toString()}`;
    console.log('--- GENERATED AUTH URL ---');
    console.log(url);
    console.log('--------------------------');
    return url;
  }

  /**
   * Generate OAuth authorization URL for Amazon Advertising API
   */
  generateAdvertisingAPIAuthUrl(userId: string, redirectUri: string): string {
    const state = this.generateState(userId, 'advertising-api');
    const clientId = process.env.AMAZON_ADVERTISING_API_CLIENT_ID!;

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state,
      scope: 'advertising::campaign_management'
    });

    return `https://www.amazon.com/ap/oa?${params.toString()}`;
  }

  /**
   * Exchange authorization code for SP-API tokens
   */
  async exchangeSPAPICode(code: string, redirectUri: string): Promise<SPAPIAuthResponse> {
    const clientId = process.env.SP_API_LWA_APP_ID!;
    const clientSecret = process.env.SP_API_LWA_CLIENT_SECRET!;

    const params = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret
    };

    try {
      const response = await axios.post(this.LWA_ENDPOINT, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`SP-API token exchange failed: ${error.response?.data?.error_description || error.message}`);
    }
  }

  /**
   * Exchange authorization code for Advertising API tokens
   */
  async exchangeAdvertisingAPICode(code: string, redirectUri: string): Promise<AdvertisingAPIAuthResponse> {
    const clientId = process.env.AMAZON_ADVERTISING_API_CLIENT_ID!;
    const clientSecret = process.env.AMAZON_ADVERTISING_API_CLIENT_SECRET!;

    const params = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret
    };

    try {
      const response = await axios.post(this.LWA_ENDPOINT, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Advertising API token exchange failed: ${error.response?.data?.error_description || error.message}`);
    }
  }

  /**
   * Refresh SP-API access token
   */
  async refreshSPAPIToken(refreshToken: string): Promise<LWATokenResponse> {
    const clientId = process.env.SP_API_LWA_APP_ID!;
    const clientSecret = process.env.SP_API_LWA_CLIENT_SECRET!;

    const params = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret
    };

    try {
      const response = await axios.post(this.LWA_ENDPOINT, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`SP-API token refresh failed: ${error.response?.data?.error_description || error.message}`);
    }
  }

  /**
   * Refresh Advertising API access token
   */
  async refreshAdvertisingAPIToken(refreshToken: string): Promise<LWATokenResponse> {
    const clientId = process.env.AMAZON_ADVERTISING_API_CLIENT_ID!;
    const clientSecret = process.env.AMAZON_ADVERTISING_API_CLIENT_SECRET!;

    const params = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret
    };

    try {
      const response = await axios.post(this.LWA_ENDPOINT, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Advertising API token refresh failed: ${error.response?.data?.error_description || error.message}`);
    }
  }

  /**
   * Store Amazon account credentials in database
   */
  async storeAmazonAccount(
    userId: string,
    accountType: 'sp-api' | 'advertising-api',
    tokens: LWATokenResponse,
    sellerId?: string,
    marketplaceId?: string,
    profileId?: string
  ): Promise<AmazonAccount> {
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    const accountData: any = {
      user_id: userId,
      account_type: accountType,
      marketplace_id: marketplaceId || 'ATVPDKIKX0DER', // Default to US marketplace
      access_token: this.encryptToken(tokens.access_token),
      refresh_token: this.encryptToken(tokens.refresh_token),
      token_expires_at: expiresAt,
      status: 'active',
      last_sync_at: undefined
    };

    // Only add optional fields if they have values
    if (sellerId) {
      accountData.seller_id = sellerId;
    }
    if (profileId) {
      accountData.profile_id = profileId;
    }

    // Check if account already exists
    let query = AmazonAccount.query()
      .where('user_id', userId)
      .where('account_type', accountType);

    if (sellerId) {
      query = query.where('seller_id', sellerId);
    } else {
      query = query.whereNull('seller_id');
    }

    const existingAccount = await query.first();

    if (existingAccount) {
      // Update existing account
      return await AmazonAccount.query()
        .patchAndFetchById(existingAccount.id, accountData);
    } else {
      // Create new account
      return await AmazonAccount.query().insert(accountData);
    }
  }

  /**
   * Get valid access token for Amazon account (refresh if needed)
   */
  async getValidAccessToken(accountId: string): Promise<string> {
    const account = await AmazonAccount.query().findById(accountId);
    if (!account) {
      throw new Error('Amazon account not found');
    }

    // Check if required tokens exist
    if (!account.access_token || !account.refresh_token || !account.token_expires_at) {
      throw new Error('Account tokens are missing or invalid');
    }

    // Check if token is still valid (with 5 minute buffer)
    const now = new Date();
    const expiresAt = new Date(account.token_expires_at);
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (now.getTime() < (expiresAt.getTime() - bufferTime)) {
      // Token is still valid
      return this.decryptToken(account.access_token);
    }

    // Token needs refresh
    const refreshToken = this.decryptToken(account.refresh_token);
    let newTokens: LWATokenResponse;

    if (account.account_type === 'sp-api') {
      newTokens = await this.refreshSPAPIToken(refreshToken);
    } else {
      newTokens = await this.refreshAdvertisingAPIToken(refreshToken);
    }

    // Update account with new tokens
    const newExpiresAt = new Date(Date.now() + newTokens.expires_in * 1000);
    await AmazonAccount.query()
      .patchAndFetchById(accountId, {
        access_token: this.encryptToken(newTokens.access_token),
        refresh_token: this.encryptToken(newTokens.refresh_token),
        token_expires_at: newExpiresAt
      });

    return newTokens.access_token;
  }

  /**
   * Revoke Amazon account access
   */
  async revokeAmazonAccount(accountId: string): Promise<void> {
    await AmazonAccount.query()
      .patchAndFetchById(accountId, {
        status: 'inactive',
        access_token: undefined,
        refresh_token: undefined,
        token_expires_at: undefined
      });
  }

  /**
   * Get user's Amazon accounts
   */
  async getUserAmazonAccounts(userId: string): Promise<AmazonAccount[]> {
    return await AmazonAccount.query()
      .where('user_id', userId)
      .whereNot('status', 'inactive') // Show active, suspended, error
      .orderBy('created_at', 'desc');
  }

  /**
   * Generate secure state parameter for OAuth
   */
  private generateState(userId: string, apiType: string): string {
    const timestamp = Date.now().toString();
    const random = crypto.randomBytes(16).toString('hex');
    const data = `${userId}:${apiType}:${timestamp}:${random}`;

    return Buffer.from(data).toString('base64url');
  }

  /**
   * Verify and parse state parameter
   */
  verifyState(state: string): { userId: string; apiType: string; timestamp: number } {
    try {
      const decoded = Buffer.from(state, 'base64url').toString();
      const [userId, apiType, timestamp] = decoded.split(':');

      // Check if state is not older than 10 minutes
      const stateAge = Date.now() - parseInt(timestamp);
      if (stateAge > 10 * 60 * 1000) {
        throw new Error('State parameter expired');
      }

      return { userId, apiType, timestamp: parseInt(timestamp) };
    } catch (error) {
      throw new Error('Invalid state parameter');
    }
  }

  /**
   * Encrypt sensitive tokens
   */
  private encryptToken(token: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipher(algorithm, key);
    cipher.setAAD(Buffer.from('amazon-token'));

    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt sensitive tokens
   */
  private decryptToken(encryptedToken: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

    const [ivHex, authTagHex, encrypted] = encryptedToken.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipher(algorithm, key);
    decipher.setAAD(Buffer.from('amazon-token'));
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Generate AWS Signature V4 for SP-API requests
   */
  generateAWSSignature(
    method: string,
    url: string,
    headers: Record<string, string>,
    payload: string = ''
  ): string {
    const accessKey = process.env.AWS_ACCESS_KEY_ID!;
    const secretKey = process.env.AWS_SECRET_ACCESS_KEY!;
    const region = process.env.AWS_REGION || 'us-east-1';
    const service = 'execute-api';

    const urlObj = new URL(url);
    const host = urlObj.hostname;
    const path = urlObj.pathname + urlObj.search;

    // Use provided date or generate new one
    let timestamp = headers['x-amz-date'];
    if (!timestamp) {
      timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
      headers['x-amz-date'] = timestamp;
    }
    const date = timestamp.substr(0, 8);

    // Create canonical request
    const canonicalHeaders = Object.keys(headers)
      .sort()
      .map(key => `${key.toLowerCase()}:${headers[key].trim()}`)
      .join('\n') + '\n';

    const signedHeaders = Object.keys(headers)
      .sort()
      .map(key => key.toLowerCase())
      .join(';');

    const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');

    const canonicalRequest = [
      method.toUpperCase(),
      path,
      '',
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join('\n');

    // Create string to sign
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${date}/${region}/${service}/aws4_request`;
    const stringToSign = [
      algorithm,
      timestamp,
      credentialScope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');

    // Calculate signature
    const kDate = crypto.createHmac('sha256', `AWS4${secretKey}`).update(date).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

    // Create authorization header
    const credential = `${accessKey}/${credentialScope}`;
    return `${algorithm} Credential=${credential}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  }
}

export const oauthService = new OAuthService();