import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart';

class AudioService {
  static final AudioService _instance = AudioService._internal();
  factory AudioService() => _instance;
  AudioService._internal();

  late AudioPlayer _player;
  bool _isInitialized = false;
  bool _isMuted = false;
  double _volume = 0.5;

  bool get isInitialized => _isInitialized;
  bool get isMuted => _isMuted;
  double get volume => _volume;

  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      _player = AudioPlayer();
      await _player.setVolume(_volume);
      _isInitialized = true;

      if (kDebugMode) {
        print('AudioService initialized successfully');
      }
    } catch (e) {
      if (kDebugMode) {
        print('Failed to initialize AudioService: $e');
      }
    }
  }

  Future<void> playBackgroundMusic({String? asset}) async {
    if (!_isInitialized || _isMuted) return;

    try {
      // Default romantic background music
      final musicAsset = asset ?? 'audio/romantic_melody.mp3';

      await _player.play(AssetSource(musicAsset));
      await _player.setReleaseMode(ReleaseMode.loop);

      if (kDebugMode) {
        print('Playing background music: $musicAsset');
      }
    } catch (e) {
      if (kDebugMode) {
        print('Failed to play background music: $e');
      }
    }
  }

  Future<void> playSoundEffect(String soundEffect) async {
    if (!_isInitialized || _isMuted) return;

    try {
      // Create a separate player for sound effects
      final effectPlayer = AudioPlayer();
      await effectPlayer
          .setVolume(_volume * 0.8); // Slightly lower than background
      await effectPlayer.play(AssetSource('audio/effects/$soundEffect'));

      // Auto-dispose after playing
      effectPlayer.onPlayerComplete.listen((_) {
        effectPlayer.dispose();
      });

      if (kDebugMode) {
        print('Playing sound effect: $soundEffect');
      }
    } catch (e) {
      if (kDebugMode) {
        print('Failed to play sound effect: $e');
      }
    }
  }

  Future<void> pauseMusic() async {
    if (!_isInitialized) return;

    try {
      await _player.pause();
    } catch (e) {
      if (kDebugMode) {
        print('Failed to pause music: $e');
      }
    }
  }

  Future<void> resumeMusic() async {
    if (!_isInitialized || _isMuted) return;

    try {
      await _player.resume();
    } catch (e) {
      if (kDebugMode) {
        print('Failed to resume music: $e');
      }
    }
  }
  Future<void> stopMusic() async {
    if (!_isInitialized) return;

    try {
      await _player.stop();
    } catch (e) {
      if (kDebugMode) {
        print('Failed to stop music: $e');
      }
    }
  }

  Future<void> playMusic(String musicFile) async {
    if (!_isInitialized || _isMuted) return;

    try {
      // Stop any currently playing music
      await _player.stop();
      
      // Play the new music file
      await _player.play(AssetSource('audio/music/$musicFile'));
      await _player.setReleaseMode(ReleaseMode.loop);

      if (kDebugMode) {
        print('Playing music: $musicFile');
      }
    } catch (e) {
      if (kDebugMode) {
        print('Failed to play music: $e');
      }
    }
  }

  Future<void> setVolume(double volume) async {
    _volume = volume.clamp(0.0, 1.0);

    if (_isInitialized) {
      try {
        await _player.setVolume(_volume);
      } catch (e) {
        if (kDebugMode) {
          print('Failed to set volume: $e');
        }
      }
    }
  }

  void toggleMute() {
    _isMuted = !_isMuted;

    if (_isInitialized) {
      if (_isMuted) {
        _player.setVolume(0);
      } else {
        _player.setVolume(_volume);
      }
    }
  }

  void dispose() {
    if (_isInitialized) {
      _player.dispose();
      _isInitialized = false;
    }
  }

  // Predefined sound effects
  static const String buttonClick = 'button_click.mp3';
  static const String heartbeat = 'heartbeat.mp3';
  static const String notification = 'notification.mp3';
  static const String celebration = 'celebration.mp3';
  static const String bubblePop = 'bubble_pop.mp3';
}
