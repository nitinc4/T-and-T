import jwt from 'jsonwebtoken';

const generateToken = (id, role, companyId) => {
  return jwt.sign(
    { id, role, companyId },
    process.env.JWT_SECRET || 'fallback_secret_123',
    { expiresIn: '30d' }
  );
};

export { generateToken };
