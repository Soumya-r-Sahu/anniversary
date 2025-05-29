import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import '../../../shared/widgets/floating_bubbles.dart';
import '../../../shared/widgets/bubble_animation.dart';
import '../../../shared/themes/app_theme.dart';

class PhotoGalleryPage extends ConsumerStatefulWidget {
  const PhotoGalleryPage({super.key});

  @override
  ConsumerState<PhotoGalleryPage> createState() => _PhotoGalleryPageState();
}

class _PhotoGalleryPageState extends ConsumerState<PhotoGalleryPage>
    with TickerProviderStateMixin {
  late AnimationController _gridController;
  late AnimationController _filterController;
  
  final PageController _pageController = PageController();
  final ScrollController _scrollController = ScrollController();
  
  String selectedCategory = 'All';
  int? selectedPhotoIndex;
  
  final List<String> categories = [
    'All',
    'Dates',
    'Travel',
    'Special Moments',
    'Family & Friends',
    'Everyday Life'
  ];

  final List<PhotoItem> photos = [
    PhotoItem(
      id: '1',
      title: 'First Coffee Date',
      description: 'The beginning of everything beautiful',
      category: 'Dates',
      imagePath: 'assets/images/photo1.jpg',
      date: DateTime(2020, 3, 15),
      isFavorite: true,
    ),
    PhotoItem(
      id: '2',
      title: 'Beach Sunset',
      description: 'Golden hour magic with my favorite person',
      category: 'Dates',
      imagePath: 'assets/images/photo2.jpg',
      date: DateTime(2020, 6, 18),
      isFavorite: true,
    ),
    PhotoItem(
      id: '3',
      title: 'Paris Adventure',
      description: 'City of love lived up to its name',
      category: 'Travel',
      imagePath: 'assets/images/photo3.jpg',
      date: DateTime(2021, 5, 10),
      isFavorite: false,
    ),
    PhotoItem(
      id: '4',
      title: 'Home Sweet Home',
      description: 'Moving in together - best decision ever',
      category: 'Special Moments',
      imagePath: 'assets/images/photo4.jpg',
      date: DateTime(2020, 10, 10),
      isFavorite: true,
    ),
    PhotoItem(
      id: '5',
      title: 'Christmas Morning',
      description: 'The proposal that changed everything',
      category: 'Special Moments',
      imagePath: 'assets/images/photo5.jpg',
      date: DateTime(2021, 12, 24),
      isFavorite: true,
    ),
    PhotoItem(
      id: '6',
      title: 'Wedding Day',
      description: 'The most perfect day of our lives',
      category: 'Special Moments',
      imagePath: 'assets/images/photo6.jpg',
      date: DateTime(2022, 9, 15),
      isFavorite: true,
    ),
    PhotoItem(
      id: '7',
      title: 'Family Dinner',
      description: 'Surrounded by love and laughter',
      category: 'Family & Friends',
      imagePath: 'assets/images/photo7.jpg',
      date: DateTime(2022, 11, 25),
      isFavorite: false,
    ),
    PhotoItem(
      id: '8',
      title: 'Morning Coffee',
      description: 'Perfect start to every day',
      category: 'Everyday Life',
      imagePath: 'assets/images/photo8.jpg',
      date: DateTime(2023, 8, 5),
      isFavorite: false,
    ),
    PhotoItem(
      id: '9',
      title: 'Italy Getaway',
      description: 'Pasta, wine, and endless love',
      category: 'Travel',
      imagePath: 'assets/images/photo9.jpg',
      date: DateTime(2023, 6, 15),
      isFavorite: true,
    ),
    PhotoItem(
      id: '10',
      title: 'Game Night',
      description: 'Competitive but still in love',
      category: 'Everyday Life',
      imagePath: 'assets/images/photo10.jpg',
      date: DateTime(2023, 10, 8),
      isFavorite: false,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _gridController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    
    _filterController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );

    Future.delayed(const Duration(milliseconds: 300), () {
      _gridController.forward();
    });
  }

  @override
  void dispose() {
    _gridController.dispose();
    _filterController.dispose();
    _pageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  List<PhotoItem> get filteredPhotos {
    if (selectedCategory == 'All') return photos;
    return photos.where((photo) => photo.category == selectedCategory).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Animated background
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppTheme.primaryColor.withOpacity(0.1),
                  AppTheme.accentColor.withOpacity(0.1),
                  AppTheme.primaryColor.withOpacity(0.05),
                ],
              ),
            ),
          ),
          
          // Floating bubbles background
          const FloatingBubblesBackground(),

          // Main content
          CustomScrollView(
            controller: _scrollController,
            slivers: [
              // App bar
              SliverAppBar(
                expandedHeight: 200,
                floating: false,
                pinned: true,
                backgroundColor: Colors.transparent,
                elevation: 0,
                leading: IconButton(
                  icon: Icon(Icons.arrow_back, color: AppTheme.textColor),
                  onPressed: () => Navigator.of(context).pop(),
                ),
                actions: [
                  IconButton(
                    icon: Icon(Icons.favorite, color: AppTheme.primaryColor),
                    onPressed: () {
                      // Filter favorites
                      setState(() {
                        selectedCategory = 'Favorites';
                      });
                    },
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  centerTitle: true,
                  title: BubbleAnimationWidget(
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.photo_library,
                          color: AppTheme.primaryColor,
                          size: 24,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Our Memories',
                          style: AppTheme.headingStyle.copyWith(
                            fontSize: 20,
                            color: AppTheme.textColor,
                          ),
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
                          AppTheme.primaryColor.withOpacity(0.3),
                          Colors.transparent,
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // Category filters
              SliverPadding(
                padding: const EdgeInsets.symmetric(vertical: 20),
                sliver: SliverToBoxAdapter(
                  child: SizedBox(
                    height: 50,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      itemCount: categories.length,
                      itemBuilder: (context, index) {
                        final category = categories[index];
                        final isSelected = selectedCategory == category;
                        
                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              selectedCategory = category;
                            });
                            _filterController.reset();
                            _filterController.forward();
                          },
                          child: Container(
                            margin: const EdgeInsets.only(right: 12),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 12,
                            ),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? AppTheme.primaryColor
                                  : Colors.white.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(25),
                              border: Border.all(
                                color: AppTheme.primaryColor.withOpacity(0.3),
                                width: 1,
                              ),
                            ),
                            child: Text(
                              category,
                              style: AppTheme.bodyStyle.copyWith(
                                color: isSelected
                                    ? Colors.white
                                    : AppTheme.textColor,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        )
                            .animate()
                            .fadeIn(delay: Duration(milliseconds: index * 100))
                            .slideX(
                              begin: 0.3,
                              duration: 600.ms,
                              delay: Duration(milliseconds: index * 100),
                            );
                      },
                    ),
                  ),
                ),
              ),

              // Photo grid
              SliverPadding(
                padding: const EdgeInsets.all(20),
                sliver: SliverToBoxAdapter(
                  child: AnimatedBuilder(
                    animation: _gridController,
                    builder: (context, child) {
                      return MasonryGridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        mainAxisSpacing: 12,
                        crossAxisSpacing: 12,
                        itemCount: filteredPhotos.length,
                        itemBuilder: (context, index) {
                          final photo = filteredPhotos[index];
                          final itemProgress = Curves.easeOutBack.transform(
                            (_gridController.value * filteredPhotos.length - index)
                                .clamp(0.0, 1.0),
                          );

                          return Transform.scale(
                            scale: itemProgress,
                            child: Opacity(
                              opacity: itemProgress,
                              child: PhotoCard(
                                photo: photo,
                                onTap: () => _openPhotoViewer(index),
                              ),
                            ),
                          );
                        },
                      );
                    },
                  ),
                ),
              ),

              // Statistics section
              SliverPadding(
                padding: const EdgeInsets.all(20),
                sliver: SliverToBoxAdapter(
                  child: BubbleAnimationWidget(
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(15),
                        border: Border.all(
                          color: AppTheme.primaryColor.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      child: Column(
                        children: [
                          Text(
                            'Memory Statistics',
                            style: AppTheme.headingStyle.copyWith(
                              fontSize: 18,
                              color: AppTheme.primaryColor,
                            ),
                          ),
                          const SizedBox(height: 15),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              _StatItem(
                                icon: Icons.photo,
                                count: photos.length,
                                label: 'Photos',
                              ),
                              _StatItem(
                                icon: Icons.favorite,
                                count: photos.where((p) => p.isFavorite).length,
                                label: 'Favorites',
                              ),
                              _StatItem(
                                icon: Icons.calendar_today,
                                count: DateTime.now().difference(photos.first.date).inDays,
                                label: 'Days Together',
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),

          // Photo viewer overlay
          if (selectedPhotoIndex != null)
            PhotoViewer(
              photos: filteredPhotos,
              initialIndex: selectedPhotoIndex!,
              onClose: () => setState(() => selectedPhotoIndex = null),
            ),
        ],
      ),
    );
  }

  void _openPhotoViewer(int index) {
    setState(() {
      selectedPhotoIndex = index;
    });
  }
}

class PhotoCard extends StatelessWidget {
  final PhotoItem photo;
  final VoidCallback onTap;

  const PhotoCard({
    super.key,
    required this.photo,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: BubbleAnimationWidget(
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(15),
            boxShadow: [
              BoxShadow(
                color: AppTheme.primaryColor.withOpacity(0.1),
                blurRadius: 10,
                spreadRadius: 1,
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(15),
            child: Stack(
              children: [
                // Photo placeholder
                Container(
                  height: (photo.id.hashCode % 3 + 2) * 60.0,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        AppTheme.primaryColor.withOpacity(0.6),
                        AppTheme.accentColor.withOpacity(0.6),
                      ],
                    ),
                  ),
                  child: Icon(
                    Icons.photo,
                    size: 40,
                    color: Colors.white.withOpacity(0.7),
                  ),
                ),
                
                // Gradient overlay
                Container(
                  height: (photo.id.hashCode % 3 + 2) * 60.0,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        Colors.black.withOpacity(0.6),
                      ],
                    ),
                  ),
                ),
                
                // Content
                Positioned(
                  bottom: 0,
                  left: 0,
                  right: 0,
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          photo.title,
                          style: AppTheme.bodyStyle.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          photo.description,
                          style: AppTheme.bodyStyle.copyWith(
                            color: Colors.white.withOpacity(0.8),
                            fontSize: 12,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ),
                
                // Favorite indicator
                if (photo.isFavorite)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.favorite,
                        color: Colors.white,
                        size: 16,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final int count;
  final String label;

  const _StatItem({
    required this.icon,
    required this.count,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(
          icon,
          color: AppTheme.primaryColor,
          size: 24,
        ),
        const SizedBox(height: 8),
        Text(
          count.toString(),
          style: AppTheme.headingStyle.copyWith(
            fontSize: 20,
            color: AppTheme.primaryColor,
          ),
        ),
        Text(
          label,
          style: AppTheme.bodyStyle.copyWith(fontSize: 12),
        ),
      ],
    );
  }
}

class PhotoViewer extends StatefulWidget {
  final List<PhotoItem> photos;
  final int initialIndex;
  final VoidCallback onClose;

  const PhotoViewer({
    super.key,
    required this.photos,
    required this.initialIndex,
    required this.onClose,
  });

  @override
  State<PhotoViewer> createState() => _PhotoViewerState();
}

class _PhotoViewerState extends State<PhotoViewer> {
  late PageController _pageController;
  late int currentIndex;

  @override
  void initState() {
    super.initState();
    currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: widget.initialIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.black.withOpacity(0.9),
      child: Stack(
        children: [
          // Photo viewer
          PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                currentIndex = index;
              });
            },
            itemCount: widget.photos.length,          itemBuilder: (context, index) {
            return Center(
              child: Container(
                  margin: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        AppTheme.primaryColor,
                        AppTheme.accentColor,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Icon(
                    Icons.photo,
                    size: 100,
                    color: Colors.white.withOpacity(0.7),
                  ),
                ),
              );
            },
          ),
          
          // Close button
          Positioned(
            top: 50,
            right: 20,
            child: GestureDetector(
              onTap: widget.onClose,
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.5),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.close,
                  color: Colors.white,
                  size: 24,
                ),
              ),
            ),
          ),
          
          // Photo info
          Positioned(
            bottom: 50,
            left: 20,
            right: 20,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.7),
                borderRadius: BorderRadius.circular(15),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    widget.photos[currentIndex].title,
                    style: AppTheme.headingStyle.copyWith(
                      color: Colors.white,
                      fontSize: 18,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.photos[currentIndex].description,
                    style: AppTheme.bodyStyle.copyWith(
                      color: Colors.white.withOpacity(0.8),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${widget.photos[currentIndex].date.day}/${widget.photos[currentIndex].date.month}/${widget.photos[currentIndex].date.year}',
                    style: AppTheme.bodyStyle.copyWith(
                      color: AppTheme.primaryColor,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          // Page indicator
          Positioned(
            top: 100,
            left: 0,
            right: 0,
            child: Center(
              child: Text(
                '${currentIndex + 1} / ${widget.photos.length}',
                style: AppTheme.bodyStyle.copyWith(
                  color: Colors.white,
                  fontSize: 16,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class PhotoItem {
  final String id;
  final String title;
  final String description;
  final String category;
  final String imagePath;
  final DateTime date;
  final bool isFavorite;

  PhotoItem({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.imagePath,
    required this.date,
    this.isFavorite = false,
  });
}
