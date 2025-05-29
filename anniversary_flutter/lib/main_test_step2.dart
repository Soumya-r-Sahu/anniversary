import 'package:flutter/material.dart';
import 'features/home/pages/home_page.dart';

void main() => runApp(const AnniversaryApp());

class AnniversaryApp extends StatelessWidget {
  const AnniversaryApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Anniversary Celebration',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.pink,
          brightness: Brightness.light,
        ),
        fontFamily: 'Roboto',
      ),
      home: const HomePage(),
    );
  }
}
