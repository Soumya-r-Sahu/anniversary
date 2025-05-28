import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'dart:async';
import '../shared/widgets/floating_bubbles.dart';
import '../shared/widgets/music_player.dart';
import '../shared/themes/app_theme.dart';

class CountdownPage extends StatefulWidget {
  const CountdownPage({Key? key}) : super(key: key);

  @override
  State<CountdownPage> createState() => _CountdownPageState();
}

class _CountdownPageState extends State<CountdownPage> {
  late Timer _timer;
  Duration _timeRemaining = Duration.zero;
  
  // Anniversary date - you can customize this
  final DateTime _anniversaryDate = DateTime(2025, 6, 15, 18, 0); // June 15, 2025 at 6 PM

  @override
  void initState() {
    super.initState();
    _updateCountdown();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      _updateCountdown();
    });
  }

  void _updateCountdown() {
    final now = DateTime.now();
    if (now.isBefore(_anniversaryDate)) {
      setState(() {
        _timeRemaining = _anniversaryDate.difference(now);
      });
    } else {
      setState(() {
        _timeRemaining = Duration.zero;
      });
      _timer.cancel();
    }
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Countdown to Love'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Container(
        decoration: BoxDecoration(gradient: AppTheme.backgroundGradient),
        child: Stack(
          children: [
            const FloatingBubblesBackground(),
            const MusicPlayerWidget(),
            
            SafeArea(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Title
                      Text(
                        '💕 Our Special Day 💕',
                        style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                          fontSize: 36,
                        ),
                        textAlign: TextAlign.center,
                      ).animate()
                        .fadeIn(duration: 800.ms)
                        .scale(delay: 200.ms),
                      
                      const SizedBox(height: 30),
                      
                      // Countdown display
                      if (_timeRemaining.inSeconds > 0) ...[
                        Text(
                          'Time until our celebration:',
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            fontSize: 18,
                            color: AppTheme.primaryPink,
                          ),
                          textAlign: TextAlign.center,
                        ).animate()
                          .fadeIn(delay: 400.ms),
                        
                        const SizedBox(height: 20),
                        
                        // Countdown timer
                        Container(
                          padding: const EdgeInsets.all(24),
                          decoration: AppTheme.glassmorphismDecoration,
                          child: Column(
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                children: [
                                  _buildTimeUnit('Days', _timeRemaining.inDays),
                                  _buildTimeUnit('Hours', _timeRemaining.inHours % 24),
                                  _buildTimeUnit('Minutes', _timeRemaining.inMinutes % 60),
                                  _buildTimeUnit('Seconds', _timeRemaining.inSeconds % 60),
                                ],
                              ),
                            ],
                          ),
                        ).animate()
                          .fadeIn(delay: 600.ms)
                          .scale(delay: 700.ms),
                        
                        const SizedBox(height: 40),
                        
                        // Sweet message
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: AppTheme.glassmorphismDecoration,
                          child: Text(
                            '✨ Every second brings us closer to our magical moment! ✨\n\n'
                            'I can\'t wait to celebrate our love and create more beautiful memories together 💖',
                            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                              fontSize: 16,
                              height: 1.6,
                              color: Colors.grey[700],
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ).animate()
                          .fadeIn(delay: 1000.ms)
                          .slideY(begin: 0.3, end: 0),
                      ] else ...[
                        // Anniversary has arrived!
                        Text(
                          '🎉 Happy Anniversary! 🎉',
                          style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                            fontSize: 42,
                            color: AppTheme.redAccent,
                          ),
                          textAlign: TextAlign.center,
                        ).animate()
                          .fadeIn(duration: 800.ms)
                          .scale(delay: 200.ms)
                          .shimmer(delay: 1000.ms, duration: 2000.ms),
                        
                        const SizedBox(height: 30),
                        
                        ElevatedButton(
                          onPressed: () {
                            Navigator.pushNamed(context, '/celebration');
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.redAccent,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 40,
                              vertical: 20,
                            ),
                            textStyle: const TextStyle(fontSize: 20),
                          ),
                          child: const Text('🎊 Start Celebration! 🎊'),
                        ).animate()
                          .fadeIn(delay: 800.ms)
                          .scale(delay: 900.ms),
                      ],
                      
                      const SizedBox(height: 40),
                      
                      // Navigation buttons
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          ElevatedButton.icon(
                            onPressed: () => Navigator.pushNamed(context, '/love-story'),
                            icon: const Icon(Icons.favorite, size: 18),
                            label: const Text('Love Story'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white.withOpacity(0.9),
                              foregroundColor: AppTheme.primaryPink,
                            ),
                          ),
                          ElevatedButton.icon(
                            onPressed: () => Navigator.pushNamed(context, '/photo-gallery'),
                            icon: const Icon(Icons.photo_library, size: 18),
                            label: const Text('Gallery'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white.withOpacity(0.9),
                              foregroundColor: AppTheme.primaryPink,
                            ),
                          ),
                        ],
                      ).animate()
                        .fadeIn(delay: 1200.ms)
                        .slideY(begin: 0.2, end: 0),
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

  Widget _buildTimeUnit(String label, int value) {
    return Column(
      children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: AppTheme.primaryPink,
            borderRadius: BorderRadius.circular(30),
            boxShadow: [
              BoxShadow(
                color: AppTheme.primaryPink.withOpacity(0.3),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Center(
            child: Text(
              value.toString().padLeft(2, '0'),
              style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: TextStyle(
            color: AppTheme.primaryPink,
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    ).animate()
      .fadeIn(delay: (800 + (value * 100)).ms)
      .scale(delay: (900 + (value * 100)).ms);
  }
}
