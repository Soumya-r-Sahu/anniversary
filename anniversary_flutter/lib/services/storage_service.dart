import 'package:shared_preferences/shared_preferences.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter/foundation.dart';

class StorageService {
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  StorageService._internal();

  late SharedPreferences _prefs;
  late Box _anniversaryBox;
  bool _isInitialized = false;

  bool get isInitialized => _isInitialized;

  // Storage keys
  static const String _anniversaryDateKey = 'anniversary_date';
  static const String _coupleNamesKey = 'couple_names';
  static const String _customMessageKey = 'custom_message';
  static const String _audioEnabledKey = 'audio_enabled';
  static const String _volumeKey = 'volume';
  static const String _themeKey = 'theme';
  static const String _firstLaunchKey = 'first_launch';
  static const String _memoriesKey = 'memories';
  static const String _milestonesKey = 'milestones';
  static const String _notificationsEnabledKey = 'notifications_enabled';

  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      // Initialize Hive
      await Hive.initFlutter();

      // Initialize SharedPreferences
      _prefs = await SharedPreferences.getInstance();

      // Open Hive box for complex data
      _anniversaryBox = await Hive.openBox('anniversary_data');

      _isInitialized = true;

      if (kDebugMode) {
        print('StorageService initialized successfully');
      }
    } catch (e) {
      if (kDebugMode) {
        print('Failed to initialize StorageService: $e');
      }
    }
  }

  // Anniversary Date Management
  Future<void> setAnniversaryDate(DateTime date) async {
    if (!_isInitialized) await initialize();
    await _prefs.setString(_anniversaryDateKey, date.toIso8601String());
  }

  DateTime? getAnniversaryDate() {
    if (!_isInitialized) return null;
    final dateString = _prefs.getString(_anniversaryDateKey);
    return dateString != null ? DateTime.parse(dateString) : null;
  }

  // Couple Names Management
  Future<void> setCoupleNames(String partner1, String partner2) async {
    if (!_isInitialized) await initialize();
    await _prefs.setStringList(_coupleNamesKey, [partner1, partner2]);
  }

  List<String>? getCoupleNames() {
    if (!_isInitialized) return null;
    return _prefs.getStringList(_coupleNamesKey);
  }

  // Custom Message Management
  Future<void> setCustomMessage(String message) async {
    if (!_isInitialized) await initialize();
    await _prefs.setString(_customMessageKey, message);
  }

  String getCustomMessage() {
    if (!_isInitialized) return 'Happy Anniversary! 💕';
    return _prefs.getString(_customMessageKey) ?? 'Happy Anniversary! 💕';
  }

  // Audio Settings
  Future<void> setAudioEnabled(bool enabled) async {
    if (!_isInitialized) await initialize();
    await _prefs.setBool(_audioEnabledKey, enabled);
  }

  bool getAudioEnabled() {
    if (!_isInitialized) return true;
    return _prefs.getBool(_audioEnabledKey) ?? true;
  }

  Future<void> setVolume(double volume) async {
    if (!_isInitialized) await initialize();
    await _prefs.setDouble(_volumeKey, volume);
  }

  double getVolume() {
    if (!_isInitialized) return 0.5;
    return _prefs.getDouble(_volumeKey) ?? 0.5;
  }

  // Theme Management
  Future<void> setTheme(String themeName) async {
    if (!_isInitialized) await initialize();
    await _prefs.setString(_themeKey, themeName);
  }

  String getTheme() {
    if (!_isInitialized) return 'romantic';
    return _prefs.getString(_themeKey) ?? 'romantic';
  }

  // First Launch Detection
  Future<void> setFirstLaunchCompleted() async {
    if (!_isInitialized) await initialize();
    await _prefs.setBool(_firstLaunchKey, false);
  }

  bool isFirstLaunch() {
    if (!_isInitialized) return true;
    return _prefs.getBool(_firstLaunchKey) ?? true;
  }

  // Memories Management (Complex data using Hive)
  Future<void> saveMemory(Memory memory) async {
    if (!_isInitialized) await initialize();

    final memories = getMemories();
    memories.add(memory);

    await _anniversaryBox.put(
        _memoriesKey, memories.map((m) => m.toJson()).toList());
  }

  List<Memory> getMemories() {
    if (!_isInitialized) return [];

    final memoriesData =
        _anniversaryBox.get(_memoriesKey, defaultValue: <Map>[]);
    return (memoriesData as List)
        .map((data) => Memory.fromJson(Map<String, dynamic>.from(data)))
        .toList();
  }

  Future<void> deleteMemory(String memoryId) async {
    if (!_isInitialized) await initialize();

    final memories = getMemories();
    memories.removeWhere((memory) => memory.id == memoryId);

    await _anniversaryBox.put(
        _memoriesKey, memories.map((m) => m.toJson()).toList());
  }

  // Milestones Management
  Future<void> saveMilestone(Milestone milestone) async {
    if (!_isInitialized) await initialize();

    final milestones = getMilestones();
    milestones.add(milestone);

    await _anniversaryBox.put(
        _milestonesKey, milestones.map((m) => m.toJson()).toList());
  }

  List<Milestone> getMilestones() {
    if (!_isInitialized) return [];

    final milestonesData =
        _anniversaryBox.get(_milestonesKey, defaultValue: <Map>[]);
    return (milestonesData as List)
        .map((data) => Milestone.fromJson(Map<String, dynamic>.from(data)))
        .toList();
  }

  // Notifications Settings
  Future<void> setNotificationsEnabled(bool enabled) async {
    if (!_isInitialized) await initialize();
    await _prefs.setBool(_notificationsEnabledKey, enabled);
  }

  bool getNotificationsEnabled() {
    if (!_isInitialized) return true;
    return _prefs.getBool(_notificationsEnabledKey) ?? true;
  }

  // Clear all data
  Future<void> clearAllData() async {
    if (!_isInitialized) await initialize();

    await _prefs.clear();
    await _anniversaryBox.clear();

    if (kDebugMode) {
      print('All storage data cleared');
    }
  }

  // Dispose resources
  Future<void> dispose() async {
    if (_isInitialized) {
      await _anniversaryBox.close();
      _isInitialized = false;
    }
  }
}

// Data Models
class Memory {
  final String id;
  final String title;
  final String description;
  final DateTime date;
  final String? imagePath;
  final List<String> tags;

  Memory({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
    this.imagePath,
    this.tags = const [],
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'date': date.toIso8601String(),
      'imagePath': imagePath,
      'tags': tags,
    };
  }

  factory Memory.fromJson(Map<String, dynamic> json) {
    return Memory(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      date: DateTime.parse(json['date']),
      imagePath: json['imagePath'],
      tags: List<String>.from(json['tags'] ?? []),
    );
  }
}

class Milestone {
  final String id;
  final String title;
  final String description;
  final DateTime date;
  final bool isAchieved;
  final String icon;

  Milestone({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
    this.isAchieved = false,
    this.icon = '💕',
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'date': date.toIso8601String(),
      'isAchieved': isAchieved,
      'icon': icon,
    };
  }

  factory Milestone.fromJson(Map<String, dynamic> json) {
    return Milestone(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      date: DateTime.parse(json['date']),
      isAchieved: json['isAchieved'] ?? false,
      icon: json['icon'] ?? '💕',
    );
  }
}
