import jwt from 'jsonwebtoken';
import { createUserModel } from '../models/User.js';
import mongoose from 'mongoose';
import { getTenantConnection } from '../utils/tenantConnection.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_123');

      let conn;
      if (!decoded.companyId) {
        conn = mongoose.connection;
      } else {
        conn = getTenantConnection(decoded.companyId);
      }
      
      const User = createUserModel(conn);
      req.user = await User.findById(decoded.id).select('-password');
      req.tenantDb = conn; // Attach the tenant connection to the request for downstream controllers!
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next();
  };
};

export { protect, restrictTo };
