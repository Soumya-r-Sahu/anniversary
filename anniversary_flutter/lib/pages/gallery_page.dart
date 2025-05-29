import 'package:flutter/material.dart';
import '../widgets/widgets.dart';

class GalleryPage extends StatefulWidget {
  const GalleryPage({super.key});

  @override
  State<GalleryPage> createState() => _GalleryPageState();
}

class _GalleryPageState extends State<GalleryPage>
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _scaleController;

  List<GalleryPhoto> _photos = [];
  int _selectedPhotoIndex = 0;
  bool _isFullScreenMode = false;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _loadPhotos();
    _fadeController.forward();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _scaleController.dispose();
    super.dispose();
  }

  void _loadPhotos() {
    // Load photos from storage or use demo data
    setState(() {
      _photos = _getDemoPhotos();
    });
  }

  List<GalleryPhoto> _getDemoPhotos() {
    return [
      GalleryPhoto(
        id: '1',
        title: 'Our First Date',
        description: 'The beginning of our beautiful journey together 💕',
        date: DateTime.now().subtract(const Duration(days: 365)),
        thumbnailUrl: 'https://picsum.photos/300/300?random=1',
        fullUrl: 'https://picsum.photos/800/600?random=1',
        location: 'Central Park',
      ),
      GalleryPhoto(
        id: '2',
        title: 'Engagement Day',
        description: 'The day you said yes! 💍',
        date: DateTime.now().subtract(const Duration(days: 200)),
        thumbnailUrl: 'https://picsum.photos/300/300?random=2',
        fullUrl: 'https://picsum.photos/800/600?random=2',
        location: 'Beach Sunset',
      ),
      GalleryPhoto(
        id: '3',
        title: 'Our Wedding',
        description: 'Forever and always 👰🤵',
        date: DateTime.now().subtract(const Duration(days: 100)),
        thumbnailUrl: 'https://picsum.photos/300/300?random=3',
        fullUrl: 'https://picsum.photos/800/600?random=3',
        location: 'Garden Chapel',
      ),
      GalleryPhoto(
        id: '4',
        title: 'Honeymoon',
        description: 'Paradise found in your eyes ✈️',
        date: DateTime.now().subtract(const Duration(days: 90)),
        thumbnailUrl: 'https://picsum.photos/300/300?random=4',
        fullUrl: 'https://picsum.photos/800/600?random=4',
        location: 'Tropical Island',
      ),
      GalleryPhoto(
        id: '5',
        title: 'First Anniversary',
        description: 'One year of pure happiness 🎉',
        date: DateTime.now().subtract(const Duration(days: 30)),
        thumbnailUrl: 'https://picsum.photos/300/300?random=5',
        fullUrl: 'https://picsum.photos/800/600?random=5',
        location: 'Romantic Restaurant',
      ),
      GalleryPhoto(
        id: '6',
        title: 'Adventure Together',
        description: 'Every moment is an adventure with you 🏔️',
        date: DateTime.now().subtract(const Duration(days: 15)),
        thumbnailUrl: 'https://picsum.photos/300/300?random=6',
        fullUrl: 'https://picsum.photos/800/600?random=6',
        location: 'Mountain Peak',
      ),
    ];
  }

  void _showFullScreenPhoto(int index) {
    setState(() {
      _selectedPhotoIndex = index;
      _isFullScreenMode = true;
    });
    _scaleController.forward();
  }

  void _closeFullScreen() {
    _scaleController.reverse().then((_) {
      setState(() {
        _isFullScreenMode = false;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Animated background
          const FloatingBubbles(
            numberOfBubbles: 15,
            animationDuration: Duration(seconds: 25),
          ),
          
          // Main content
          FadeTransition(
            opacity: _fadeController,
            child: CustomScrollView(
              slivers: [
                SliverAppBar(
                  expandedHeight: 200,
                  pinned: true,
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                  flexibleSpace: FlexibleSpaceBar(
                    title: const RomanticText(
                      'Our Gallery',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        shadows: [
                          Shadow(
                            offset: Offset(0, 1),
                            blurRadius: 3,
                            color: Colors.black54,
                          ),
                        ],
                      ),
                    ),
                    background: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.pink.withOpacity(0.8),
                            Colors.purple.withOpacity(0.6),
                          ],
                        ),
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.photo_library,
                          size: 60,
                          color: Colors.white70,
                        ),
                      ),
                    ),
                  ),
                ),
                
                SliverPadding(
                  padding: const EdgeInsets.all(16),
                  sliver: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.8,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        return _buildPhotoCard(_photos[index], index);
                      },
                      childCount: _photos.length,
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          // Full screen photo viewer
          if (_isFullScreenMode)
            _buildFullScreenViewer(),
        ],
      ),
    );
  }

  Widget _buildPhotoCard(GalleryPhoto photo, int index) {
    return GestureDetector(
      onTap: () => _showFullScreenPhoto(index),
      child: RomanticCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(16),
                  ),
                  image: DecorationImage(
                    image: NetworkImage(photo.thumbnailUrl),
                    fit: BoxFit.cover,
                  ),
                ),
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(16),
                    ),
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        Colors.black.withOpacity(0.3),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    photo.title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    photo.description,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        size: 12,
                        color: Colors.pink[300],
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          photo.location,
                          style: TextStyle(
                            fontSize: 11,
                            color: Colors.pink[300],
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFullScreenViewer() {
    final photo = _photos[_selectedPhotoIndex];
    
    return Material(
      color: Colors.black87,
      child: Stack(
        children: [
          // Photo
          Center(
            child: ScaleTransition(
              scale: Tween<double>(begin: 0.5, end: 1.0).animate(
                CurvedAnimation(
                  parent: _scaleController,
                  curve: Curves.easeOutBack,
                ),
              ),
              child: InteractiveViewer(
                child: Image.network(
                  photo.fullUrl,
                  fit: BoxFit.contain,
                  loadingBuilder: (context, child, loadingProgress) {
                    if (loadingProgress == null) return child;
                    return const Center(
                      child: CircularProgressIndicator(
                        color: Colors.pink,
                      ),
                    );
                  },
                ),
              ),
            ),
          ),
          
          // Close button
          Positioned(
            top: 40,
            right: 20,
            child: IconButton(
              onPressed: _closeFullScreen,
              icon: const Icon(
                Icons.close,
                color: Colors.white,
                size: 30,
              ),
            ),
          ),
          
          // Photo info
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withOpacity(0.8),
                  ],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    photo.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    photo.description,
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on,
                        color: Colors.pink,
                        size: 16,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        photo.location,
                        style: const TextStyle(
                          color: Colors.pink,
                          fontSize: 14,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        '${_selectedPhotoIndex + 1} / ${_photos.length}',
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          
          // Navigation arrows
          if (_photos.length > 1) ...[
            if (_selectedPhotoIndex > 0)
              Positioned(
                left: 20,
                top: 0,
                bottom: 0,
                child: Center(
                  child: IconButton(
                    onPressed: () {
                      setState(() {
                        _selectedPhotoIndex--;
                      });
                    },
                    icon: const Icon(
                      Icons.arrow_back_ios,
                      color: Colors.white,
                      size: 30,
                    ),
                  ),
                ),
              ),
            if (_selectedPhotoIndex < _photos.length - 1)
              Positioned(
                right: 20,
                top: 0,
                bottom: 0,
                child: Center(
                  child: IconButton(
                    onPressed: () {
                      setState(() {
                        _selectedPhotoIndex++;
                      });
                    },
                    icon: const Icon(
                      Icons.arrow_forward_ios,
                      color: Colors.white,
                      size: 30,
                    ),
                  ),
                ),
              ),
          ],
        ],
      ),
    );
  }
}

class GalleryPhoto {
  final String id;
  final String title;
  final String description;
  final DateTime date;
  final String thumbnailUrl;
  final String fullUrl;
  final String location;

  GalleryPhoto({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
    required this.thumbnailUrl,
    required this.fullUrl,
    required this.location,
  });
}
