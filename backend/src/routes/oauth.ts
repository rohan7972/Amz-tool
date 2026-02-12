import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { oauthService } from '../services/OAuthService';
import { logger } from '../utils/logger';

console.log('======== OAuth module loaded ========');

const router = Router();

console.log('======== OAuth router created ========');

// Validation schemas
const connectAccountSchema = z.object({
  body: z.object({
    accountType: z.enum(['sp-api', 'advertising-api']),
    redirectUri: z.string().url(),
    region: z.string().optional(),
    userType: z.enum(['seller', 'vendor']).optional()
  })
});

const callbackSchema = z.object({
  query: z.object({
    code: z.string(),
    state: z.string(),
    error: z.string().optional(),
    error_description: z.string().optional()
  })
});

const disconnectAccountSchema = z.object({
  params: z.object({
    accountId: z.string().uuid()
  })
});

/**
 * @route POST /api/oauth/connect
 * @desc Generate OAuth authorization URL for Amazon APIs
 * @access Private
 */
router.post('/connect',
  authenticate,
  // validateRequest(connectAccountSchema), // Temporarily disabled for debugging
  async (req: Request, res: Response) => {
    try {
      console.log('=== OAuth /connect route hit ===');
      console.log('Request body:', req.body);
      console.log('User:', req.user);
      
      const { accountType, redirectUri, region, userType } = req.body;
      const userId = req.user!.id;

      console.log('Generating OAuth URL with params:', { accountType, redirectUri, region, userType, userId });

      let authUrl: string;

      if (accountType === 'sp-api') {
        authUrl = oauthService.generateSPAPIAuthUrl(userId, redirectUri, region);
      } else {
        authUrl = oauthService.generateAdvertisingAPIAuthUrl(userId, redirectUri);
      }

      console.log('Generated authUrl:', authUrl);

      logger.info('Generated OAuth URL', {
        userId,
        accountType,
        redirectUri
      });

      res.json({
        success: true,
        data: {
          authUrl,
          accountType
        }
      });
    } catch (error: any) {
      console.error('=== OAuth connect error ===', error);
      logger.error('OAuth connect error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate authorization URL',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/oauth/callback/sp-api
 * @desc Handle SP-API OAuth callback
 * @access Public
 */
router.get('/callback/sp-api',
  // Temporarily disable validation for debugging
  // validateRequest(callbackSchema),
  async (req: Request, res: Response) => {
    try {
      console.log('=== SP-API OAuth Callback Received ===');
      console.log('Query params:', req.query);
      console.log('Headers:', req.headers);
      
      const { code, state, error, error_description, selling_partner_id, spapi_oauth_code } = req.query;

      // Handle OAuth errors
      if (error) {
        console.error('OAuth error received:', error, error_description);
        logger.error('SP-API OAuth error:', { error, error_description });
        return res.redirect(`${process.env.FRONTEND_URL}/settings?error=${error}&description=${encodeURIComponent(error_description as string || 'Unknown error')}`);
      }

      // Amazon may send either 'code' or 'spapi_oauth_code'
      const authCode = (code || spapi_oauth_code) as string;
      
      if (!authCode) {
        console.error('No authorization code received');
        return res.redirect(`${process.env.FRONTEND_URL}/settings?error=no_code&description=${encodeURIComponent('No authorization code received from Amazon')}`);
      }

      if (!state) {
        console.error('No state parameter received');
        return res.redirect(`${process.env.FRONTEND_URL}/settings?error=no_state&description=${encodeURIComponent('No state parameter received')}`);
      }

      console.log('Authorization code received:', authCode.substring(0, 20) + '...');
      console.log('State parameter:', state);
      if (selling_partner_id) {
        console.log('Selling Partner ID:', selling_partner_id);
      }

      // Verify state parameter
      console.log('Verifying state parameter...');
      const stateData = oauthService.verifyState(state as string);
      console.log('State verified successfully:', stateData);
      
      if (stateData.apiType !== 'sp-api') {
        throw new Error('Invalid state parameter for SP-API');
      }

      // Exchange code for tokens
      // Use FRONTEND_URL as base since redirect URI goes through nginx proxy
      const redirectUri = `${process.env.FRONTEND_URL}/api/oauth/callback/sp-api`;
      console.log('Exchanging code for tokens with redirect URI:', redirectUri);
      
      const tokens = await oauthService.exchangeSPAPICode(authCode, redirectUri);
      console.log('Tokens received successfully');

      // Store account in database
      console.log('Storing account in database...');
      const account = await oauthService.storeAmazonAccount(
        stateData.userId,
        'sp-api',
        tokens,
        selling_partner_id as string || undefined
      );
      console.log('Account stored successfully:', account.id);

      logger.info('SP-API account connected successfully', {
        userId: stateData.userId,
        accountId: account.id,
        sellingPartnerId: selling_partner_id
      });

      // Redirect to frontend with success
      const successUrl = `${process.env.FRONTEND_URL}/settings?success=sp-api&accountId=${account.id}`;
      console.log('Redirecting to:', successUrl);
      res.redirect(successUrl);
    } catch (error: any) {
      console.error('=== SP-API Callback Error ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      logger.error('SP-API callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/settings?error=callback_failed&description=${encodeURIComponent(error.message)}`);
    }
  }
);

/**
 * @route GET /api/oauth/callback/advertising-api
 * @desc Handle Advertising API OAuth callback
 * @access Public
 */
router.get('/callback/advertising-api',
  validateRequest(callbackSchema),
  async (req: Request, res: Response) => {
    try {
      const { code, state, error, error_description } = req.query;

      // Handle OAuth errors
      if (error) {
        logger.error('Advertising API OAuth error:', { error, error_description });
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard/accounts?error=${error}&description=${error_description}`);
      }

      // Verify state parameter
      const stateData = oauthService.verifyState(state as string);
      if (stateData.apiType !== 'advertising-api') {
        throw new Error('Invalid state parameter for Advertising API');
      }

      // Exchange code for tokens
      const redirectUri = `${process.env.BACKEND_URL}/api/oauth/callback/advertising-api`;
      const tokens = await oauthService.exchangeAdvertisingAPICode(code as string, redirectUri);

      // Store account in database
      const account = await oauthService.storeAmazonAccount(
        stateData.userId,
        'advertising-api',
        tokens
      );

      logger.info('Advertising API account connected successfully', {
        userId: stateData.userId,
        accountId: account.id
      });

      // Redirect to frontend with success
      res.redirect(`${process.env.FRONTEND_URL}/dashboard/accounts?success=advertising-api&accountId=${account.id}`);
    } catch (error: any) {
      logger.error('Advertising API callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/dashboard/accounts?error=callback_failed&description=${encodeURIComponent(error.message)}`);
    }
  }
);

/**
 * @route GET /api/oauth/accounts
 * @desc Get user's connected Amazon accounts
 * @access Private
 */
router.get('/accounts',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const accounts = await oauthService.getUserAmazonAccounts(userId);

      // Remove sensitive data before sending
      const sanitizedAccounts = accounts.map(account => ({
        id: account.id,
        account_type: account.account_type,
        seller_id: account.seller_id,
        marketplace_id: account.marketplace_id,
        profile_id: account.profile_id,
        is_active: account.status === 'active',
        last_sync_at: account.last_sync_at,
        created_at: account.created_at,
        updated_at: account.updated_at
      }));

      res.json({
        success: true,
        data: sanitizedAccounts
      });
    } catch (error: any) {
      logger.error('Get accounts error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch accounts',
        message: error.message
      });
    }
  }
);

/**
 * @route DELETE /api/oauth/accounts/:accountId
 * @desc Disconnect Amazon account
 * @access Private
 */
router.delete('/accounts/:accountId',
  authenticate,
  validateRequest(disconnectAccountSchema),
  async (req: Request, res: Response) => {
    try {
      const { accountId } = req.params;
      const userId = req.user!.id;

      // Verify account belongs to user
      const account = await oauthService.getUserAmazonAccounts(userId);
      const targetAccount = account.find(acc => acc.id === accountId);

      if (!targetAccount) {
        return res.status(404).json({
          success: false,
          error: 'Account not found'
        });
      }

      // Revoke account access
      await oauthService.revokeAmazonAccount(accountId);

      logger.info('Amazon account disconnected', {
        userId,
        accountId,
        accountType: targetAccount.account_type
      });

      return res.json({
        success: true,
        message: 'Account disconnected successfully'
      });
    } catch (error: any) {
      logger.error('Disconnect account error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to disconnect account',
        message: error.message
      });
    }
  }
);

/**
 * @route POST /api/oauth/refresh/:accountId
 * @desc Manually refresh account tokens
 * @access Private
 */
router.post('/refresh/:accountId',
  authenticate,
  validateRequest(disconnectAccountSchema),
  async (req: Request, res: Response) => {
    try {
      const { accountId } = req.params;
      const userId = req.user!.id;

      // Verify account belongs to user
      const accounts = await oauthService.getUserAmazonAccounts(userId);
      const targetAccount = accounts.find(acc => acc.id === accountId);

      if (!targetAccount) {
        return res.status(404).json({
          success: false,
          error: 'Account not found'
        });
      }

      // Get valid access token (this will refresh if needed)
      await oauthService.getValidAccessToken(accountId);

      logger.info('Account tokens refreshed', {
        userId,
        accountId,
        accountType: targetAccount.account_type
      });

      return res.json({
        success: true,
        message: 'Tokens refreshed successfully'
      });
    } catch (error: any) {
      logger.error('Refresh tokens error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to refresh tokens',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/oauth/status/:accountId
 * @desc Check account connection status
 * @access Private
 */
router.get('/status/:accountId',
  authenticate,
  validateRequest(disconnectAccountSchema),
  async (req: Request, res: Response) => {
    try {
      const { accountId } = req.params;
      const userId = req.user!.id;

      // Verify account belongs to user
      const accounts = await oauthService.getUserAmazonAccounts(userId);
      const targetAccount = accounts.find(acc => acc.id === accountId);

      if (!targetAccount) {
        return res.status(404).json({
          success: false,
          error: 'Account not found'
        });
      }

      // Check token validity
      let isValid = false;
      let tokenExpiresAt = null;

      try {
        await oauthService.getValidAccessToken(accountId);
        isValid = true;
        tokenExpiresAt = targetAccount.token_expires_at;
      } catch (error) {
        isValid = false;
      }

      return res.json({
        success: true,
        data: {
          accountId,
          accountType: targetAccount.account_type,
          isActive: targetAccount.status === 'active',
          isTokenValid: isValid,
          tokenExpiresAt,
          lastSyncAt: targetAccount.last_sync_at
        }
      });
    } catch (error: any) {
      logger.error('Check account status error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to check account status',
        message: error.message
      });
    }
  }
);

export default router;