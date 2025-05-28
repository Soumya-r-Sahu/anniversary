import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'shared/themes/app_theme.dart';
import 'features/home/pages/home_page.dart';
import 'features/countdown/countdown_page.dart';
import 'features/love_story/pages/love_story_page.dart';
import 'features/photo_gallery/pages/photo_gallery_page.dart';
import 'features/anniversary/pages/anniversary_page.dart';
import 'features/celebration/pages/celebration_page.dart';
import 'core/services/audio_service.dart';
import 'core/services/storage_service.dart';
import 'core/services/animation_service.dart';

class AnniversaryApp extends ConsumerStatefulWidget {
  const AnniversaryApp({Key? key}) : super(key: key);

  @override
  ConsumerState<AnniversaryApp> createState() => _AnniversaryAppState();
}

class _AnniversaryAppState extends ConsumerState<AnniversaryApp> {
  bool _isInitialized = false;

  @override
  void initState() {
    super.initState();
    _initializeServices();
  }

  Future<void> _initializeServices() async {
    try {
      // Initialize core services
      await StorageService().initialize();
      await AudioService().initialize();
      AnimationService().initialize();

      setState(() {
        _isInitialized = true;
      });
    } catch (e) {
      debugPrint('Error initializing services: $e');
      // Still show the app even if some services fail
      setState(() {
        _isInitialized = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_isInitialized) {
      return MaterialApp(
        home: Scaffold(
          body: Container(
            decoration: BoxDecoration(gradient: AppTheme.backgroundGradient),
            child: const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primaryPink),
              ),
            ),
          ),
        ),
      );
    }

    return MaterialApp(
      title: 'Anniversary Love',
      theme: AppTheme.lightTheme,
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/': (context) => const HomePage(),
        '/countdown': (context) => const CountdownPage(),
        '/love-story': (context) => const LoveStoryPage(),
        '/photo-gallery': (context) => const PhotoGalleryPage(),
        '/anniversary': (context) => const AnniversaryPage(),
        '/celebration': (context) => const CelebrationPage(),
      },
    );
  }
}
