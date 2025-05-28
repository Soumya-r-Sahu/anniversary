import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../../core/services/animation_service.dart';

class FloatingBubblesBackground extends StatefulWidget {
  final int bubbleCount;
  final Color bubbleColor;
  final double minRadius;
  final double maxRadius;
  final Duration animationDuration;

  const FloatingBubblesBackground({
    Key? key,
    this.bubbleCount = 15,
    this.bubbleColor = const Color(0x30ec4899),
    this.minRadius = 10.0,
    this.maxRadius = 30.0,
    this.animationDuration = const Duration(seconds: 8),
  }) : super(key: key);

  @override
  State<FloatingBubblesBackground> createState() => _FloatingBubblesBackgroundState();
}

class _FloatingBubblesBackgroundState extends State<FloatingBubblesBackground>
    with TickerProviderStateMixin {
  late List<AnimationController> _controllers;
  late List<Animation<double>> _animations;
  late List<Bubble> _bubbles;
  final AnimationService _animationService = AnimationService();

  @override
  void initState() {
    super.initState();
    _initializeBubbles();
  }

  void _initializeBubbles() {
    final random = math.Random();
    final bubbleCount = _animationService.shouldReduceAnimations 
        ? (widget.bubbleCount * 0.5).round() 
        : widget.bubbleCount;

    _controllers = List.generate(
      bubbleCount,
      (index) => AnimationController(
        duration: Duration(
          milliseconds: widget.animationDuration.inMilliseconds + 
            random.nextInt(3000),
        ),
        vsync: this,
      ),
    );

    _animations = _controllers.map((controller) {
      return Tween<double>(begin: 0, end: 1).animate(
        CurvedAnimation(
          parent: controller,
          curve: Curves.linear,
        ),
      );
    }).toList();

    _bubbles = List.generate(bubbleCount, (index) {
      return Bubble(
        x: random.nextDouble(),
        y: 1.0 + random.nextDouble() * 0.1,
        radius: widget.minRadius + 
          random.nextDouble() * (widget.maxRadius - widget.minRadius),
        speed: 0.5 + random.nextDouble() * 0.5,
      );
    });

    // Start animations with staggered delays
    for (int i = 0; i < _controllers.length; i++) {
      Future.delayed(Duration(milliseconds: i * 200), () {
        if (mounted) {
          _controllers[i].repeat();
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_animationService.shouldReduceAnimations) {
      return Container(); // Skip animations for accessibility
    }

    return Positioned.fill(
      child: CustomPaint(
        painter: BubblePainter(
          animations: _animations,
          bubbles: _bubbles,
          color: widget.bubbleColor,
        ),
      ),
    );
  }

  @override
  void dispose() {
    for (final controller in _controllers) {
      controller.dispose();
    }
    super.dispose();
  }
}

class Bubble {
  final double x;
  final double y;
  final double radius;
  final double speed;

  Bubble({
    required this.x,
    required this.y,
    required this.radius,
    required this.speed,
  });
}

class BubblePainter extends CustomPainter {
  final List<Animation<double>> animations;
  final List<Bubble> bubbles;
  final Color color;

  BubblePainter({
    required this.animations,
    required this.bubbles,
    required this.color,
  }) : super(repaint: Listenable.merge(animations));

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    for (int i = 0; i < bubbles.length && i < animations.length; i++) {
      final bubble = bubbles[i];
      final animation = animations[i];
      
      final x = bubble.x * size.width;
      final y = size.height - (animation.value * size.height * bubble.speed) + 
        (bubble.y * size.height);
      
      if (y < -bubble.radius) continue;
      
      final opacity = (1.0 - animation.value).clamp(0.0, 1.0);
      paint.color = color.withOpacity(opacity * color.opacity);
      
      canvas.drawCircle(
        Offset(x, y),
        bubble.radius,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
