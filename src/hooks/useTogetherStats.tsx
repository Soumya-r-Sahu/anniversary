import { useState, useEffect, useCallback } from 'react';
import type { TogetherStats } from '../types';

export interface TogetherCalculatorOptions {
  startDate?: Date;
  updateInterval?: number;
  includeMilliseconds?: boolean;
}

const TARGET_DATE = new Date(2024, 5, 16, 0, 0, 0, 0); // June 16, 2024

export const useTogetherStats = (options: TogetherCalculatorOptions = {}): TogetherStats => {
  const {
    startDate = TARGET_DATE,
    updateInterval = 1000,
    includeMilliseconds = false
  } = options;

  const [stats, setStats] = useState<TogetherStats>(() => 
    calculateTogetherStats(startDate, includeMilliseconds)
  );

  const calculateTogetherStats = useCallback((start: Date, withMs = false): TogetherStats => {
    const now = new Date();
    const timeDiff = now.getTime() - start.getTime();
    
    if (timeDiff < 0) {
      // If the date is in the future, return zero stats
      return {
        totalDays: 0,
        totalHours: 0,
        totalMinutes: 0,
        totalSeconds: 0,
        totalMilliseconds: 0,
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        formattedDuration: "Not started yet",
        milestones: {
          firstMonth: false,
          firstYear: false,
          firstThreeYears: false,
          firstFiveYears: false,
          firstDecade: false
        },
        percentage: {
          toFirstYear: 0,
          toFiveYears: 0,
          toDecade: 0
        },
        specialMoments: {
          daysTogetherCount: 0,
          hoursTogetherCount: 0,
          monthsTogetherCount: 0,
          seasonsTogetherCount: 0
        }
      };
    }

    // Calculate total time units
    const totalMilliseconds = timeDiff;
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Calculate breakdown
    const years = Math.floor(totalDays / 365.25);
    const remainingDaysAfterYears = totalDays - Math.floor(years * 365.25);
    const months = Math.floor(remainingDaysAfterYears / 30.44);
    const days = Math.floor(remainingDaysAfterYears - (months * 30.44));
    
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;
    const milliseconds = withMs ? totalMilliseconds % 1000 : 0;

    // Format duration string
    let formattedParts: string[] = [];
    if (years > 0) formattedParts.push(`${years} year${years !== 1 ? 's' : ''}`);
    if (months > 0) formattedParts.push(`${months} month${months !== 1 ? 's' : ''}`);
    if (days > 0) formattedParts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) formattedParts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) formattedParts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (withMs && seconds > 0) formattedParts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);

    const formattedDuration = formattedParts.length > 0 
      ? formattedParts.slice(0, 3).join(', ') 
      : "Just started";

    // Calculate milestones
    const milestones = {
      firstMonth: totalDays >= 30,
      firstYear: totalDays >= 365,
      firstThreeYears: totalDays >= (365 * 3),
      firstFiveYears: totalDays >= (365 * 5),
      firstDecade: totalDays >= (365 * 10)
    };

    // Calculate percentage progress
    const percentage = {
      toFirstYear: Math.min((totalDays / 365) * 100, 100),
      toFiveYears: Math.min((totalDays / (365 * 5)) * 100, 100),
      toDecade: Math.min((totalDays / (365 * 10)) * 100, 100)
    };

    // Special moments counting
    const specialMoments = {
      daysTogetherCount: totalDays,
      hoursTogetherCount: totalHours,
      monthsTogetherCount: Math.floor(totalDays / 30.44),
      seasonsTogetherCount: Math.floor(totalDays / 91.25) // ~3 months per season
    };

    return {
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      totalMilliseconds,
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      formattedDuration,
      milestones,
      percentage,
      specialMoments
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(calculateTogetherStats(startDate, includeMilliseconds));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [startDate, updateInterval, includeMilliseconds, calculateTogetherStats]);

  return stats;
};

// Utility hook for specific milestone tracking
export const useMilestoneTracker = (startDate: Date = TARGET_DATE) => {
  const stats = useTogetherStats({ startDate });
  
  const getNextMilestone = useCallback(() => {
    const { totalDays } = stats;
    
    if (totalDays < 30) return { name: "First Month", days: 30 - totalDays };
    if (totalDays < 100) return { name: "100 Days", days: 100 - totalDays };
    if (totalDays < 365) return { name: "First Year", days: 365 - totalDays };
    if (totalDays < 500) return { name: "500 Days", days: 500 - totalDays };
    if (totalDays < 1000) return { name: "1000 Days", days: 1000 - totalDays };
    if (totalDays < (365 * 3)) return { name: "3 Years", days: (365 * 3) - totalDays };
    if (totalDays < (365 * 5)) return { name: "5 Years", days: (365 * 5) - totalDays };
    if (totalDays < (365 * 10)) return { name: "10 Years", days: (365 * 10) - totalDays };
    
    return { name: "Forever", days: 0 };
  }, [stats]);

  const getAchievedMilestones = useCallback(() => {
    const { totalDays } = stats;
    const milestones = [];
    
    if (totalDays >= 1) milestones.push("First Day");
    if (totalDays >= 7) milestones.push("First Week");
    if (totalDays >= 30) milestones.push("First Month");
    if (totalDays >= 100) milestones.push("100 Days");
    if (totalDays >= 365) milestones.push("First Year");
    if (totalDays >= 500) milestones.push("500 Days");
    if (totalDays >= 1000) milestones.push("1000 Days");
    if (totalDays >= (365 * 3)) milestones.push("3 Years");
    if (totalDays >= (365 * 5)) milestones.push("5 Years");
    if (totalDays >= (365 * 10)) milestones.push("10 Years");
    
    return milestones;
  }, [stats]);

  return {
    ...stats,
    nextMilestone: getNextMilestone(),
    achievedMilestones: getAchievedMilestones()
  };
};
