import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, MapPin, Briefcase, CreditCard, Zap } from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Welcome to CasePort',
      description: 'Let\'s get you set up in 5 minutes',
      icon: <Zap className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-foreground">
            You're about to join 156 leading law firms who are converting cases 3x faster.
          </p>
          <div className="space-y-2">
            {['Access pre-qualified cases', 'Real-time notifications', 'Performance analytics'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Select Your Markets',
      description: 'Which markets do you serve?',
      icon: <MapPin className="w-6 h-6" />,
      content: (
        <div className="grid grid-cols-2 gap-3">
          {['Houston', 'Dallas', 'Austin', 'San Antonio', 'Other Texas', 'National'].map((market) => (
            <Button key={market} variant="outline" className="justify-start">
              {market}
            </Button>
          ))}
        </div>
      ),
    },
    {
      id: 3,
      title: 'Case Type Preferences',
      description: 'What types of cases do you handle?',
      icon: <Briefcase className="w-6 h-6" />,
      content: (
        <div className="space-y-2">
          {['Auto Accident', 'Slip & Fall', 'Workers Comp', 'Medical Malpractice', 'Product Liability'].map((type) => (
            <Button key={type} variant="outline" className="w-full justify-start">
              {type}
            </Button>
          ))}
        </div>
      ),
    },
    {
      id: 4,
      title: 'Pre-Funded Wallet Setup',
      description: 'Fund your wallet to start receiving cases',
      icon: <CreditCard className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm font-semibold text-foreground mb-2">How it works:</p>
            <ol className="text-xs space-y-1 text-muted-foreground">
              <li>1. Fund your wallet with $5,000 - $50,000</li>
              <li>2. Funds remain in your wallet until case delivery</li>
              <li>3. Only deducted when you receive a qualified case</li>
              <li>4. Automatic replenishment available</li>
            </ol>
          </div>
          <Button className="w-full bg-primary text-primary-foreground">
            Add Payment Method
          </Button>
        </div>
      ),
    },
    {
      id: 5,
      title: 'First Case Walkthrough',
      description: 'Your first case is ready',
      icon: <CheckCircle className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Card className="p-4 border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Sample Case
            </p>
            <p className="font-semibold text-foreground mb-2">Auto Accident - Houston</p>
            <p className="text-sm text-muted-foreground mb-3">
              Multi-vehicle collision. Client has clear liability. Estimated value: $45,000-$85,000
            </p>
            <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-300">Platinum Lead</Badge>
          </Card>
          <Button className="w-full bg-primary text-primary-foreground">
            Accept & Start Receiving Cases
          </Button>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompleted([...completed, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md mx-4"
      >
        <Card className="border-border p-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    idx < currentStep ? 'bg-primary' : idx === currentStep ? 'bg-primary' : 'bg-border'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  {step.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{step.title}</h2>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>

              {step.content}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleSkip}
                >
                  {currentStep === steps.length - 1 ? 'Done' : 'Skip'}
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground"
                  onClick={handleNext}
                >
                  {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}
