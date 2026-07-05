import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Send, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: 'opportunities' | 'wallet' | 'performance';
  email: string;
  frequency: 'weekly' | 'monthly';
  onSendNow?: () => void;
}

export default function EmailPreviewModal({
  isOpen,
  onClose,
  reportType,
  email,
  frequency,
  onSendNow,
}: EmailPreviewModalProps) {
  const [isSending, setIsSending] = useState(false);

  const handleSendNow = async () => {
    setIsSending(true);
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSending(false);
    onSendNow?.();
    onClose();
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'opportunities':
        return 'Weekly Opportunities Report';
      case 'wallet':
        return 'Wallet Activity Report';
      case 'performance':
        return 'Performance Report';
      default:
        return 'Report';
    }
  };

  const getReportContent = () => {
    switch (reportType) {
      case 'opportunities':
        return {
          subject: `Weekly Opportunities Report - ${new Date().toLocaleDateString()}`,
          preview: 'Your weekly case opportunities summary',
          sections: [
            { title: 'New Opportunities', value: '12 cases' },
            { title: 'Contacted', value: '8 cases' },
            { title: 'Conversion Rate', value: '22.4%' },
            { title: 'Avg Response Time', value: '4.3 hours' },
          ],
        };
      case 'wallet':
        return {
          subject: `Wallet Activity Report - ${new Date().toLocaleDateString()}`,
          preview: 'Your wallet transactions and balance',
          sections: [
            { title: 'Current Balance', value: '$12,450' },
            { title: 'This Month Spent', value: '$8,200' },
            { title: 'Cases Delivered', value: '18 cases' },
            { title: 'Avg Cost per Case', value: '$455.56' },
          ],
        };
      case 'performance':
        return {
          subject: `Performance Report - ${new Date().toLocaleDateString()}`,
          preview: 'Your firm performance metrics',
          sections: [
            { title: 'Total Cases', value: '156 cases' },
            { title: 'Signed Cases', value: '35 cases' },
            { title: 'Conversion Rate', value: '22.4%' },
            { title: 'Rank', value: '#8 of 156 firms' },
          ],
        };
      default:
        return {
          subject: 'Report',
          preview: 'Your report summary',
          sections: [],
        };
    }
  };

  const content = getReportContent();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <Card className="bg-background border-border shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Email Preview</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Email Content */}
              <div className="p-6 space-y-6">
                {/* Email Header */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">To:</span>
                    <span className="text-sm text-foreground">{email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Subject:</span>
                    <span className="text-sm text-foreground">{content.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Frequency:</span>
                    <Badge variant="outline" className="capitalize">
                      {frequency}
                    </Badge>
                  </div>
                </div>

                {/* Email Body */}
                <div className="bg-white dark:bg-slate-950 rounded-lg p-6 space-y-6 border border-border">
                  {/* Title */}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {getReportTitle()}
                    </h3>
                    <p className="text-sm text-muted-foreground">{content.preview}</p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border" />

                  {/* Report Sections */}
                  <div className="grid grid-cols-2 gap-4">
                    {content.sections.map((section, idx) => (
                      <div key={idx} className="bg-muted/30 rounded-lg p-4">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          {section.title}
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {section.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="text-center pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      This is an automated report from CasePort. Your data is confidential and
                      secure.
                    </p>
                  </div>
                </div>

                {/* Note */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Note:</span> This is a preview of the email
                    that will be sent to <span className="font-medium">{email}</span> on your
                    scheduled frequency.
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSendNow}
                  disabled={isSending}
                  className="flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Now
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
