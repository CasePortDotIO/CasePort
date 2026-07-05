import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Lock, Bell, Eye, Palette } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuditTrailViewer from '@/firm/AuditTrailViewer';
import AccessibilitySettings from '@/firm/AccessibilitySettings';
import EmailSchedulingPanel from '@/firm/EmailSchedulingPanel';
import ReportHistoryViewer from '@/firm/ReportHistoryViewer';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'accessibility' | 'audit' | 'notifications'>('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'audit', label: 'Audit Trail', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-secondary px-8 py-6">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences and integrations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="px-8 flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* General Tab */}
        {activeTab === 'general' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl space-y-6"
          >
            <Card className="p-6 border-dashed border-primary/30">
              <h2 className="text-lg font-semibold text-foreground mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Firm Name</label>
                  <p className="text-foreground mt-1">Chen & Associates</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Market</label>
                  <p className="text-foreground mt-1">Houston, TX</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Account Status</label>
                  <p className="text-foreground mt-1">Active</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-dashed border-primary/30">
              <h2 className="text-lg font-semibold text-foreground mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates about your cases</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Weekly Reports</p>
                    <p className="text-sm text-muted-foreground">Get a summary every Monday</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </motion.div>
        )}

        {/* Accessibility Tab */}
        {activeTab === 'accessibility' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl"
          >
            <AccessibilitySettings />
          </motion.div>
        )}

        {/* Audit Trail Tab */}
        {activeTab === 'audit' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl"
          >
            <AuditTrailViewer />
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl space-y-6"
          >
            <Card className="p-6 border-dashed border-primary/30">
              <h2 className="text-lg font-semibold text-foreground mb-4">Notification Channels</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">michael@chenlaw.com</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">In-App Notifications</p>
                    <p className="text-sm text-muted-foreground">Real-time alerts</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Slack Integration</p>
                    <p className="text-sm text-muted-foreground">Send alerts to Slack</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-dashed border-primary/30">
              <EmailSchedulingPanel />
            </Card>

            <Card className="p-6 border-dashed border-primary/30">
              <ReportHistoryViewer />
            </Card>

            <Card className="p-6 border-dashed border-primary/30">
              <h2 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">New Opportunities</p>
                    <p className="text-sm text-muted-foreground">Notify when new cases arrive</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Overdue Outcomes</p>
                    <p className="text-sm text-muted-foreground">Remind about pending submissions</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Team Mentions</p>
                    <p className="text-sm text-muted-foreground">Notify when mentioned by team</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
              </div>
            </Card>

            <Button className="bg-primary hover:bg-primary/90">Save Preferences</Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
