import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Clock, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EmailPreviewModal from '@/firm/EmailPreviewModal';

interface ScheduledReport {
  id: string;
  type: 'opportunities' | 'wallet' | 'performance';
  frequency: 'weekly' | 'monthly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  email: string;
  enabled: boolean;
  lastSent?: Date;
  nextSend?: Date;
}

export default function EmailSchedulingPanel() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ScheduledReport | null>(null);
  const [reports, setReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      type: 'opportunities',
      frequency: 'weekly',
      dayOfWeek: 1,
      email: 'michael@chenassociates.com',
      enabled: true,
      lastSent: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      nextSend: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      type: 'performance',
      frequency: 'monthly',
      dayOfMonth: 1,
      email: 'michael@chenassociates.com',
      enabled: true,
      lastSent: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      nextSend: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    },
  ]);

  const toggleReport = (id: string) => {
    setReports(reports.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const getFrequencyLabel = (report: ScheduledReport) => {
    if (report.frequency === 'weekly') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return `Every ${days[report.dayOfWeek || 0]}`;
    }
    return `Monthly (Day ${report.dayOfMonth || 1})`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Scheduled Reports</h3>
        </div>
        <Button size="sm" variant="outline">
          Add Report
        </Button>
      </div>

      <div className="space-y-3">
        {reports.map((report, idx) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`border border-border rounded-lg p-4 transition-colors ${
              report.enabled ? 'bg-card hover:bg-muted/30' : 'bg-muted/20 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="capitalize">
                    {report.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">
                    {getFrequencyLabel(report)}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{report.email}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Last: {formatDate(report.lastSent)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Next: {formatDate(report.nextSend)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => {
                    setSelectedReport(report);
                    setPreviewOpen(true);
                  }}
                >
                  <Eye className="w-3 h-3" />
                  Preview
                </Button>
                <button
                  onClick={() => toggleReport(report.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    report.enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      report.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-8">
          <Mail className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No scheduled reports yet</p>
        </div>
      )}

      {selectedReport && (
        <EmailPreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          reportType={selectedReport.type}
          email={selectedReport.email}
          frequency={selectedReport.frequency}
          onSendNow={() => {
            console.log('Report sent:', selectedReport);
          }}
        />
      )}
    </div>
  );
}
