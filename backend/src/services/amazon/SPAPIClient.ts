import axios, { AxiosInstance } from 'axios';
import { logger } from '../../utils/logger';
import { oauthService } from '../OAuthService';

export class SPAPIClient {
  private baseUrl: string;
  private accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
    this.baseUrl = oauthService.getSpApiEndpoint();
    if (process.env.AMAZON_SANDBOX_MODE === 'true') {
      logger.info(`SPAPIClient initialized in SANDBOX mode for account ${accountId}`);
    }
  }

  private async getClient(): Promise<AxiosInstance> {
    const accessToken = await oauthService.getValidAccessToken(this.accountId);

    const client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'x-amz-access-token': accessToken,
        'Content-Type': 'application/json',
        'User-Agent': 'AmazonFDCTool/1.0 (Language=Node.js)'
      }
    });

    // Request Signing Interceptor
    client.interceptors.request.use((config) => {
      const url = `${config.baseURL}${config.url}`;
      const method = config.method?.toUpperCase() || 'GET';
      const headers = { ...config.headers } as Record<string, string>;

      // Remove standard axios headers that interfere or are duplicates if any
      delete headers['common'];

      // Ensure Host header is present for signing (required by AWS)
      if (!headers['host']) {
        headers['host'] = new URL(config.baseURL!).hostname;
      }

      const body = config.data ? JSON.stringify(config.data) : '';

      const authorization = oauthService.generateAWSSignature(
        method,
        url,
        headers,
        body
      );

      config.headers['Authorization'] = authorization;
      config.headers['x-amz-date'] = headers['x-amz-date']; // generateAWSSignature adds this to the headers object we passed

      return config;
    });

    // 429 Retry Interceptor
    client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 429) {
          logger.warn(`SP-API Rate Limit Hit for account ${this.accountId}. Retrying...`);
          // Retry Logic could be added here (e.g., using 'retry-axios')
        }
        return Promise.reject(error);
      }
    );

    return client;
  }

  /**
   * Step 1: Request a Report
   * POST /reports/2021-06-30/reports
   */
  async requestReport(reportType: string, dataStartTime: string, dataEndTime: string, marketplaceIds: string[]) {
    try {
      const client = await this.getClient();
      const response = await client.post('/reports/2021-06-30/reports', {
        reportType,
        dataStartTime,
        dataEndTime,
        marketplaceIds
      });
      return response.data; // content: { reportId: "..." }
    } catch (error: any) {
      logger.error(`Failed to request report ${reportType}`, error.response?.data || error);
      throw error;
    }
  }

  /**
   * Step 2: Check Report Status
   * GET /reports/2021-06-30/reports/{reportId}
   */
  async getReportStatus(reportId: string) {
    try {
      const client = await this.getClient();
      const response = await client.get(`/reports/2021-06-30/reports/${reportId}`);
      return response.data; // content: { processingStatus: "DONE", reportDocumentId: "..." }
    } catch (error: any) {
      logger.error(`Failed to check status for report ${reportId}`, error.response?.data || error);
      throw error;
    }
  }

  /**
   * Step 3: Get Document URL
   * GET /reports/2021-06-30/documents/{reportDocumentId}
   */
  async getReportDocument(reportDocumentId: string) {
    try {
      const client = await this.getClient();
      const response = await client.get(`/reports/2021-06-30/documents/${reportDocumentId}`);
      return response.data; // content: { url: "signed-s3-url" }
    } catch (error: any) {
      logger.error(`Failed to get document ${reportDocumentId}`, error.response?.data || error);
      throw error;
    }
  }

  /**
   * Download and Parse Content
   * (Helper method to fetch the actual GZIP/CSV data)
   */
  async downloadReportContent(url: string, compressionAlgorithm?: string): Promise<string> {
    try {
      // Direct Axios call (no auth headers needed for S3 signed URL)
      const response = await axios.get(url, {
        responseType: 'arraybuffer' // Important for GZIP
      });

      // TODO: Handle GZIP decompression if compressionAlgorithm === 'GZIP'
      return response.data.toString('utf-8');
    } catch (error) {
      logger.error('Failed to download report content', error);
      throw error;
    }
  }
}