import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../shared/widgets/floating_bubbles.dart';
import '../../../shared/widgets/bubble_animation.dart';
import '../../../shared/themes/app_theme.dart';

class LoveStoryPage extends ConsumerStatefulWidget {
  const LoveStoryPage({super.key});

  @override
  ConsumerState<LoveStoryPage> createState() => _LoveStoryPageState();
}

class _LoveStoryPageState extends ConsumerState<LoveStoryPage>
    with TickerProviderStateMixin {
  late AnimationController _heartbeatController;
  late AnimationController _timelineController;
  final ScrollController _scrollController = ScrollController();

  final List<StoryMilestone> milestones = [
    StoryMilestone(
      title: "First Meeting",
      date: "March 15, 2020",
      description: "The day our eyes first met and the world seemed to pause. It was in the coffee shop on Main Street, and I knew immediately that something magical was about to begin.",
      icon: Icons.favorite_border,
      image: "assets/images/first_meeting.jpg",
    ),
    StoryMilestone(
      title: "First Date",
      date: "April 2, 2020",
      description: "Our first official date at the botanical gardens. We walked for hours, talking about everything and nothing, completely lost in each other's company.",
      icon: Icons.local_florist,
      image: "assets/images/first_date.jpg",
    ),
    StoryMilestone(
      title: "First 'I Love You'",
      date: "June 18, 2020",
      description: "Under the stars at the beach, you whispered those three magical words that changed everything. The waves witnessed our love declaration.",
      icon: Icons.star,
      image: "assets/images/first_i_love_you.jpg",
    ),
    StoryMilestone(
      title: "Moving In Together",
      date: "October 10, 2020",
      description: "The day we decided to build a home together. Boxes everywhere, but our hearts were full knowing we were starting this beautiful journey.",
      icon: Icons.home,
      image: "assets/images/moving_in.jpg",
    ),
    StoryMilestone(
      title: "The Proposal",
      date: "December 24, 2021",
      description: "Christmas Eve magic when you got down on one knee. The ring sparkled, but not as much as the tears of joy in our eyes.",
      icon: Icons.diamond,
      image: "assets/images/proposal.jpg",
    ),
    StoryMilestone(
      title: "Our Wedding",
      date: "September 15, 2022",
      description: "The most beautiful day of our lives. Surrounded by family and friends, we promised to love each other forever and always.",
      icon: Icons.favorite,
      image: "assets/images/wedding.jpg",
    ),
  ];

  @override
  void initState() {
    super.initState();
    _heartbeatController = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    )..repeat(reverse: true);

    _timelineController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );

    // Start timeline animation after a short delay
    Future.delayed(const Duration(milliseconds: 500), () {
      _timelineController.forward();
    });
  }

  @override
  void dispose() {
    _heartbeatController.dispose();
    _timelineController.dispose();
    _scrollController.dispose();
    super.dispose();
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
                flexibleSpace: FlexibleSpaceBar(
                  centerTitle: true,
                  title: BubbleAnimationWidget(
                    child: AnimatedBuilder(
                      animation: _heartbeatController,
                      builder: (context, child) {
                        return Transform.scale(
                          scale: 1.0 + (_heartbeatController.value * 0.1),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.favorite,
                                color: AppTheme.primaryColor,
                                size: 24,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Our Love Story',
                                style: AppTheme.headingStyle.copyWith(
                                  fontSize: 20,
                                  color: AppTheme.textColor,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Icon(
                                Icons.favorite,
                                color: AppTheme.primaryColor,
                                size: 24,
                              ),
                            ],
                          ),
                        );
                      },
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

              // Love story timeline
              SliverPadding(
                padding: const EdgeInsets.all(20),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final milestone = milestones[index];
                      final isEven = index % 2 == 0;
                      
                      return AnimatedBuilder(
                        animation: _timelineController,
                        builder: (context, child) {
                          final itemProgress = Curves.easeOutBack.transform(
                            (_timelineController.value * milestones.length - index)
                                .clamp(0.0, 1.0),
                          );
                          
                          return Transform.translate(
                            offset: Offset(
                              isEven ? -50 * (1 - itemProgress) : 50 * (1 - itemProgress),
                              0,
                            ),
                            child: Opacity(
                              opacity: itemProgress,
                              child: MilestoneCard(
                                milestone: milestone,
                                isEven: isEven,
                                index: index,
                              ),
                            ),
                          );
                        },
                      );
                    },
                    childCount: milestones.length,
                  ),
                ),
              ),

              // Footer message
              SliverPadding(
                padding: const EdgeInsets.all(40),
                sliver: SliverToBoxAdapter(
                  child: BubbleAnimationWidget(
                    child: Container(
                      padding: const EdgeInsets.all(30),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: AppTheme.primaryColor.withOpacity(0.3),
                          width: 1,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.primaryColor.withOpacity(0.1),
                            blurRadius: 20,
                            spreadRadius: 2,
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Icon(
                            Icons.favorite,
                            color: AppTheme.primaryColor,
                            size: 40,
                          )
                              .animate(onPlay: (controller) => controller.repeat())
                              .scale(
                                duration: 1000.ms,
                                begin: const Offset(1.0, 1.0),
                                end: const Offset(1.2, 1.2),
                              )
                              .then()
                              .scale(
                                duration: 1000.ms,
                                begin: const Offset(1.2, 1.2),
                                end: const Offset(1.0, 1.0),
                              ),
                          const SizedBox(height: 20),
                          Text(
                            "Every moment with you is a new chapter in our beautiful love story. Here's to many more years of love, laughter, and endless adventures together! 💕",
                            style: AppTheme.bodyStyle.copyWith(
                              fontSize: 16,
                              fontStyle: FontStyle.italic,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class MilestoneCard extends StatelessWidget {
  final StoryMilestone milestone;
  final bool isEven;
  final int index;

  const MilestoneCard({
    super.key,
    required this.milestone,
    required this.isEven,
    required this.index,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 20),
      child: Row(
        children: [
          if (!isEven) const Expanded(child: SizedBox()),
          
          // Timeline line and icon
          Column(
            children: [
              Container(
                width: 4,
                height: 30,
                color: AppTheme.primaryColor.withOpacity(0.3),
              ),
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.primaryColor.withOpacity(0.3),
                      blurRadius: 10,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Icon(
                  milestone.icon,
                  color: Colors.white,
                  size: 30,
                ),
              )
                  .animate()
                  .scale(
                    duration: 600.ms,
                    delay: Duration(milliseconds: index * 200),
                  )
                  .then()
                  .shimmer(
                    duration: 1000.ms,
                    color: Colors.white.withOpacity(0.5),
                  ),
              Container(
                width: 4,
                height: 30,
                color: AppTheme.primaryColor.withOpacity(0.3),
              ),
            ],
          ),
          
          const SizedBox(width: 20),
          
          // Content card
          Expanded(
            flex: 2,
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
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.primaryColor.withOpacity(0.1),
                      blurRadius: 15,
                      spreadRadius: 1,
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      milestone.title,
                      style: AppTheme.headingStyle.copyWith(
                        fontSize: 18,
                        color: AppTheme.primaryColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      milestone.date,
                      style: AppTheme.bodyStyle.copyWith(
                        fontSize: 14,
                        color: AppTheme.accentColor,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      milestone.description,
                      style: AppTheme.bodyStyle.copyWith(fontSize: 14),
                    ),
                    if (milestone.image.isNotEmpty) ...[
                      const SizedBox(height: 15),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: Container(
                          height: 120,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(
                            Icons.photo,
                            size: 40,
                            color: AppTheme.primaryColor.withOpacity(0.5),
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
          
          if (isEven) const Expanded(child: SizedBox()),
        ],
      ),
    );
  }
}

class StoryMilestone {
  final String title;
  final String date;
  final String description;
  final IconData icon;
  final String image;

  StoryMilestone({
    required this.title,
    required this.date,
    required this.description,
    required this.icon,
    this.image = '',
  });
}
