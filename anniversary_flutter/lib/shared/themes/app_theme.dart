import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryPink = Color(0xFFec4899);
  static const Color lightPink = Color(0xFFfdf2f8);
  static const Color mediumPink = Color(0xFFfce7f3);
  static const Color redAccent = Color(0xFFf43f5e);
  
  // Additional static properties referenced throughout the app
  static const Color primaryColor = primaryPink;
  static const Color accentColor = redAccent;
  static const Color textColor = Color(0xFF6b7280);
  static const Color backgroundColor = lightPink;
  
  static const TextStyle headingStyle = TextStyle(
    fontFamily: 'Dancing Script',
    fontSize: 36,
    fontWeight: FontWeight.w600,
    color: primaryPink,
  );
  
  static const TextStyle bodyStyle = TextStyle(
    fontSize: 16,
    color: textColor,
    height: 1.5,
  );
  
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryPink,
        brightness: Brightness.light,
      ),
      fontFamily: 'Poppins',
      scaffoldBackgroundColor: lightPink,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: primaryPink),
        titleTextStyle: TextStyle(
          color: primaryPink,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryPink,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30),
          ),
          elevation: 8,
          shadowColor: primaryPink.withOpacity(0.3),
        ),
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          fontFamily: 'Dancing Script',
          fontSize: 48,
          fontWeight: FontWeight.bold,
          color: primaryPink,
        ),
        headlineMedium: TextStyle(
          fontFamily: 'Dancing Script',
          fontSize: 36,
          fontWeight: FontWeight.w600,
          color: primaryPink,
        ),
        bodyLarge: TextStyle(
          fontSize: 18,
          color: Colors.grey,
          height: 1.6,
        ),
        bodyMedium: TextStyle(
          fontSize: 16,
          color: Colors.grey,
          height: 1.5,
        ),
      ),
    );
  }

  static BoxDecoration get glassmorphismDecoration {
    return BoxDecoration(
      color: Colors.white.withOpacity(0.1),
      borderRadius: BorderRadius.circular(20),
      border: Border.all(
        color: Colors.white.withOpacity(0.2),
        width: 1,
      ),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.1),
          blurRadius: 10,
          offset: const Offset(0, 4),
        ),
      ],
    );
  }

  static LinearGradient get backgroundGradient {
    return const LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [
        lightPink,
        mediumPink,
        Color(0xFFfecaca),
      ],
    );
  }
}
