'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedLuma, { LumaEmotion } from '@/components/animated-luma';

const emotions: LumaEmotion[] = [
  'default', 'happy', 'excited', 'dancing', 'celebrating', 'focused', 'crying', 'worried', 'proud'
];

export default function AnimatedLumaDemoPage() {
  const [currentEmotion, setCurrentEmotion] = useState<LumaEmotion>('default');
  const [autoAnimate, setAutoAnimate] = useState(false);

  const handleEmotionChange = (emotion: LumaEmotion) => {
    setCurrentEmotion(emotion);
    setAutoAnimate(true);
    setTimeout(() => setAutoAnimate(false), 3000);
  };

  const handleMascotClick = () => {
    // Cycle through emotions when clicked
    const currentIndex = emotions.indexOf(currentEmotion);
    const nextIndex = (currentIndex + 1) % emotions.length;
    handleEmotionChange(emotions[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Meet the New Animated Luma! 🎭✨
          </h1>
          <p className="text-lg text-muted-foreground">
            A cute, expressive creature that dances, cries, and celebrates with you!
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Main Mascot Display */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Interactive Luma - Click to See Different Emotions!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <AnimatedLuma
                  emotion={currentEmotion}
                  size="large"
                  autoAnimate={autoAnimate}
                  className="cursor-pointer"
                  onClick={handleMascotClick}
                />
              </div>

              {/* Emotion Controls */}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {emotions.map((emotion) => (
                  <Button
                    key={emotion}
                    variant={currentEmotion === emotion ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleEmotionChange(emotion)}
                    className="capitalize text-xs"
                  >
                    {emotion}
                  </Button>
                ))}
              </div>

              {/* Animation Toggle */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setAutoAnimate(!autoAnimate)}
                  className="w-full max-w-xs"
                >
                  {autoAnimate ? 'Stop' : 'Start'} Continuous Animation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Different Sizes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Different Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-end space-x-8">
                <AnimatedLuma emotion="happy" size="small" />
                <AnimatedLuma emotion="excited" size="medium" />
                <AnimatedLuma emotion="dancing" size="large" />
              </div>
            </CardContent>
          </Card>

          {/* Emotion Showcase */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">All Emotions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {emotions.map((emotion) => (
                  <div key={emotion} className="text-center">
                    <AnimatedLuma
                      emotion={emotion}
                      size="small"
                      className="mx-auto mb-2"
                    />
                    <p className="text-xs font-medium capitalize">{emotion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">What Makes Luma Special</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <h3 className="font-semibold text-primary">🎭 Expressive Emotions</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Happy:</strong> Gentle bouncing and smiling</li>
                    <li>• <strong>Excited:</strong> Jumping and energetic movements</li>
                    <li>• <strong>Dancing:</strong> Full dance routine with spins</li>
                    <li>• <strong>Celebrating:</strong> 360° spin with sparkles</li>
                    <li>• <strong>Focused:</strong> Subtle concentration movements</li>
                    <li>• <strong>Crying:</strong> Animated tears and sad movements</li>
                    <li>• <strong>Worried:</strong> Nervous, concerned expressions</li>
                    <li>• <strong>Proud:</strong> Confident, uplifting animations</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-primary">✨ Animation Features</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Body Movements:</strong> Rotate, scale, and bounce</li>
                    <li>• <strong>Eye Animations:</strong> Scale and rotate independently</li>
                    <li>• <strong>Mouth Expressions:</strong> Dynamic emoji changes</li>
                    <li>• <strong>Sparkle Effects:</strong> Celebration animations</li>
                    <li>• <strong>Tear Animations:</strong> Flowing tears for crying</li>
                    <li>• <strong>Hover Effects:</strong> Interactive responses</li>
                    <li>• <strong>Auto-animation:</strong> Continuous movement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Interactive Demo</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Click on Luma above to see different emotions! Each click cycles through the emotions with automatic animations.
              </p>
              <p className="text-xs text-muted-foreground">
                Try the emotion buttons or the animation toggle to see Luma in action!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
