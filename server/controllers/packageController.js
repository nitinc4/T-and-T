import { getTenantConnection } from '../utils/tenantConnection.js';
import { createPackageModel } from '../models/Package.js';

export const getPackages = async (req, res) => {
  try {
    const tenantConn = getTenantConnection(req.user.companyId);
    const Package = createPackageModel(tenantConn);
    const packages = await Package.find({});
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPackage = async (req, res) => {
  try {
    const { title, price, imageUrl, duration, destination } = req.body;
    const tenantConn = getTenantConnection(req.user.companyId);
    const Package = createPackageModel(tenantConn);

    const newPackage = await Package.create({
      title, price, imageUrl, duration, destination, companyId: req.user.companyId
    });

    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const tenantConn = getTenantConnection(req.user.companyId);
    const Package = createPackageModel(tenantConn);
    
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    pkg.title = req.body.title || pkg.title;
    pkg.price = req.body.price || pkg.price;
    pkg.imageUrl = req.body.imageUrl || pkg.imageUrl;
    pkg.duration = req.body.duration || pkg.duration;
    pkg.destination = req.body.destination || pkg.destination;

    const updatedPackage = await pkg.save();
    res.json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const tenantConn = getTenantConnection(req.user.companyId);
    const Package = createPackageModel(tenantConn);
    
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.json({ message: 'Package removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
