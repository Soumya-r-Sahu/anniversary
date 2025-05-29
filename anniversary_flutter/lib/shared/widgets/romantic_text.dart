import 'package:flutter/material.dart';
import '../themes/app_theme.dart';

class RomanticText extends StatelessWidget {
  final String text;
  final double? fontSize;
  final Color? color;
  final FontWeight? fontWeight;
  final TextAlign? textAlign;
  final TextStyle? style;

  const RomanticText(
    this.text, {
    Key? key,
    this.fontSize,
    this.color,
    this.fontWeight,
    this.textAlign,
    this.style,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: textAlign,
      style: (style ?? AppTheme.headingStyle).copyWith(
        fontSize: fontSize,
        color: color,
        fontWeight: fontWeight,
      ),
    );
  }
}
