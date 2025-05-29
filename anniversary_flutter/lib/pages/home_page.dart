import 'package:flutter/material.dart';
import '../services/services.dart';
import '../widgets/widgets.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage>
    with TickerProviderStateMixin {
  final DateCalculationService _dateService = DateCalculationService();
  final StorageService _storageService = StorageService();
  late AnimationController _backgroundController;
  
  AnniversaryDuration? _timeTogether;
  AnniversaryDuration? _timeUntilNext;
  DateTime? _anniversaryDate;
  List<String>? _coupleNames;
  String _customMessage = 'Happy Anniversary! 💕';

  @override
  void initState() {
    super.initState();
    _backgroundController = AnimationController(
      duration: const Duration(seconds: 20),
      vsync: this,
    )..repeat();
    
    _loadAnniversaryData();
  }

  Future<void> _loadAnniversaryData() async {
    await _storageService.initialize();
    
    final anniversaryDate = _storageService.getAnniversaryDate();
    final coupleNames = _storageService.getCoupleNames();
    final message = _storageService.getCustomMessage();
    
    if (anniversaryDate != null) {
      setState(() {
        _anniversaryDate = anniversaryDate;
        _coupleNames = coupleNames;
        _customMessage = message;
        _timeTogether = _dateService.calculateTimeSinceAnniversary(anniversaryDate);
        _timeUntilNext = _dateService.calculateTimeUntilNextAnniversary(anniversaryDate);
      });
    } else {
      // Set default anniversary date for demo
      final defaultDate = DateTime(2023, 2, 14); // Valentine's Day 2023
      await _storageService.setAnniversaryDate(defaultDate);
      await _storageService.setCoupleNames('Love', 'Forever');
      setState(() {
        _anniversaryDate = defaultDate;
        _coupleNames = ['Love', 'Forever'];
        _timeTogether = _dateService.calculateTimeSinceAnniversary(defaultDate);
        _timeUntilNext = _dateService.calculateTimeUntilNextAnniversary(defaultDate);
      });
    }
  }

  @override
  void dispose() {
    _backgroundController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      body: FloatingBubbles(
        numberOfBubbles: 20,
        bubbleColors: BubbleTheme.romantic,
        child: InteractiveBubbles(
          child: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(height: 20),
                  
                  // Header Section
                  _buildHeader(theme),
                  
                  const SizedBox(height: 30),
                  
                  // Time Together Section
                  if (_timeTogether != null) _buildTimeTogetherSection(theme),
                  
                  const SizedBox(height: 30),
                  
                  // Next Anniversary Countdown
                  if (_timeUntilNext != null) _buildCountdownSection(theme),
                  
                  const SizedBox(height: 30),
                  
                  // Quick Actions
                  _buildQuickActions(theme),
                  
                  const SizedBox(height: 30),
                  
                  // Milestones Section
                  if (_anniversaryDate != null) _buildMilestonesSection(theme),
                  
                  const SizedBox(height: 50),
                ],
              ),
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showSettingsDialog,
        backgroundColor: Colors.pink,
        icon: const Icon(Icons.settings, color: Colors.white),
        label: const Text(
          'Settings',
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }

  Widget _buildHeader(ThemeData theme) {
    return RomanticCard(
      addGlow: true,
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              HeartIcon(size: 40, color: Colors.red, animate: true),
              const SizedBox(width: 16),
              Flexible(
                child: Column(
                  children: [
                    if (_coupleNames != null && _coupleNames!.length == 2)
                      ShimmerText(
                        text: '${_coupleNames![0]} & ${_coupleNames![1]}',
                        style: theme.textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Colors.pink.shade700,
                        ),
                      )
                    else
                      ShimmerText(
                        text: 'Our Love Story',
                        style: theme.textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Colors.pink.shade700,
                        ),
                      ),
                    const SizedBox(height: 8),
                    Text(
                      _customMessage,
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: Colors.pink.shade600,
                        fontStyle: FontStyle.italic,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              HeartIcon(size: 40, color: Colors.red, animate: true),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTimeTogetherSection(ThemeData theme) {
    return RomanticCard(
      animationDelay: const Duration(milliseconds: 200),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.favorite, color: Colors.pink, size: 28),
              const SizedBox(width: 8),
              Text(
                'Time Together',
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: theme.colorScheme.primary,
                ),
              ),
              const SizedBox(width: 8),
              Icon(Icons.favorite, color: Colors.pink, size: 28),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            _dateService.formatDuration(_timeTogether!),
            style: theme.textTheme.titleLarge?.copyWith(
              color: Colors.pink.shade600,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          Text(
            'of beautiful moments together 💕',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: Colors.grey.shade600,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildCountdownSection(ThemeData theme) {
    return RomanticCard(
      animationDelay: const Duration(milliseconds: 400),
      child: Column(
        children: [
          Text(
            'Next Anniversary In',
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.primary,
            ),
          ),
          const SizedBox(height: 20),
          if (_timeUntilNext!.days > 0 || _timeUntilNext!.hours > 0)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                if (_timeUntilNext!.days > 0)
                  CountdownDigit(
                    digit: _timeUntilNext!.days.toString(),
                    label: 'Days',
                    size: 0.8,
                  ),
                if (_timeUntilNext!.hours > 0)
                  CountdownDigit(
                    digit: _timeUntilNext!.hours.toString(),
                    label: 'Hours',
                    size: 0.8,
                  ),
                CountdownDigit(
                  digit: _timeUntilNext!.minutes.toString(),
                  label: 'Minutes',
                  size: 0.8,
                ),
              ],
            )
          else
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.pink, Colors.purple],
                ),
                borderRadius: BorderRadius.circular(15),
              ),
              child: Text(
                '🎉 Happy Anniversary! 🎉',
                style: theme.textTheme.headlineMedium?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildQuickActions(ThemeData theme) {
    return RomanticCard(
      animationDelay: const Duration(milliseconds: 600),
      child: Column(
        children: [
          Text(
            'Explore Together',
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.primary,
            ),
          ),
          const SizedBox(height: 20),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            alignment: WrapAlignment.center,
            children: [
              _buildActionButton(
                'Timeline',
                Icons.timeline,
                [Colors.pink, Colors.purple],
                () => _navigateToPage(context, 'Timeline'),
              ),
              _buildActionButton(
                'Gallery',
                Icons.photo_library,
                [Colors.red, Colors.pink],
                () => _navigateToPage(context, 'Gallery'),
              ),
              _buildActionButton(
                'Memories',
                Icons.favorite_border,
                [Colors.purple, Colors.deepPurple],
                () => _navigateToPage(context, 'Memories'),
              ),
              _buildActionButton(
                'Messages',
                Icons.message,
                [Colors.orange, Colors.red],
                () => _navigateToPage(context, 'Messages'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
    String label,
    IconData icon,
    List<Color> colors,
    VoidCallback onPressed,
  ) {
    return GradientButton(
      onPressed: onPressed,
      gradientColors: colors,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 20),
          const SizedBox(width: 8),
          Text(label),
        ],
      ),
    );
  }

  Widget _buildMilestonesSection(ThemeData theme) {
    final milestones = _dateService.getAnniversaryMilestones(_anniversaryDate!);
    
    if (milestones.isEmpty) return const SizedBox.shrink();
    
    return RomanticCard(
      animationDelay: const Duration(milliseconds: 800),
      child: Column(
        children: [
          Text(
            'Milestones Achieved',
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.primary,
            ),
          ),
          const SizedBox(height: 16),
          ...milestones.take(3).map((milestone) => Padding(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Row(
              children: [
                Text(
                  milestone.icon,
                  style: const TextStyle(fontSize: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    milestone.title,
                    style: theme.textTheme.bodyLarge?.copyWith(
                      fontWeight: milestone.isSpecial ? FontWeight.bold : FontWeight.normal,
                      color: milestone.isSpecial ? Colors.pink.shade700 : null,
                    ),
                  ),
                ),
                if (milestone.isSpecial)
                  Icon(
                    Icons.star,
                    color: Colors.amber,
                    size: 20,
                  ),
              ],
            ),
          )).toList(),
        ],
      ),
    );
  }

  void _navigateToPage(BuildContext context, String pageName) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$pageName page is being developed! 💕'),
        duration: const Duration(seconds: 2),
        backgroundColor: Colors.pink,
      ),
    );
  }

  void _showSettingsDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Icon(Icons.settings, color: Colors.pink),
            const SizedBox(width: 8),
            const Text('Settings'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: Icon(Icons.date_range, color: Colors.pink),
              title: const Text('Anniversary Date'),
              subtitle: Text(_anniversaryDate?.toString().split(' ')[0] ?? 'Not set'),
              onTap: () {
                Navigator.pop(context);
                _showDatePicker();
              },
            ),
            ListTile(
              leading: Icon(Icons.people, color: Colors.pink),
              title: const Text('Couple Names'),
              subtitle: Text(
                _coupleNames?.join(' & ') ?? 'Not set',
              ),
              onTap: () {
                Navigator.pop(context);
                _showNamesDialog();
              },
            ),
            ListTile(
              leading: Icon(Icons.message, color: Colors.pink),
              title: const Text('Custom Message'),
              subtitle: Text(_customMessage),
              onTap: () {
                Navigator.pop(context);
                _showMessageDialog();
              },
            ),
          ],
        ),
        actions: [
          GradientButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showDatePicker() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _anniversaryDate ?? DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    
    if (date != null) {
      await _storageService.setAnniversaryDate(date);
      _loadAnniversaryData();
    }
  }

  void _showNamesDialog() {
    final name1Controller = TextEditingController(
      text: _coupleNames?[0] ?? '',
    );
    final name2Controller = TextEditingController(
      text: _coupleNames?[1] ?? '',
    );
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Couple Names'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: name1Controller,
              decoration: const InputDecoration(
                labelText: 'First Name',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: name2Controller,
              decoration: const InputDecoration(
                labelText: 'Second Name',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          GradientButton(
            onPressed: () async {
              if (name1Controller.text.isNotEmpty && 
                  name2Controller.text.isNotEmpty) {
                await _storageService.setCoupleNames(
                  name1Controller.text,
                  name2Controller.text,
                );
                _loadAnniversaryData();
                Navigator.pop(context);
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _showMessageDialog() {
    final messageController = TextEditingController(text: _customMessage);
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Custom Message'),
        content: TextField(
          controller: messageController,
          decoration: const InputDecoration(
            labelText: 'Anniversary Message',
            border: OutlineInputBorder(),
          ),
          maxLines: 3,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          GradientButton(
            onPressed: () async {
              if (messageController.text.isNotEmpty) {
                await _storageService.setCustomMessage(messageController.text);
                _loadAnniversaryData();
                Navigator.pop(context);
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
}
