import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Heart, TrendingUp, Award, Sparkles } from 'lucide-react'
import { calculateTimeFromStart, formatDuration, getSpecialMessages } from '../../utils/timeCalculator'
import { useNotify } from '../../contexts/NotificationContext'
import { SkeletonLoader } from '../ui/LoadingSpinner'

interface TimeCalculatorProps {
  className?: string
  showMilestones?: boolean
  showAnalytics?: boolean
  compact?: boolean
}

interface TimeData {
  totalDays: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  percentage: number
  nextMilestone: {
    name: string
    emoji: string
    days: number
    daysRemaining: number
    progress: number
  } | null
}

const TimeCalculator: React.FC<TimeCalculatorProps> = ({
  className = '',
  showMilestones = true,
  showAnalytics = true,
  compact = false
}) => {
  const [timeData, setTimeData] = useState<TimeData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [lastMilestone, setLastMilestone] = useState<number>(0)
  const notify = useNotify()

  // Memoized special messages to prevent unnecessary recalculations
  const specialMessages = useMemo(() => {
    return timeData ? getSpecialMessages(timeData) : []
  }, [timeData?.totalDays])

  useEffect(() => {
    const updateTime = () => {
      const data = calculateTimeFromStart()
      setTimeData(data)
      setIsLoaded(true)

      // Check for milestone notifications
      if (data.totalDays > lastMilestone && data.totalDays % 50 === 0) {
        notify.love(
          `🎉 ${data.totalDays} Days Together!`,
          `What an amazing milestone in our love story! 💕`
        )
        setLastMilestone(data.totalDays)
      }
    }

    // Update immediately
    updateTime()

    // Update every second
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [lastMilestone, notify])

  if (!timeData || !isLoaded) {
    return (
      <div className={`glassmorphism p-8 text-center ${className}`}>
        <SkeletonLoader lines={4} />
      </div>
    )
  }

  // Animation variants for stats
  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      className={`glassmorphism p-8 ${className}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        variants={statVariants}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-dancing gradient-text mb-2"
          animate={{
            textShadow: [
              '0 0 10px rgba(236, 72, 153, 0.5)',
              '0 0 20px rgba(236, 72, 153, 0.8)',
              '0 0 10px rgba(236, 72, 153, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Clock className="inline-block w-8 h-8 mr-2" />
          Our Time Together
          <Heart className="inline-block w-8 h-8 ml-2" />
        </motion.h2>
        <motion.p
          className="text-pink-600 font-medium flex items-center justify-center gap-2"
          variants={statVariants}
        >
          <Calendar className="w-4 h-4" />
          Since June 16, 2024 💕
        </motion.p>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        variants={containerVariants}
      >
        {[
          { value: timeData.totalDays, label: 'Days', icon: Calendar, color: 'from-pink-500 to-rose-500' },
          { value: timeData.totalHours, label: 'Hours', icon: Clock, color: 'from-purple-500 to-pink-500' },
          { value: timeData.totalMinutes, label: 'Minutes', icon: TrendingUp, color: 'from-red-500 to-pink-500' },
          { value: timeData.totalSeconds, label: 'Seconds', icon: Sparkles, color: 'from-pink-500 to-purple-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="text-center p-4 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300"
            variants={statVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2
              }}
            >
              {stat.value.toLocaleString()}
            </motion.div>
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 font-medium">
              <stat.icon className="w-4 h-4" />
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Detailed Breakdown */}
      {!compact && (
        <motion.div
          className="bg-white/30 rounded-xl p-6 mb-6 backdrop-blur-sm border border-white/20"
          variants={statVariants}
        >
          <motion.h3
            className="text-xl font-dancing text-pink-700 mb-4 text-center flex items-center justify-center gap-2"
            variants={statVariants}
          >
            <Calendar className="w-5 h-5" />
            Detailed Breakdown
            <TrendingUp className="w-5 h-5" />
          </motion.h3>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center"
            variants={containerVariants}
          >
            {[
              { value: timeData.years, label: 'Year', show: timeData.years > 0 },
              { value: timeData.months, label: 'Month', show: timeData.months > 0 },
              { value: Math.floor(timeData.totalDays / 7), label: 'Week', show: true },
              { value: timeData.days, label: 'Day', show: true },
              { value: timeData.hours, label: 'Hour', show: true },
              { value: timeData.minutes, label: 'Minute', show: true }
            ].filter(item => item.show).map((item, index) => (
              <motion.div
                key={item.label}
                variants={statVariants}
                whileHover={{ scale: 1.05 }}
                className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                <motion.div
                  className="text-lg font-bold text-pink-600"
                  animate={{
                    color: ['#ec4899', '#f472b6', '#ec4899']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                >
                  {item.value}
                </motion.div>
                <div className="text-sm text-gray-600">
                  {item.label}{item.value !== 1 ? 's' : ''}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Next Milestone */}
      {showMilestones && timeData.nextMilestone && (
        <motion.div
          className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-xl p-6 mb-6 backdrop-blur-sm border border-white/20"
          variants={statVariants}
          whileHover={{ scale: 1.02 }}
        >
          <motion.h3
            className="text-xl font-dancing text-pink-700 dark:text-pink-300 mb-3 text-center flex items-center justify-center gap-2"
            variants={statVariants}
          >
            <Award className="w-5 h-5" />
            Next Milestone
            <Sparkles className="w-5 h-5" />
          </motion.h3>
          <div className="text-center">
            <motion.div
              className="text-2xl mb-2"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              {timeData.nextMilestone.emoji} {timeData.nextMilestone.name}
            </motion.div>
            <motion.div
              className="text-pink-600 dark:text-pink-400 font-medium mb-3"
              variants={statVariants}
            >
              {timeData.nextMilestone.daysRemaining} days to go!
            </motion.div>
            <div className="w-full bg-white/50 dark:bg-gray-700/50 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, timeData.nextMilestone.progress)}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>
            <motion.div
              className="text-sm text-gray-600 dark:text-gray-400 mt-2"
              variants={statVariants}
            >
              {Math.round(timeData.nextMilestone.progress)}% complete
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Special Messages */}
      <AnimatePresence>
        {specialMessages.length > 0 && (
          <motion.div
            className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 rounded-r-xl backdrop-blur-sm"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h3
              className="text-lg font-dancing text-yellow-700 dark:text-yellow-300 mb-2 flex items-center gap-2"
              animate={{
                textShadow: [
                  '0 0 5px rgba(251, 191, 36, 0.5)',
                  '0 0 15px rgba(251, 191, 36, 0.8)',
                  '0 0 5px rgba(251, 191, 36, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5" />
              Special Moment!
            </motion.h3>
            {specialMessages.map((message, index) => (
              <motion.p
                key={index}
                className="text-yellow-600 dark:text-yellow-400 mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                {message}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Year Progress */}
      {showAnalytics && (
        <motion.div
          className="mt-6 text-center"
          variants={statVariants}
        >
          <motion.div
            className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center justify-center gap-2"
            variants={statVariants}
          >
            <TrendingUp className="w-4 h-4" />
            This year together: {timeData.percentage.toFixed(1)}%
          </motion.div>
          <div className="w-full bg-white/50 dark:bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-pink-400 to-red-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, timeData.percentage)}%` }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default TimeCalculator
