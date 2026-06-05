import { createCustomerModel } from '../models/Customer.js';
import { createBookingModel } from '../models/Booking.js';

export const getCustomers = async (req, res) => {
  try {
    const Customer = createCustomerModel(req.tenantDb);
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const Customer = createCustomerModel(req.tenantDb);
    const Booking = createBookingModel(req.tenantDb);
    
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Get Booking History by matching mobile number
    const bookings = await Booking.find({ mobileNumber: customer.mobileNumber }).sort({ tripDate: -1 });
    
    // We can also extract payments simply by looking at completed bookings / amounts
    const payments = bookings
      .filter(b => b.paymentStatus !== 'Pending')
      .map(b => ({
        bookingId: b.bookingId,
        date: b.updatedAt,
        amount: b.amount,
        status: b.paymentStatus
      }));

    res.json({
      profile: customer,
      bookings: bookings,
      payments: payments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const Customer = createCustomerModel(req.tenantDb);
    const { name, mobileNumber, email, address } = req.body;

    const existingCustomer = await Customer.findOne({ mobileNumber });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this mobile number already exists' });
    }

    const customer = new Customer({
      name,
      mobileNumber,
      email,
      address
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const Customer = createCustomerModel(req.tenantDb);
    const { name, mobileNumber, email, address, isActive } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, mobileNumber, email, address, isActive },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const Customer = createCustomerModel(req.tenantDb);
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
