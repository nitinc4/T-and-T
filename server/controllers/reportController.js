import { createBookingModel } from '../models/Booking.js';
import { createVehicleModel } from '../models/Vehicle.js';
import { createUserModel } from '../models/User.js';

export const getDashboardStats = async (req, res) => {
  try {
    const tenantDb = req.tenantDb;
    
    const Booking = createBookingModel(tenantDb);
    const Vehicle = createVehicleModel(tenantDb);
    const Driver = createUserModel(tenantDb); // Note: drivers are stored in User model with role='Driver'

    // Get all bookings
    const allBookings = await Booking.find();
    
    const totalBookings = allBookings.length;
    const pendingBookings = allBookings.filter(b => b.bookingStatus === 'Pending').length;
    const completedBookings = allBookings.filter(b => b.bookingStatus === 'Completed').length;
    
    const totalRevenue = allBookings
      .filter(b => b.paymentStatus === 'Completed' || b.bookingStatus === 'Completed')
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    // Vehicles
    const allVehicles = await Vehicle.find();
    const availableVehicles = allVehicles.filter(v => v.status === 'Available').length;
    
    // Drivers
    const allDrivers = await Driver.find({ role: 'Driver' });
    const availableDrivers = allDrivers.filter(d => d.status === 'Available').length;

    // Monthly data for chart (Last 6 months)
    const monthlyDataMap = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthYear = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyDataMap[monthYear] = 0;
    }

    allBookings.forEach(b => {
      if (b.tripDate) {
        const d = new Date(b.tripDate);
        const monthYear = d.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (monthlyDataMap[monthYear] !== undefined) {
          monthlyDataMap[monthYear] += (b.amount || 0);
        }
      }
    });

    const revenueChartData = Object.keys(monthlyDataMap).map(key => ({
      name: key,
      revenue: monthlyDataMap[key]
    }));

    res.json({
      totalBookings,
      pendingBookings,
      completedBookings,
      totalRevenue,
      vehicleStats: { total: allVehicles.length, available: availableVehicles },
      driverStats: { total: allDrivers.length, available: availableDrivers },
      revenueChartData
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};
