import 'package:flutter/material.dart';
import 'dart:async';
import '../services/services.dart';
import '../widgets/widgets.dart';

class CountdownPage extends StatefulWidget {
  final DateTime anniversaryDate;
  
  const CountdownPage({
    super.key,
    required this.anniversaryDate,
  });

  @override
  State<CountdownPage> createState() => _CountdownPageState();
}

class _CountdownPageState extends State<CountdownPage>
    with TickerProviderStateMixin {
  final DateCalculationService _dateService = DateCalculationService();
  late Timer _timer;
  late AnimationController _pulseController;
  
  AnniversaryDuration? _timeUntilNext;
  bool _isAnniversaryToday = false;

  @override
  void initState() {
    super.initState();
    
    _pulseController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
    
    _updateCountdown();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) => _updateCountdown());
  }

  void _updateCountdown() {
    setState(() {
      _timeUntilNext = _dateService.calculateTimeUntilNextAnniversary(widget.anniversaryDate);
      _isAnniversaryToday = _dateService.isAnniversaryToday(widget.anniversaryDate);
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Anniversary Countdown'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: theme.colorScheme.primary,
      ),
      body: FloatingBubbles(
        numberOfBubbles: 25,
        bubbleColors: BubbleTheme.romantic,
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                const SizedBox(height: 20),
                
                // Main Countdown Display
                if (_isAnniversaryToday)
                  _buildAnniversaryToday(theme)
                else if (_timeUntilNext != null)
                  _buildCountdownDisplay(theme),
                
                const SizedBox(height: 40),
                
                // Celebration Animation
                _buildCelebrationSection(theme),
                
                const SizedBox(height: 40),
                
                // Progress Visualization
                _buildProgressSection(theme),
                
                const SizedBox(height: 40),
                
                // Motivational Messages
                _buildMotivationalSection(theme),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAnniversaryToday(ThemeData theme) {
    return RomanticCard(
      addGlow: true,
      backgroundColor: Colors.pink.shade50,
      child: Column(
        children: [
          AnimatedBuilder(
            animation: _pulseController,
            builder: (context, child) {
              return Transform.scale(
                scale: 1.0 + (_pulseController.value * 0.1),
                child: Text(
                  '🎉',
                  style: TextStyle(fontSize: 80),
                ),
              );
            },
          ),
          const SizedBox(height: 20),
          ShimmerText(
            text: 'Happy Anniversary!',
            style: theme.textTheme.headlineLarge?.copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.pink.shade700,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Today marks another beautiful year of your love story! 💕',
            style: theme.textTheme.bodyLarge?.copyWith(
              color: Colors.pink.shade600,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              HeartIcon(size: 40, animate: true),
              HeartIcon(size: 40, animate: true),
              HeartIcon(size: 40, animate: true),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCountdownDisplay(ThemeData theme) {
    return RomanticCard(
      addGlow: true,
      child: Column(
        children: [
          Text(
            'Next Anniversary In',
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.pink.shade700,
            ),
          ),
          const SizedBox(height: 30),
          
          // Large countdown digits
          if (_timeUntilNext!.days > 0)
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CountdownDigit(
                  digit: _timeUntilNext!.days.toString().padLeft(2, '0'),
                  label: 'Days',
                  size: 1.2,
                ),
              ],
            ),
          
          const SizedBox(height: 20),
          
          // Smaller time units
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              CountdownDigit(
                digit: _timeUntilNext!.hours.toString().padLeft(2, '0'),
                label: 'Hours',
                size: 0.9,
              ),
              CountdownDigit(
                digit: _timeUntilNext!.minutes.toString().padLeft(2, '0'),
                label: 'Minutes',
                size: 0.9,
              ),
              CountdownDigit(
                digit: _timeUntilNext!.seconds.toString().padLeft(2, '0'),
                label: 'Seconds',
                size: 0.9,
              ),
            ],
          ),
          
          const SizedBox(height: 20),
          
          Text(
            'Until your special day arrives! 💖',
            style: theme.textTheme.bodyLarge?.copyWith(
              color: Colors.pink.shade600,
              fontStyle: FontStyle.italic,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildCelebrationSection(ThemeData theme) {
    return RomanticCard(
      animationDelay: const Duration(milliseconds: 300),
      child: Column(
        children: [
          Text(
            'Celebration Mode',
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.primary,
            ),
          ),
          const SizedBox(height: 20),
          
          // Interactive bubbles area
          Container(
            height: 200,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.pink.shade50,
                  Colors.purple.shade50,
                ],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: InteractiveBubbles(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Tap anywhere to celebrate! 🎈',
                      style: theme.textTheme.titleMedium?.copyWith(
                        color: Colors.pink.shade700,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        BubbleAnimation(
                          color: Colors.pink,
                          size: 50,
                          duration: const Duration(seconds: 2),
                        ),
                        BubbleAnimation(
                          color: Colors.purple,
                          size: 45,
                          duration: const Duration(milliseconds: 1800),
                        ),
                        BubbleAnimation(
                          color: Colors.red,
                          size: 55,
                          duration: const Duration(seconds: 2, milliseconds: 200),
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
    );
  }

  Widget _buildProgressSection(ThemeData theme) {
    final totalDaysInYear = 365;
    final daysUntilAnniversary = _timeUntilNext?.days ?? 0;
    final progress = 1.0 - (daysUntilAnniversary / totalDaysInYear);
    
    return RomanticCard(
      animationDelay: const Duration(milliseconds: 600),
      child: Column(
        children: [
          Text(
            'Progress This Year',
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.primary,
            ),
          ),
          const SizedBox(height: 20),
          
          LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.pink.shade100,
            valueColor: AlwaysStoppedAnimation<Color>(Colors.pink),
            minHeight: 8,
          ),
          
          const SizedBox(height: 12),
          
          Text(
            '${(progress * 100).toInt()}% of the year has passed',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: Colors.grey.shade600,
            ),
          ),
          
          const SizedBox(height: 20),
          
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.pink.shade100, Colors.purple.shade100],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Icon(Icons.calendar_today, color: Colors.pink.shade700),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Your anniversary date: ${widget.anniversaryDate.day}/${widget.anniversaryDate.month}',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                      color: Colors.pink.shade700,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMotivationalSection(ThemeData theme) {
    final messages = [
      "Every day together is a gift 💝",
      "Love grows stronger with time 🌱",
      "Your story is beautiful and unique 📖",
      "Celebrating love, one day at a time ⭐",
      "Together is a wonderful place to be 🏠",
    ];
    
    final randomMessage = messages[DateTime.now().day % messages.length];
    
    return RomanticCard(
      animationDelay: const Duration(milliseconds: 900),
      backgroundColor: Colors.purple.shade50,
      child: Column(
        children: [
          Icon(
            Icons.format_quote,
            color: Colors.purple.shade400,
            size: 40,
          ),
          const SizedBox(height: 16),
          Text(
            randomMessage,
            style: theme.textTheme.titleMedium?.copyWith(
              color: Colors.purple.shade700,
              fontStyle: FontStyle.italic,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              5,
              (index) => Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: HeartIcon(
                  size: 20,
                  animate: false,
                  color: Colors.purple.shade300,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
