import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/firm/useAuth';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Briefcase,
  CreditCard,
  BarChart3,
  CheckSquare,
  LogOut,
  TrendingUp,
  Settings,
  Trophy,
} from 'lucide-react';

interface CasePortLayoutProps {
  children: React.ReactNode;
  currentScreen: string;
}

export default function CasePortLayoutEnhanced({ children, currentScreen }: CasePortLayoutProps) {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'wallet', label: 'Wallet', icon: CreditCard },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'feedback', label: 'Outcome Feedback', icon: CheckSquare, badge: 3 },
    { id: 'analytics', label: 'Advanced Analytics', icon: TrendingUp },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    navigate(`/${id}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-[220px] bg-secondary border-r border-border flex flex-col fixed left-0 top-0 h-screen">
        {/* Logo */}
        <div className="px-6 py-8 border-b border-border">
          <h1 className="text-lg font-bold tracking-widest text-primary">CASEPORT</h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium transition-colors relative group ${
                  isActive
                    ? 'bg-primary text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-foreground bg-destructive rounded-full"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4 space-y-4">
          <div className="px-2 space-y-1">
            <p className="text-sm font-semibold text-foreground">Chen & Associates</p>
            <p className="text-xs text-muted-foreground">Houston, TX</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[220px] overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen bg-background"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
