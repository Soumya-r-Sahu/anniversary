import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/services/animation_service.dart';

class BubbleAnimationWidget extends StatefulWidget {
  final Widget child;
  final Duration? duration;
  final bool autoStart;
  final VoidCallback? onComplete;

  const BubbleAnimationWidget({
    Key? key,
    required this.child,
    this.duration,
    this.autoStart = true,
    this.onComplete,
  }) : super(key: key);

  @override
  State<BubbleAnimationWidget> createState() => _BubbleAnimationWidgetState();
}

class _BubbleAnimationWidgetState extends State<BubbleAnimationWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final AnimationService _animationService = AnimationService();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.duration ?? const Duration(milliseconds: 1000),
      vsync: this,
    );

    if (widget.autoStart) {
      _startAnimation();
    }

    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        widget.onComplete?.call();
      }
    });
  }

  void _startAnimation() {
    _controller.forward();
  }

  @override
  Widget build(BuildContext context) {
    return _animationService.createBubbleAnimation(
      child: widget.child,
      duration: widget.duration,
      autoPlay: widget.autoStart,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
