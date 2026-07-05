import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Mention {
  id: string;
  from: string;
  message: string;
  resource: string;
  timestamp: Date;
  read: boolean;
}

export default function MentionNotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [mentions, setMentions] = useState<Mention[]>([
    {
      id: '1',
      from: 'David Lee',
      message: 'mentioned you in a comment',
      resource: 'CP-2026-000089',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
    {
      id: '2',
      from: 'Sarah Johnson',
      message: 'replied to your comment',
      resource: 'CP-2026-000084',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: '3',
      from: 'Emily Rodriguez',
      message: 'mentioned you in a comment',
      resource: 'CP-2026-000075',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
    },
  ]);

  const unreadCount = mentions.filter((m) => !m.read).length;

  const markAsRead = (id: string) => {
    setMentions(mentions.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const markAllAsRead = () => {
    setMentions(mentions.map((m) => ({ ...m, read: true })));
  };

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
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="absolute top-12 right-0 z-50 w-96 max-h-96 overflow-y-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="rounded-lg border border-dashed border-primary/30 shadow-lg">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Mentions & Replies</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-secondary rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {mentions.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No mentions yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {mentions.map((mention) => (
                      <motion.div
                        key={mention.id}
                        className={`p-4 hover:bg-secondary/50 transition-colors cursor-pointer ${
                          !mention.read ? 'bg-primary/5' : ''
                        }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => markAsRead(mention.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {mention.read ? (
                              <CheckCircle className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm">
                              <span className="font-semibold text-foreground">{mention.from}</span>
                              <span className="text-muted-foreground"> {mention.message}</span>
                            </div>
                            <div className="text-xs text-primary font-mono mt-1">
                              {mention.resource}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatTime(mention.timestamp)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {unreadCount > 0 && (
                  <div className="p-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
