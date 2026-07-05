import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/firm/useAuth';
import { Button } from '@/components/ui/button';
import {
  Home,
  Briefcase,
  CreditCard,
  BarChart3,
  CheckSquare,
  LogOut,
} from 'lucide-react';

interface CasePortLayoutProps {
  children: React.ReactNode;
  currentScreen: string;
}

export default function CasePortLayout({ children, currentScreen }: CasePortLayoutProps) {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'wallet', label: 'Wallet', icon: CreditCard },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'feedback', label: 'Outcome Feedback', icon: CheckSquare, badge: 3 },
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
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
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
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-foreground bg-destructive rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
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
        <div className="min-h-screen bg-background">{children}</div>
      </main>
    </div>
  );
}
