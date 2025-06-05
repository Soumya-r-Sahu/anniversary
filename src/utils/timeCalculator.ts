
// Time Calculator Utilities - Enhanced for Dark Romantic Theme
export interface TimeData {
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  percentage: number;
  nextMilestone: {
    name: string;
    emoji: string;
    days: number;
    daysRemaining: number;
    progress: number;
  } | null;
}

// Anniversary start date - June 16, 2024
const ANNIVERSARY_START = new Date(2024, 5, 16, 0, 0, 0); // Month is 0-indexed

export function calculateTimeFromStart(): TimeData {
  const now = new Date();
  const timeDiff = now.getTime() - ANNIVERSARY_START.getTime();
  
  // Calculate total time units
  const totalSeconds = Math.floor(timeDiff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  
  // Calculate remaining time components
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 365 % 30;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;
  
  // Calculate year progress percentage
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
  const yearProgress = ((now.getTime() - yearStart.getTime()) / (yearEnd.getTime() - yearStart.getTime())) * 100;
  
  // Calculate next milestone
  const nextMilestone = calculateNextMilestone(totalDays);
  
  return {
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    percentage: yearProgress,
    nextMilestone
  };
}

function calculateNextMilestone(totalDays: number) {
  const milestones = [
    { days: 100, name: "100 Days Together", emoji: "💯" },
    { days: 200, name: "200 Days of Love", emoji: "💕" },
    { days: 365, name: "One Year Anniversary", emoji: "🎂" },
    { days: 500, name: "500 Days Strong", emoji: "💪" },
    { days: 730, name: "Two Years Together", emoji: "💖" },
    { days: 1000, name: "1000 Days of Love", emoji: "🌟" },
    { days: 1095, name: "Three Years Anniversary", emoji: "🎉" },
    { days: 1460, name: "Four Years Together", emoji: "💝" },
    { days: 1825, name: "Five Years of Love", emoji: "🏆" }
  ];
  
  const nextMilestone = milestones.find(m => m.days > totalDays);
  
  if (nextMilestone) {
    const daysRemaining = nextMilestone.days - totalDays;
    const progress = ((totalDays / nextMilestone.days) * 100);
    
    return {
      name: nextMilestone.name,
      emoji: nextMilestone.emoji,
      days: nextMilestone.days,
      daysRemaining,
      progress
    };
  }
  
  return null;
}

export function formatDuration(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;
  
  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
  
  return parts.join(', ') || '0 seconds';
}

export function getSpecialMessages(timeData: TimeData): string[] {
  const messages = [];
  
  // Special day messages
  if (timeData.totalDays % 100 === 0 && timeData.totalDays > 0) {
    messages.push(`🎉 Today marks ${timeData.totalDays} days of our beautiful journey together!`);
  }
  
  if (timeData.totalDays % 365 === 0 && timeData.totalDays > 0) {
    const years = Math.floor(timeData.totalDays / 365);
    messages.push(`🎂 Happy ${years} year anniversary! What an incredible milestone! 💕`);
  }
  
  // Monthly milestones
  if (timeData.totalDays % 30 === 0 && timeData.totalDays > 0) {
    const months = Math.floor(timeData.totalDays / 30);
    messages.push(`💖 ${months} months of love and counting! 💖`);
  }
  
  return messages;
}