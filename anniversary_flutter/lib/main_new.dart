import 'package:flutter/material.dart';
import 'features/home/pages/home_page.dart';
import 'pages/countdown_page.dart';
import 'pages/gallery_page.dart';
import 'pages/timeline_page.dart';
import 'pages/memories_page.dart';
import 'services/services.dart';

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
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.pink,
          brightness: Brightness.dark,
        ),
        fontFamily: 'Roboto',
      ),
      home: const NavigationPage(),
    );
  }
}

class NavigationPage extends StatefulWidget {
  const NavigationPage({super.key});

  @override
  State<NavigationPage> createState() => _NavigationPageState();
}

class _NavigationPageState extends State<NavigationPage> {
  int _currentIndex = 0;
  DateTime _anniversaryDate = DateTime(2025, 6, 15, 18, 0); // Default date
  bool _servicesInitialized = false;

  @override
  void initState() {
    super.initState();
    _initializeServices();
  }

  Future<void> _initializeServices() async {
    try {
      await StorageService().initialize();
      await AudioService().initialize();
      
      // Try to load saved anniversary date
      final savedDate = StorageService().getAnniversaryDate();
      if (savedDate != null && mounted) {
        setState(() {
          _anniversaryDate = savedDate;
        });
      }
      
      if (mounted) {
        setState(() {
          _servicesInitialized = true;
        });
      }
    } catch (e) {
      debugPrint('Service initialization error: $e');
      if (mounted) {
        setState(() {
          _servicesInitialized = true; // Continue with defaults
        });
      }
    }
  }

  List<Widget> get _pages => [
    const HomePage(),
    CountdownPage(anniversaryDate: _anniversaryDate),
    const GalleryPage(),
    const TimelinePage(),
    const MemoriesPage(),
  ];

  final List<NavigationDestination> _destinations = [
    const NavigationDestination(
      icon: Icon(Icons.home_outlined),
      selectedIcon: Icon(Icons.home),
      label: 'Home',
    ),
    const NavigationDestination(
      icon: Icon(Icons.timer_outlined),
      selectedIcon: Icon(Icons.timer),
      label: 'Countdown',
    ),
    const NavigationDestination(
      icon: Icon(Icons.photo_library_outlined),
      selectedIcon: Icon(Icons.photo_library),
      label: 'Gallery',
    ),
    const NavigationDestination(
      icon: Icon(Icons.timeline_outlined),
      selectedIcon: Icon(Icons.timeline),
      label: 'Timeline',
    ),
    const NavigationDestination(
      icon: Icon(Icons.favorite_outline),
      selectedIcon: Icon(Icons.favorite),
      label: 'Memories',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    if (!_servicesInitialized) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        destinations: _destinations,
        backgroundColor: Colors.white.withOpacity(0.9),
        indicatorColor: Colors.pink.withOpacity(0.3),
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
      ),
    );
  }
}
