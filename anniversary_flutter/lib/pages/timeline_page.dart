import 'package:flutter/material.dart';
import '../widgets/widgets.dart';

class TimelinePage extends StatefulWidget {
  const TimelinePage({super.key});

  @override
  State<TimelinePage> createState() => _TimelinePageState();
}

class _TimelinePageState extends State<TimelinePage>
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _slideController;

  List<TimelineEvent> _events = [];
  ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _loadTimelineEvents();
    _fadeController.forward();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _slideController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _loadTimelineEvents() {
    setState(() {
      _events = _getDemoEvents();
    });
    _slideController.forward();
  }

  List<TimelineEvent> _getDemoEvents() {
    final now = DateTime.now();
    return [
      TimelineEvent(
        id: '1',
        title: 'First Meeting',
        description: 'The day our eyes first met and my world changed forever. Little did I know that this moment would be the beginning of the most beautiful chapter of my life.',
        date: now.subtract(const Duration(days: 1000)),
        icon: Icons.favorite,
        color: Colors.pink,
        category: 'Milestone',
        imageUrl: 'https://picsum.photos/400/300?random=10',
        location: 'Coffee Shop Downtown',
      ),
      TimelineEvent(
        id: '2',
        title: 'First Date',
        description: 'Our magical first date where we talked for hours and time just seemed to stop. I knew then that you were someone special.',
        date: now.subtract(const Duration(days: 980)),
        icon: Icons.restaurant,
        color: Colors.red,
        category: 'Date',
        imageUrl: 'https://picsum.photos/400/300?random=11',
        location: 'Italian Restaurant',
      ),
      TimelineEvent(
        id: '3',
        title: 'First Kiss',
        description: 'Under the starlit sky, our first kiss sealed a promise of forever. My heart still skips a beat remembering that perfect moment.',
        date: now.subtract(const Duration(days: 950)),
        icon: Icons.star,
        color: Colors.purple,
        category: 'Romantic',
        imageUrl: 'https://picsum.photos/400/300?random=12',
        location: 'City Park',
      ),
      TimelineEvent(
        id: '4',
        title: 'Became Official',        description: 'The day we decided to make it official! From that moment, we became a team, ready to face the world together.',
        date: now.subtract(const Duration(days: 900)),
        icon: Icons.favorite,
        color: Colors.orange,
        category: 'Milestone',
        imageUrl: 'https://picsum.photos/400/300?random=13',
        location: 'Our Special Place',
      ),
      TimelineEvent(
        id: '5',
        title: 'First Trip Together',
        description: 'Our first adventure together! Exploring new places hand in hand, creating memories that would last a lifetime.',
        date: now.subtract(const Duration(days: 750)),
        icon: Icons.flight,
        color: Colors.blue,
        category: 'Adventure',
        imageUrl: 'https://picsum.photos/400/300?random=14',
        location: 'Mountain Resort',
      ),
      TimelineEvent(
        id: '6',
        title: 'Moving In Together',
        description: 'The big step! Moving in together and creating our own little world filled with love, laughter, and endless possibilities.',
        date: now.subtract(const Duration(days: 600)),
        icon: Icons.home,
        color: Colors.green,
        category: 'Milestone',
        imageUrl: 'https://picsum.photos/400/300?random=15',
        location: 'Our First Home',
      ),
      TimelineEvent(
        id: '7',
        title: 'The Proposal',
        description: 'The most magical day! When you got down on one knee and asked me to be your forever. Of course, the answer was YES! 💍',
        date: now.subtract(const Duration(days: 400)),
        icon: Icons.diamond,
        color: Colors.amber,
        category: 'Milestone',
        imageUrl: 'https://picsum.photos/400/300?random=16',
        location: 'Beach Sunset',
      ),
      TimelineEvent(
        id: '8',
        title: 'Engagement Party',
        description: 'Celebrating our engagement with family and friends. So much love and joy surrounded us on this special day.',
        date: now.subtract(const Duration(days: 350)),
        icon: Icons.celebration,
        color: Colors.teal,
        category: 'Celebration',
        imageUrl: 'https://picsum.photos/400/300?random=17',
        location: 'Garden Venue',
      ),
      TimelineEvent(
        id: '9',
        title: 'Our Wedding Day',
        description: 'The most beautiful day of our lives! Saying "I do" in front of our loved ones and promising to love each other forever.',
        date: now.subtract(const Duration(days: 200)),
        icon: Icons.church,
        color: Colors.deepPurple,
        category: 'Milestone',
        imageUrl: 'https://picsum.photos/400/300?random=18',
        location: 'Beautiful Chapel',
      ),
      TimelineEvent(
        id: '10',
        title: 'Honeymoon',
        description: 'Paradise found! Our dreamy honeymoon where we celebrated our new life together in the most romantic setting.',
        date: now.subtract(const Duration(days: 190)),
        icon: Icons.beach_access,
        color: Colors.cyan,
        category: 'Adventure',
        imageUrl: 'https://picsum.photos/400/300?random=19',
        location: 'Tropical Paradise',
      ),
      TimelineEvent(
        id: '11',
        title: 'First Anniversary',
        description: 'One year of marriage! Celebrating how far we\'ve come and looking forward to all the adventures ahead.',
        date: now.subtract(const Duration(days: 100)),
        icon: Icons.cake,
        color: Colors.pink,
        category: 'Anniversary',
        imageUrl: 'https://picsum.photos/400/300?random=20',
        location: 'Romantic Restaurant',
      ),
      TimelineEvent(
        id: '12',
        title: 'Today',
        description: 'Every day with you is a gift. Here\'s to many more beautiful moments, adventures, and anniversaries together! ❤️',
        date: now,
        icon: Icons.today,
        color: Colors.red,
        category: 'Present',
        imageUrl: 'https://picsum.photos/400/300?random=21',
        location: 'Here & Now',
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Animated background
          const FloatingBubbles(
            numberOfBubbles: 20,
            animationDuration: Duration(seconds: 30),
          ),
          
          // Main content
          FadeTransition(
            opacity: _fadeController,
            child: CustomScrollView(
              controller: _scrollController,
              slivers: [
                SliverAppBar(
                  expandedHeight: 200,
                  pinned: true,
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                  flexibleSpace: FlexibleSpaceBar(
                    title: const RomanticText(
                      'Our Journey',
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
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Colors.purple.withOpacity(0.8),
                            Colors.pink.withOpacity(0.6),
                          ],
                        ),
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.timeline,
                          size: 60,
                          color: Colors.white70,
                        ),
                      ),
                    ),
                  ),
                ),
                
                SliverPadding(
                  padding: const EdgeInsets.all(16),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        return SlideTransition(
                          position: Tween<Offset>(
                            begin: Offset(index.isEven ? -1.0 : 1.0, 0.0),
                            end: Offset.zero,
                          ).animate(CurvedAnimation(
                            parent: _slideController,
                            curve: Interval(
                              index * 0.1,
                              (index * 0.1) + 0.3,
                              curve: Curves.easeOut,
                            ),
                          )),
                          child: _buildTimelineItem(_events[index], index),
                        );
                      },
                      childCount: _events.length,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(TimelineEvent event, int index) {
    final isEven = index.isEven;
    
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        children: [
          // Left side content (for even indices)
          if (isEven) ...[
            Expanded(
              child: _buildEventCard(event, isLeft: true),
            ),
            const SizedBox(width: 16),
          ] else ...[
            const Expanded(child: SizedBox()),
            const SizedBox(width: 16),
          ],
          
          // Center timeline
          Column(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: event.color,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: event.color.withOpacity(0.3),
                      blurRadius: 10,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Icon(
                  event.icon,
                  color: Colors.white,
                  size: 30,
                ),
              ),
              if (index < _events.length - 1)
                Container(
                  width: 3,
                  height: 100,
                  color: Colors.grey[300],
                ),
            ],
          ),
          
          // Right side content (for odd indices)
          if (!isEven) ...[
            const SizedBox(width: 16),
            Expanded(
              child: _buildEventCard(event, isLeft: false),
            ),
          ] else ...[
            const SizedBox(width: 16),
            const Expanded(child: SizedBox()),
          ],
        ],
      ),
    );
  }

  Widget _buildEventCard(TimelineEvent event, {required bool isLeft}) {
    return RomanticCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image
          if (event.imageUrl != null)
            Container(
              height: 120,
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
                image: DecorationImage(
                  image: NetworkImage(event.imageUrl!),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Category badge
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: event.color.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    event.category,
                    style: TextStyle(
                      color: event.color,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                
                const SizedBox(height: 8),
                
                // Title
                Text(
                  event.title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                
                const SizedBox(height: 4),
                
                // Date
                Text(
                  _formatDate(event.date),
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
                
                const SizedBox(height: 8),
                
                // Description
                Text(
                  event.description,
                  style: const TextStyle(
                    fontSize: 14,
                    height: 1.4,
                  ),
                ),
                
                const SizedBox(height: 8),
                
                // Location
                if (event.location.isNotEmpty)
                  Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        size: 14,
                        color: event.color,
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          event.location,
                          style: TextStyle(
                            fontSize: 12,
                            color: event.color,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ),
                    ],
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }
}

class TimelineEvent {
  final String id;
  final String title;
  final String description;
  final DateTime date;
  final IconData icon;
  final Color color;
  final String category;
  final String? imageUrl;
  final String location;

  TimelineEvent({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
    required this.icon,
    required this.color,
    required this.category,
    this.imageUrl,
    required this.location,
  });
}
