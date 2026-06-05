import PDFDocument from 'pdfkit';
import { createBookingModel } from '../models/Booking.js';

export const generateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    
    // We need the company info for the invoice header
    // Wait, Company is on the central DB, we can just use the Tenant DB's info if we had it, 
    // or just pass generic info since companyId is available.
    
    const tenantDb = req.tenantDb;
    const Booking = createBookingModel(tenantDb);
    
    const booking = await Booking.findById(id).populate('vehicle').populate('driver');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${booking.bookingId}.pdf`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('TAX INVOICE', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(10).text(`Company ID: ${req.companyId}`, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.text(`Invoice No: INV-${booking.bookingId}`, { align: 'right' });
    
    doc.moveDown();
    
    // Customer Info
    doc.fontSize(14).text('Bill To:');
    doc.fontSize(10).text(`Name: ${booking.customerName}`);
    doc.text(`Phone: ${booking.mobileNumber}`);
    
    doc.moveDown();
    
    // Trip Details
    doc.fontSize(14).text('Trip Details:');
    doc.fontSize(10).text(`Booking ID: ${booking.bookingId}`);
    doc.text(`Date of Travel: ${new Date(booking.tripDate).toLocaleDateString()}`);
    doc.text(`Pickup: ${booking.pickupLocation}`);
    doc.text(`Drop: ${booking.dropLocation}`);
    doc.text(`Vehicle Type: ${booking.vehicleType}`);
    
    if (booking.vehicle) {
      doc.text(`Vehicle Number: ${booking.vehicle.vehicleNumber}`);
    }
    
    doc.moveDown();
    
    // Pricing
    doc.rect(50, doc.y, 500, 20).fill('#eeeeee');
    doc.fillColor('#000000').fontSize(10).text('Description', 60, doc.y + 6);
    doc.text('Amount (INR)', 450, doc.y, { width: 90, align: 'right' });
    doc.moveDown(1.5);
    
    doc.text('Travel Package / Trip Fare', 60, doc.y);
    const baseAmount = booking.amount / 1.18; // Reverse calculate 18% GST for display
    const gstAmount = booking.amount - baseAmount;
    
    doc.text(baseAmount.toFixed(2), 450, doc.y, { width: 90, align: 'right' });
    doc.moveDown();
    
    doc.text('GST (18%)', 60, doc.y);
    doc.text(gstAmount.toFixed(2), 450, doc.y, { width: 90, align: 'right' });
    doc.moveDown(2);
    
    doc.rect(50, doc.y, 500, 1).fill('#000000');
    doc.moveDown(0.5);
    
    doc.fontSize(12).text('Total Amount:', 60, doc.y);
    doc.text(`Rs. ${booking.amount.toFixed(2)}`, 450, doc.y, { width: 90, align: 'right' });
    
    doc.moveDown(4);
    doc.fontSize(10).text('Thank you for traveling with us!', { align: 'center', color: 'gray' });

    doc.end();

  } catch (error) {
    console.error('Error generating invoice:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate invoice' });
    }
  }
};
