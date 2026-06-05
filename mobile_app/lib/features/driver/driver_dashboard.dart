import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import '../../core/network/api_client.dart';

class DriverDashboard extends StatefulWidget {
  const DriverDashboard({super.key});

  @override
  State<DriverDashboard> createState() => _DriverDashboardState();
}

class _DriverDashboardState extends State<DriverDashboard> {
  int _currentIndex = 0;
  String _driverName = '';
  String _driverStatus = 'Available';
  List<dynamic> _trips = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDriverInfo();
    _fetchTrips();
  }

  Future<void> _loadDriverInfo() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _driverName = prefs.getString('userName') ?? 'Driver';
    });
  }

  Future<void> _fetchTrips() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      
      final response = await ApiClient().dio.get(
        '/bookings/driver/me',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      setState(() {
        _trips = response.data;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _updateStatus(String status) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      
      await ApiClient().dio.put(
        '/drivers/me/status',
        data: {'status': status},
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      setState(() {
        _driverStatus = status;
      });
      if(mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Status updated')));
    } catch (e) {}
  }

  Future<void> _updateTripStatus(String tripId, String newStatus) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      
      await ApiClient().dio.put(
        '/bookings/$tripId/status',
        data: {'status': newStatus},
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      _fetchTrips();
      if(mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Trip marked as $newStatus')));
    } catch (e) {}
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('userRole');
    if (mounted) context.go('/');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F9),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(_currentIndex == 0 ? 'My Trips' : 'Profile', style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        actions: [
          if (_currentIndex == 1)
            IconButton(icon: const Icon(Icons.logout, color: Colors.black), onPressed: _logout),
        ],
      ),
      body: _currentIndex == 0 ? _buildTripsTab() : _buildProfileTab(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        selectedItemColor: Colors.black,
        unselectedItemColor: Colors.black38,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Trips'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }

  Widget _buildTripsTab() {
    if (_isLoading) return const Center(child: CircularProgressIndicator(color: Colors.black));
    
    if (_trips.isEmpty) {
      return const Center(child: Text('No assigned trips found.', style: TextStyle(color: Colors.black54, fontSize: 16)));
    }

    return RefreshIndicator(
      onRefresh: _fetchTrips,
      color: Colors.black,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _trips.length,
        separatorBuilder: (context, index) => const SizedBox(height: 16),
        itemBuilder: (context, index) {
          final trip = _trips[index];
          return _buildTripCard(trip);
        },
      ),
    );
  }

  Widget _buildTripCard(dynamic trip) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 15, offset: const Offset(0, 5)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Trip: ${trip['bookingId']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: _getStatusColor(trip['bookingStatus']).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(trip['bookingStatus'], style: TextStyle(color: _getStatusColor(trip['bookingStatus']), fontWeight: FontWeight.w600, fontSize: 12)),
              ),
            ],
          ),
          const Divider(height: 32),
          _buildInfoRow(Icons.person, trip['customerName']),
          const SizedBox(height: 8),
          _buildInfoRow(Icons.phone, trip['mobileNumber']),
          const SizedBox(height: 16),
          _buildInfoRow(Icons.my_location, 'Pickup: ${trip['pickupLocation']}'),
          const SizedBox(height: 8),
          _buildInfoRow(Icons.location_on, 'Drop: ${trip['dropLocation']}'),
          
          if (trip['bookingStatus'] == 'Confirmed') ...[
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () => _updateTripStatus(trip['_id'], 'In Progress'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Start Trip', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            )
          ] else if (trip['bookingStatus'] == 'In Progress') ...[
             const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () => _updateTripStatus(trip['_id'], 'Completed'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Complete Trip', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            )
          ]
        ],
      ),
    );
  }

  Widget _buildProfileTab() {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 60, height: 60,
                decoration: BoxDecoration(color: Colors.black, borderRadius: BorderRadius.circular(30)),
                child: Center(child: Text(_driverName.isNotEmpty ? _driverName[0].toUpperCase() : 'D', style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold))),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(_driverName, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    const Text('Driver Account', style: TextStyle(color: Colors.black54)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 40),
          const Text('Availability Status', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
          const SizedBox(height: 16),
          _buildStatusToggle('Available', Icons.check_circle, Colors.green),
          _buildStatusToggle('On Trip', Icons.directions_car, Colors.blue),
          _buildStatusToggle('Offline', Icons.do_not_disturb_on, Colors.red),
        ],
      ),
    );
  }

  Widget _buildStatusToggle(String title, IconData icon, Color color) {
    final isSelected = _driverStatus == title;
    return GestureDetector(
      onTap: () => _updateStatus(title),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? color.withOpacity(0.1) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isSelected ? color : Colors.transparent, width: 2),
        ),
        child: Row(
          children: [
            Icon(icon, color: isSelected ? color : Colors.black54),
            const SizedBox(width: 16),
            Expanded(child: Text(title, style: TextStyle(fontWeight: isSelected ? FontWeight.bold : FontWeight.normal))),
            if (isSelected) Icon(Icons.check, color: color),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 18, color: Colors.black54),
        const SizedBox(width: 8),
        Expanded(child: Text(text, style: const TextStyle(fontSize: 14))),
      ],
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Confirmed': return Colors.blue;
      case 'In Progress': return Colors.orange;
      case 'Completed': return Colors.green;
      default: return Colors.black54;
    }
  }
}
