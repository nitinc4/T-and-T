import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkStatus();
  }

  Future<void> _checkStatus() async {
    await Future.delayed(const Duration(seconds: 2)); // Artificial delay for aesthetic
    final prefs = await SharedPreferences.getInstance();
    final companyId = prefs.getString('companyId');
    final role = prefs.getString('userRole');

    if (mounted) {
      if (companyId != null) {
        if (role == 'Customer') {
          context.go('/customer-dashboard');
        } else {
          // TODO: Driver dashboard
          context.go('/role-selection');
        }
      } else {
        context.go('/role-selection');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Beautiful minimalist logo placeholder
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(24),
              ),
              child: const Icon(Icons.flight_takeoff, color: Colors.white, size: 50),
            ),
            const SizedBox(height: 24),
            const Text(
              'TravelPro',
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, letterSpacing: -0.5),
            ),
          ],
        ),
      ),
    );
  }
}
