'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EnhancedMascot, { MascotEmotion } from './enhanced-mascot';

const emotions: MascotEmotion[] = [
  'default', 'happy', 'excited', 'encouraging', 'celebrating', 'focused', 'concerned', 'proud'
];

export default function MascotShowcase() {
  const [currentEmotion, setCurrentEmotion] = useState<MascotEmotion>('default');
  const [showAnimation, setShowAnimation] = useState(false);

  const handleEmotionChange = (emotion: MascotEmotion) => {
    setCurrentEmotion(emotion);
    if (emotion === 'celebrating') {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 3000);
    }
  };

  const handleMascotClick = () => {
    // Cycle through emotions when clicked
    const currentIndex = emotions.indexOf(currentEmotion);
    const nextIndex = (currentIndex + 1) % emotions.length;
    handleEmotionChange(emotions[nextIndex]);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Meet Luma - Your Digital Security Guide! 🛡️</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Mascot Display */}
          <div className="flex justify-center">
            <EnhancedMascot
              emotion={currentEmotion}
              showAnimation={showAnimation}
              size="large"
              interactive={true}
              onClick={handleMascotClick}
              className="cursor-pointer"
            />
          </div>

          {/* Emotion Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {emotions.map((emotion) => (
              <Button
                key={emotion}
                variant={currentEmotion === emotion ? "default" : "outline"}
                size="sm"
                onClick={() => handleEmotionChange(emotion)}
                className="capitalize"
              >
                {emotion}
              </Button>
            ))}
          </div>

          {/* Animation Toggle */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowAnimation(!showAnimation)}
              className="w-full max-w-xs"
            >
              {showAnimation ? 'Stop' : 'Start'} Continuous Animation
            </Button>
          </div>

          {/* Mascot Sizes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Different Sizes</h3>
            <div className="flex justify-center items-end space-x-6">
              <EnhancedMascot emotion="happy" size="small" />
              <EnhancedMascot emotion="excited" size="medium" />
              <EnhancedMascot emotion="celebrating" size="large" />
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold">Interactive Demo</h3>
            <p className="text-sm text-muted-foreground">
              Click on Luma above to see different emotions! Each click cycles through the emotions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

