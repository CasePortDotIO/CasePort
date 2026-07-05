import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ReportHistoryItem {
  id: string;
  reportType: 'opportunities' | 'wallet' | 'performance';
  email: string;
  sentAt: Date;
  status: 'sent' | 'failed' | 'pending';
  pdfUrl?: string;
  errorMessage?: string;
}

export default function ReportHistoryViewer() {
  const [reports] = useState<ReportHistoryItem[]>([
    {
      id: '1',
      reportType: 'opportunities',
      email: 'michael@chenassociates.com',
      sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'sent',
      pdfUrl: '/reports/opportunities-2026-04-15.pdf',
    },
    {
      id: '2',
      reportType: 'performance',
      email: 'michael@chenassociates.com',
      sentAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      status: 'sent',
      pdfUrl: '/reports/performance-2026-04-08.pdf',
    },
    {
      id: '3',
      reportType: 'wallet',
      email: 'michael@chenassociates.com',
      sentAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      status: 'failed',
      errorMessage: 'SMTP connection timeout',
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'failed':
        return 'bg-red-500/10 text-red-600 border-red-200';
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Report History</h3>
        </div>
        <span className="text-xs text-muted-foreground">{reports.length} reports</span>
      </div>

      <div className="space-y-3">
        {reports.map((report, idx) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="capitalize">
                    {report.reportType}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(report.status)}
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusBadgeColor(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-2">{report.email}</p>

                <p className="text-xs text-muted-foreground">
                  Sent: {formatDate(report.sentAt)}
                </p>

                {report.errorMessage && (
                  <p className="text-xs text-red-600 mt-2">Error: {report.errorMessage}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {report.pdfUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(report.pdfUrl, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-8">
          <Mail className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No report history yet</p>
        </div>
      )}
    </div>
  );
}
