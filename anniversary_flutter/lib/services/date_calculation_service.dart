class DateCalculationService {
  static final DateCalculationService _instance =
      DateCalculationService._internal();
  factory DateCalculationService() => _instance;
  DateCalculationService._internal();

  /// Calculates the time difference between anniversary date and current date
  AnniversaryDuration calculateTimeSinceAnniversary(DateTime anniversaryDate) {
    final now = DateTime.now();
    final difference = now.difference(anniversaryDate);

    if (difference.isNegative) {
      // Anniversary is in the future
      return AnniversaryDuration(
        years: 0,
        months: 0,
        days: difference.inDays.abs(),
        hours: difference.inHours.abs() % 24,
        minutes: difference.inMinutes.abs() % 60,
        seconds: difference.inSeconds.abs() % 60,
        isInFuture: true,
      );
    }

    // Calculate years, months, and days more accurately
    int years = now.year - anniversaryDate.year;
    int months = now.month - anniversaryDate.month;
    int days = now.day - anniversaryDate.day;

    // Adjust for negative days
    if (days < 0) {
      months--;
      final lastMonth = DateTime(now.year, now.month, 0);
      days += lastMonth.day;
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    return AnniversaryDuration(
      years: years,
      months: months,
      days: days,
      hours: difference.inHours % 24,
      minutes: difference.inMinutes % 60,
      seconds: difference.inSeconds % 60,
    );
  }

  /// Calculates time until next anniversary
  AnniversaryDuration calculateTimeUntilNextAnniversary(
      DateTime anniversaryDate) {
    final now = DateTime.now();

    // Calculate this year's anniversary
    DateTime thisYearAnniversary = DateTime(
      now.year,
      anniversaryDate.month,
      anniversaryDate.day,
      anniversaryDate.hour,
      anniversaryDate.minute,
      anniversaryDate.second,
    );

    // If this year's anniversary has passed, calculate next year's
    if (thisYearAnniversary.isBefore(now)) {
      thisYearAnniversary = DateTime(
        now.year + 1,
        anniversaryDate.month,
        anniversaryDate.day,
        anniversaryDate.hour,
        anniversaryDate.minute,
        anniversaryDate.second,
      );
    }

    final difference = thisYearAnniversary.difference(now);

    return AnniversaryDuration(
      years: 0,
      months: 0,
      days: difference.inDays,
      hours: difference.inHours % 24,
      minutes: difference.inMinutes % 60,
      seconds: difference.inSeconds % 60,
      isCountdown: true,
    );
  }

  /// Get total days since anniversary
  int getTotalDaysSinceAnniversary(DateTime anniversaryDate) {
    final now = DateTime.now();
    return now.difference(anniversaryDate).inDays;
  }

  /// Get total hours since anniversary
  int getTotalHoursSinceAnniversary(DateTime anniversaryDate) {
    final now = DateTime.now();
    return now.difference(anniversaryDate).inHours;
  }

  /// Get total minutes since anniversary
  int getTotalMinutesSinceAnniversary(DateTime anniversaryDate) {
    final now = DateTime.now();
    return now.difference(anniversaryDate).inMinutes;
  }

  /// Get total seconds since anniversary
  int getTotalSecondsSinceAnniversary(DateTime anniversaryDate) {
    final now = DateTime.now();
    return now.difference(anniversaryDate).inSeconds;
  }

  /// Check if today is anniversary
  bool isAnniversaryToday(DateTime anniversaryDate) {
    final now = DateTime.now();
    return now.month == anniversaryDate.month && now.day == anniversaryDate.day;
  }

  /// Check if anniversary is this week
  bool isAnniversaryThisWeek(DateTime anniversaryDate) {
    final now = DateTime.now();
    final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
    final endOfWeek = startOfWeek.add(const Duration(days: 6));

    final thisYearAnniversary = DateTime(
      now.year,
      anniversaryDate.month,
      anniversaryDate.day,
    );

    return thisYearAnniversary.isAfter(startOfWeek) &&
        thisYearAnniversary.isBefore(endOfWeek);
  }

  /// Get anniversary milestones (monthly, yearly)
  List<AnniversaryMilestone> getAnniversaryMilestones(
      DateTime anniversaryDate) {
    final duration = calculateTimeSinceAnniversary(anniversaryDate);
    final milestones = <AnniversaryMilestone>[];

    // Year milestones
    if (duration.years > 0) {
      milestones.add(AnniversaryMilestone(
        type: MilestoneType.yearly,
        value: duration.years,
        title:
            '${duration.years} Year${duration.years > 1 ? 's' : ''} Together',
        icon: '💕',
        isSpecial: _isSpecialYearMilestone(duration.years),
      ));
    }

    // Month milestones
    final totalMonths = duration.years * 12 + duration.months;
    if (totalMonths > 0) {
      milestones.add(AnniversaryMilestone(
        type: MilestoneType.monthly,
        value: totalMonths,
        title: '${totalMonths} Month${totalMonths > 1 ? 's' : ''} Together',
        icon: '💖',
        isSpecial: totalMonths % 6 == 0, // Every 6 months is special
      ));
    }

    // Day milestones for special numbers
    final totalDays = getTotalDaysSinceAnniversary(anniversaryDate);
    if (_isSpecialDayMilestone(totalDays)) {
      milestones.add(AnniversaryMilestone(
        type: MilestoneType.daily,
        value: totalDays,
        title: '$totalDays Days Together',
        icon: '✨',
        isSpecial: true,
      ));
    }

    return milestones;
  }

  /// Format duration to readable string
  String formatDuration(AnniversaryDuration duration,
      {bool includeSeconds = false}) {
    final parts = <String>[];

    if (duration.years > 0) {
      parts.add('${duration.years} year${duration.years > 1 ? 's' : ''}');
    }

    if (duration.months > 0) {
      parts.add('${duration.months} month${duration.months > 1 ? 's' : ''}');
    }

    if (duration.days > 0) {
      parts.add('${duration.days} day${duration.days > 1 ? 's' : ''}');
    }

    if (duration.hours > 0 && duration.years == 0) {
      parts.add('${duration.hours} hour${duration.hours > 1 ? 's' : ''}');
    }

    if (duration.minutes > 0 && duration.years == 0 && duration.months == 0) {
      parts.add('${duration.minutes} minute${duration.minutes > 1 ? 's' : ''}');
    }

    if (includeSeconds &&
        duration.seconds > 0 &&
        duration.years == 0 &&
        duration.months == 0 &&
        duration.days == 0) {
      parts.add('${duration.seconds} second${duration.seconds > 1 ? 's' : ''}');
    }

    if (parts.isEmpty) {
      return 'Just started';
    }

    if (parts.length == 1) {
      return parts.first;
    } else if (parts.length == 2) {
      return '${parts[0]} and ${parts[1]}';
    } else {
      return parts.take(parts.length - 1).join(', ') + ', and ${parts.last}';
    }
  }

  bool _isSpecialYearMilestone(int years) {
    final specialYears = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];
    return specialYears.contains(years);
  }

  bool _isSpecialDayMilestone(int days) {
    final specialDays = [100, 200, 365, 500, 730, 1000, 1500, 2000, 2555, 3000];
    return specialDays.contains(days);
  }
}

class AnniversaryDuration {
  final int years;
  final int months;
  final int days;
  final int hours;
  final int minutes;
  final int seconds;
  final bool isInFuture;
  final bool isCountdown;

  AnniversaryDuration({
    required this.years,
    required this.months,
    required this.days,
    required this.hours,
    required this.minutes,
    required this.seconds,
    this.isInFuture = false,
    this.isCountdown = false,
  });

  @override
  String toString() {
    return 'AnniversaryDuration(years: $years, months: $months, days: $days, hours: $hours, minutes: $minutes, seconds: $seconds)';
  }
}

class AnniversaryMilestone {
  final MilestoneType type;
  final int value;
  final String title;
  final String icon;
  final bool isSpecial;

  AnniversaryMilestone({
    required this.type,
    required this.value,
    required this.title,
    required this.icon,
    this.isSpecial = false,
  });
}

enum MilestoneType {
  daily,
  monthly,
  yearly,
}
