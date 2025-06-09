import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimation } from 'framer-motion'
import { Heart, Sparkles, Calendar, Music, Camera, BookOpen } from 'lucide-react'
import FloatingBubbles from '../../components/effects/FloatingBubbles'
import TimeCalculator from '../../components/features/TimeCalculator'
import { useTheme } from '../../contexts/ThemeContext'
import { useNotify } from '../../contexts/NotificationContext'

// Enhanced navigation items with 3D effects
const navigationItems = [
  {
    id: 'love-story',
    title: 'Our Love Story',
    description: 'Journey through our beautiful story',
    icon: BookOpen,
    color: 'from-pink-500 to-rose-500',
    delay: 0.1
  },
  {
    id: 'photo-gallery',
    title: 'Photo Gallery',
    description: 'Cherished memories captured',
    icon: Camera,
    color: 'from-purple-500 to-pink-500',
    delay: 0.2
  },
  {
    id: 'anniversary',
    title: 'Anniversary',
    description: 'Celebrating our special day',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    delay: 0.3
  },
  {
    id: 'music-playlist',
    title: 'Our Songs',
    description: 'Music that tells our story',
    icon: Music,
    color: 'from-indigo-500 to-purple-500',
    delay: 0.4
  },
  {
    id: 'countdown',
    title: 'Countdown',
    description: 'Time since we found each other',
    icon: Calendar,
    color: 'from-emerald-500 to-teal-500',
    delay: 0.5
  },
  {
    id: 'special-dates',
    title: 'Special Dates',
    description: 'Milestones in our journey',
    icon: Sparkles,
    color: 'from-yellow-500 to-orange-500',
    delay: 0.6
  }
]

const HomePage: React.FC = () => {
  const [typedText, setTypedText] = useState('')
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const controls = useAnimation()
  useTheme()
  const notify = useNotify()

  const messages = [
    "From June 16, 2024 to forever... ✨",
    "Every moment with you is magical.. 🌟",
    "You are my greatest blessing 💕",
    "My sweet Jerry, my everything ❤️",
    "Together we create beautiful memories 📸",
    "Our love story continues to unfold 📖"
  ]

  const typewriterEffect = useCallback(() => {
    let timeout: NodeJS.Timeout
    const currentMessage = messages[currentMessageIndex]

    if (isTyping) {
      if (typedText.length < currentMessage.length) {
        timeout = setTimeout(() => {
          setTypedText(currentMessage.slice(0, typedText.length + 1))
        }, 50)
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      }
    } else {
      if (typedText.length > 0) {
        timeout = setTimeout(() => {
          setTypedText(typedText.slice(0, -1))
        }, 30)
      } else {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [typedText, currentMessageIndex, isTyping, messages])

  useEffect(() => {
    const cleanup = typewriterEffect()
    return cleanup
  }, [typewriterEffect])

  useEffect(() => {
    // Welcome animation sequence
    const timer = setTimeout(() => {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.6 }
      })
    }, 500)
    return () => clearTimeout(timer)
  }, [controls])

  const handleJourneyStart = () => {
    notify.love(
      "Journey Started! 🎉",
      "Welcome to our beautiful love story, my sweet Jerry! 💕"
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-8">
      {/* Floating Bubbles Background */}
      <FloatingBubbles />

      {/* Main Content */}
      <motion.div
        className="text-center w-full max-w-6xl z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.section className="mb-12" variants={itemVariants}>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold gradient-text mb-6 font-dancing leading-tight"
            variants={floatingVariants}
            animate="animate"
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="inline-block w-12 h-12 md:w-16 md:h-16 mr-4 text-pink-500" />
            For My Sweet Jerry
            <Heart className="inline-block w-12 h-12 md:w-16 md:h-16 ml-4 text-pink-500" />
          </motion.h1>

          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl text-pink-700 dark:text-pink-300 mb-8 font-dancing leading-relaxed"
            variants={itemVariants}
          >
            My Dearest <span className="text-red-500 font-semibold">Pujuu (Jerry)</span> 🐭
          </motion.h2>

          {/* Typewriter Effect */}
          <motion.div
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed glassmorphism rounded-2xl p-6"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <span className="border-r-2 border-pink-500 animate-pulse">
              {typedText}
            </span>
          </motion.div>

          {/* Call to Action Button */}
          <motion.div variants={itemVariants}>
            <Link
              to="/countdown"
              onClick={handleJourneyStart}
              className="group inline-block"
            >
              <motion.div
                className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(236, 72, 153, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-6 h-6 group-hover:animate-spin" />
                Start Our Anniversary Journey
                <Calendar className="w-6 h-6" />
              </motion.div>
            </Link>
          </motion.div>

          <motion.p
            className="text-base text-pink-600 dark:text-pink-400 mt-6 font-dancing"
            variants={itemVariants}
          >
            With all my love, Your Mankada (Soumya) 💖
          </motion.p>
        </motion.section>

        {/* Time Calculator Section */}
        <motion.section className="mb-12" variants={itemVariants}>
          <TimeCalculator
            className="max-w-5xl mx-auto"
            showMilestones={true}
            showAnalytics={true}
          />
        </motion.section>

        {/* Enhanced 3D Navigation Cards */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
        >
          {navigationItems.map((item) => (
            <motion.div
              key={item.id}
              className="card-3d perspective-1000"
              variants={itemVariants}
              custom={item.delay}
              whileHover={{
                scale: 1.05,
                rotateY: 12,
                rotateX: 8,
                transition: { duration: 0.4, ease: 'easeOut' }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="card-3d-inner preserve-3d">
                <Link
                  to={`/${item.id}`}
                  className="block card-3d-face-front glassmorphism-enhanced p-8 rounded-2xl text-center group relative overflow-hidden h-full min-h-[280px] flex flex-col justify-center"
                >
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-25 transition-all duration-500 rounded-2xl`} />
                  
                  {/* Floating icon with enhanced 3D effects */}
                  <motion.div
                    className="relative z-10 mb-6"
                    whileHover={{ 
                      rotateY: [0, 360],
                      scale: [1, 1.2, 1],
                      transition: { duration: 0.6 }
                    }}
                  >
                    <div className="icon-3d-container mx-auto w-20 h-20 mb-4 relative">
                      <div className="icon-3d-shadow absolute inset-0 bg-pink-200 dark:bg-pink-800 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                      <item.icon className="w-full h-full text-pink-500 group-hover:text-pink-400 transition-colors duration-300 relative z-10 drop-shadow-lg" />
                    </div>
                  </motion.div>

                  {/* Enhanced typography with 3D text effects */}
                  <h3 className="text-3d-romantic text-2xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-base text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Shimmer effect overlay */}
                  <div className="shimmer-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  {/* Romantic particle trail on hover */}
                  <div className="particle-trail absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Enhanced hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-pink-400/10 via-purple-400/10 to-pink-400/10 blur-xl"></div>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Footer Message */}
        <motion.div
          className="mt-16 text-center"
          variants={itemVariants}
        >
          <motion.p
            className="text-lg font-dancing text-pink-600 dark:text-pink-400 mb-4"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            "Every love story is beautiful, but ours is my favorite" 💕
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400"
            variants={itemVariants}
          >
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Made with love for Jerry</span>
            <Heart className="w-4 h-4 text-pink-500" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HomePage
