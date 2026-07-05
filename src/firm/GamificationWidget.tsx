import { motion } from 'framer-motion';
import { Award, Flame, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import AchievementsModal from './AchievementsModal';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

interface GamificationData {
  level: number;
  points: number;
  nextLevelPoints: number;
  streak: number;
  badges: Badge[];
  rank: number;
  totalUsers: number;
}

export default function GamificationWidget() {
  const [showAchievements, setShowAchievements] = useState(false);

  // Mock data
  const gamification: GamificationData = {
    level: 12,
    points: 4850,
    nextLevelPoints: 5000,
    streak: 23,
    rank: 8,
    totalUsers: 156,
    badges: [
      {
        id: 'response-master',
        name: 'Response Master',
        description: 'Responded to 100 cases',
        icon: '⚡',
        unlockedAt: new Date('2026-04-15'),
      },
      {
        id: 'deal-closer',
        name: 'Deal Closer',
        description: 'Signed 50 cases',
        icon: '🎯',
        unlockedAt: new Date('2026-04-10'),
      },
      {
        id: 'consistency-king',
        name: 'Consistency King',
        description: '30-day streak',
        icon: '👑',
        unlockedAt: new Date('2026-04-05'),
      },
    ],
  };

  const progressPercent = (gamification.points / gamification.nextLevelPoints) * 100;

  return (
    <>
      <Card className="border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-4">
        <div className="space-y-4">
          {/* Level & Points */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Level</div>
              <div className="text-3xl font-bold text-primary">{gamification.level}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Points</div>
              <div className="text-2xl font-bold">{gamification.points.toLocaleString()}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress to Level {gamification.level + 1}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 p-2">
            <Flame className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">
              {gamification.streak}-day streak! Keep it up 🔥
            </span>
          </div>

          {/* Rank */}
          <div className="flex items-center justify-between rounded-lg bg-primary/10 p-2">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Rank</span>
            </div>
            <span className="font-bold text-primary">
              #{gamification.rank} of {gamification.totalUsers}
            </span>
          </div>

          {/* Badges Preview */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">Recent Badges</div>
            <div className="flex gap-2">
              {gamification.badges.slice(0, 3).map((badge) => (
                <motion.div
                  key={badge.id}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-lg"
                  whileHover={{ scale: 1.1 }}
                  title={badge.name}
                >
                  {badge.icon}
                </motion.div>
              ))}
            </div>
          </div>

          {/* View All Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowAchievements(true)}
          >
            <Zap className="mr-2 h-4 w-4" />
            View All Achievements
          </Button>
        </div>
      </Card>

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        badges={gamification.badges}
      />
    </>
  );
}
