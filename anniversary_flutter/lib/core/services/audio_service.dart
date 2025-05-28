import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart';

class AudioService {
  static final AudioService _instance = AudioService._internal();
  factory AudioService() => _instance;
  AudioService._internal();

  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _isPlaying = false;
  bool _isMuted = false;
  double _volume = 0.7;
  
  // Web-specific optimizations
  bool get isWeb => kIsWeb;
  
  Future<void> initialize() async {
    try {
      if (isWeb) {
        // Web-specific audio initialization
        await _audioPlayer.setReleaseMode(ReleaseMode.loop);
        await _audioPlayer.setVolume(_volume);
      } else {
        // Mobile-specific audio initialization
        await _audioPlayer.setPlayerMode(PlayerMode.mediaPlayer);
        await _audioPlayer.setReleaseMode(ReleaseMode.loop);
      }
    } catch (e) {
      debugPrint('Audio initialization error: $e');
    }
  }

  Future<void> playBackgroundMusic({String? assetPath}) async {
    try {
      if (_isMuted) return;
      
      final path = assetPath ?? 'assets/music/song1.m4a';
      
      if (isWeb) {
        // Web deployment path for GitHub Pages
        await _audioPlayer.play(AssetSource(path));
      } else {
        // Mobile asset path
        await _audioPlayer.play(AssetSource(path));
      }
      
      _isPlaying = true;
    } catch (e) {
      debugPrint('Audio playback error: $e');
      // Graceful degradation for web without audio permissions
      if (isWeb) {
        _showAudioPermissionDialog();
      }
    }
  }

  Future<void> pause() async {
    await _audioPlayer.pause();
    _isPlaying = false;
  }

  Future<void> resume() async {
    if (!_isMuted) {
      await _audioPlayer.resume();
      _isPlaying = true;
    }
  }

  Future<void> stop() async {
    await _audioPlayer.stop();
    _isPlaying = false;
  }

  void setVolume(double volume) {
    _volume = volume.clamp(0.0, 1.0);
    _audioPlayer.setVolume(_volume);
  }

  void toggleMute() {
    _isMuted = !_isMuted;
    if (_isMuted) {
      pause();
    } else if (_isPlaying) {
      resume();
    }
  }

  void _showAudioPermissionDialog() {
    // Handle web audio permission requirements
    debugPrint('Audio requires user interaction on web');
  }

  bool get isPlaying => _isPlaying;
  bool get isMuted => _isMuted;
  double get volume => _volume;

  void dispose() {
    _audioPlayer.dispose();
  }
}
