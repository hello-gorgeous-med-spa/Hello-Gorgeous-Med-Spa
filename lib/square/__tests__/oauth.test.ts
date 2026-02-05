// ============================================================
// SQUARE OAUTH TESTS
// Validates OAuth URL construction per Square spec
// ============================================================

import { getOAuthUrl, generateOAuthState, getOAuthConfig } from '../oauth';

// Mock environment for tests
const mockEnv = {
  SQUARE_OAUTH_CLIENT_ID: 'test-client-id',
  SQUARE_OAUTH_CLIENT_SECRET: 'test-client-secret',
  SQUARE_ENVIRONMENT: 'sandbox',
  BASE_URL: 'https://example.com',
};

describe('Square OAuth', () => {
  beforeEach(() => {
    // Set mock environment
    process.env.SQUARE_OAUTH_CLIENT_ID = mockEnv.SQUARE_OAUTH_CLIENT_ID;
    process.env.SQUARE_OAUTH_CLIENT_SECRET = mockEnv.SQUARE_OAUTH_CLIENT_SECRET;
    process.env.SQUARE_ENVIRONMENT = mockEnv.SQUARE_ENVIRONMENT;
    process.env.BASE_URL = mockEnv.BASE_URL;
  });

  afterEach(() => {
    // Clean up
    delete process.env.SQUARE_OAUTH_CLIENT_ID;
    delete process.env.SQUARE_OAUTH_CLIENT_SECRET;
    delete process.env.SQUARE_ENVIRONMENT;
    delete process.env.BASE_URL;
  });

  describe('getOAuthUrl', () => {
    it('should include all required OAuth parameters', () => {
      const state = 'test-state-123';
      const url = getOAuthUrl(state);
      const parsed = new URL(url);

      // Required per Square OAuth spec:
      // https://developer.squareup.com/docs/oauth-api/create-urls-for-square-authorization
      expect(parsed.searchParams.get('client_id')).toBe(mockEnv.SQUARE_OAUTH_CLIENT_ID);
      expect(parsed.searchParams.get('response_type')).toBe('code');
      expect(parsed.searchParams.get('redirect_uri')).toBe(`${mockEnv.BASE_URL}/api/square/oauth/callback`);
      expect(parsed.searchParams.get('scope')).toBeTruthy();
      expect(parsed.searchParams.get('state')).toBe(state);
    });

    it('should use sandbox URL for sandbox environment', () => {
      process.env.SQUARE_ENVIRONMENT = 'sandbox';
      const url = getOAuthUrl('test-state');
      expect(url).toContain('connect.squareupsandbox.com');
    });

    it('should use production URL for production environment', () => {
      process.env.SQUARE_ENVIRONMENT = 'production';
      const url = getOAuthUrl('test-state');
      expect(url).toContain('connect.squareup.com');
      expect(url).not.toContain('sandbox');
    });

    it('should include required scopes', () => {
      const url = getOAuthUrl('test-state');
      const parsed = new URL(url);
      const scopes = parsed.searchParams.get('scope') || '';

      // Minimum required scopes for Terminal integration
      expect(scopes).toContain('MERCHANT_PROFILE_READ');
      expect(scopes).toContain('PAYMENTS_READ');
      expect(scopes).toContain('PAYMENTS_WRITE');
      expect(scopes).toContain('ORDERS_READ');
      expect(scopes).toContain('ORDERS_WRITE');
    });
  });

  describe('generateOAuthState', () => {
    it('should generate a non-empty state string', () => {
      const state = generateOAuthState();
      expect(state).toBeTruthy();
      expect(typeof state).toBe('string');
      expect(state.length).toBeGreaterThan(10);
    });

    it('should generate unique states', () => {
      const state1 = generateOAuthState();
      const state2 = generateOAuthState();
      expect(state1).not.toBe(state2);
    });
  });

  describe('getOAuthConfig', () => {
    it('should throw if client ID is missing', () => {
      delete process.env.SQUARE_OAUTH_CLIENT_ID;
      expect(() => getOAuthConfig()).toThrow('SQUARE_OAUTH_CLIENT_ID');
    });

    it('should throw if client secret is missing', () => {
      delete process.env.SQUARE_OAUTH_CLIENT_SECRET;
      expect(() => getOAuthConfig()).toThrow('SQUARE_OAUTH_CLIENT_SECRET');
    });

    it('should default to sandbox environment', () => {
      delete process.env.SQUARE_ENVIRONMENT;
      const config = getOAuthConfig();
      expect(config.environment).toBe('sandbox');
    });

    it('should normalize environment to lowercase', () => {
      process.env.SQUARE_ENVIRONMENT = 'PRODUCTION';
      const config = getOAuthConfig();
      expect(config.environment).toBe('production');
    });
  });
});
