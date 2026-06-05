import Company from '../models/Company.js';
import { getTenantConnection } from '../utils/tenantConnection.js';
import { createUserModel } from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private/SuperAdmin
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new company
// @route   POST /api/companies
// @access  Private/SuperAdmin
export const createCompany = async (req, res) => {
  try {
    const { name, ownerName, mobileNumber, email, gstNumber, address, planType, expiryDate } = req.body;

    const companyExists = await Company.findOne({ email });

    if (companyExists) {
      return res.status(400).json({ message: 'Company with this email already exists' });
    }

    const company = await Company.create({
      name, ownerName, mobileNumber, email, gstNumber, address, planType, expiryDate
    });

    // Provision the new tenant database
    const tenantConn = getTenantConnection(company._id);
    const TenantUser = createUserModel(tenantConn);
    
    // Create the initial CompanyAdmin for the new tenant
    // We'll use a default password "password123" for now, they can change it later
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    await TenantUser.create({
      name: ownerName,
      email: email,
      password: hashedPassword,
      role: 'CompanyAdmin',
      companyId: company._id
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a company
// @route   PUT /api/companies/:id
// @access  Private/SuperAdmin
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company) {
      company.name = req.body.name || company.name;
      company.ownerName = req.body.ownerName || company.ownerName;
      company.mobileNumber = req.body.mobileNumber || company.mobileNumber;
      company.email = req.body.email || company.email;
      company.gstNumber = req.body.gstNumber || company.gstNumber;
      company.address = req.body.address || company.address;
      company.planType = req.body.planType || company.planType;
      company.expiryDate = req.body.expiryDate || company.expiryDate;
      company.isActive = req.body.isActive !== undefined ? req.body.isActive : company.isActive;

      const updatedCompany = await company.save();
      res.json(updatedCompany);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
