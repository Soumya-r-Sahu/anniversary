// Time Calculator from June 16, 2024
export const ANNIVERSARY_START_DATE = new Date('2024-06-16T00:00:00');

export const calculateTimeFromStart = (currentDate = new Date()) => {
  const startDate = ANNIVERSARY_START_DATE;
  const now = currentDate;
  
  // Calculate total milliseconds
  const totalMs = now.getTime() - startDate.getTime();
  
  // If the date is before our start date, return zeros
  if (totalMs < 0) {
    return {
      totalDays: 0,
      totalHours: 0,
      totalMinutes: 0,
      totalSeconds: 0,
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      percentage: 0,
      nextMilestone: null
    };
  }
  
  // Calculate total units
  const totalSeconds = Math.floor(totalMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  
  // Calculate years, months, days
  const years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  if (months < 0) {
    months += 12;
  }
  
  // Calculate remaining time components
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;
  
  // Calculate percentage of current year together
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
  const yearTotal = yearEnd.getTime() - yearStart.getTime();
  const yearTogether = Math.max(0, now.getTime() - Math.max(startDate.getTime(), yearStart.getTime()));
  const percentage = Math.min(100, (yearTogether / yearTotal) * 100);
  
  // Calculate next milestone
  const nextMilestone = getNextMilestone(totalDays);
  
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
    percentage: Math.round(percentage * 100) / 100,
    nextMilestone
  };
};

export const getNextMilestone = (totalDays) => {
  const milestones = [
    { days: 30, name: "1 Month Together", emoji: "🌙" },
    { days: 50, name: "50 Days of Love", emoji: "💝" },
    { days: 100, name: "100 Days Milestone", emoji: "💯" },
    { days: 150, name: "150 Days Strong", emoji: "💪" },
    { days: 180, name: "6 Months Together", emoji: "💕" },
    { days: 200, name: "200 Days of Joy", emoji: "🎉" },
    { days: 250, name: "250 Days Celebration", emoji: "🎊" },
    { days: 300, name: "300 Days of Bliss", emoji: "✨" },
    { days: 365, name: "1 Year Anniversary", emoji: "🎂" },
    { days: 400, name: "400 Days Together", emoji: "🌟" },
    { days: 500, name: "500 Days Milestone", emoji: "🏆" },
    { days: 730, name: "2 Years Together", emoji: "💖" },
    { days: 1000, name: "1000 Days of Love", emoji: "👑" },
    { days: 1095, name: "3 Years Together", emoji: "💎" },
    { days: 1460, name: "4 Years Together", emoji: "🌈" },
    { days: 1825, name: "5 Years Together", emoji: "🎆" }
  ];
  
  for (const milestone of milestones) {
    if (totalDays < milestone.days) {
      return {
        ...milestone,
        daysRemaining: milestone.days - totalDays,
        progress: (totalDays / milestone.days) * 100
      };
    }
  }
  
  // If we've passed all milestones, create a dynamic one
  const nextThousand = Math.ceil(totalDays / 1000) * 1000;
  return {
    days: nextThousand,
    name: `${nextThousand} Days Together`,
    emoji: "🎯",
    daysRemaining: nextThousand - totalDays,
    progress: (totalDays / nextThousand) * 100
  };
};

export const formatDuration = (totalDays) => {
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;
  
  const parts = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  
  if (parts.length === 0) return '0 days';
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts.join(' and ');
  return parts.slice(0, -1).join(', ') + ', and ' + parts[parts.length - 1];
};

export const getSpecialMessages = (timeData) => {
  const { totalDays, years, months } = timeData;
  
  const messages = [];
  
  // Special day messages
  if (totalDays === 100) {
    messages.push("🎉 100 days of pure happiness together!");
  }
  
  if (totalDays === 365) {
    messages.push("🎂 One whole year of beautiful memories!");
  }
  
  if (totalDays % 100 === 0 && totalDays > 0) {
    messages.push(`✨ ${totalDays} days of love and counting!`);
  }
  
  // Monthly messages
  if (months >= 6) {
    messages.push("💕 Half a year of endless love!");
  }
  
  if (years >= 1) {
    messages.push(`💖 ${years} year${years !== 1 ? 's' : ''} of being each other's everything!`);
  }
  
  return messages;
};

export default {
  calculateTimeFromStart,
  getNextMilestone,
  formatDuration,
  getSpecialMessages,
  ANNIVERSARY_START_DATE
};
