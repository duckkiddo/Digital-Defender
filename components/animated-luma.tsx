'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type LumaEmotion = 
  | 'happy' 
  | 'excited' 
  | 'dancing' 
  | 'celebrating' 
  | 'focused' 
  | 'crying' 
  | 'worried' 
  | 'proud' 
  | 'default';

interface AnimatedLumaProps {
  emotion?: LumaEmotion;
  message?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  autoAnimate?: boolean;
  onClick?: () => void;
  messagePlacement?: 'above' | 'below';
}

const emotionConfig = {
  happy: {
    message: "Yay! You're doing great! 🎉",
    bodyColor: "bg-gradient-to-br from-blue-400 to-purple-500",
    eyeColor: "bg-green-500",
    mouth: "😊",
    animation: {
      body: { rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] },
      eyes: { scale: [1, 1.2, 1] },
      mouth: { scale: [1, 1.1, 1] }
    }
  },
  excited: {
    message: "Wow! You're on fire today! 🔥",
    bodyColor: "bg-gradient-to-br from-yellow-400 to-orange-500",
    eyeColor: "bg-yellow-500",
    mouth: "🤩",
    animation: {
      body: { y: [0, -8, 0], rotate: [0, -8, 8, 0] },
      eyes: { scale: [1, 1.3, 1] },
      mouth: { scale: [1, 1.2, 1] }
    }
  },
  dancing: {
    message: "Dance with me! You're amazing! 💃",
    bodyColor: "bg-gradient-to-br from-pink-400 to-purple-500",
    eyeColor: "bg-pink-500",
    mouth: "😄",
    animation: {
      body: { 
        rotate: [0, 15, -15, 15, 0],
        y: [0, -10, 0, -5, 0],
        scale: [1, 1.1, 1, 1.05, 1]
      },
      eyes: { rotate: [0, 5, -5, 0] },
      mouth: { scale: [1, 1.3, 1, 1.2, 1] }
    }
  },
  celebrating: {
    message: "Mission accomplished! You're incredible! 🏆",
    bodyColor: "bg-gradient-to-br from-yellow-400 to-red-500",
    eyeColor: "bg-yellow-500",
    mouth: "🎊",
    animation: {
      body: { 
        rotate: [0, 360],
        scale: [1, 1.4, 1],
        y: [0, -15, 0]
      },
      eyes: { scale: [1, 1.5, 1] },
      mouth: { scale: [1, 1.4, 1] }
    }
  },
  focused: {
    message: "Stay focused! You've got this! 🎯",
    bodyColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
    eyeColor: "bg-blue-500",
    mouth: "🤔",
    animation: {
      body: { scale: [1, 1.02, 1] },
      eyes: { scale: [1, 1.1, 1] },
      mouth: { scale: [1, 1.05, 1] }
    }
  },
  crying: {
    message: "Don't worry! Let's try again together! 😢",
    bodyColor: "bg-gradient-to-br from-blue-300 to-blue-500",
    eyeColor: "bg-blue-400",
    mouth: "😭",
    animation: {
      body: { 
        scale: [1, 0.95, 1],
        rotate: [0, -2, 2, 0],
        y: [0, 2, 0]
      },
      eyes: { 
        scale: [1, 0.8, 1],
        y: [0, 2, 0]
      },
      mouth: { scale: [1, 0.9, 1] }
    }
  },
  worried: {
    message: "Take your time, you can do it! 🤗",
    bodyColor: "bg-gradient-to-br from-orange-400 to-red-400",
    eyeColor: "bg-orange-500",
    mouth: "😰",
    animation: {
      body: { 
        scale: [1, 0.98, 1],
        rotate: [0, -1, 1, 0]
      },
      eyes: { scale: [1, 0.9, 1] },
      mouth: { scale: [1, 0.95, 1] }
    }
  },
  proud: {
    message: "I'm so proud of your progress! ⭐",
    bodyColor: "bg-gradient-to-br from-purple-400 to-pink-500",
    eyeColor: "bg-purple-500",
    mouth: "🥰",
    animation: {
      body: { 
        scale: [1, 1.08, 1],
        y: [0, -3, 0]
      },
      eyes: { scale: [1, 1.2, 1] },
      mouth: { scale: [1, 1.1, 1] }
    }
  },
  default: {
    message: "Hi! I'm Luma, your digital security guide! 🛡️",
    bodyColor: "bg-gradient-to-br from-blue-500 to-purple-600",
    eyeColor: "bg-blue-500",
    mouth: "👋",
    animation: {
      body: { scale: [1, 1.03, 1] },
      eyes: { scale: [1, 1.05, 1] },
      mouth: { scale: [1, 1.02, 1] }
    }
  }
};

const sizeConfig = {
  small: { 
    bodySize: 'w-16 h-16', 
    eyeSize: 'w-3 h-3', 
    textSize: 'text-sm',
    mouthSize: 'text-xl',
    sparkleSize: 'w-1 h-1'
  },
  medium: { 
    bodySize: 'w-20 h-20', 
    eyeSize: 'w-4 h-4', 
    textSize: 'text-base',
    mouthSize: 'text-2xl',
    sparkleSize: 'w-1.5 h-1.5'
  },
  large: { 
    bodySize: 'w-24 h-24', 
    eyeSize: 'w-5 h-5', 
    textSize: 'text-lg',
    mouthSize: 'text-3xl',
    sparkleSize: 'w-2 h-2'
  }
};

export default function AnimatedLuma({
  emotion = 'default',
  message,
  size = 'medium',
  className = '',
  autoAnimate = false,
  onClick,
  messagePlacement = 'below'
}: AnimatedLumaProps) {
  const [currentEmotion, setCurrentEmotion] = useState<LumaEmotion>(emotion);
  const [isAnimating, setIsAnimating] = useState(false);

  const config = emotionConfig[currentEmotion];
  const sizeStyle = sizeConfig[size];
  const displayMessage = message ?? config.message;

  useEffect(() => {
    setCurrentEmotion(emotion);
  }, [emotion]);

  useEffect(() => {
    if (autoAnimate) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [autoAnimate]);

  const bodyVariants = {
    initial: { scale: 1, rotate: 0, y: 0 },
    animate: isAnimating ? config.animation.body : { scale: 1, rotate: 0, y: 0 },
    hover: { 
      scale: 1.1, 
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const eyeVariants = {
    initial: { scale: 1, rotate: 0, y: 0 },
    animate: isAnimating ? config.animation.eyes : { scale: 1, rotate: 0, y: 0 }
  };

  const mouthVariants = {
    initial: { scale: 1 },
    animate: isAnimating ? config.animation.mouth : { scale: 1 }
  };

  return (
    <motion.div
      className={`${className} relative z-20`}
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={bodyVariants}
      onClick={onClick}
      transition={{ 
        duration: 0.8, 
        ease: "easeInOut",
        repeat: isAnimating ? Infinity : 0,
        repeatDelay: 1
      }}
    >
      <div className="flex flex-col items-center space-y-3">
        {/* Message above (optional) */}
        {messagePlacement === 'above' && displayMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center z-20"
          >
            <p className={`${sizeStyle.textSize} font-semibold text-primary mb-1`}>
              Luma
            </p>
            <div className="inline-block max-w-xs md:max-w-sm rounded-xl border bg-white/95 dark:bg-neutral-900/95 shadow-lg ring-1 ring-black/10 dark:ring-white/10 px-3 py-2">
              <p className={`${sizeStyle.textSize} text-black dark:text-white`}>{displayMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Luma's Body */}
        <motion.div
          className={`${sizeStyle.bodySize} ${config.bodyColor} rounded-full relative shadow-lg border-4 border-white/20 overflow-hidden`}
          variants={bodyVariants}
        >
          {/* Eyes */}
          <div className="absolute top-4 left-3 flex space-x-2">
            <motion.div
              className={`${sizeStyle.eyeSize} ${config.eyeColor} rounded-full`}
              variants={eyeVariants}
            />
            <motion.div
              className={`${sizeStyle.eyeSize} ${config.eyeColor} rounded-full`}
              variants={eyeVariants}
            />
          </div>

          {/* Mouth */}
          <motion.div
            className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 ${sizeStyle.mouthSize}`}
            variants={mouthVariants}
          >
            {config.mouth}
          </motion.div>

          {/* Cute Details */}
          <div className="absolute top-2 right-3 w-2 h-2 bg-white/30 rounded-full" />
          <div className="absolute bottom-2 right-4 w-1.5 h-1.5 bg-white/20 rounded-full" />
        </motion.div>

        {/* Message below (default) */}
        {messagePlacement === 'below' && displayMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center z-20"
          >
            <p className={`${sizeStyle.textSize} font-semibold text-primary mb-1`}>
              Luma
            </p>
            <div className="inline-block max-w-xs md:max-w-sm rounded-xl border bg-white/95 dark:bg-neutral-900/95 shadow-lg ring-1 ring-black/10 dark:ring-white/10 px-3 py-2">
              <p className={`${sizeStyle.textSize} text-black dark:text-white`}>{displayMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Celebration Sparkles */}
        {(currentEmotion === 'celebrating' || currentEmotion === 'dancing') && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`${sizeStyle.sparkleSize} bg-yellow-400 rounded-full absolute`}
                  style={{
                    left: `${15 + (i * 10)}%`,
                    top: `${20 + (i * 10)}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, -30, -60],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Tears for crying emotion */}
        {currentEmotion === 'crying' && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              <motion.div
                className="w-1 h-3 bg-blue-400 rounded-full absolute"
                style={{ left: '35%', top: '60%' }}
                animate={{
                  y: [0, 20, 40],
                  opacity: [1, 0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
              />
              <motion.div
                className="w-1 h-3 bg-blue-400 rounded-full absolute"
                style={{ left: '55%', top: '60%' }}
                animate={{
                  y: [0, 20, 40],
                  opacity: [1, 0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.3,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

// Helper component for quick emotion changes
export function LumaWithEmotion({ 
  emotion, 
  message, 
  ...props 
}: AnimatedLumaProps) {
  return (
    <AnimatedLuma
      emotion={emotion}
      message={message || emotionConfig[emotion].message}
      {...props}
    />
  );
}


