import { createUserModel } from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get all drivers for a company
// @route   GET /api/drivers
// @access  Private/CompanyAdmin
export const getDrivers = async (req, res) => {
  try {
    const User = createUserModel(req.tenantDb);
    const drivers = await User.find({ role: 'Driver' }).select('-password');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new driver
// @route   POST /api/drivers
// @access  Private/CompanyAdmin
export const addDriver = async (req, res) => {
  try {
    const User = createUserModel(req.tenantDb);
    const { name, email, password, licenseNumber, licenseExpiry, address } = req.body;

    const driverExists = await User.findOne({ email });

    if (driverExists) {
      return res.status(400).json({ message: 'Driver with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const driver = await User.create({
      name, 
      email, 
      password: hashedPassword, 
      role: 'Driver',
      licenseNumber, 
      licenseExpiry, 
      address,
      companyId: req.user.companyId
    });

    res.status(201).json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      licenseNumber: driver.licenseNumber,
      status: driver.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update driver own status
// @route   PUT /api/drivers/me/status
// @access  Private/Driver
export const updateDriverStatus = async (req, res) => {
  try {
    const User = createUserModel(req.tenantDb);
    const { status } = req.body;
    
    const driver = await User.findById(req.user._id);
    if (!driver || driver.role !== 'Driver') {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.status = status;
    await driver.save();
    
    res.json({ status: driver.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
