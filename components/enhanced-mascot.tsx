'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, Trophy, Heart, Zap, Target, CheckCircle, AlertCircle } from 'lucide-react';

export type MascotEmotion = 
  | 'happy' 
  | 'excited' 
  | 'encouraging' 
  | 'celebrating' 
  | 'focused' 
  | 'concerned' 
  | 'proud' 
  | 'default';

interface EnhancedMascotProps {
  emotion?: MascotEmotion;
  message?: string;
  showAnimation?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  interactive?: boolean;
}

const emotionConfig = {
  happy: {
    icon: <Heart className="w-full h-full text-pink-500" />,
    bgColor: 'bg-gradient-to-br from-blue-400 to-purple-500',
    message: "Great job! You're becoming a digital defender! 🎉",
    animation: { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }
  },
  excited: {
    icon: <Zap className="w-full h-full text-yellow-400" />,
    bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    message: "Wow! You're on fire today! 🔥",
    animation: { scale: [1, 1.2, 1], y: [0, -10, 0] }
  },
  encouraging: {
    icon: <Target className="w-full h-full text-green-500" />,
    bgColor: 'bg-gradient-to-br from-green-400 to-blue-500',
    message: "You've got this! Keep going! 💪",
    animation: { scale: [1, 1.05, 1], x: [0, 2, 0] }
  },
  celebrating: {
    icon: <Trophy className="w-full h-full text-yellow-500" />,
    bgColor: 'bg-gradient-to-br from-yellow-400 to-red-500',
    message: "Mission accomplished! You're amazing! 🏆",
    animation: { scale: [1, 1.3, 1], rotate: [0, 360] }
  },
  focused: {
    icon: <Shield className="w-full h-full text-blue-500" />,
    bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    message: "Stay focused! You're doing great! 🎯",
    animation: { scale: [1, 1.02, 1] }
  },
  concerned: {
    icon: <AlertCircle className="w-full h-full text-orange-500" />,
    bgColor: 'bg-gradient-to-br from-orange-400 to-red-400',
    message: "Don't worry, let's try again together! 🤝",
    animation: { scale: [1, 0.95, 1], rotate: [0, -2, 2, 0] }
  },
  proud: {
    icon: <Star className="w-full h-full text-yellow-400" />,
    bgColor: 'bg-gradient-to-br from-purple-400 to-pink-500',
    message: "I'm so proud of your progress! ⭐",
    animation: { scale: [1, 1.1, 1], y: [0, -5, 0] }
  },
  default: {
    icon: <Shield className="w-full h-full text-blue-500" />,
    bgColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
    message: "Hi! I'm Luma, your digital security guide! 🛡️",
    animation: { scale: [1, 1.05, 1] }
  }
};

const sizeConfig = {
  small: { width: 'w-16', height: 'h-16', textSize: 'text-xs' },
  medium: { width: 'w-20', height: 'h-20', textSize: 'text-sm' },
  large: { width: 'w-24', height: 'h-24', textSize: 'text-base' }
};

export default function EnhancedMascot({
  emotion = 'default',
  message,
  showAnimation = false,
  className = '',
  size = 'medium',
  onClick,
  interactive = false
}: EnhancedMascotProps) {
  const [currentEmotion, setCurrentEmotion] = useState<MascotEmotion>(emotion);
  const [isAnimating, setIsAnimating] = useState(false);

  const config = emotionConfig[currentEmotion];
  const sizeStyle = sizeConfig[size];

  useEffect(() => {
    setCurrentEmotion(emotion);
  }, [emotion]);

  const handleClick = () => {
    if (interactive && onClick) {
      setIsAnimating(true);
      onClick();
      
      // Reset animation state after animation completes
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const containerVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: showAnimation ? [1, 1.1, 1] : 1,
      transition: { 
        duration: 0.6, 
        ease: "easeInOut",
        repeat: showAnimation ? Infinity : 0,
        repeatDelay: 2
      }
    },
    hover: interactive ? { 
      scale: 1.1, 
      y: -5,
      transition: { duration: 0.2 }
    } : {},
    tap: interactive ? { 
      scale: 0.95,
      transition: { duration: 0.1 }
    } : {}
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    animate: isAnimating ? config.animation : { scale: 1, rotate: 0 },
    hover: interactive ? { 
      scale: 1.1, 
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.3 }
    } : {}
  };

  return (
    <motion.div
      className={`${className} ${interactive ? 'cursor-pointer' : ''}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={handleClick}
    >
      <div className="flex flex-col items-center space-y-3">
        {/* Mascot Icon */}
        <motion.div
          className={`${sizeStyle.width} ${sizeStyle.height} ${config.bgColor} rounded-full flex items-center justify-center shadow-lg border-4 border-white/20`}
          variants={iconVariants}
          animate={isAnimating ? "animate" : "initial"}
        >
          {config.icon}
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className={`${sizeStyle.textSize} font-medium text-primary mb-1`}>
              Luma
            </p>
            <p className={`${sizeStyle.textSize} text-muted-foreground max-w-48`}>
              {message}
            </p>
          </motion.div>
        )}

        {/* Achievement Sparkles */}
        {currentEmotion === 'celebrating' && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${20 + (i * 10)}%`,
                    top: `${30 + (i * 10)}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, -20, -40],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

// Helper component for quick emotion changes
export function MascotWithEmotion({ 
  emotion, 
  message, 
  ...props 
}: EnhancedMascotProps) {
  return (
    <EnhancedMascot
      emotion={emotion}
      message={message || emotionConfig[emotion].message}
      {...props}
    />
  );
}

