import { createUserModel } from '../models/User.js';
import mongoose from 'mongoose';
import { getTenantConnection } from '../utils/tenantConnection.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/auth.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password, companyId } = req.body;

    let conn;
    // SuperAdmins log into the core database using 'admin' as companyId
    if (!companyId || companyId === 'admin') {
      conn = mongoose.connection;
    } else {
      conn = getTenantConnection(companyId);
    }

    const User = createUserModel(conn);
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        token: generateToken(user._id, user.role, user.companyId),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register initial Super Admin (for setup purposes)
// @route   POST /api/auth/setup
// @access  Public (Should be disabled in prod)
export const setupSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const User = createUserModel(mongoose.connection);

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'SuperAdmin'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role, user.companyId),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
