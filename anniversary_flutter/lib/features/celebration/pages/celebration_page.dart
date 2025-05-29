import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:confetti/confetti.dart';
import 'dart:math' as math;
import '../../../shared/widgets/floating_bubbles.dart';
import '../../../shared/widgets/bubble_animation.dart';
import '../../../shared/widgets/music_player.dart';
import '../../../shared/themes/app_theme.dart';
import '../../../services/audio_service.dart';

class CelebrationPage extends ConsumerStatefulWidget {
  const CelebrationPage({super.key});

  @override
  ConsumerState<CelebrationPage> createState() => _CelebrationPageState();
}

class _CelebrationPageState extends ConsumerState<CelebrationPage>
    with TickerProviderStateMixin {
  late AnimationController _celebrationController;
  late AnimationController _fireworksController;
  late AnimationController _heartRainController;
  late AnimationController _textController;
  
  late ConfettiController _confettiController;
  
  final ScrollController _scrollController = ScrollController();
  
  bool _isPlaying = false;
  int _currentMessageIndex = 0;
  
  final List<CelebrationMessage> messages = [
    CelebrationMessage(
      text: "🎉 Let's Celebrate Our Love! 🎉",
      icon: Icons.celebration,
      color: Colors.orange,
    ),
    CelebrationMessage(
      text: "💖 You Make Every Day Special 💖",
      icon: Icons.favorite,
      color: Colors.pink,
    ),
    CelebrationMessage(
      text: "🌟 Here's to Forever Together 🌟",
      icon: Icons.star,
      color: Colors.amber,
    ),
    CelebrationMessage(
      text: "🥂 Cheers to Our Amazing Journey 🥂",
      icon: Icons.local_bar,
      color: Colors.purple,
    ),
    CelebrationMessage(
      text: "💍 My Heart Belongs to You 💍",
      icon: Icons.diamond,
      color: Colors.blue,
    ),
  ];

  @override
  void initState() {
    super.initState();
    
    _celebrationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    
    _fireworksController = AnimationController(
      duration: const Duration(seconds: 4),
      vsync: this,
    );
    
    _heartRainController = AnimationController(
      duration: const Duration(seconds: 6),
      vsync: this,
    );
    
    _textController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    
    _confettiController = ConfettiController(
      duration: const Duration(seconds: 3),
    );
    
    // Start celebration sequence
    _startCelebration();
  }
  
  @override
  void dispose() {
    _celebrationController.dispose();
    _fireworksController.dispose();
    _heartRainController.dispose();
    _textController.dispose();
    _confettiController.dispose();
    _scrollController.dispose();
    super.dispose();
  }
  
  void _startCelebration() async {
    // Play celebration music
    try {
      await AudioService().playMusic('celebration.mp3');
      setState(() {
        _isPlaying = true;
      });
    } catch (e) {
      // Handle error silently
    }
    
    // Start confetti
    _confettiController.play();
    
    // Start animations sequence
    _celebrationController.forward();
    
    Future.delayed(const Duration(milliseconds: 500), () {
      _fireworksController.repeat();
    });
    
    Future.delayed(const Duration(milliseconds: 1000), () {
      _heartRainController.repeat();
    });
    
    // Cycle through messages
    _cycleMessages();
  }
  
  void _cycleMessages() {
    _textController.forward().then((_) {
      Future.delayed(const Duration(milliseconds: 2000), () {
        _textController.reverse().then((_) {
          setState(() {
            _currentMessageIndex = (_currentMessageIndex + 1) % messages.length;
          });
          Future.delayed(const Duration(milliseconds: 200), () {
            _cycleMessages();
          });
        });
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Animated background
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppTheme.primaryColor.withOpacity(0.3),
                  AppTheme.accentColor.withOpacity(0.3),
                  Colors.purple.withOpacity(0.2),
                  AppTheme.primaryColor.withOpacity(0.2),
                ],
                stops: const [0.0, 0.3, 0.7, 1.0],
              ),
            ),
          ),
          
          // Floating bubbles background
          const FloatingBubblesBackground(),
          
          // Confetti
          Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirection: 1.57, // Down
              particleDrag: 0.05,
              emissionFrequency: 0.3,
              numberOfParticles: 50,
              gravity: 0.3,
              shouldLoop: true,
              colors: [
                AppTheme.primaryColor,
                AppTheme.accentColor,
                Colors.orange,
                Colors.purple,
                Colors.amber,
              ],
            ),
          ),
          
          // Fireworks effect
          AnimatedBuilder(
            animation: _fireworksController,
            builder: (context, child) {
              return CustomPaint(
                painter: FireworksPainter(_fireworksController.value),
                size: Size.infinite,
              );
            },
          ),
          
          // Heart rain effect
          AnimatedBuilder(
            animation: _heartRainController,
            builder: (context, child) {
              return CustomPaint(
                painter: HeartRainPainter(_heartRainController.value),
                size: Size.infinite,
              );
            },
          ),

          // Main content
          CustomScrollView(
            controller: _scrollController,
            slivers: [
              // App bar
              SliverAppBar(
                expandedHeight: 200,
                floating: false,
                pinned: true,
                backgroundColor: Colors.transparent,
                elevation: 0,
                leading: IconButton(
                  icon: Icon(Icons.arrow_back, color: AppTheme.textColor),
                  onPressed: () => Navigator.of(context).pop(),
                ),
                actions: [
                  IconButton(
                    icon: Icon(
                      _isPlaying ? Icons.pause : Icons.play_arrow,
                      color: AppTheme.primaryColor,
                    ),
                    onPressed: () {
                      if (_isPlaying) {
                        AudioService().pauseMusic();
                        _confettiController.stop();
                      } else {
                        AudioService().resumeMusic();
                        _confettiController.play();
                      }
                      setState(() {
                        _isPlaying = !_isPlaying;
                      });
                    },
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  centerTitle: true,
                  title: AnimatedBuilder(
                    animation: _celebrationController,
                    builder: (context, child) {
                      return Transform.scale(
                        scale: 1.0 + (_celebrationController.value * 0.2),
                        child: BubbleAnimationWidget(
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.celebration,
                                color: AppTheme.primaryColor,
                                size: 24,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Celebrate!',
                                style: AppTheme.headingStyle.copyWith(
                                  fontSize: 20,
                                  color: AppTheme.textColor,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Icon(
                                Icons.celebration,
                                color: AppTheme.primaryColor,
                                size: 24,
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                  background: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          AppTheme.primaryColor.withOpacity(0.4),
                          Colors.transparent,
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // Main celebration message
              SliverPadding(
                padding: const EdgeInsets.all(20),
                sliver: SliverToBoxAdapter(
                  child: AnimatedBuilder(
                    animation: _textController,
                    builder: (context, child) {
                      final currentMessage = messages[_currentMessageIndex];
                      return Transform.scale(
                        scale: _textController.value,
                        child: Opacity(
                          opacity: _textController.value,
                          child: BubbleAnimationWidget(
                            child: Container(
                              padding: const EdgeInsets.all(30),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(25),
                                border: Border.all(
                                  color: currentMessage.color.withOpacity(0.5),
                                  width: 2,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: currentMessage.color.withOpacity(0.3),
                                    blurRadius: 20,
                                    spreadRadius: 2,
                                  ),
                                ],
                              ),
                              child: Column(
                                children: [
                                  Icon(
                                    currentMessage.icon,
                                    color: currentMessage.color,
                                    size: 60,
                                  )
                                      .animate(onPlay: (controller) => controller.repeat())
                                      .rotate(duration: 2000.ms)
                                      .then()
                                      .scale(
                                        duration: 500.ms,
                                        begin: const Offset(1.0, 1.0),
                                        end: const Offset(1.2, 1.2),
                                      )
                                      .then()
                                      .scale(
                                        duration: 500.ms,
                                        begin: const Offset(1.2, 1.2),
                                        end: const Offset(1.0, 1.0),
                                      ),
                                  const SizedBox(height: 20),
                                  Text(
                                    currentMessage.text,
                                    style: AppTheme.headingStyle.copyWith(
                                      fontSize: 22,
                                      color: currentMessage.color,
                                      fontWeight: FontWeight.bold,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),

              // Celebration activities
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverToBoxAdapter(
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: _CelebrationCard(
                              icon: Icons.cake,
                              title: 'Virtual Cake',
                              subtitle: 'Make a wish!',
                              color: Colors.orange,
                              onTap: () => _showVirtualCake(),
                            ),
                          ),
                          const SizedBox(width: 15),
                          Expanded(
                            child: _CelebrationCard(
                              icon: Icons.local_florist,
                              title: 'Love Bouquet',
                              subtitle: 'Digital flowers',
                              color: Colors.pink,
                              onTap: () => _showLoveBouquet(),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          Expanded(
                            child: _CelebrationCard(
                              icon: Icons.auto_awesome,
                              title: 'Magic Moment',
                              subtitle: 'Create sparkles',
                              color: Colors.purple,
                              onTap: () => _createSparkles(),
                            ),
                          ),
                          const SizedBox(width: 15),
                          Expanded(
                            child: _CelebrationCard(
                              icon: Icons.rocket_launch,
                              title: 'Love Rocket',
                              subtitle: 'Launch hearts',
                              color: Colors.blue,
                              onTap: () => _launchHearts(),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // Music player
              SliverPadding(
                padding: const EdgeInsets.all(20),
                sliver: SliverToBoxAdapter(
                  child: BubbleAnimationWidget(
                    child: const MusicPlayerWidget(),
                  ),
                ),
              ),

              // Celebration quotes
              SliverPadding(
                padding: const EdgeInsets.all(20),
                sliver: SliverToBoxAdapter(
                  child: BubbleAnimationWidget(
                    child: Container(
                      padding: const EdgeInsets.all(25),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: AppTheme.accentColor.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            Icons.format_quote,
                            color: AppTheme.accentColor,
                            size: 30,
                          ),
                          const SizedBox(height: 15),
                          Text(
                            'Celebration Thoughts',
                            style: AppTheme.headingStyle.copyWith(
                              fontSize: 18,
                              color: AppTheme.accentColor,
                            ),
                          ),
                          const SizedBox(height: 20),
                          ..._buildCelebrationQuotes(),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // Footer
              SliverPadding(
                padding: const EdgeInsets.all(40),
                sliver: SliverToBoxAdapter(
                  child: BubbleAnimationWidget(
                    child: Text(
                      "Every moment with you is a celebration! Let's dance through life together, creating joy and spreading love wherever we go! 🎉💕",
                      style: AppTheme.bodyStyle.copyWith(
                        fontSize: 16,
                        fontStyle: FontStyle.italic,
                        color: AppTheme.primaryColor,
                        height: 1.5,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showVirtualCake() {
    showDialog(
      context: context,
      builder: (context) => const VirtualCakeDialog(),
    );
  }

  void _showLoveBouquet() {
    // Trigger confetti burst
    _confettiController.play();
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(Icons.local_florist, color: Colors.pink),
            const SizedBox(width: 8),
            const Text('💐 Here\'s a beautiful bouquet just for you! 💐'),
          ],
        ),
        backgroundColor: Colors.pink.withOpacity(0.8),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _createSparkles() {
    // Add sparkle animation
    _fireworksController.reset();
    _fireworksController.forward();
  }

  void _launchHearts() {
    // Add heart rain animation
    _heartRainController.reset();
    _heartRainController.forward();
  }

  List<Widget> _buildCelebrationQuotes() {
    final quotes = [
      '"Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day."',
      '"In you, I\'ve found the love of my life and my closest, truest friend."',
      '"The best thing to hold onto in life is each other." - Audrey Hepburn',
      '"Love is composed of a single soul inhabiting two bodies." - Aristotle',
    ];

    return quotes.map((quote) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 10),
        child: Text(
          quote,
          style: AppTheme.bodyStyle.copyWith(
            fontSize: 14,
            fontStyle: FontStyle.italic,
            height: 1.5,
          ),
          textAlign: TextAlign.center,
        ),
      );
    }).toList();
  }
}

class _CelebrationCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _CelebrationCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: BubbleAnimationWidget(
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.1),
            borderRadius: BorderRadius.circular(15),
            border: Border.all(
              color: color.withOpacity(0.3),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: color.withOpacity(0.2),
                blurRadius: 10,
                spreadRadius: 1,
              ),
            ],
          ),
          child: Column(
            children: [
              Icon(
                icon,
                color: color,
                size: 35,
              )
                  .animate(onPlay: (controller) => controller.repeat())
                  .scale(
                    duration: 1500.ms,
                    begin: const Offset(1.0, 1.0),
                    end: const Offset(1.1, 1.1),
                  )
                  .then()
                  .scale(
                    duration: 1500.ms,
                    begin: const Offset(1.1, 1.1),
                    end: const Offset(1.0, 1.0),
                  ),
              const SizedBox(height: 12),
              Text(
                title,
                style: AppTheme.bodyStyle.copyWith(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: AppTheme.bodyStyle.copyWith(
                  fontSize: 12,
                  color: AppTheme.textColor.withOpacity(0.7),
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class VirtualCakeDialog extends StatefulWidget {
  const VirtualCakeDialog({super.key});

  @override
  State<VirtualCakeDialog> createState() => _VirtualCakeDialogState();
}

class _VirtualCakeDialogState extends State<VirtualCakeDialog>
    with TickerProviderStateMixin {
  late AnimationController _cakeController;
  bool _candlesBlown = false;

  @override
  void initState() {
    super.initState();
    _cakeController = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    );
    _cakeController.forward();
  }

  @override
  void dispose() {
    _cakeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      child: Container(
        padding: const EdgeInsets.all(30),
        decoration: BoxDecoration(
          color: AppTheme.backgroundColor.withOpacity(0.95),
          borderRadius: BorderRadius.circular(25),
          border: Border.all(
            color: AppTheme.primaryColor.withOpacity(0.3),
            width: 2,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              '🎂 Virtual Anniversary Cake 🎂',
              style: AppTheme.headingStyle.copyWith(
                fontSize: 20,
                color: AppTheme.primaryColor,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 30),
            AnimatedBuilder(
              animation: _cakeController,
              builder: (context, child) {
                return Transform.scale(
                  scale: _cakeController.value,
                  child: Container(
                    width: 150,
                    height: 150,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.pink.withOpacity(0.8),
                          Colors.brown.withOpacity(0.8),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: Stack(
                      children: [
                        Center(
                          child: Icon(
                            Icons.cake,
                            size: 80,
                            color: Colors.white,
                          ),
                        ),
                        if (!_candlesBlown)
                          Positioned(
                            top: 20,
                            left: 0,
                            right: 0,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: List.generate(3, (index) {
                                return Container(
                                  width: 4,
                                  height: 20,
                                  decoration: BoxDecoration(
                                    color: Colors.orange,
                                    borderRadius: BorderRadius.circular(2),
                                  ),
                                );
                              }),
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 30),
            if (!_candlesBlown) ...[
              Text(
                'Make a wish and blow out the candles!',
                style: AppTheme.bodyStyle.copyWith(fontSize: 14),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _candlesBlown = true;
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25),
                  ),
                ),
                child: const Text('💨 Blow Candles'),
              ),
            ] else ...[
              Text(
                '🎉 Wish granted! Happy Anniversary! 🎉',
                style: AppTheme.bodyStyle.copyWith(
                  fontSize: 16,
                  color: AppTheme.primaryColor,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () => Navigator.of(context).pop(),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.accentColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25),
                  ),
                ),
                child: const Text('Close'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class FireworksPainter extends CustomPainter {
  final double animationValue;

  FireworksPainter(this.animationValue);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.fill;

    final fireworks = [
      FireworkData(
        center: Offset(size.width * 0.2, size.height * 0.3),
        color: Colors.red,
      ),
      FireworkData(
        center: Offset(size.width * 0.8, size.height * 0.2),
        color: Colors.blue,
      ),
      FireworkData(
        center: Offset(size.width * 0.6, size.height * 0.5),
        color: Colors.green,
      ),
      FireworkData(
        center: Offset(size.width * 0.3, size.height * 0.7),
        color: Colors.orange,
      ),
    ];

    for (int i = 0; i < fireworks.length; i++) {
      final firework = fireworks[i];
      final progress = (animationValue + i * 0.25) % 1.0;
      
      if (progress > 0.8) {
        // Explosion phase
        final explosionProgress = (progress - 0.8) / 0.2;
        paint.color = firework.color.withOpacity(1.0 - explosionProgress);
        
        for (int j = 0; j < 12; j++) {
          final angle = (j * 30) * 3.14159 / 180;
          final distance = explosionProgress * 50;
          final sparkle = Offset(
            firework.center.dx + distance * math.cos(angle),
            firework.center.dy + distance * math.sin(angle),
          );
          canvas.drawCircle(sparkle, 3.0, paint);
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

class HeartRainPainter extends CustomPainter {
  final double animationValue;

  HeartRainPainter(this.animationValue);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppTheme.primaryColor.withOpacity(0.7)
      ..style = PaintingStyle.fill;

    // Draw falling hearts
    for (int i = 0; i < 20; i++) {
      final x = (size.width / 20) * i + (animationValue * 50) % 100;
      final y = (animationValue * size.height + i * 100) % (size.height + 100);
      
      _drawHeart(canvas, paint, Offset(x, y), 8.0);
    }
  }

  void _drawHeart(Canvas canvas, Paint paint, Offset center, double size) {
    final path = Path();
    
    // Simple heart shape using circles and triangle
    path.addOval(Rect.fromCircle(center: Offset(center.dx - size/4, center.dy), radius: size/2));
    path.addOval(Rect.fromCircle(center: Offset(center.dx + size/4, center.dy), radius: size/2));
    
    path.moveTo(center.dx - size/2, center.dy + size/4);
    path.lineTo(center.dx, center.dy + size);
    path.lineTo(center.dx + size/2, center.dy + size/4);
    
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

class CelebrationMessage {
  final String text;
  final IconData icon;
  final Color color;

  CelebrationMessage({
    required this.text,
    required this.icon,
    required this.color,
  });
}

class FireworkData {
  final Offset center;
  final Color color;

  FireworkData({
    required this.center,
    required this.color,
  });
}
