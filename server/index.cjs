const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';
const ALLOWED_ORIGINS = Array.from(
  new Set(
    (process.env.FRONTEND_URL || 'http://localhost:5174,http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  ),
);
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@qubanhygienecare.com';
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'QubanHC';
const BREVO_REPLY_TO_EMAIL = process.env.BREVO_REPLY_TO_EMAIL || 'support@qubanhygienecare.com';
const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-secret';
const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);
const ALLOW_DEV_OTP = process.env.ALLOW_DEV_OTP === 'true';

const OTP_STORE = new Map();
const USER_STORE = new Map();
const PENDING_USERS = new Map();

function makeOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, type: 'refresh' }, JWT_SECRET, {
    expiresIn: '30d',
  });
}

function sendOtpEmail(email, otp) {
  if (!BREVO_API_KEY) {
    console.log(`\n[DEV OTP] Email: ${email}`);
    console.log(`[DEV OTP] OTP: ${otp}\n`);
    return Promise.resolve({ devMode: true });
  }

  console.log(`[BREVO] Sending OTP email to ${email} via sender ${BREVO_SENDER_EMAIL}`);

  return axios
    .post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
        to: [{ email }],
        replyTo: { email: BREVO_REPLY_TO_EMAIL, name: 'QubanHC Support' },
        subject: 'Your QubanHC verification code',
        textContent: `Your QubanHC verification code is ${otp}. This code expires in ${OTP_TTL_MINUTES} minutes.`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
            <h2 style="margin-bottom: 12px;">Your OTP Code</h2>
            <p>Hello,</p>
            <p>Your verification code is:</p>
            <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; margin: 20px 0; color: #0f766e;">${otp}</div>
            <p>This code expires in ${OTP_TTL_MINUTES} minutes.</p>
          </div>
        `,
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      },
    )
    .then((response) => {
      console.log(`[BREVO] Email accepted by Brevo for ${email}`);
      console.log('[BREVO] Response metadata:', JSON.stringify(response?.data || {}));
      return response;
    })
    .catch((error) => {
      console.error('[BREVO] Email send failed:', error.response?.status, error.response?.data || error.message);
      throw error;
    });
}

app.use(
  cors({
    origin: function originCheck(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Backend is running' });
});

app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (USER_STORE.has(normalizedEmail) || PENDING_USERS.has(normalizedEmail)) {
      return res.status(409).json({ message: 'User already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: String(Date.now() + Math.random()),
      name,
      email: normalizedEmail,
      phone: phone || '',
      password: hashedPassword,
      role: 'customer',
    };

    PENDING_USERS.set(normalizedEmail, user);

    const otp = makeOtp();
    OTP_STORE.set(normalizedEmail, {
      otp,
      expiresAt: Date.now() + OTP_TTL_MINUTES * 60 * 1000,
      userId: user.id,
      type: 'email_verify',
    });

    await sendOtpEmail(normalizedEmail, otp);

    return res.status(201).json({
      message: 'OTP sent successfully. Please verify your email to complete registration.',
      otp: ALLOW_DEV_OTP ? otp : undefined,
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error.response?.data || error.message);
    return res.status(500).json({
      message: 'Registration failed. Please try again.',
    });
  }
});

app.post('/api/v1/auth/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const storedOtp = OTP_STORE.get(normalizedEmail);

    if (!storedOtp) {
      return res.status(400).json({ message: 'No OTP found for this email. Please register again.' });
    }

    if (Date.now() > storedOtp.expiresAt) {
      OTP_STORE.delete(normalizedEmail);
      PENDING_USERS.delete(normalizedEmail);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (storedOtp.otp !== String(otp).trim()) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    const pendingUser = PENDING_USERS.get(normalizedEmail);
    if (!pendingUser) {
      const existingUser = USER_STORE.get(normalizedEmail);
      if (existingUser) {
        OTP_STORE.delete(normalizedEmail);
        return res.status(200).json({
          message: 'Email already verified.',
          data: { user: { id: existingUser.id, name: existingUser.name, email: existingUser.email, role: existingUser.role } },
        });
      }

      return res.status(404).json({ message: 'User not found.' });
    }

    const user = { ...pendingUser, isVerified: true };
    USER_STORE.set(normalizedEmail, user);
    PENDING_USERS.delete(normalizedEmail);
    OTP_STORE.delete(normalizedEmail);

    return res.status(200).json({
      message: 'Email verified successfully.',
      data: { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (error) {
    console.error('VERIFY EMAIL ERROR:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to verify email.' });
  }
});

app.post('/api/v1/auth/resend-otp', async (req, res) => {
  try {
    const { email, type } = req.body || {};

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const pendingUser = PENDING_USERS.get(normalizedEmail);

    if (!pendingUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const otp = makeOtp();
    OTP_STORE.set(normalizedEmail, {
      otp,
      expiresAt: Date.now() + OTP_TTL_MINUTES * 60 * 1000,
      userId: pendingUser.id,
      type: type || 'email_verify',
    });

    await sendOtpEmail(normalizedEmail, otp);

    return res.status(200).json({
      message: 'A new OTP has been sent to your email.',
      otp: ALLOW_DEV_OTP ? otp : undefined,
    });
  } catch (error) {
    console.error('RESEND OTP ERROR:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to resend OTP.' });
  }
});

app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = USER_STORE.get(normalizedEmail);
    const pendingUser = PENDING_USERS.get(normalizedEmail);

    if (!user && pendingUser) {
      const otp = makeOtp();
      OTP_STORE.set(normalizedEmail, {
        otp,
        expiresAt: Date.now() + OTP_TTL_MINUTES * 60 * 1000,
        userId: pendingUser.id,
        type: 'email_verify',
      });

      await sendOtpEmail(normalizedEmail, otp);

      return res.status(403).json({
        message: 'Email not verified. A new OTP has been sent.',
        otp: ALLOW_DEV_OTP ? otp : undefined,
      });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Login failed.' });
  }
});

app.post('/api/v1/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = USER_STORE.get(normalizedEmail);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const otp = makeOtp();
    OTP_STORE.set(normalizedEmail, {
      otp,
      expiresAt: Date.now() + OTP_TTL_MINUTES * 60 * 1000,
      userId: user.id,
      type: 'password_reset',
    });

    await sendOtpEmail(normalizedEmail, otp);

    return res.status(200).json({
      message: 'Password reset OTP sent to your email.',
      otp: ALLOW_DEV_OTP ? otp : undefined,
    });
  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to send reset OTP.' });
  }
});

app.post('/api/v1/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body || {};

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Email, OTP, and passwords are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const storedOtp = OTP_STORE.get(normalizedEmail);

    if (!storedOtp || storedOtp.type !== 'password_reset') {
      return res.status(400).json({ message: 'No reset OTP found for this email.' });
    }

    if (Date.now() > storedOtp.expiresAt) {
      OTP_STORE.delete(normalizedEmail);
      return res.status(400).json({ message: 'Reset OTP has expired.' });
    }

    if (storedOtp.otp !== String(otp).trim()) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    const user = USER_STORE.get(normalizedEmail);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    OTP_STORE.delete(normalizedEmail);

    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to reset password.' });
  }
});

app.post('/api/v1/auth/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required.' });
    }

    const payload = jwt.verify(refreshToken, JWT_SECRET);

    if (payload.type !== 'refresh') {
      return res.status(401).json({ message: 'Invalid refresh token.' });
    }

    const user = USER_STORE.get(payload.email || '');

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      data: {
        accessToken: generateAccessToken(user),
      },
    });
  } catch (error) {
    console.error('REFRESH TOKEN ERROR:', error.message);
    return res.status(401).json({ message: 'jwt expired' });
  }
});

app.post('/api/v1/auth/logout', async (req, res) => {
  res.status(200).json({ message: 'Logged out.' });
});

app.get('/api/v1/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = USER_STORE.get(payload.email || '');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.status(200).json({
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(401).json({ message: 'jwt expired' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log('Brevo API key configured:', !!BREVO_API_KEY);
  console.log('Brevo sender configured:', BREVO_SENDER_EMAIL);
  console.log('Important: if this sender email is not verified in Brevo, the API may accept the request but delivery can fail or be filtered.');
});
