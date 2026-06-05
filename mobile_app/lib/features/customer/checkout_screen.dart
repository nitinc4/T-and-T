import 'package:flutter/material.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:go_router/go_router.dart';
import '../../core/network/api_client.dart';

class CheckoutScreen extends StatefulWidget {
  final Map<String, dynamic> packageData;

  const CheckoutScreen({super.key, required this.packageData});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  late Razorpay _razorpay;
  bool _isLoading = false;
  
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _pickupController = TextEditingController();
  final _dropController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  @override
  void dispose() {
    _razorpay.clear();
    _nameController.dispose();
    _phoneController.dispose();
    _pickupController.dispose();
    _dropController.dispose();
    super.dispose();
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) async {
    // Call our backend to verify the signature
    try {
      final prefs = await SharedPreferences.getInstance();
      final companyId = prefs.getString('companyId');
      final bookingId = prefs.getString('pendingBookingId');

      await ApiClient().dio.post('/payments/verify', data: {
        'companyId': companyId,
        'razorpay_order_id': response.orderId,
        'razorpay_payment_id': response.paymentId,
        'razorpay_signature': response.signature,
        'bookingId': bookingId,
      });

      if (mounted) {
        setState(() => _isLoading = false);
        _showSuccessDialog();
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Payment verification failed on server.')));
      }
    }
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    setState(() => _isLoading = false);
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Payment failed: ${response.message}')));
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    setState(() => _isLoading = false);
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('External Wallet Selected: ${response.walletName}')));
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Icon(Icons.check_circle, color: Colors.green, size: 64),
        content: const Text('Booking Confirmed!', textAlign: TextAlign.center, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        actions: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                context.pop(); // close dialog
                context.go('/customer-dashboard');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('Go to Dashboard', style: TextStyle(color: Colors.white)),
            ),
          )
        ],
      ),
    );
  }

  Future<void> _processCheckout() async {
    if (_nameController.text.isEmpty || _phoneController.text.isEmpty || _pickupController.text.isEmpty || _dropController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all fields')));
      return;
    }

    setState(() => _isLoading = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final companyId = prefs.getString('companyId');
      
      // We parse the price. Assuming price looks like "$500" or "500"
      final priceString = widget.packageData['price']?.toString().replaceAll(RegExp(r'[^0-9.]'), '') ?? '0';
      final double amount = double.parse(priceString);

      // 1. Create Order via our Backend
      final orderResponse = await ApiClient().dio.post('/payments/create-order', data: {
        'companyId': companyId,
        'amount': amount,
        'currency': 'INR', // Hardcoded for demo, could be dynamic
      });

      final orderId = orderResponse.data['orderId'];
      final keyId = orderResponse.data['keyId'];
      
      // 2. Create the actual Booking in our DB as Pending
      final token = prefs.getString('token');
      // For a real app, customer should be logged in or we allow guest booking.
      // Assuming customer is logged in if they have a token.
      final bookingResponse = await ApiClient().dio.post(
        '/bookings',
        data: {
          'customerName': _nameController.text,
          'mobileNumber': _phoneController.text,
          'pickupLocation': _pickupController.text,
          'dropLocation': _dropController.text,
          'tripDate': DateTime.now().add(const Duration(days: 1)).toIso8601String(), // Mock
          'vehicleType': 'Sedan', // Mock
          'amount': amount,
        },
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );

      final bookingId = bookingResponse.data['_id'];
      await prefs.setString('pendingBookingId', bookingId);

      // 3. Open Razorpay Checkout
      var options = {
        'key': keyId,
        'amount': orderResponse.data['amount'], 
        'name': 'TravelPro Package',
        'description': widget.packageData['title'] ?? 'Tour Booking',
        'order_id': orderId,
        'prefill': {
          'contact': _phoneController.text,
          'email': 'customer@example.com'
        }
      };

      _razorpay.open(options);
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Checkout failed: ${e.toString()}')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F9),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.black), onPressed: () => context.pop()),
        title: const Text('Checkout', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Summary Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
              child: Row(
                children: [
                  Container(
                    width: 80, height: 80,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      image: DecorationImage(
                        image: NetworkImage(widget.packageData['image'] ?? 'https://via.placeholder.com/150'),
                        fit: BoxFit.cover,
                      )
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(widget.packageData['title'] ?? 'Package', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                        const SizedBox(height: 8),
                        Text(widget.packageData['price'] ?? '', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 20, color: Colors.black)),
                      ],
                    ),
                  )
                ],
              ),
            ),
            const SizedBox(height: 32),
            const Text('Passenger Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildTextField(_nameController, 'Full Name', Icons.person),
            const SizedBox(height: 16),
            _buildTextField(_phoneController, 'Phone Number', Icons.phone),
            const SizedBox(height: 32),
            const Text('Trip Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildTextField(_pickupController, 'Pickup Location', Icons.my_location),
            const SizedBox(height: 16),
            _buildTextField(_dropController, 'Drop Location', Icons.location_on),
          ],
        ),
      ),
      bottomSheet: Container(
        padding: const EdgeInsets.all(24.0),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5))],
        ),
        child: SizedBox(
          width: double.infinity,
          height: 56,
          child: ElevatedButton(
            onPressed: _isLoading ? null : _processCheckout,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.black,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: _isLoading 
              ? const CircularProgressIndicator(color: Colors.white)
              : const Text('Pay Securely', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String hint, IconData icon) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon, color: Colors.black54),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
      ),
    );
  }
}
