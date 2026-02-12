import { User } from '@/stores/authStore';
import { apiClient } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    console.log('[AUTH SERVICE] Attempting login with:', credentials.email);

    // Use real API login
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    console.log('[AUTH SERVICE] Login API response status:', response.status);
    console.log('[AUTH SERVICE] Response data:', response.data);
    
    const authData = response.data.data;
    console.log('[AUTH SERVICE] Token received:', authData.token?.substring(0, 50) + '...');
    console.log('[AUTH SERVICE] Token length:', authData.token?.length);
    console.log('[AUTH SERVICE] User role:', authData.user?.role);
    
    return authData;
  },

  // Google Login
  googleLogin: async (credential: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/google', { credential });
      return response.data.data;
    } catch (error) {
      console.warn('Backend Google Login failed (likely backend offline), falling back to mock login');
      // Mock fallback for demo/development without backend
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        user: {
          id: 'google-mock-user-1',
          email: 'google.user@example.com',
          firstName: 'Google',
          lastName: 'User',
          role: 'user',
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          preferences: {}
        },
        token: 'mock-google-jwt-token',
        refreshToken: 'mock-google-refresh-token',
      };
    }
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>('/auth/profile', userData);
    return response.data.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password with token
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post('/auth/verify-email', { token });
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<void> => {
    await apiClient.post('/auth/resend-verification', { email });
  },
};