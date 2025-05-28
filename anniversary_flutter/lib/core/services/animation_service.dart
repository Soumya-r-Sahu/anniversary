import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:animated_text_kit/animated_text_kit.dart';

class AnimationService {
  static final AnimationService _instance = AnimationService._internal();
  factory AnimationService() => _instance;
  AnimationService._internal();

  // Performance optimization flags
  bool _reduceAnimations = false;
  bool _isLowEndDevice = false;

  void initialize() {
    _detectDeviceCapabilities();
  }

  void _detectDeviceCapabilities() {
    if (kIsWeb) {
      // Web performance detection
      _isLowEndDevice = _detectWebPerformance();
    } else {
      // Mobile performance detection will be added
      _isLowEndDevice = false;
    }
    
    _reduceAnimations = _isLowEndDevice;
  }

  bool _detectWebPerformance() {
    // Simple web performance heuristic
    try {
      final userAgent = kIsWeb ? 'unknown' : 'mobile';
      return userAgent.toLowerCase().contains('mobile');
    } catch (e) {
      return false;
    }
  }

  // Bubble animation factory
  Widget createBubbleAnimation({
    required Widget child,
    Duration? duration,
    Curve? curve,
    bool autoPlay = true,
  }) {
    final effectiveDuration = _getOptimizedDuration(
      duration ?? const Duration(milliseconds: 1000)
    );
    
    final effectiveCurve = curve ?? (_isLowEndDevice ? Curves.linear : Curves.elasticOut);

    if (_reduceAnimations) {
      return child.animate(autoPlay: autoPlay)
        .fadeIn(duration: effectiveDuration * 0.3)
        .scale(duration: effectiveDuration * 0.3);
    }

    return child.animate(autoPlay: autoPlay)
      .fadeIn(duration: effectiveDuration * 0.2)
      .scale(
        begin: const Offset(0.0, 0.0),
        end: const Offset(1.2, 1.2),
        duration: effectiveDuration * 0.4,
        curve: effectiveCurve,
      )
      .then()
      .scale(
        begin: const Offset(1.2, 1.2),
        end: const Offset(1.0, 1.0),
        duration: effectiveDuration * 0.4,
        curve: Curves.easeOut,
      )
      .rotate(
        begin: 0,
        end: 0.05,
        duration: effectiveDuration,
        curve: Curves.easeInOut,
      );
  }

  // Heart animation factory
  Widget createHeartAnimation({
    required Widget child,
    bool floating = false,
  }) {
    if (_reduceAnimations) {
      return child.animate(autoPlay: true)
        .fadeIn(duration: 300.ms);
    }

    if (floating) {
      return child.animate(autoPlay: true)
        .moveY(
          begin: 0,
          end: -20,
          duration: 2.seconds,
          curve: Curves.easeInOut,
        )
        .fadeIn(duration: 500.ms)
        .fadeOut(delay: 1.5.seconds, duration: 500.ms);
    }

    return child.animate(autoPlay: true)
      .scale(duration: 300.ms, curve: Curves.elasticOut)
      .shake(duration: 100.ms);
  }

  // Typewriter effect
  Widget createTypewriterEffect({
    required String text,
    required TextStyle style,
    Duration? duration,
  }) {
    final effectiveDuration = _getOptimizedDuration(
      duration ?? Duration(milliseconds: text.length * 50)
    );

    if (_reduceAnimations) {
      return Text(text, style: style)
        .animate()
        .fadeIn(duration: effectiveDuration * 0.2);
    }

    return AnimatedTextKit(
      animatedTexts: [
        TypewriterAnimatedText(
          text,
          textStyle: style,
          speed: Duration(milliseconds: effectiveDuration.inMilliseconds ~/ text.length),
        ),
      ],
      totalRepeatCount: 1,
    );
  }

  Duration _getOptimizedDuration(Duration baseDuration) {
    if (_isLowEndDevice) {
      return Duration(milliseconds: (baseDuration.inMilliseconds * 0.5).round());
    }
    if (_reduceAnimations) {
      return Duration(milliseconds: (baseDuration.inMilliseconds * 0.3).round());
    }
    return baseDuration;
  }

  // Performance getters
  bool get isLowEndDevice => _isLowEndDevice;
  bool get shouldReduceAnimations => _reduceAnimations;
}
