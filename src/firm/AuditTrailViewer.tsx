import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface AuditEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  resourceId: string;
  changes: Record<string, { from: string; to: string }>;
  ipAddress: string;
}

export default function AuditTrailViewer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  // Mock audit trail data
  const auditTrail: AuditEntry[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: 'Michael Chen',
      action: 'UPDATE',
      resource: 'Opportunity',
      resourceId: 'CP-2024-001',
      changes: { status: { from: 'Contacted', to: 'Outcome Pending' } },
      ipAddress: '192.168.1.1',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      user: 'Sarah Johnson',
      action: 'CREATE',
      resource: 'Comment',
      resourceId: 'CP-2024-002',
      changes: { content: { from: '', to: 'Need more info on this case' } },
      ipAddress: '192.168.1.2',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      user: 'Michael Chen',
      action: 'DELETE',
      resource: 'Filter',
      resourceId: 'filter-123',
      changes: { name: { from: 'High Value Cases', to: '' } },
      ipAddress: '192.168.1.1',
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      user: 'Admin User',
      action: 'UPDATE',
      resource: 'User',
      resourceId: 'user-456',
      changes: { role: { from: 'user', to: 'admin' } },
      ipAddress: '192.168.1.3',
    },
  ];

  const filtered = auditTrail.filter((entry) => {
    const matchesSearch =
      entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.resourceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterAction === 'all' || entry.action === filterAction;
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Resource ID', 'IP Address'].join(','),
      ...filtered.map((entry) =>
        [
          entry.timestamp.toISOString(),
          entry.user,
          entry.action,
          entry.resource,
          entry.resourceId,
          entry.ipAddress,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-trail.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Audit trail exported');
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user, resource, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-3 py-2 rounded-md border border-input bg-background"
        >
          <option value="all">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
        </select>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Audit Entries */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filtered.length === 0 ? (
          <Card className="p-4 text-center text-muted-foreground">
            No audit entries found
          </Card>
        ) : (
          filtered.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-3 hover:bg-secondary/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{entry.user}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          entry.action === 'CREATE'
                            ? 'bg-green-500/20 text-green-700'
                            : entry.action === 'UPDATE'
                            ? 'bg-blue-500/20 text-blue-700'
                            : 'bg-red-500/20 text-red-700'
                        }`}
                      >
                        {entry.action}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {entry.resource} ({entry.resourceId})
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {entry.timestamp.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {entry.ipAddress}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Statistics */}
      <Card className="p-3 bg-secondary/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-muted-foreground">Total Entries</div>
            <div className="text-lg font-bold">{auditTrail.length}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Users</div>
            <div className="text-lg font-bold">
              {new Set(auditTrail.map((e) => e.user)).size}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Actions</div>
            <div className="text-lg font-bold">
              {new Set(auditTrail.map((e) => e.action)).size}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
