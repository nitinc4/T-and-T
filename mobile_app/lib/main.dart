import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/routing/app_router.dart';

void main() {
  runApp(
    const ProviderScope(
      child: TravelProApp(),
    ),
  );
}

class TravelProApp extends StatelessWidget {
  const TravelProApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'TravelPro',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.black),
        useMaterial3: true,
        textTheme: GoogleFonts.interTextTheme(
          Theme.of(context).textTheme,
        ),
      ),
      routerConfig: appRouter,
    );
  }
}
