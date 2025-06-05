import React from 'react'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'hearts' | 'dots' | 'pulse'
  message?: string
  fullScreen?: boolean
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  message = 'Loading our love story...',
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-rose-100 z-50'
    : 'flex items-center justify-center p-8'

  const renderSpinner = () => {
    switch (variant) {
      case 'hearts':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="text-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              >
                💕
              </motion.div>
            ))}
          </div>
        )

      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        )

      case 'pulse':
        return (
          <motion.div
            className={`${sizeClasses[size]} bg-gradient-to-r from-pink-500 to-red-500 rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )

      default:
        return (
          <motion.div
            className={`${sizeClasses[size]} border-4 border-pink-200 border-t-pink-500 rounded-full`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )
    }
  }

  return (
    <div className={`${containerClasses} ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="mb-4 flex justify-center">
          {renderSpinner()}
        </div>
        
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-pink-600 font-medium font-dancing text-lg"
          >
            {message}
          </motion.p>
        )}

        {fullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-sm text-pink-500 font-dancing"
          >
            "Good things take time, just like our love" 💖
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// Skeleton loader component for content loading
export const SkeletonLoader: React.FC<{
  lines?: number
  className?: string
}> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`h-4 bg-pink-200 rounded mb-3 ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  )
}

// Card skeleton for loading cards
export const CardSkeleton: React.FC<{ className?: string }> = ({ 
  className = '' 
}) => {
  return (
    <div className={`animate-pulse bg-white/50 rounded-xl p-6 ${className}`}>
      <div className="h-6 bg-pink-200 rounded mb-4 w-3/4" />
      <div className="space-y-3">
        <div className="h-4 bg-pink-100 rounded w-full" />
        <div className="h-4 bg-pink-100 rounded w-5/6" />
        <div className="h-4 bg-pink-100 rounded w-4/6" />
      </div>
    </div>
  )
}

export default LoadingSpinner
