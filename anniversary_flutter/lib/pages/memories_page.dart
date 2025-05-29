import 'package:flutter/material.dart';
import '../widgets/widgets.dart';

class MemoriesPage extends StatefulWidget {
  const MemoriesPage({super.key});

  @override
  State<MemoriesPage> createState() => _MemoriesPageState();
}

class _MemoriesPageState extends State<MemoriesPage>
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _rotateController;
  late AnimationController _heartController;

  List<Memory> _memories = [];
  PageController _pageController = PageController(viewportFraction: 0.85);
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );
    _rotateController = AnimationController(
      duration: const Duration(seconds: 8),
      vsync: this,
    )..repeat();
    _heartController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    )..repeat(reverse: true);
    
    _loadMemories();
    _fadeController.forward();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _rotateController.dispose();
    _heartController.dispose();
    _pageController.dispose();
    super.dispose();
  }

  void _loadMemories() {
    setState(() {
      _memories = _getDemoMemories();
    });
  }

  List<Memory> _getDemoMemories() {
    return [
      Memory(
        id: '1',
        title: 'Love Letter Collection',
        description: 'All the beautiful letters we\'ve written to each other, filled with promises, dreams, and endless love.',
        type: MemoryType.letter,
        content: '''My Dearest Love,

Every morning I wake up grateful for another day to love you. Your smile lights up my darkest days, and your laugh is the melody that makes my heart sing.

I promise to love you through every season of life, through every challenge and celebration. You are my forever, my always, my everything.

With all my love,
Forever yours ❤️''',
        date: DateTime.now().subtract(const Duration(days: 100)),
        color: Colors.pink,
        imageUrl: 'https://picsum.photos/400/300?random=30',
      ),
      Memory(
        id: '2',
        title: 'Our Song Playlist',
        description: 'The soundtrack to our love story - songs that remind us of special moments and make our hearts dance.',
        type: MemoryType.music,
        content: '''♪ Perfect by Ed Sheeran - Our first dance
♪ All of Me by John Legend - Proposal song
♪ A Thousand Years by Christina Perri - Wedding song
♪ Make You Feel My Love by Adele - Rainy day comfort
♪ Can't Help Myself by Four Tops - Kitchen dance song
♪ Thinking Out Loud by Ed Sheeran - Road trip favorite
♪ L-O-V-E by Nat King Cole - Sunday morning song
♪ At Last by Etta James - Anniversary dinner song''',
        date: DateTime.now().subtract(const Duration(days: 200)),
        color: Colors.purple,
        imageUrl: 'https://picsum.photos/400/300?random=31',
      ),
      Memory(
        id: '3',
        title: 'Recipe Collection',
        description: 'All the meals we\'ve cooked together, from disasters to masterpieces. Each recipe tells a story of our journey.',
        type: MemoryType.recipe,
        content: '''🍝 Spaghetti Carbonara - Our first attempt at cooking together (slightly burned, perfectly memorable)

🥘 Mom's Famous Stew - The recipe you taught me that always reminds me of home

🎂 Anniversary Chocolate Cake - Made with extra love and a few tears of joy

🥗 Summer Garden Salad - Fresh from our little herb garden

🍪 Midnight Cookies - For those late-night sweet tooth emergencies

🍕 Friday Night Pizza - Our weekly tradition with extra cheese and laughter''',
        date: DateTime.now().subtract(const Duration(days: 150)),
        color: Colors.orange,
        imageUrl: 'https://picsum.photos/400/300?random=32',
      ),
      Memory(
        id: '4',
        title: 'Travel Journal',
        description: 'Adventures we\'ve shared, places we\'ve explored, and dreams of destinations yet to come.',
        type: MemoryType.travel,
        content: '''🏔️ Mountain Retreat - Where we watched the sunrise and you said you loved me

🏖️ Beach Getaway - Building sandcastles and making wishes on shooting stars

🏛️ City Explorer Weekend - Getting lost in new streets and finding ourselves in each other

🌲 Camping Under Stars - Where we planned our future by the campfire

✈️ Honeymoon Paradise - Seven days that felt like a beautiful dream

🚗 Road Trip Adventures - Miles of music, snacks, and endless conversations''',
        date: DateTime.now().subtract(const Duration(days: 80)),
        color: Colors.blue,
        imageUrl: 'https://picsum.photos/400/300?random=33',
      ),
      Memory(
        id: '5',
        title: 'Funny Moments',
        description: 'All the times we laughed until our stomachs hurt and created inside jokes that only we understand.',
        type: MemoryType.funny,
        content: '''😂 The Great Pasta Disaster - When you forgot water was needed to cook pasta

🤣 Dance-off in the Grocery Store - Embarrassing but totally worth it

😆 Getting Lost with GPS - "In 500 feet, turn left... wait, was that left?"

😂 Halloween Costume Fail - When we both showed up as the same character

🤪 Karaoke Night Champions - Our duet of "Don't Stop Believin'" will go down in history

😁 Pillow Fight Championship - Still debating who actually won''',
        date: DateTime.now().subtract(const Duration(days: 50)),
        color: Colors.green,
        imageUrl: 'https://picsum.photos/400/300?random=34',
      ),
      Memory(
        id: '6',
        title: 'Dreams & Wishes',
        description: 'All the plans we\'ve made, dreams we\'ve shared, and wishes we\'re working to make come true.',
        type: MemoryType.dream,
        content: '''🏡 Our Dream Home - With a big kitchen, cozy reading nook, and garden for herbs

👶 Little Ones - Teaching them to be kind, curious, and full of love

🌍 World Adventures - Paris in spring, Japan for cherry blossoms, Italy for the food

📚 Writing Our Story - Maybe a book about how we met and fell in love

🎨 Creative Projects - Your photography, my writing, our joint masterpiece

💰 Financial Freedom - So we can focus on experiences over things

🌱 Growing Together - Always learning, always loving, always dreaming''',
        date: DateTime.now().subtract(const Duration(days: 10)),
        color: Colors.teal,
        imageUrl: 'https://picsum.photos/400/300?random=35',
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
            numberOfBubbles: 25,
            animationDuration: Duration(seconds: 35),
          ),
          
          // Floating hearts
          Positioned.fill(
            child: CustomPaint(
              painter: HeartsPainter(_heartController.value),
            ),
          ),
          
          // Main content
          FadeTransition(
            opacity: _fadeController,
            child: Column(
              children: [
                // Header
                Container(
                  height: 200,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.pink.withOpacity(0.8),
                        Colors.purple.withOpacity(0.6),
                      ],
                    ),
                  ),
                  child: SafeArea(
                    child: Stack(
                      children: [
                        // Back button
                        Positioned(
                          top: 16,
                          left: 16,
                          child: IconButton(
                            onPressed: () => Navigator.of(context).pop(),
                            icon: const Icon(
                              Icons.arrow_back,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        
                        // Title and rotating heart
                        Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              RotationTransition(
                                turns: _rotateController,
                                child: const Icon(
                                  Icons.favorite,
                                  size: 50,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 16),
                              const RomanticText(
                                'Our Memories',
                                style: TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                  shadows: [
                                    Shadow(
                                      offset: Offset(0, 2),
                                      blurRadius: 4,
                                      color: Colors.black54,
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Treasured moments, preserved forever',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.white.withOpacity(0.9),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                
                // Memory cards
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    onPageChanged: (index) {
                      setState(() {
                        _currentIndex = index;
                      });
                    },
                    itemCount: _memories.length,
                    itemBuilder: (context, index) {
                      return _buildMemoryCard(_memories[index], index);
                    },
                  ),
                ),
                
                // Page indicator
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      _memories.length,
                      (index) => Container(
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        width: _currentIndex == index ? 12 : 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: _currentIndex == index
                              ? Colors.pink
                              : Colors.grey[300],
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
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

  Widget _buildMemoryCard(Memory memory, int index) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 20),
      child: RomanticCard(
        child: Column(
          children: [
            // Header with icon and title
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: memory.color.withOpacity(0.1),
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: memory.color,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      _getMemoryIcon(memory.type),
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          memory.title,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _formatDate(memory.date),
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            
            // Description
            Padding(
              padding: const EdgeInsets.all(20),
              child: Text(
                memory.description,
                style: const TextStyle(
                  fontSize: 14,
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            
            // Content
            Expanded(
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 20),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: SingleChildScrollView(
                  child: Text(
                    memory.content,
                    style: const TextStyle(
                      fontSize: 13,
                      height: 1.5,
                      fontFamily: 'monospace',
                    ),
                  ),
                ),
              ),
            ),
            
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  IconData _getMemoryIcon(MemoryType type) {
    switch (type) {
      case MemoryType.letter:
        return Icons.mail;
      case MemoryType.music:
        return Icons.music_note;
      case MemoryType.recipe:
        return Icons.restaurant;
      case MemoryType.travel:
        return Icons.flight;
      case MemoryType.funny:
        return Icons.emoji_emotions;
      case MemoryType.dream:
        return Icons.star;
    }
  }

  String _formatDate(DateTime date) {
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }
}

class HeartsPainter extends CustomPainter {
  final double animationValue;

  HeartsPainter(this.animationValue);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.pink.withOpacity(0.1)
      ..style = PaintingStyle.fill;

    for (int i = 0; i < 10; i++) {
      final x = (size.width * 0.1) + (i * size.width * 0.08);
      final y = (size.height * 0.3) + 
                (50 * (i % 2)) + 
                (20 * animationValue * (i.isEven ? 1 : -1));
      
      _drawHeart(canvas, paint, Offset(x, y), 8 + (i % 3) * 2);
    }
  }

  void _drawHeart(Canvas canvas, Paint paint, Offset center, double size) {
    final path = Path();
    
    path.moveTo(center.dx, center.dy + size * 0.3);
    
    path.cubicTo(
      center.dx - size * 0.5, center.dy - size * 0.1,
      center.dx - size * 0.5, center.dy - size * 0.5,
      center.dx, center.dy - size * 0.2,
    );
    
    path.cubicTo(
      center.dx + size * 0.5, center.dy - size * 0.5,
      center.dx + size * 0.5, center.dy - size * 0.1,
      center.dx, center.dy + size * 0.3,
    );
    
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

enum MemoryType {
  letter,
  music,
  recipe,
  travel,
  funny,
  dream,
}

class Memory {
  final String id;
  final String title;
  final String description;
  final MemoryType type;
  final String content;
  final DateTime date;
  final Color color;
  final String? imageUrl;

  Memory({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.content,
    required this.date,
    required this.color,
    this.imageUrl,
  });
}
