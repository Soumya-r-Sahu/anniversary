import 'package:flutter/material.dart';
import 'dart:math' as math;

class FloatingBubbles extends StatefulWidget {
  final int numberOfBubbles;
  final double minBubbleSize;
  final double maxBubbleSize;
  final List<Color> bubbleColors;
  final Duration animationDuration;
  final Widget? child;

  const FloatingBubbles({
    super.key,
    this.numberOfBubbles = 20,
    this.minBubbleSize = 10.0,
    this.maxBubbleSize = 30.0,
    this.bubbleColors = const [
      Colors.pink,
      Colors.red,
      Colors.purple,
      Colors.deepPurple,
      Colors.blue,
    ],
    this.animationDuration = const Duration(seconds: 10),
    this.child,
  });

  @override
  State<FloatingBubbles> createState() => _FloatingBubblesState();
}

class _FloatingBubblesState extends State<FloatingBubbles>
    with TickerProviderStateMixin {
  late List<BubbleData> _bubbles;
  late List<AnimationController> _controllers;

  @override
  void initState() {
    super.initState();
    _initializeBubbles();
  }

  void _initializeBubbles() {
    _bubbles = [];
    _controllers = [];

    for (int i = 0; i < widget.numberOfBubbles; i++) {
      final controller = AnimationController(
        duration: Duration(
          milliseconds: widget.animationDuration.inMilliseconds +
              math.Random().nextInt(5000),
        ),
        vsync: this,
      );

      _controllers.add(controller);

      final bubble = BubbleData(
        position: Offset(
          math.Random().nextDouble(),
          math.Random().nextDouble(),
        ),
        size: widget.minBubbleSize +
            math.Random().nextDouble() *
                (widget.maxBubbleSize - widget.minBubbleSize),
        color: widget
            .bubbleColors[math.Random().nextInt(widget.bubbleColors.length)],
        speed: 0.1 + math.Random().nextDouble() * 0.3,
        direction: math.Random().nextDouble() * 2 * math.pi,
        opacity: 0.3 + math.Random().nextDouble() * 0.4,
        controller: controller,
      );

      _bubbles.add(bubble);

      // Start animation with random delay
      Future.delayed(
        Duration(milliseconds: math.Random().nextInt(2000)),
        () {
          if (mounted) {
            controller.repeat();
          }
        },
      );
    }
  }

  @override
  void dispose() {
    for (final controller in _controllers) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Stack(
          children: [
            // Background child widget
            if (widget.child != null) widget.child!,

            // Floating bubbles
            ...List.generate(widget.numberOfBubbles, (index) {
              return AnimatedBuilder(
                animation: _bubbles[index].controller,
                builder: (context, child) {
                  return _BubbleWidget(
                    bubble: _bubbles[index],
                    constraints: constraints,
                  );
                },
              );
            }),
          ],
        );
      },
    );
  }
}

class _BubbleWidget extends StatelessWidget {
  final BubbleData bubble;
  final BoxConstraints constraints;

  const _BubbleWidget({
    required this.bubble,
    required this.constraints,
  });

  @override
  Widget build(BuildContext context) {
    // Calculate animated position
    final animationValue = bubble.controller.value;
    final floatOffset = math.sin(animationValue * 2 * math.pi) * 20;
    final driftOffset = animationValue * bubble.speed * 100;

    double x = (bubble.position.dx * constraints.maxWidth +
            math.cos(bubble.direction) * driftOffset) %
        (constraints.maxWidth + bubble.size);
    double y = (bubble.position.dy * constraints.maxHeight +
            math.sin(bubble.direction) * driftOffset +
            floatOffset) %
        (constraints.maxHeight + bubble.size);

    // Wrap around screen edges
    if (x > constraints.maxWidth) x = -bubble.size;
    if (y > constraints.maxHeight) y = -bubble.size;

    return Positioned(
      left: x,
      top: y,
      child: Container(
        width: bubble.size,
        height: bubble.size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            colors: [
              bubble.color.withOpacity(bubble.opacity),
              bubble.color.withOpacity(bubble.opacity * 0.5),
              bubble.color.withOpacity(bubble.opacity * 0.1),
            ],
            stops: const [0.0, 0.7, 1.0],
          ),
          boxShadow: [
            BoxShadow(
              color: bubble.color.withOpacity(0.2),
              blurRadius: bubble.size * 0.3,
              spreadRadius: 1,
            ),
          ],
        ),
      ),
    );
  }
}

class BubbleData {
  final Offset position;
  final double size;
  final Color color;
  final double speed;
  final double direction;
  final double opacity;
  final AnimationController controller;

  BubbleData({
    required this.position,
    required this.size,
    required this.color,
    required this.speed,
    required this.direction,
    required this.opacity,
    required this.controller,
  });
}

class InteractiveBubbles extends StatefulWidget {
  final Widget child;
  final int bubblesPerTap;
  final Duration bubbleDuration;
  final List<Color> bubbleColors;

  const InteractiveBubbles({
    super.key,
    required this.child,
    this.bubblesPerTap = 5,
    this.bubbleDuration = const Duration(seconds: 2),
    this.bubbleColors = const [
      Colors.pink,
      Colors.red,
      Colors.purple,
    ],
  });

  @override
  State<InteractiveBubbles> createState() => _InteractiveBubblesState();
}

class _InteractiveBubblesState extends State<InteractiveBubbles>
    with TickerProviderStateMixin {
  final List<TapBubble> _tapBubbles = [];

  void _createBubblesAtPosition(Offset position) {
    for (int i = 0; i < widget.bubblesPerTap; i++) {
      final controller = AnimationController(
        duration: widget.bubbleDuration,
        vsync: this,
      );

      final bubble = TapBubble(
        position: position,
        size: 10 + math.Random().nextDouble() * 20,
        color: widget
            .bubbleColors[math.Random().nextInt(widget.bubbleColors.length)],
        direction: Offset(
          (math.Random().nextDouble() - 0.5) * 200,
          -50 - math.Random().nextDouble() * 100,
        ),
        controller: controller,
      );

      setState(() {
        _tapBubbles.add(bubble);
      });

      controller.forward().then((_) {
        setState(() {
          _tapBubbles.remove(bubble);
        });
        controller.dispose();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (details) {
        _createBubblesAtPosition(details.localPosition);
      },
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          widget.child,
          ..._tapBubbles.map((bubble) => _TapBubbleWidget(bubble: bubble)),
        ],
      ),
    );
  }
}

class _TapBubbleWidget extends StatelessWidget {
  final TapBubble bubble;

  const _TapBubbleWidget({required this.bubble});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: bubble.controller,
      builder: (context, child) {
        final value = bubble.controller.value;
        final scale = 1.0 - (value * 0.5);
        final opacity = 1.0 - value;

        return Positioned(
          left: bubble.position.dx + (bubble.direction.dx * value),
          top: bubble.position.dy + (bubble.direction.dy * value),
          child: Transform.scale(
            scale: scale,
            child: Opacity(
              opacity: opacity,
              child: Container(
                width: bubble.size,
                height: bubble.size,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      bubble.color.withOpacity(0.8),
                      bubble.color.withOpacity(0.4),
                      bubble.color.withOpacity(0.1),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

class TapBubble {
  final Offset position;
  final double size;
  final Color color;
  final Offset direction;
  final AnimationController controller;

  TapBubble({
    required this.position,
    required this.size,
    required this.color,
    required this.direction,
    required this.controller,
  });
}

class BubbleTheme {
  static const List<Color> romantic = [
    Color(0xFFFF69B4), // Hot Pink
    Color(0xFFFF1493), // Deep Pink
    Color(0xFFDC143C), // Crimson
    Color(0xFFDA70D6), // Orchid
    Color(0xFFBA55D3), // Medium Orchid
  ];

  static const List<Color> dreamy = [
    Color(0xFFE6E6FA), // Lavender
    Color(0xFFDDA0DD), // Plum
    Color(0xFFD8BFD8), // Thistle
    Color(0xFFB19CD9), // Light Purple
    Color(0xFF9370DB), // Medium Purple
  ];

  static const List<Color> sunset = [
    Color(0xFFFF6347), // Tomato
    Color(0xFFFF4500), // Orange Red
    Color(0xFFFFD700), // Gold
    Color(0xFFFF8C00), // Dark Orange
    Color(0xFFFF7F50), // Coral
  ];

  static const List<Color> ocean = [
    Color(0xFF00CED1), // Dark Turquoise
    Color(0xFF48CAE4), // Sky Blue
    Color(0xFF0077BE), // Ocean Blue
    Color(0xFF023E8A), // Navy Blue
    Color(0xFF90E0EF), // Light Blue
  ];
}
