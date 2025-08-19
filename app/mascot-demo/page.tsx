import MascotShowcase from '@/components/mascot-showcase';

export default function MascotDemoPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Luma Mascot Demo 🎭
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore all the different emotions and animations of your digital security guide!
          </p>
        </div>
        
        <MascotShowcase />
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Use Luma in Your App</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">🎯 Different Emotions</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Happy:</strong> For celebrations and achievements</li>
                <li>• <strong>Excited:</strong> For new missions and challenges</li>
                <li>• <strong>Encouraging:</strong> For motivation and support</li>
                <li>• <strong>Celebrating:</strong> For mission completions</li>
                <li>• <strong>Focused:</strong> For learning and concentration</li>
                <li>• <strong>Concerned:</strong> For mistakes and retries</li>
                <li>• <strong>Proud:</strong> For progress and growth</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">⚡ Features</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Animations:</strong> Smooth transitions and effects</li>
                <li>• <strong>Interactive:</strong> Click to trigger emotions</li>
                <li>• <strong>Responsive:</strong> Different sizes for different contexts</li>
                <li>• <strong>Customizable:</strong> Easy to modify messages and colors</li>
                <li>• <strong>Accessible:</strong> Screen reader friendly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

