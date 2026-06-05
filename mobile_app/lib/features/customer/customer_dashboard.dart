import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/network/api_client.dart';
import '../../core/sdui/sdui_engine.dart';

class CustomerDashboard extends StatefulWidget {
  const CustomerDashboard({super.key});

  @override
  State<CustomerDashboard> createState() => _CustomerDashboardState();
}

class _CustomerDashboardState extends State<CustomerDashboard> {
  Map<String, dynamic>? _config;
  bool _isLoading = true;
  String? _error;
  Color _primaryColor = Colors.blue;

  @override
  void initState() {
    super.initState();
    _fetchSDUIConfig();
  }

  Future<void> _fetchSDUIConfig() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final companyId = prefs.getString('companyId');
      
      if (companyId == null) {
        setState(() {
          _error = 'Session expired. Please restart the app.';
          _isLoading = false;
        });
        return;
      }

      final response = await ApiClient().dio.get('/public/companies/$companyId/config');
      final data = response.data;
      
      // Parse Hex Color
      String hexColor = data['theme']['primaryColor'];
      hexColor = hexColor.replaceAll('#', '0xff');
      
      setState(() {
        _config = data;
        _primaryColor = Color(int.parse(hexColor));
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Failed to load dashboard. Please try again.';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Colors.white,
        body: Center(child: CircularProgressIndicator(color: Colors.black)),
      );
    }

    if (_error != null) {
      return Scaffold(
        backgroundColor: Colors.white,
        body: Center(child: Text(_error!, style: const TextStyle(color: Colors.red))),
      );
    }

    final layout = List<Map<String, dynamic>>.from(_config!['layout']);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Explore',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 24),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_outline, color: Colors.black),
            onPressed: () {},
          )
        ],
      ),
      body: ListView.builder(
        itemCount: layout.length,
        itemBuilder: (context, index) {
          return SDUIEngine.buildWidget(context, layout[index], _primaryColor);
        },
      ),
    );
  }
}
