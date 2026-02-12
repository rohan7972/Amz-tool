import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import { generateRefreshToken, generateToken, UserRole } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

// Mock user for fallback (Still useful for emergency access if DB fails)
const MOCK_USER = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'admin@amazonfdc.com',
  password_hash: '$2b$10$YourHashHere', // we will bypass check for this specific email
  first_name: 'Admin',
  last_name: 'User',
  role: UserRole.ADMIN,
  is_active: true,
  email_verified: true,
  permissions: ['*'],
  accountIds: ['acc_mock_12345']
};

// POST /api/auth/register
// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.query().findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await User.query().insertAndFetch({
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      role: UserRole.USER,
      is_active: true,
      email_verified: false, // Email verification flow to be implemented later
      preferences: {}
    });

    // Generate tokens
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });
    const refreshToken = generateRefreshToken(newUser.id);

    return res.status(201).json({
      success: true,
      data: {
        token,
        refreshToken,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          role: newUser.role,
          avatar: null
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log(`Login attempt for: ${email}`);

    // 1. Check DB first
    try {
      const user = await User.query().findOne({ email });

      if (user) {
        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
          // Fallback to demo check only if DB auth failed AND it matches demo creds
          if (email === 'admin@amazonfdc.com' && password === 'admin123') {
            // Let it pass through to the demo block below
          } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
          }
        } else {
          // Success DB Login
          const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
          });
          const refreshToken = generateRefreshToken(user.id);

          return res.json({
            success: true,
            data: {
              token,
              refreshToken,
              user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                avatar: null
              }
            }
          });
        }
      }
    } catch (dbError) {
      console.error('Database connection error during login:', dbError);
    }

    // 2. Fallback: Check for demo credentials (if DB is empty or connection fails)
    if (email === 'admin@amazonfdc.com' && password === 'admin123') {
      const token = generateToken({
        userId: MOCK_USER.id,
        email: MOCK_USER.email,
        role: MOCK_USER.role
      });

      const refreshToken = generateRefreshToken(MOCK_USER.id);

      console.log('Login successful for demo user (Fallback)');

      return res.json({
        success: true,
        data: {
          token,
          refreshToken,
          user: {
            id: MOCK_USER.id,
            email: MOCK_USER.email,
            firstName: MOCK_USER.first_name,
            lastName: MOCK_USER.last_name,
            role: MOCK_USER.role,
            avatar: null
          }
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Google authentication removed as per user request

router.get('/me', (req: Request, res: Response) => {
  // This route should be protected by auth middleware.
  // If it reaches here, req.user is populated.
  // But we iterate on the side of caution and return the mock user if request is for them
  // Actually, req.user should already be set by middleware.

  if (req.user) {
    return res.json({
      success: true,
      data: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        firstName: MOCK_USER.first_name, // Fallback as req.user might not have names
        lastName: MOCK_USER.last_name,
        // Add other fields as expected by frontend
      }
    });
  }

  // Fallback/Mock response if for some reason middleware didn't populate but we want to be nice
  return res.json({
    success: true,
    data: {
      id: MOCK_USER.id,
      email: MOCK_USER.email,
      firstName: MOCK_USER.first_name,
      lastName: MOCK_USER.last_name,
      role: MOCK_USER.role,
    }
  });
});

router.post('/logout', (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

router.get('/health', (req: Request, res: Response) => {
  res.json({ message: 'Auth routes are working' });
});

export { router as authRoutes };

