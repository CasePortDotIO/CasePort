import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, MessageCircle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CaseOutcome {
  id: string;
  caseId: string;
  caseType: string;
  market: string;
  outcome: 'converted' | 'rejected' | 'pending';
  feedback?: string;
  rating?: number;
}

const recentCases: CaseOutcome[] = [
  {
    id: '1',
    caseId: 'CP-2026-000089',
    caseType: 'Auto Accident',
    market: 'Houston',
    outcome: 'converted',
    rating: 5,
    feedback: 'Great lead quality. Client was ready to sign.',
  },
  {
    id: '2',
    caseId: 'CP-2026-000088',
    caseType: 'Slip & Fall',
    market: 'Dallas',
    outcome: 'rejected',
  },
  {
    id: '3',
    caseId: 'CP-2026-000087',
    caseType: 'Workers Comp',
    market: 'Austin',
    outcome: 'pending',
  },
];

export default function CaseFeedbackLoop() {
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const handleFeedback = (caseId: string, text: string) => {
    setFeedback({ ...feedback, [caseId]: text });
  };

  const handleRating = (caseId: string, rating: number) => {
    setRatings({ ...ratings, [caseId]: rating });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Case Feedback Loop</h2>
        <p className="text-sm text-muted-foreground">
          Your feedback helps us improve lead quality and scoring
        </p>
      </div>

      {/* Feedback Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Cases Reviewed', value: '47', icon: MessageCircle },
          { label: 'Conversion Rate', value: '22.4%', icon: TrendingUp },
          { label: 'Avg Rating', value: '4.2/5', icon: ThumbsUp },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-4 border-border text-center">
                <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-light text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Cases Feedback */}
      <div className="space-y-3">
        {recentCases.map((caseItem, idx) => (
          <motion.div
            key={caseItem.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-4 border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground">{caseItem.caseType}</p>
                  <p className="text-xs text-muted-foreground">{caseItem.caseId} • {caseItem.market}</p>
                </div>
                <Badge
                  className={
                    caseItem.outcome === 'converted'
                      ? 'bg-green-500/20 text-green-700 border-green-300'
                      : caseItem.outcome === 'rejected'
                      ? 'bg-red-500/20 text-red-700 border-red-300'
                      : 'bg-blue-500/20 text-blue-700 border-blue-300'
                  }
                >
                  {caseItem.outcome.charAt(0).toUpperCase() + caseItem.outcome.slice(1)}
                </Badge>
              </div>

              {caseItem.outcome !== 'pending' && (
                <div className="space-y-3 border-t border-border pt-3">
                  {/* Rating */}
                  {caseItem.outcome === 'converted' && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Rate this lead quality</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(caseItem.caseId, star)}
                            className={`text-lg ${
                              (ratings[caseItem.caseId] || 0) >= star ? 'text-yellow-500' : 'text-border'
                            }`}
                          >

                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback Text */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Why did this case {caseItem.outcome}?</p>
                    <textarea
                      value={feedback[caseItem.caseId] || ''}
                      onChange={(e) => handleFeedback(caseItem.caseId, e.target.value)}
                      placeholder="Your feedback helps us improve..."
                      className="w-full text-xs p-2 bg-secondary border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      rows={2}
                    />
                  </div>

                  <Button size="sm" className="w-full bg-primary text-primary-foreground text-xs">
                    Submit Feedback
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Data Moat Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-primary/10 border border-primary/20 rounded-lg p-4"
      >
        <p className="text-sm font-semibold text-foreground mb-1">Building Your Data Moat</p>
        <p className="text-xs text-muted-foreground">
          Your feedback is proprietary. It trains our AI to send you better cases and improves your competitive advantage. This data stays with you.
        </p>
      </motion.div>
    </div>
  );
}
