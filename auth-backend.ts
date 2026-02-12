import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const testUsers: User[] = [
  {
    id: '1',
    email: 'admin@amazonfdc.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'demo@amazonfdc.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    role: 'user',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = testUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    'your-secret-key',
    { expiresIn: '24h' }
  );

  const userResponse = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return res.json({
    user: userResponse,
    token,
    message: 'Login successful'
  });
});

router.post('/register', (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = testUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser: User = {
    id: String(testUsers.length + 1),
    email,
    password,
    firstName,
    lastName,
    role: 'user',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  testUsers.push(newUser);

  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    'your-secret-key',
    { expiresIn: '24h' }
  );

  const userResponse = {
    id: newUser.id,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    role: newUser.role,
    isEmailVerified: newUser.isEmailVerified,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };

  return res.json({
    user: userResponse,
    token,
    message: 'Registration successful'
  });
});

export default router;