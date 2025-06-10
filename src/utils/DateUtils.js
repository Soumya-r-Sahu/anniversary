/**
 * DateUtils - Centralized date calculation utilities
 * Extracted from TimeCalculator for better organization
 */

export class DateUtils {
    // Anniversary start date
    static ANNIVERSARY_START = new Date('2024-06-16T00:00:00');

    /**
     * Calculate difference between two dates
     */
    static calculateDifference(targetDate, currentDate = new Date()) {
        const totalMs = Math.abs(targetDate.getTime() - currentDate.getTime());
        const isTargetInFuture = targetDate > currentDate;
        
        // Calculate total units
        const totalSeconds = Math.floor(totalMs / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        
        // Calculate time components
        const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);
        
        return {
            totalDays,
            totalHours,
            totalMinutes,
            totalSeconds,
            days,
            hours,
            minutes,
            seconds,
            isTargetInFuture,
            formatted: this.formatDuration({ days, hours, minutes, seconds })
        };
    }

    /**
     * Calculate time from anniversary start
     */
    static calculateFromStart(currentDate = new Date()) {
        return this.calculateDifference(currentDate, this.ANNIVERSARY_START);
    }

    /**
     * Format duration object to readable string
     */
    static formatDuration({ days, hours, minutes, seconds }) {
        const parts = [];
        
        if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
        if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
        if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
        if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
        
        return parts.join(', ') || '0 seconds';
    }

    /**
     * Get next milestone
     */
    static getNextMilestone(currentDate = new Date()) {
        const timeTogether = this.calculateFromStart(currentDate);
        const { totalDays } = timeTogether;
        
        const milestones = [
            { days: 30, name: "1 Month Together", emoji: "💖" },
            { days: 100, name: "100 Days Together", emoji: "🎉" },
            { days: 365, name: "1 Year Together", emoji: "🎂" },
            { days: 500, name: "500 Days Together", emoji: "🌟" },
            { days: 730, name: "2 Years Together", emoji: "💕" },
            { days: 1000, name: "1000 Days Together", emoji: "🏆" },
            { days: 1095, name: "3 Years Together", emoji: "🎊" }
        ];
        
        return milestones.find(milestone => milestone.days > totalDays) || null;
    }
}
