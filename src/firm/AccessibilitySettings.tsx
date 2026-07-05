import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface AccessibilityPreferences {
  highContrast: boolean;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  fontSize: number;
}

export default function AccessibilitySettings() {
  const [prefs, setPrefs] = useState<AccessibilityPreferences>(() => {
    const saved = localStorage.getItem('a11y-prefs');
    return saved
      ? JSON.parse(saved)
      : {
          highContrast: false,
          dyslexiaFont: false,
          reducedMotion: false,
          fontSize: 100,
        };
  });

  useEffect(() => {
    localStorage.setItem('a11y-prefs', JSON.stringify(prefs));

    // Apply settings
    const root = document.documentElement;
    if (prefs.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (prefs.dyslexiaFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }

    if (prefs.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    root.style.fontSize = `${prefs.fontSize}%`;
  }, [prefs]);

  const handleToggle = (key: keyof AccessibilityPreferences) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success('Accessibility settings updated');
  };

  const handleFontSizeChange = (value: number[]) => {
    setPrefs((prev) => ({
      ...prev,
      fontSize: value[0],
    }));
  };

  const handleReset = () => {
    setPrefs({
      highContrast: false,
      dyslexiaFont: false,
      reducedMotion: false,
      fontSize: 100,
    });
    toast.success('Accessibility settings reset');
  };

  return (
    <div className="space-y-4">
      {/* High Contrast */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">High Contrast Mode</h3>
            <p className="text-sm text-muted-foreground">
              Increase contrast for better visibility
            </p>
          </div>
          <Switch
            checked={prefs.highContrast}
            onCheckedChange={() => handleToggle('highContrast')}
          />
        </div>
      </Card>

      {/* Dyslexia-Friendly Font */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Dyslexia-Friendly Font</h3>
            <p className="text-sm text-muted-foreground">
              Use OpenDyslexic font for easier reading
            </p>
          </div>
          <Switch
            checked={prefs.dyslexiaFont}
            onCheckedChange={() => handleToggle('dyslexiaFont')}
          />
        </div>
      </Card>

      {/* Reduced Motion */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Reduce Motion</h3>
            <p className="text-sm text-muted-foreground">
              Minimize animations and transitions
            </p>
          </div>
          <Switch
            checked={prefs.reducedMotion}
            onCheckedChange={() => handleToggle('reducedMotion')}
          />
        </div>
      </Card>

      {/* Font Size */}
      <Card className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold">Font Size</h3>
            <p className="text-sm text-muted-foreground">
              Current: {prefs.fontSize}%
            </p>
          </div>
          <Slider
            value={[prefs.fontSize]}
            onValueChange={handleFontSizeChange}
            min={75}
            max={150}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>75%</span>
            <span>100%</span>
            <span>150%</span>
          </div>
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-4 bg-secondary/50">
        <p className="text-sm">
          This is a preview of how text will appear with your current settings.
        </p>
      </Card>

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleReset}
      >
        Reset to Defaults
      </Button>
    </div>
  );
}
