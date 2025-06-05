/**
 * Global Type Definitions for Anniversary Website
 */

export interface TogetherStats {
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  months: number;
  weeks: number;
  anniversaries: number;
  nextMilestone: string;
  nextMilestoneDate: Date;
  relationshipPercentage: number;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  type: 'milestone' | 'memory' | 'special' | 'future';
  significance: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  emotions?: string[];
}

export interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
  date: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  thumbnailUrl?: string;
}

export interface Memory {
  id: string;
  title: string;
  content: string;
  date: string;
  photos: Photo[];
  type: 'sweet' | 'funny' | 'romantic' | 'special';
  mood: 'happy' | 'excited' | 'loving' | 'grateful';
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  category: 'travel' | 'milestone' | 'experience' | 'goal';
  priority: 'low' | 'medium' | 'high';
  timeline: 'short' | 'medium' | 'long';
  status: 'idea' | 'planning' | 'in-progress' | 'completed';
  targetDate?: string;
}

export interface ResponsiveConfig {
  screenSize: ScreenSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  hasTouch: boolean;
  isHighDPI: boolean;
}

export type ScreenSize = 'mobile' | 'tablet' | 'desktop' | 'desktop-lg';

export interface AnimationConfig {
  duration: number;
  particleCount: number;
  enableAdvancedEffects: boolean;
  reducedMotion: boolean;
}

export interface PageConfig {
  enableTimeline: boolean;
  enableMemories: boolean;
  enableAnimations: boolean;
  autoplayMemories: boolean;
  musicEnabled: boolean;
  darkMode: boolean;
}

export interface MilestoneData {
  type: 'days' | 'weeks' | 'months' | 'years';
  value: number;
  message: string;
  celebration: 'hearts' | 'confetti' | 'fireworks' | 'stars';
  isSpecial: boolean;
}

export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
  timeRemaining: number;
}

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon: string;
  description: string;
  isActive: boolean;
}

export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundGradient: string[];
  fontFamily: {
    heading: string;
    body: string;
    script: string;
  };
}
