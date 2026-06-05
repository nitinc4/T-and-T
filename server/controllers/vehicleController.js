import { createVehicleModel } from '../models/Vehicle.js';

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private/CompanyAdmin
export const getVehicles = async (req, res) => {
  try {
    const Vehicle = createVehicleModel(req.tenantDb);
    const vehicles = await Vehicle.find({});
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a vehicle
// @route   POST /api/vehicles
// @access  Private/CompanyAdmin
export const addVehicle = async (req, res) => {
  try {
    const Vehicle = createVehicleModel(req.tenantDb);
    const { vehicleNumber, vehicleType, brand, model, seatingCapacity, insuranceExpiry, permitExpiry } = req.body;

    const vehicleExists = await Vehicle.findOne({ vehicleNumber });

    if (vehicleExists) {
      return res.status(400).json({ message: 'Vehicle with this number already exists' });
    }

    const vehicle = await Vehicle.create({
      vehicleNumber, vehicleType, brand, model, seatingCapacity, insuranceExpiry, permitExpiry
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
