import 'package:flutter/material.dart';

class RomanticCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? backgroundColor;
  final double? elevation;
  final BorderRadiusGeometry? borderRadius;
  final bool addGlow;
  final bool animate;
  final Duration animationDelay;

  const RomanticCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.backgroundColor,
    this.elevation,
    this.borderRadius,
    this.addGlow = false,
    this.animate = true,
    this.animationDelay = Duration.zero,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cardColor = backgroundColor ?? theme.cardColor;

    Widget card = Container(
      margin: margin ?? const EdgeInsets.all(8.0),
      padding: padding ?? const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: borderRadius ?? BorderRadius.circular(16.0),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            cardColor,
            cardColor.withOpacity(0.8),
          ],
        ),
        boxShadow: [
          if (elevation != null && elevation! > 0)
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: elevation! * 2,
              offset: Offset(0, elevation!),
            ),
          if (addGlow)
            BoxShadow(
              color: Colors.pink.withOpacity(0.3),
              blurRadius: 20,
              spreadRadius: 2,
            ),
        ],
      ),
      child: child,
    );    if (animate) {
      return TweenAnimationBuilder<double>(
        duration: Duration(milliseconds: 800 + animationDelay.inMilliseconds),
        tween: Tween(begin: 0.0, end: 1.0),
        builder: (context, value, child) {
          return Transform.scale(
            scale: 0.8 + (0.2 * value),
            child: Opacity(
              opacity: value,
              child: card,
            ),
          );
        },
      );
    }

    return card;
  }
}

class GradientButton extends StatefulWidget {
  final Widget child;
  final VoidCallback? onPressed;
  final EdgeInsetsGeometry? padding;
  final BorderRadiusGeometry? borderRadius;
  final List<Color>? gradientColors;
  final bool enabled;
  final double elevation;
  final Duration animationDuration;

  const GradientButton({
    super.key,
    required this.child,
    this.onPressed,
    this.padding,
    this.borderRadius,
    this.gradientColors,
    this.enabled = true,
    this.elevation = 4.0,
    this.animationDuration = const Duration(milliseconds: 200),
  });

  @override
  State<GradientButton> createState() => _GradientButtonState();
}

class _GradientButtonState extends State<GradientButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _elevationAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.animationDuration,
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));

    _elevationAnimation = Tween<double>(
      begin: widget.elevation,
      end: widget.elevation * 0.5,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    if (widget.enabled) {
      _controller.forward();
    }
  }

  void _onTapUp(TapUpDetails details) {
    if (widget.enabled) {
      _controller.reverse();
    }
  }

  void _onTapCancel() {
    if (widget.enabled) {
      _controller.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = widget.gradientColors ??
        [
          Colors.pink,
          Colors.purple,
        ];

    return GestureDetector(
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      onTap: widget.enabled ? widget.onPressed : null,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: Container(
              padding: widget.padding ??
                  const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: widget.enabled
                      ? colors
                      : colors.map((c) => c.withOpacity(0.5)).toList(),
                ),
                borderRadius: widget.borderRadius ?? BorderRadius.circular(25),
                boxShadow: [
                  BoxShadow(
                    color: colors.first.withOpacity(0.3),
                    blurRadius: _elevationAnimation.value * 2,
                    offset: Offset(0, _elevationAnimation.value),
                  ),
                ],
              ),
              child: DefaultTextStyle(
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
                child: widget.child,
              ),
            ),
          );
        },
      ),
    );
  }
}

class HeartIcon extends StatefulWidget {
  final double size;
  final Color? color;
  final bool animate;
  final Duration animationDuration;
  final VoidCallback? onTap;

  const HeartIcon({
    super.key,
    this.size = 24.0,
    this.color,
    this.animate = true,
    this.animationDuration = const Duration(milliseconds: 1200),
    this.onTap,
  });

  @override
  State<HeartIcon> createState() => _HeartIconState();
}

class _HeartIconState extends State<HeartIcon>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.animationDuration,
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 1.3,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.elasticInOut,
    ));

    if (widget.animate) {
      _controller.repeat(reverse: true);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTap() {
    if (!widget.animate) {
      _controller.forward().then((_) {
        _controller.reverse();
      });
    }
    widget.onTap?.call();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _onTap,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: Icon(
              Icons.favorite,
              size: widget.size,
              color: widget.color ?? Colors.red,
            ),
          );
        },
      ),
    );
  }
}

class CountdownDigit extends StatefulWidget {
  final String digit;
  final String label;
  final Color? backgroundColor;
  final Color? textColor;
  final double size;

  const CountdownDigit({
    super.key,
    required this.digit,
    required this.label,
    this.backgroundColor,
    this.textColor,
    this.size = 1.0,
  });

  @override
  State<CountdownDigit> createState() => _CountdownDigitState();
}

class _CountdownDigitState extends State<CountdownDigit>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _flipAnimation;
  String _previousDigit = '';

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _flipAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));

    _previousDigit = widget.digit;
  }

  @override
  void didUpdateWidget(CountdownDigit oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.digit != widget.digit) {
      _previousDigit = oldWidget.digit;
      _controller.forward().then((_) {
        _controller.reset();
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AnimatedBuilder(
      animation: _flipAnimation,
      builder: (context, child) {
        final isShowingFront = _flipAnimation.value < 0.5;
        final displayDigit = isShowingFront ? _previousDigit : widget.digit;

        return Transform(
          alignment: Alignment.center,
          transform: Matrix4.identity()
            ..setEntry(3, 2, 0.001)
            ..rotateX(_flipAnimation.value * 3.14159),
          child: Container(
            width: 60 * widget.size,
            height: 80 * widget.size,
            margin: const EdgeInsets.symmetric(horizontal: 4),
            decoration: BoxDecoration(
              color:
                  widget.backgroundColor ?? theme.colorScheme.primaryContainer,
              borderRadius: BorderRadius.circular(8 * widget.size),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  displayDigit,
                  style: theme.textTheme.headlineLarge?.copyWith(
                    color: widget.textColor ??
                        theme.colorScheme.onPrimaryContainer,
                    fontWeight: FontWeight.bold,
                    fontSize: 32 * widget.size,
                  ),
                ),
                Text(
                  widget.label,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: (widget.textColor ??
                            theme.colorScheme.onPrimaryContainer)
                        .withOpacity(0.7),
                    fontSize: 10 * widget.size,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class ShimmerText extends StatefulWidget {
  final String text;
  final TextStyle? style;
  final Duration duration;

  const ShimmerText({
    super.key,
    required this.text,
    this.style,
    this.duration = const Duration(seconds: 2),
  });

  @override
  State<ShimmerText> createState() => _ShimmerTextState();
}

class _ShimmerTextState extends State<ShimmerText>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
    );

    _animation = Tween<double>(
      begin: -1.0,
      end: 2.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));

    _controller.repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return ShaderMask(
          shaderCallback: (bounds) {
            return LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: const [
                Colors.transparent,
                Colors.white,
                Colors.transparent,
              ],
              stops: [
                _animation.value - 0.3,
                _animation.value,
                _animation.value + 0.3,
              ],
            ).createShader(bounds);
          },
          child: Text(
            widget.text,
            style: widget.style,
          ),
        );
      },
    );
  }
}
