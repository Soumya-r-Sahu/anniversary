import 'package:flutter/material.dart';
import 'dart:math' as math;

class BubbleAnimation extends StatefulWidget {
  final Color color;
  final double size;
  final Duration duration;
  final bool autoPlay;
  final VoidCallback? onTap;

  const BubbleAnimation({
    super.key,
    this.color = Colors.pink,
    this.size = 50.0,
    this.duration = const Duration(seconds: 2),
    this.autoPlay = true,
    this.onTap,
  });

  @override
  State<BubbleAnimation> createState() => _BubbleAnimationState();
}

class _BubbleAnimationState extends State<BubbleAnimation>
    with TickerProviderStateMixin {
  late AnimationController _controller;
  late AnimationController _floatController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;
  late Animation<double> _floatAnimation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
    );

    _floatController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.elasticOut,
    ));

    _opacityAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.0, 0.5, curve: Curves.easeIn),
    ));

    _floatAnimation = Tween<double>(
      begin: 0.0,
      end: -20.0,
    ).animate(CurvedAnimation(
      parent: _floatController,
      curve: Curves.easeInOut,
    ));

    if (widget.autoPlay) {
      _controller.forward();
      _floatController.repeat(reverse: true);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _floatController.dispose();
    super.dispose();
  }

  void _animateBubble() {
    if (_controller.isCompleted) {
      _controller.reverse().then((_) {
        _controller.forward();
      });
    } else {
      _controller.forward();
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        _animateBubble();
        widget.onTap?.call();
      },
      child: AnimatedBuilder(
        animation: Listenable.merge([_controller, _floatController]),
        builder: (context, child) {
          return Transform.translate(
            offset: Offset(0, _floatAnimation.value),
            child: Transform.scale(
              scale: _scaleAnimation.value,
              child: Opacity(
                opacity: _opacityAnimation.value,
                child: Container(
                  width: widget.size,
                  height: widget.size,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [
                        widget.color.withOpacity(0.8),
                        widget.color.withOpacity(0.4),
                        widget.color.withOpacity(0.1),
                      ],
                      stops: const [0.0, 0.7, 1.0],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: widget.color.withOpacity(0.3),
                        blurRadius: 10,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.favorite,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class HeartBubble extends StatefulWidget {
  final Color color;
  final double size;
  final Duration duration;

  const HeartBubble({
    super.key,
    this.color = Colors.red,
    this.size = 30.0,
    this.duration = const Duration(seconds: 2),
  });

  @override
  State<HeartBubble> createState() => _HeartBubbleState();
}

class _HeartBubbleState extends State<HeartBubble>
    with TickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 0.5,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.elasticInOut,
    ));

    _rotationAnimation = Tween<double>(
      begin: 0.0,
      end: 2 * math.pi,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.linear,
    ));

    _controller.repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: Transform.rotate(
            angle: _rotationAnimation.value * 0.1, // Subtle rotation
            child: Icon(
              Icons.favorite,
              color: widget.color,
              size: widget.size,
            ),
          ),
        );
      },
    );
  }
}

class PoppingBubble extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final VoidCallback? onComplete;

  const PoppingBubble({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 600),
    this.onComplete,
  });

  @override
  State<PoppingBubble> createState() => _PoppingBubbleState();
}

class _PoppingBubbleState extends State<PoppingBubble>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInBack,
    ));

    _opacityAnimation = Tween<double>(
      begin: 1.0,
      end: 0.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.5, 1.0, curve: Curves.easeOut),
    ));

    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        widget.onComplete?.call();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void pop() {
    _controller.forward();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: pop,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: Opacity(
              opacity: _opacityAnimation.value,
              child: widget.child,
            ),
          );
        },
      ),
    );
  }
}

class BubbleTrail extends StatefulWidget {
  final Widget child;
  final int bubbleCount;
  final Duration trailDuration;
  final List<Color> bubbleColors;

  const BubbleTrail({
    super.key,
    required this.child,
    this.bubbleCount = 5,
    this.trailDuration = const Duration(seconds: 3),
    this.bubbleColors = const [
      Colors.pink,
      Colors.red,
      Colors.purple,
      Colors.deepPurple,
    ],
  });

  @override
  State<BubbleTrail> createState() => _BubbleTrailState();
}

class _BubbleTrailState extends State<BubbleTrail>
    with TickerProviderStateMixin {
  late List<AnimationController> _controllers;
  late List<Animation<Offset>> _positionAnimations;
  late List<Animation<double>> _opacityAnimations;
  final List<Offset> _bubblePositions = [];

  @override
  void initState() {
    super.initState();

    _controllers = List.generate(
      widget.bubbleCount,
      (index) => AnimationController(
        duration: widget.trailDuration,
        vsync: this,
      ),
    );

    _positionAnimations = _controllers.map((controller) {
      return Tween<Offset>(
        begin: Offset.zero,
        end: Offset(
          (math.Random().nextDouble() - 0.5) * 200,
          -100 - math.Random().nextDouble() * 100,
        ),
      ).animate(CurvedAnimation(
        parent: controller,
        curve: Curves.easeOut,
      ));
    }).toList();

    _opacityAnimations = _controllers.map((controller) {
      return Tween<double>(
        begin: 1.0,
        end: 0.0,
      ).animate(CurvedAnimation(
        parent: controller,
        curve: const Interval(0.7, 1.0, curve: Curves.easeOut),
      ));
    }).toList();

    for (int i = 0; i < widget.bubbleCount; i++) {
      _bubblePositions.add(Offset.zero);
    }
  }

  @override
  void dispose() {
    for (final controller in _controllers) {
      controller.dispose();
    }
    super.dispose();
  }

  void _createBubbleTrail() {
    for (int i = 0; i < _controllers.length; i++) {
      Future.delayed(Duration(milliseconds: i * 100), () {
        if (mounted) {
          _controllers[i].forward().then((_) {
            _controllers[i].reset();
          });
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _createBubbleTrail,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          widget.child,
          ...List.generate(widget.bubbleCount, (index) {
            return AnimatedBuilder(
              animation: _controllers[index],
              builder: (context, child) {
                return Positioned(
                  left: _positionAnimations[index].value.dx,
                  top: _positionAnimations[index].value.dy,
                  child: Opacity(
                    opacity: _opacityAnimations[index].value,
                    child: Container(
                      width: 20 - (index * 2),
                      height: 20 - (index * 2),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: widget
                            .bubbleColors[index % widget.bubbleColors.length],
                      ),
                    ),
                  ),
                );
              },
            );
          }),
        ],
      ),
    );
  }
}
