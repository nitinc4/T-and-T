import 'package:go_router/go_router.dart';
import '../../features/onboarding/splash_screen.dart';
import '../../features/onboarding/role_selection.dart';
import '../../features/onboarding/client_selection.dart';
import '../../features/customer/customer_dashboard.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/role-selection',
      builder: (context, state) => const RoleSelectionScreen(),
    ),
    GoRoute(
      path: '/client-selection',
      builder: (context, state) => const ClientSelectionScreen(),
    ),
    GoRoute(
      path: '/customer-dashboard',
      builder: (context, state) => const CustomerDashboard(),
    ),
    // TODO: Add Driver Dashboard Route
  ],
);
