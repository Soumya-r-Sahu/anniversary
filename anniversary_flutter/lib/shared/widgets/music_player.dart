import 'package:flutter/material.dart';
import '../../core/services/audio_service.dart';

class MusicPlayerWidget extends StatefulWidget {
  const MusicPlayerWidget({Key? key}) : super(key: key);

  @override
  State<MusicPlayerWidget> createState() => _MusicPlayerWidgetState();
}

class _MusicPlayerWidgetState extends State<MusicPlayerWidget>
    with SingleTickerProviderStateMixin {
  final AudioService _audioService = AudioService();
  late AnimationController _visualizerController;
  bool _isInitialized = false;

  @override
  void initState() {
    super.initState();
    _visualizerController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _initializeAudio();
  }

  Future<void> _initializeAudio() async {
    await _audioService.initialize();
    setState(() {
      _isInitialized = true;
    });
  }

  void _toggleMusic() async {
    if (_audioService.isPlaying) {
      await _audioService.pause();
      _visualizerController.stop();
    } else {
      await _audioService.playBackgroundMusic();
      _visualizerController.repeat();
    }
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    if (!_isInitialized) {
      return const SizedBox.shrink();
    }

    return Positioned(
      top: 20,
      right: 20,
      child: Container(
        width: 60,
        height: 60,
        decoration: BoxDecoration(
          color: Colors.pink.withOpacity(0.9),
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: Colors.pink.withOpacity(0.3),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(30),
            onTap: _toggleMusic,
            child: Center(
              child: _audioService.isPlaying
                  ? _buildMusicVisualizer()
                  : const Icon(
                      Icons.music_note,
                      color: Colors.white,
                      size: 24,
                    ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMusicVisualizer() {
    return AnimatedBuilder(
      animation: _visualizerController,
      builder: (context, child) {
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(4, (index) {
            return Container(
              width: 3,
              height: 10 + (_visualizerController.value * 15) * 
                (index % 2 == 0 ? 1 : 0.7),
              margin: const EdgeInsets.symmetric(horizontal: 1),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(1.5),
              ),
            );
          }),
        );
      },
    );
  }

  @override
  void dispose() {
    _visualizerController.dispose();
    super.dispose();
  }
}
