import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../shared/widgets/floating_bubbles.dart';
import '../../../shared/widgets/bubble_animation.dart';
import '../../../shared/widgets/music_player.dart';
import '../../../shared/themes/app_theme.dart';
import '../../../services/audio_service.dart';

class AnniversaryPage extends ConsumerStatefulWidget {
  const AnniversaryPage({super.key});

  @override
  ConsumerState<AnniversaryPage> createState() => _AnniversaryPageState();
}

class _AnniversaryPageState extends ConsumerState<AnniversaryPage>
    with TickerProviderStateMixin {
  late AnimationController _heartController;
  late AnimationController _sparkleController;
  late AnimationController _textController;
  late AnimationController _cardController;
  
  final ScrollController _scrollController = ScrollController();
  
  final DateTime anniversaryDate = DateTime(2022, 9, 15); // Wedding date
  final DateTime relationshipStart = DateTime(2020, 3, 15); // First meeting
  
  @override
  void initState() {
    super.initState();
    
    _heartController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat();
    
    _sparkleController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat();
    
    _textController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    
    _cardController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    
    // Start animations
    Future.delayed(const Duration(milliseconds: 500), () {
      _textController.forward();
    });
    
    Future.delayed(const Duration(milliseconds: 800), () {
      _cardController.forward();
    });
    
    // Play anniversary music
    _playAnniversaryMusic();
  }
  
  @override
  void dispose() {
    _heartController.dispose();
    _sparkleController.dispose();
    _textController.dispose();
    _cardController.dispose();
    _scrollController.dispose();
    super.dispose();
  }
  
  void _playAnniversaryMusic() async {
    try {
      await AudioService().playMusic('our_song.mp3');
    } catch (e) {
      // Handle error silently
    }
  }
  
  int get daysTogether {
    return DateTime.now().difference(relationshipStart).inDays;
  }
  
  int get daysMarried {
    return DateTime.now().difference(anniversaryDate).inDays;
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
                  AppTheme.primaryColor.withOpacity(0.2),
                  AppTheme.accentColor.withOpacity(0.2),
                  AppTheme.primaryColor.withOpacity(0.1),
                ],
              ),
            ),
          ),
          
          // Floating bubbles background
          const FloatingBubblesBackground(),
          
          // Sparkle effects
          AnimatedBuilder(
            animation: _sparkleController,
            builder: (context, child) {
              return CustomPaint(
                painter: SparklePainter(_sparkleController.value),
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
                expandedHeight: 250,
                floating: false,
                pinned: true,
                backgroundColor: Colors.transparent,
                elevation: 0,
                leading: IconButton(
                  icon: Icon(Icons.arrow_back, color: AppTheme.textColor),
                  onPressed: () => Navigator.of(context).pop(),
                ),
                flexibleSpace: FlexibleSpaceBar(
                  centerTitle: true,
                  title: AnimatedBuilder(
                    animation: _heartController,
                    builder: (context, child) {
                      return Transform.scale(
                        scale: 1.0 + ((_heartController.value * 2) % 1) * 0.1,
                        child: BubbleAnimationWidget(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.favorite,
                                    color: AppTheme.primaryColor,
                                    size: 24,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Anniversary',
                                    style: AppTheme.headingStyle.copyWith(
                                      fontSize: 20,
                                      color: AppTheme.textColor,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Icon(
                                    Icons.favorite,
                                    color: AppTheme.primaryColor,
                                    size: 24,
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'September 15, 2022',
                                style: AppTheme.bodyStyle.copyWith(
                                  fontSize: 14,
                                  color: AppTheme.accentColor,
                                ),
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

              // Anniversary message
              SliverPadding(
                padding: const EdgeInsets.all(20),
                sliver: SliverToBoxAdapter(
                  child: AnimatedBuilder(
                    animation: _textController,
                    builder: (context, child) {
                      return Transform.translate(
                        offset: Offset(0, 50 * (1 - _textController.value)),
                        child: Opacity(
                          opacity: _textController.value,
                          child: BubbleAnimationWidget(
                            child: Container(
                              padding: const EdgeInsets.all(30),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: AppTheme.primaryColor.withOpacity(0.3),
                                  width: 1,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppTheme.primaryColor.withOpacity(0.1),
                                    blurRadius: 20,
                                    spreadRadius: 2,
                                  ),
                                ],
                              ),
                              child: Column(
                                children: [
                                  Icon(
                                    Icons.favorite,
                                    color: AppTheme.primaryColor,
                                    size: 50,
                                  )
                                      .animate(onPlay: (controller) => controller.repeat())
                                      .scale(
                                        duration: 1500.ms,
                                        begin: const Offset(1.0, 1.0),
                                        end: const Offset(1.3, 1.3),
                                      )
                                      .then()
                                      .scale(
                                        duration: 1500.ms,
                                        begin: const Offset(1.3, 1.3),
                                        end: const Offset(1.0, 1.0),
                                      ),
                                  const SizedBox(height: 20),
                                  Text(
                                    'Happy Anniversary, My Love!',
                                    style: AppTheme.headingStyle.copyWith(
                                      fontSize: 24,
                                      color: AppTheme.primaryColor,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                  const SizedBox(height: 20),
                                  Text(
                                    'Today marks another year of our beautiful journey together. From the moment we said "I do," every day has been a new adventure filled with love, laughter, and endless joy. You are my heart, my soul, my everything.',
                                    style: AppTheme.bodyStyle.copyWith(
                                      fontSize: 16,
                                      height: 1.6,
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

              // Stats cards
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverToBoxAdapter(
                  child: AnimatedBuilder(
                    animation: _cardController,
                    builder: (context, child) {
                      return Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Transform.translate(
                                  offset: Offset(
                                    -100 * (1 - _cardController.value),
                                    0,
                                  ),
                                  child: Opacity(
                                    opacity: _cardController.value,
                                    child: _StatCard(
                                      icon: Icons.calendar_today,
                                      title: 'Days Together',
                                      value: daysTogether.toString(),
                                      subtitle: 'Since we first met',
                                      color: AppTheme.primaryColor,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 15),
                              Expanded(
                                child: Transform.translate(
                                  offset: Offset(
                                    100 * (1 - _cardController.value),
                                    0,
                                  ),
                                  child: Opacity(
                                    opacity: _cardController.value,
                                    child: _StatCard(
                                      icon: Icons.favorite,
                                      title: 'Days Married',
                                      value: daysMarried.toString(),
                                      subtitle: 'As husband & wife',
                                      color: AppTheme.accentColor,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          Row(
                            children: [
                              Expanded(
                                child: Transform.translate(
                                  offset: Offset(
                                    -100 * (1 - _cardController.value),
                                    0,
                                  ),
                                  child: Opacity(
                                    opacity: _cardController.value,
                                    child: _StatCard(
                                      icon: Icons.celebration,
                                      title: 'Anniversaries',
                                      value: (DateTime.now().year - anniversaryDate.year + 1).toString(),
                                      subtitle: 'Years celebrated',
                                      color: AppTheme.primaryColor.withOpacity(0.8),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 15),
                              Expanded(
                                child: Transform.translate(
                                  offset: Offset(
                                    100 * (1 - _cardController.value),
                                    0,
                                  ),
                                  child: Opacity(
                                    opacity: _cardController.value,
                                    child: _StatCard(
                                      icon: Icons.auto_awesome,
                                      title: 'Infinite',
                                      value: '∞',
                                      subtitle: 'Love & happiness',
                                      color: AppTheme.accentColor.withOpacity(0.8),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      );
                    },
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

              // Anniversary promises
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
                          color: AppTheme.primaryColor.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            Icons.auto_awesome,
                            color: AppTheme.primaryColor,
                            size: 35,
                          ),
                          const SizedBox(height: 15),
                          Text(
                            'My Anniversary Promises',
                            style: AppTheme.headingStyle.copyWith(
                              fontSize: 20,
                              color: AppTheme.primaryColor,
                            ),
                          ),
                          const SizedBox(height: 20),
                          ..._buildPromisesList(),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // Future dreams
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
                            Icons.rocket_launch,
                            color: AppTheme.accentColor,
                            size: 35,
                          ),
                          const SizedBox(height: 15),
                          Text(
                            'Our Future Dreams',
                            style: AppTheme.headingStyle.copyWith(
                              fontSize: 20,
                              color: AppTheme.accentColor,
                            ),
                          ),
                          const SizedBox(height: 20),
                          ..._buildDreamsList(),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // Final message
              SliverPadding(
                padding: const EdgeInsets.all(40),
                sliver: SliverToBoxAdapter(
                  child: BubbleAnimationWidget(
                    child: Text(
                      "Here's to many more years of love, adventure, and beautiful memories together. I love you more than words can express! 💕",
                      style: AppTheme.bodyStyle.copyWith(
                        fontSize: 18,
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
  
  List<Widget> _buildPromisesList() {
    final promises = [
      'To love you more each day than the day before',
      'To always listen with my heart and speak with kindness',
      'To support your dreams as if they were my own',
      'To laugh with you, cry with you, and grow with you',
      'To choose us, every single day, for the rest of my life',
    ];
    
    return promises.asMap().entries.map((entry) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              margin: const EdgeInsets.only(top: 4, right: 12),
              width: 6,
              height: 6,
              decoration: BoxDecoration(
                color: AppTheme.primaryColor,
                shape: BoxShape.circle,
              ),
            ),
            Expanded(
              child: Text(
                entry.value,
                style: AppTheme.bodyStyle.copyWith(
                  fontSize: 14,
                  height: 1.4,
                ),
              ),
            ),
          ],
        ),
      );
    }).toList();
  }
  
  List<Widget> _buildDreamsList() {
    final dreams = [
      'Travel the world together, creating memories in every corner',
      'Build a beautiful family filled with love and laughter',
      'Grow old together, still holding hands at 80',
      'Create a home that\'s a sanctuary for our love',
      'Continue to fall in love with each other every single day',
    ];
    
    return dreams.asMap().entries.map((entry) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              margin: const EdgeInsets.only(top: 4, right: 12),
              width: 6,
              height: 6,
              decoration: BoxDecoration(
                color: AppTheme.accentColor,
                shape: BoxShape.circle,
              ),
            ),
            Expanded(
              child: Text(
                entry.value,
                style: AppTheme.bodyStyle.copyWith(
                  fontSize: 14,
                  height: 1.4,
                ),
              ),
            ),
          ],
        ),
      );
    }).toList();
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final String subtitle;
  final Color color;

  const _StatCard({
    required this.icon,
    required this.title,
    required this.value,
    required this.subtitle,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return BubbleAnimationWidget(
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
              color: color.withOpacity(0.1),
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
              size: 30,
            ),
            const SizedBox(height: 12),
            Text(
              value,
              style: AppTheme.headingStyle.copyWith(
                fontSize: 28,
                color: color,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: AppTheme.bodyStyle.copyWith(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppTheme.textColor,
              ),
            ),
            Text(
              subtitle,
              style: AppTheme.bodyStyle.copyWith(
                fontSize: 10,
                color: AppTheme.textColor.withOpacity(0.7),
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class SparklePainter extends CustomPainter {
  final double animationValue;

  SparklePainter(this.animationValue);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppTheme.primaryColor.withOpacity(0.6)
      ..style = PaintingStyle.fill;

    // Draw sparkles at various positions
    final sparkles = [
      Offset(size.width * 0.1, size.height * 0.2),
      Offset(size.width * 0.8, size.height * 0.15),
      Offset(size.width * 0.2, size.height * 0.7),
      Offset(size.width * 0.9, size.height * 0.6),
      Offset(size.width * 0.3, size.height * 0.4),
      Offset(size.width * 0.7, size.height * 0.8),
    ];

    for (int i = 0; i < sparkles.length; i++) {
      final opacity = (animationValue + i * 0.2) % 1.0;
      paint.color = AppTheme.primaryColor.withOpacity(opacity * 0.6);
      
      final sparkleSize = 3.0 + (opacity * 2.0);
      canvas.drawCircle(sparkles[i], sparkleSize, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
