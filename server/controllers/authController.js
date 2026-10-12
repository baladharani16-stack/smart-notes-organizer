import User from '../models/User.js';
import Subject from '../models/Subject.js';
import { generateToken, setAuthCookie, clearAuthCookie } from '../utils/tokenUtils.js';

// Default subjects seeded automatically for every new registered student/developer
const DEFAULT_SUBJECTS = [
  { name: 'Programming', color: 'indigo', description: 'Core languages, data structures & algorithms' },
  { name: 'Database', color: 'emerald', description: 'SQL, NoSQL, schema design & query optimization' },
  { name: 'Data Analytics', color: 'amber', description: 'Data processing, statistics & machine learning' },
  { name: 'Cloud Computing', color: 'sky', description: 'AWS, Azure, Docker, Kubernetes & serverless' },
  { name: 'Interview Preparation', color: 'purple', description: 'System design, behavioral & coding puzzles' },
  { name: 'General', color: 'rose', description: 'Quick thoughts, study schedules & miscellaneous' },
];

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    // Automatically seed default subjects for the user
    try {
      const subjectDocs = DEFAULT_SUBJECTS.map((s) => ({
        ...s,
        userId: user._id,
      }));
      await Subject.insertMany(subjectDocs);
    } catch (subjectErr) {
      console.warn('Failed to seed default subjects during registration:', subjectErr.message);
    }

    const token = generateToken({ userId: user._id, email: user.email });
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Log in existing user
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken({ userId: user._id, email: user.email });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Log out user
 * POST /api/auth/logout
 */
export async function logout(req, res) {
  clearAuthCookie(res);
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
}

/**
 * Get current user profile
 * GET /api/auth/me
 */
export async function getMe(req, res) {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
}

/**
 * Update user profile
 * PATCH /api/auth/profile
 */
export async function updateProfile(req, res, next) {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) {
      user.name = name;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to set a new password.',
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect.',
        });
      }

      user.passwordHash = await User.hashPassword(newPassword);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}
