import React, { useState, useEffect } from 'react';
import { useTogetherStats, useMilestoneTracker } from '../hooks/useTogetherStats';
import { useResponsive } from '../hooks/useResponsive';

interface TogetherCalculatorProps {
  className?: string;
  showMilliseconds?: boolean;
  showMilestones?: boolean;
  theme?: 'romantic' | 'elegant' | 'playful';
}

const TogetherCalculator: React.FC<TogetherCalculatorProps> = ({
  className = '',
  showMilliseconds = false,
  showMilestones = true,
  theme = 'romantic'
}) => {
  const { isMobile, isTablet } = useResponsive();
  const stats = useTogetherStats({ includeMilliseconds: showMilliseconds });
  const milestoneTracker = useMilestoneTracker();
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation on significant changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [stats.totalDays, stats.totalHours]);

  const themeClasses = {
    romantic: 'bg-gradient-to-br from-pink-50 to-rose-100 border-pink-200',
    elegant: 'bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-200',
    playful: 'bg-gradient-to-br from-yellow-50 to-orange-100 border-orange-200'
  };

  const textTheme = {
    romantic: {
      primary: 'text-pink-600',
      secondary: 'text-rose-500',
      accent: 'text-pink-700'
    },
    elegant: {
      primary: 'text-purple-600',
      secondary: 'text-indigo-500',
      accent: 'text-purple-700'
    },
    playful: {
      primary: 'text-orange-600',
      secondary: 'text-yellow-600',
      accent: 'text-orange-700'
    }
  };

  const StatCard: React.FC<{ 
    label: string; 
    value: number; 
    suffix?: string;
    highlight?: boolean;
  }> = ({ label, value, suffix = '', highlight = false }) => (
    <div className={`
      relative overflow-hidden rounded-lg border-2 transition-all duration-300
      ${highlight ? 'border-pink-300 shadow-lg scale-105' : 'border-pink-200 shadow-md'}
      ${isAnimating ? 'animate-pulse' : ''}
      bg-white/70 backdrop-blur-sm
      ${isMobile ? 'p-3' : 'p-4'}
    `}>
      <div className="text-center">
        <div className={`
          font-bold transition-all duration-300
          ${textTheme[theme].primary}
          ${isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl'}
          ${highlight ? 'animate-bounce' : ''}
        `}>
          {value.toLocaleString()}{suffix}
        </div>
        <div className={`
          font-medium capitalize
          ${textTheme[theme].secondary}
          ${isMobile ? 'text-xs' : 'text-sm'}
        `}>
          {label}
        </div>
      </div>
      
      {/* Decorative heart for special numbers */}
      {(value % 100 === 0 && value > 0) && (
        <div className="absolute top-1 right-1 text-pink-400 animate-ping">
          💕
        </div>
      )}
    </div>
  );

  const MilestoneCard: React.FC<{ name: string; achieved: boolean }> = ({ name, achieved }) => (
    <div className={`
      flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300
      ${achieved 
        ? 'bg-green-100 border-green-300 text-green-700' 
        : 'bg-gray-100 border-gray-300 text-gray-500'
      }
      ${isMobile ? 'text-xs' : 'text-sm'}
    `}>
      <span className={achieved ? '✓' : '○'}></span>
      <span className="font-medium">{name}</span>
      {achieved && <span className="text-green-500">🎉</span>}
    </div>
  );

  return (
    <div className={`
      rounded-2xl border-2 shadow-xl backdrop-blur-sm transition-all duration-500
      ${themeClasses[theme]}
      ${className}
      ${isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'}
    `}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className={`
          font-bold mb-2 font-['Dancing_Script']
          ${textTheme[theme].accent}
          ${isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'}
        `}>
          💕 Together Calculator 💕
        </h2>
        <p className={`
          ${textTheme[theme].secondary}
          ${isMobile ? 'text-sm' : 'text-base'}
        `}>
          Celebrating our journey since June 16, 2024
        </p>
      </div>

      {/* Main Duration Display */}
      <div className="text-center mb-8">
        <div className={`
          font-bold mb-2 font-['Dancing_Script']
          ${textTheme[theme].primary}
          ${isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl'}
        `}>
          {stats.formattedDuration}
        </div>
        
        {showMilliseconds && (
          <div className={`
            font-mono tabular-nums
            ${textTheme[theme].secondary}
            ${isMobile ? 'text-xs' : 'text-sm'}
          `}>
            {stats.milliseconds}ms
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className={`
        grid gap-4 mb-6
        ${isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-4'}
      `}>
        <StatCard 
          label="Total Days" 
          value={stats.totalDays} 
          highlight={stats.totalDays % 100 === 0}
        />
        <StatCard 
          label="Total Hours" 
          value={stats.totalHours}
        />
        <StatCard 
          label="Total Minutes" 
          value={stats.totalMinutes}
        />
        {!isMobile && (
          <StatCard 
            label="Total Seconds" 
            value={stats.totalSeconds}
          />
        )}
      </div>

      {/* Special Moments */}
      <div className={`
        grid gap-4 mb-6
        ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}
      `}>
        <div className="bg-white/50 rounded-lg p-4 border border-pink-200">
          <h3 className={`
            font-semibold mb-3 text-center
            ${textTheme[theme].accent}
            ${isMobile ? 'text-sm' : 'text-base'}
          `}>
            🎁 Special Moments
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`${textTheme[theme].secondary} ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Months Together:
              </span>
              <span className={`font-bold ${textTheme[theme].primary} ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {stats.specialMoments.monthsTogetherCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`${textTheme[theme].secondary} ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Seasons Together:
              </span>
              <span className={`font-bold ${textTheme[theme].primary} ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {stats.specialMoments.seasonsTogetherCount}
              </span>
            </div>
          </div>
        </div>

        {/* Next Milestone */}
        <div className="bg-white/50 rounded-lg p-4 border border-pink-200">
          <h3 className={`
            font-semibold mb-3 text-center
            ${textTheme[theme].accent}
            ${isMobile ? 'text-sm' : 'text-base'}
          `}>
            🎯 Next Milestone
          </h3>
          <div className="text-center">
            <div className={`
              font-bold
              ${textTheme[theme].primary}
              ${isMobile ? 'text-sm' : 'text-base'}
            `}>
              {milestoneTracker.nextMilestone.name}
            </div>
            {milestoneTracker.nextMilestone.days > 0 && (
              <div className={`
                ${textTheme[theme].secondary}
                ${isMobile ? 'text-xs' : 'text-sm'}
              `}>
                in {milestoneTracker.nextMilestone.days} days
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Milestones Progress */}
      {showMilestones && (
        <div className="bg-white/50 rounded-lg p-4 border border-pink-200">
          <h3 className={`
            font-semibold mb-4 text-center
            ${textTheme[theme].accent}
            ${isMobile ? 'text-sm' : 'text-base'}
          `}>
            🏆 Achieved Milestones
          </h3>
          <div className={`
            flex flex-wrap gap-2 justify-center
          `}>
            {milestoneTracker.achievedMilestones.map((milestone, index) => (
              <MilestoneCard 
                key={index}
                name={milestone}
                achieved={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress Bars */}
      <div className="mt-6 space-y-3">
        <div>
          <div className={`
            flex justify-between mb-1
            ${isMobile ? 'text-xs' : 'text-sm'}
            ${textTheme[theme].secondary}
          `}>
            <span>Progress to 5 Years</span>
            <span>{stats.percentage.toFiveYears.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-400 to-rose-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(stats.percentage.toFiveYears, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className={`
            flex justify-between mb-1
            ${isMobile ? 'text-xs' : 'text-sm'}
            ${textTheme[theme].secondary}
          `}>
            <span>Progress to 10 Years</span>
            <span>{stats.percentage.toDecade.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-indigo-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(stats.percentage.toDecade, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="mt-6 text-center">
        <div className={`
          ${textTheme[theme].secondary}
          ${isMobile ? 'text-xs' : 'text-sm'}
        `}>
          💫 That's approximately {Math.floor(stats.totalHours / 24 / 7)} weeks of pure love! 💫
        </div>
      </div>
    </div>
  );
};

export default TogetherCalculator;
