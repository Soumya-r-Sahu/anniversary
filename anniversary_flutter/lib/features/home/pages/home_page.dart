import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../shared/widgets/floating_bubbles.dart';
import '../../../shared/widgets/music_player.dart';
import '../../../shared/widgets/bubble_animation.dart';
import '../../../shared/themes/app_theme.dart';
import '../../../core/services/animation_service.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final AnimationService _animationService = AnimationService();
  
  @override
  void initState() {
    super.initState();
    _animationService.initialize();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(gradient: AppTheme.backgroundGradient),
        child: Stack(
          children: [
            // Floating bubbles background
            const FloatingBubblesBackground(),
            
            // Music player
            const MusicPlayerWidget(),
            
            // Main content
            SafeArea(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Main title with animation
                      BubbleAnimationWidget(
                        child: Text(
                          '💕 For My Sweet Jerry 💕',
                          style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                            fontSize: 42,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ).animate()
                        .fadeIn(duration: 800.ms)
                        .scale(delay: 200.ms, duration: 600.ms),
                      
                      const SizedBox(height: 20),
                      
                      // Subtitle
                      Text(
                        'My Dearest Pujuu (Jerry) 🐭',
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          color: AppTheme.redAccent,
                          fontSize: 28,
                        ),
                        textAlign: TextAlign.center,
                      ).animate()
                        .fadeIn(delay: 400.ms, duration: 800.ms)
                        .slideY(begin: 0.3, end: 0),
                      
                      const SizedBox(height: 30),
                      
                      // Typewriter text container
                      Container(
                        padding: const EdgeInsets.all(24),
                        margin: const EdgeInsets.symmetric(horizontal: 10),
                        decoration: AppTheme.glassmorphismDecoration,
                        child: _animationService.createTypewriterEffect(
                          text: "Every moment with you feels like magic ✨\n"
                               "You make my heart skip a beat every single day 💓\n"
                               "Ready for our special surprise? 🎁",
                          style: Theme.of(context).textTheme.bodyLarge!.copyWith(
                            fontSize: 18,
                            height: 1.6,
                            color: Colors.grey[700],
                          ),
                          duration: const Duration(milliseconds: 3000),
                        ),
                      ).animate()
                        .fadeIn(delay: 800.ms, duration: 1000.ms)
                        .scale(delay: 900.ms, duration: 500.ms),
                      
                      const SizedBox(height: 40),
                      
                      // Main action button
                      BubbleAnimationWidget(
                        duration: const Duration(milliseconds: 1200),
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.pushNamed(context, '/countdown');
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryPink,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 40, 
                              vertical: 20
                            ),
                            textStyle: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w600,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                            elevation: 12,
                            shadowColor: AppTheme.primaryPink.withOpacity(0.4),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text('🎁 Open Your Surprise'),
                              SizedBox(width: 8),
                              Icon(Icons.arrow_forward_rounded, size: 24),
                            ],
                          ),
                        ),
                      ).animate()
                        .fadeIn(delay: 1200.ms, duration: 800.ms)
                        .scale(delay: 1300.ms, duration: 600.ms)
                        .shimmer(delay: 2000.ms, duration: 1500.ms),
                      
                      const SizedBox(height: 30),
                      
                      // Love signature
                      Text(
                        'With all my love, Your Mankada (Soumya) 💖',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppTheme.primaryPink,
                          fontStyle: FontStyle.italic,
                          fontSize: 16,
                          fontFamily: 'Dancing Script',
                        ),
                        textAlign: TextAlign.center,
                      ).animate()
                        .fadeIn(delay: 1600.ms, duration: 1000.ms)
                        .slideY(begin: 0.2, end: 0),
                      
                      const SizedBox(height: 40),
                      
                      // Navigation buttons row
                      Wrap(
                        spacing: 15,
                        runSpacing: 15,
                        alignment: WrapAlignment.center,
                        children: [
                          _buildNavButton(
                            context,
                            'Love Story',
                            Icons.favorite,
                            '/love-story',
                            delay: 1800,
                          ),
                          _buildNavButton(
                            context,
                            'Photo Gallery',
                            Icons.photo_library,
                            '/photo-gallery',
                            delay: 1900,
                          ),
                          _buildNavButton(
                            context,
                            'Anniversary',
                            Icons.celebration,
                            '/anniversary',
                            delay: 2000,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
  Widget _buildNavButton(
    BuildContext context,
    String label,
    IconData icon,
    String route, {
    int delay = 0,
  }) {
    return BubbleAnimationWidget(
      child: ElevatedButton.icon(
        onPressed: () => Navigator.pushNamed(context, route),
        icon: Icon(icon, size: 18),
        label: Text(label),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.white.withOpacity(0.9),
          foregroundColor: AppTheme.primaryPink,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          textStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(25),
          ),
          elevation: 6,
          shadowColor: AppTheme.primaryPink.withOpacity(0.2),
        ),
      ),
    ).animate()
      .fadeIn(delay: delay.ms, duration: 600.ms)
      .scale(delay: (delay + 100).ms, duration: 400.ms);
  }
}
