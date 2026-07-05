import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronDown, MoreVertical } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge, OutcomeBadge, CPIDCell } from '@/firm/CasePortComponents';

export default function Opportunities() {
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState('all');

  const opportunities = [
    {
      id: 'CP-2026-000089',
      caseType: 'Auto Accident',
      received: '2 hrs ago',
      responseTime: 6,
      status: 'Contacted' as const,
      outcome: 'Pending' as const,
    },
    {
      id: 'CP-2026-000084',
      caseType: 'Auto Accident',
      received: '1 day ago',
      responseTime: 4,
      status: 'Contacted' as const,
      outcome: 'Pending' as const,
    },
    {
      id: 'CP-2026-000081',
      caseType: 'Slip & Fall',
      received: '2 days ago',
      responseTime: 31,
      status: 'Outcome Pending' as const,
      outcome: 'Overdue' as const,
    },
    {
      id: 'CP-2026-000077',
      caseType: 'Auto Accident',
      received: '4 days ago',
      responseTime: 8,
      status: 'Signed' as const,
      outcome: 'Submitted' as const,
    },
    {
      id: 'CP-2026-000071',
      caseType: 'Auto Accident',
      received: '6 days ago',
      responseTime: 12,
      status: 'Closed Lost' as const,
      outcome: 'Submitted' as const,
    },
    {
      id: 'CP-2026-000065',
      caseType: 'Auto Accident',
      received: '9 days ago',
      responseTime: 19,
      status: 'Outcome Pending' as const,
      outcome: 'Overdue' as const,
    },
    {
      id: 'CP-2026-000058',
      caseType: 'Slip & Fall',
      received: '12 days ago',
      responseTime: 7,
      status: 'Signed' as const,
      outcome: 'Submitted' as const,
    },
    {
      id: 'CP-2026-000051',
      caseType: 'Auto Accident',
      received: '16 days ago',
      responseTime: 4,
      status: 'Signed' as const,
      outcome: 'Submitted' as const,
    },
  ];

  const handleViewDetail = (id: string) => {
    navigate(`/opportunities/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-secondary px-8 py-6">
        <h1 className="text-2xl font-semibold text-foreground">Opportunities</h1>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Filter Bar */}
        <div className="flex gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="pending">Outcome Pending</SelectItem>
              <SelectItem value="signed">Signed</SelectItem>
              <SelectItem value="closed">Closed Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Case Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="auto">Auto Accident</SelectItem>
              <SelectItem value="slip">Slip & Fall</SelectItem>
            </SelectContent>
          </Select>

          <input
            type="text"
            placeholder="Search CP-ID..."
            className="flex-1 px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Case Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Received
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Outcome
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {opportunities.map((opp) => (
                <tr
                  key={opp.id}
                  className="hover:bg-muted/50 transition-colors"
                  onClick={() => handleViewDetail(opp.id)}
                >
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <CPIDCell id={opp.id} />
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{opp.caseType}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{opp.received}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-mono text-sm font-semibold ${
                        opp.responseTime <= 15
                          ? 'text-green-400'
                          : opp.responseTime <= 30
                            ? 'text-amber-400'
                            : 'text-red-400'
                      }`}
                    >
                      {opp.responseTime} min
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={opp.status} />
                  </td>
                  <td className="px-6 py-4">
                    <OutcomeBadge outcome={opp.outcome} />
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetail(opp.id)}>
                          View Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem>Submit Outcome</DropdownMenuItem>
                        <DropdownMenuItem>Open Dispute</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 text-sm text-muted-foreground">
          Showing 8 of 28 opportunities
        </div>
      </div>
    </div>
  );
}
