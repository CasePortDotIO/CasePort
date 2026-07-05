import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle, AlertCircle, TrendingUp, User } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Activity {
  id: string;
  type: 'comment' | 'outcome' | 'alert' | 'achievement' | 'mention';
  user: string;
  action: string;
  resource: string;
  timestamp: Date;
  icon: React.ReactNode;
}

export default function ActivityFeed() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'comment',
      user: 'Sarah Johnson',
      action: 'commented on',
      resource: 'CP-2026-000089',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      icon: <MessageSquare className="w-4 h-4 text-blue-400" />,
    },
    {
      id: '2',
      type: 'outcome',
      user: 'You',
      action: 'submitted outcome for',
      resource: 'CP-2026-000084',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: <CheckCircle className="w-4 h-4 text-green-400" />,
    },
    {
      id: '3',
      type: 'mention',
      user: 'David Lee',
      action: 'mentioned you in',
      resource: 'CP-2026-000075',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      icon: <User className="w-4 h-4 text-purple-400" />,
    },
    {
      id: '4',
      type: 'achievement',
      user: 'You',
      action: 'unlocked achievement',
      resource: 'Deal Closer',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      icon: <TrendingUp className="w-4 h-4 text-amber-400" />,
    },
    {
      id: '5',
      type: 'alert',
      user: 'System',
      action: 'alert: overdue outcome for',
      resource: 'CP-2026-000081',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: <AlertCircle className="w-4 h-4 text-red-400" />,
    },
  ];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Card className="border-dashed border-primary/30 p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>

      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <motion.div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="mt-1 flex-shrink-0">{activity.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm">
                <span className="font-semibold text-foreground">{activity.user}</span>
                <span className="text-muted-foreground"> {activity.action} </span>
                <span className="font-mono text-primary hover:underline cursor-pointer">
                  {activity.resource}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatTime(activity.timestamp)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="mt-4 w-full py-2 text-sm text-primary hover:text-primary/80 transition-colors">
        View All Activity
      </button>
    </Card>
  );
}
