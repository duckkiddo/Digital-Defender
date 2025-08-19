"use client";

import React, { useState, useEffect } from 'react';


interface EmotionalFeedbackProps {
  emotion: 'happy' | 'sad' | 'neutral' | 'thinking' | 'celebrate';
}

const EmotionalFeedback: React.FC<EmotionalFeedbackProps> = ({ emotion }) => {
  const [emoji, setEmoji] = useState('😐'); // Default to neutral emoji

  useEffect(() => {
    switch (emotion) {
      case 'happy':
        setEmoji('😊');
        break;
      case 'sad':
        setEmoji('😔');
        break;
      case 'neutral':
        setEmoji('😐');
        break;
      case 'thinking':
        setEmoji('🤔');
        break;
      case 'celebrate':
        setEmoji('🥳');
        break;
      default:
        setEmoji('😐');
    }
  }, [emotion]);

  return (
    <div className="duolingo-character flex flex-col items-center justify-center p-4 text-6xl">
      <span>{emoji}</span>
      <p className="text-sm text-muted-foreground mt-2">{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</p>
    </div>
  );
};

export default EmotionalFeedback;