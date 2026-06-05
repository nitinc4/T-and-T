import { createBookingModel } from '../models/Booking.js';
import { createVehicleModel } from '../models/Vehicle.js';
import { createUserModel } from '../models/User.js';

// Helper to generate a short friendly Booking ID (e.g., BKG-12345)
const generateBookingId = () => {
  return `BKG-${Math.floor(10000 + Math.random() * 90000)}`;
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/CompanyAdmin
export const getBookings = async (req, res) => {
  try {
    const Booking = createBookingModel(req.tenantDb);
    // Populate driver and vehicle info if assigned
    const bookings = await Booking.find({}).populate('driver', 'name mobileNumber').populate('vehicle', 'vehicleNumber brand model');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get driver specific bookings
// @route   GET /api/bookings/driver/me
// @access  Private/Driver
export const getDriverBookings = async (req, res) => {
  try {
    const Booking = createBookingModel(req.tenantDb);
    const bookings = await Booking.find({ driver: req.user._id }).populate('vehicle', 'vehicleNumber brand model');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private/CompanyAdmin
export const createBooking = async (req, res) => {
  try {
    const Booking = createBookingModel(req.tenantDb);
    const { customerName, mobileNumber, pickupLocation, dropLocation, tripDate, vehicleType, amount } = req.body;

    const booking = await Booking.create({
      bookingId: generateBookingId(),
      customerName, 
      mobileNumber, 
      pickupLocation, 
      dropLocation, 
      tripDate, 
      vehicleType, 
      amount,
      bookingStatus: 'Pending',
      paymentStatus: 'Pending'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign Driver and Vehicle to Booking
// @route   PUT /api/bookings/:id/assign
// @access  Private/CompanyAdmin
export const assignResources = async (req, res) => {
  try {
    const Booking = createBookingModel(req.tenantDb);
    const Vehicle = createVehicleModel(req.tenantDb);
    const User = createUserModel(req.tenantDb);

    const { vehicleId, driverId } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify Vehicle exists and is Available
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(400).json({ message: 'Vehicle not found' });

    // Verify Driver exists
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'Driver') return res.status(400).json({ message: 'Driver not found' });

    // Update booking
    booking.vehicle = vehicleId;
    booking.driver = driverId;
    booking.bookingStatus = 'Confirmed';
    await booking.save();

    // Optionally update Vehicle and Driver status to 'In Trip'
    vehicle.status = 'In Trip';
    await vehicle.save();
    driver.status = 'On Trip';
    await driver.save();

    const updatedBooking = await Booking.findById(req.params.id).populate('driver', 'name').populate('vehicle', 'vehicleNumber');
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Booking Status
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res) => {
  try {
    const Booking = createBookingModel(req.tenantDb);
    const { status } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Allow if CompanyAdmin or if it's the assigned Driver
    if (req.user.role !== 'CompanyAdmin' && req.user._id.toString() !== booking.driver?.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.bookingStatus = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
