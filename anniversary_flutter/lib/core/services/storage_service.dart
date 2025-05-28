import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
// import 'package:hive_flutter/hive_flutter.dart';

class StorageService {
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  StorageService._internal();

  // late Box _settingsBox;
  // late Box _userDataBox;
  late SharedPreferences _prefs;

  Future<void> initialize() async {
    try {
      // Initialize Hive for complex data - temporarily disabled for web
      // await Hive.initFlutter();
      // _settingsBox = await Hive.openBox('settings');
      // _userDataBox = await Hive.openBox('userData');

      // Initialize SharedPreferences for simple data
      _prefs = await SharedPreferences.getInstance();
    } catch (e) {
      debugPrint('Storage initialization error: $e');
    }
  }

  // Simple key-value storage
  Future<void> setString(String key, String value) async {
    await _prefs.setString(key, value);
  }

  String? getString(String key) {
    return _prefs.getString(key);
  }

  Future<void> setBool(String key, bool value) async {
    await _prefs.setBool(key, value);
  }

  bool getBool(String key, {bool defaultValue = false}) {
    return _prefs.getBool(key) ?? defaultValue;
  }

  Future<void> setDouble(String key, double value) async {
    await _prefs.setDouble(key, value);
  }

  double getDouble(String key, {double defaultValue = 0.0}) {
    return _prefs.getDouble(key) ?? defaultValue;
  }
  // Complex data storage using SharedPreferences (JSON string format)
  Future<void> saveUserSettings(Map<String, dynamic> settings) async {
    final String settingsJson = settings.toString(); // Simple string conversion for now
    await _prefs.setString('userSettings', settingsJson);
  }

  Map<String, dynamic>? getUserSettings() {
    final settings = _prefs.getString('userSettings');
    // For now, return empty map - in production you'd parse JSON
    return settings != null ? {} : null;
  }

  Future<void> saveAnniversaryData(Map<String, dynamic> data) async {
    final String dataJson = data.toString(); // Simple string conversion for now
    await _prefs.setString('anniversaryData', dataJson);
  }

  Map<String, dynamic>? getAnniversaryData() {
    final data = _prefs.getString('anniversaryData');
    // For now, return empty map - in production you'd parse JSON
    return data != null ? {} : null;
  }

  // Photo gallery storage using SharedPreferences
  Future<void> savePhotoGallery(List<String> photoPaths) async {
    await _prefs.setStringList('photoGallery', photoPaths);
  }
  List<String> getPhotoGallery() {
    return _prefs.getStringList('photoGallery') ?? [];
  }

  // Clear all data
  Future<void> clearAllData() async {
    await _prefs.clear();
  }

  void dispose() {
    // No need to close SharedPreferences
  }
}
