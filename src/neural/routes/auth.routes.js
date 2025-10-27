import express from 'express';
import authNeuron from '../neurons/AuthNeuron.js';
import { authenticate, authorize, requirePermission } from '../neurons/auth/AuthMiddleware.js';
import { UserRoles, Permissions } from '../neurons/auth/RoleDefinitions.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, phone, role, profile } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone required' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }
    if (!role) {
      return res.status(400).json({ error: 'Role required' });
    }

    const result = await authNeuron.register({
      email,
      password,
      phone,
      role,
      profile
    });

    res.status(201).json({
      success: true,
      user: result.user
    });
  } catch (error) {
    res.status(400).json({ 
      error: error.message || 'Registration failed' 
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    const result = await authNeuron.login({ email, password, phone });

    res.json({
      success: true,
      user: result.user,
      role: result.role,
      token: result.token,
      permissions: result.permissions
    });
  } catch (error) {
    res.status(401).json({ 
      error: error.message || 'Login failed' 
    });
  }
});

router.post('/logout', authenticate, async (req, res) => {
  try {
    await authNeuron.logout(req.user.userId);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

router.post('/password/reset', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    await authNeuron.emit('PASSWORD_RESET_REQUESTED', { email });

    res.json({ 
      success: true, 
      message: 'Password reset email sent' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

router.get('/verify', authenticate, (req, res) => {
  res.json({ 
    success: true, 
    valid: true,
    user: req.user
  });
});

router.get('/refresh', authenticate, async (req, res) => {
  try {
    const oldToken = req.headers.authorization.substring(7);
    const newToken = await authNeuron.AuthService?.refreshToken(oldToken);

    res.json({
      success: true,
      token: newToken
    });
  } catch (error) {
    res.status(401).json({ error: 'Token refresh failed' });
  }
});

export default router;
