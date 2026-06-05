import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  late Dio dio;

  factory ApiClient() {
    return _instance;
  }

  ApiClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: 'http://10.0.2.2:5000/api', // Android Emulator localhost
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Inject tenant ID and auth token if available
          final prefs = await SharedPreferences.getInstance();
          final companyId = prefs.getString('companyId');
          final token = prefs.getString('token');

          if (companyId != null) {
            options.headers['x-company-id'] = companyId;
          }
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }

          return handler.next(options);
        },
      ),
    );
  }
}
