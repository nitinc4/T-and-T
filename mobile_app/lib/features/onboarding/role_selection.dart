import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

class RoleSelectionScreen extends StatelessWidget {
  const RoleSelectionScreen({super.key});

  Future<void> _selectRole(BuildContext context, String role) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('userRole', role);
    if (context.mounted) {
      context.go('/client-selection');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F9),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 40.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'How are you using\nTravelPro?',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                  height: 1.1,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Choose your role to get started.',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.black54,
                ),
              ),
              const SizedBox(height: 48),
              _buildRoleCard(
                context,
                title: 'I am a Customer',
                subtitle: 'Find and book amazing travel experiences.',
                icon: Icons.explore,
                onTap: () => _selectRole(context, 'Customer'),
              ),
              const SizedBox(height: 24),
              _buildRoleCard(
                context,
                title: 'I am a Driver',
                subtitle: 'Manage your trips and earnings.',
                icon: Icons.directions_car,
                onTap: () => _selectRole(context, 'Driver'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRoleCard(BuildContext context, {required String title, required String subtitle, required IconData icon, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFF0F0F0),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, size: 32, color: Colors.black87),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(fontSize: 14, color: Colors.black54),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.black38),
          ],
        ),
      ),
    );
  }
}
