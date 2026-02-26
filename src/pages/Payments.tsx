import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Filter, Download, Plus, Calendar,
  TrendingUp, Clock, CheckCircle2, XCircle,
  ArrowUpDown, Eye, CheckCheck
} from 'lucide-react';
import { formatCurrency, mockTransactions, Transaction } from '@/data/mockData';
import PaymentDetailModal from '@/components/modals/PaymentDetailModal';
import ManualPaymentModal from '@/components/modals/ManualPaymentModal';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Payments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  // Calculate summary statistics
  const stats = useMemo(() => {
    const paidTransactions = mockTransactions.filter(t => t.status === 'Paid' || t.status === 'Verified');
    const pendingVerification = mockTransactions.filter(
      t => t.paymentSource === 'Company Transfer' && t.verificationStatus === 'Pending'
    );
    
    return {
      totalIncome: paidTransactions.reduce((sum, t) => sum + t.amount, 0),
      pendingVerifications: pendingVerification.length,
      pendingAmount: pendingVerification.reduce((sum, t) => sum + t.amount, 0),
      totalTransactions: mockTransactions.length,
      paymeSources: mockTransactions.filter(t => t.paymentSource === 'Payme').length,
      uzumSources: mockTransactions.filter(t => t.paymentSource === 'Uzum Bank').length,
      companySources: mockTransactions.filter(t => t.paymentSource === 'Company Transfer').length,
    };
  }, []);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = mockTransactions.filter(transaction => {
      const matchesSearch = 
        transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSource = sourceFilter === 'all' || transaction.paymentSource === sourceFilter;
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;

      return matchesSearch && matchesSource && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        return sortOrder === 'desc' ? comparison : -comparison;
      } else {
        const comparison = b.amount - a.amount;
        return sortOrder === 'desc' ? comparison : -comparison;
      }
    });

    return filtered;
  }, [searchTerm, sourceFilter, statusFilter, sortBy, sortOrder]);

  const handleViewPayment = (paymentId: string) => {
    setSelectedPayment(paymentId);
    setShowPaymentDetail(true);
  };

  const handleVerifyPayment = (transactionId: string) => {
    toast({
      title: "Payment Verified",
      description: `Transaction ${transactionId} has been successfully verified.`,
    });
  };

  const handleExportCSV = () => {
    toast({
      title: "Export Started",
      description: "Your CSV file will download shortly.",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Export Started", 
      description: "Your PDF report will download shortly.",
    });
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'Payme': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Uzum Bank': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Company Transfer': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Cash': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'Manual': return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
      default: return '';
    }
  };

  const getStatusBadge = (transaction: Transaction) => {
    if (transaction.status === 'Paid' || transaction.status === 'Verified') {
      return <Badge variant="default" className="gap-1"><CheckCircle2 className="w-3 h-3" /> {transaction.status}</Badge>;
    } else if (transaction.status === 'Pending') {
      return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
    } else if (transaction.status === 'Failed') {
      return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Failed</Badge>;
    } else if (transaction.status === 'Refunded') {
      return <Badge variant="outline" className="gap-1">Refunded</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payments Management</h1>
        <p className="text-muted-foreground mt-1">Track and manage all incoming payments from multiple sources</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-widget transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(stats.totalIncome)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-widget transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Verifications</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {stats.pendingVerifications}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{formatCurrency(stats.pendingAmount)}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-widget transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.totalTransactions}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs text-blue-600 dark:text-blue-400">Payme: {stats.paymeSources}</span>
                  <span className="text-xs text-purple-600 dark:text-purple-400">Uzum: {stats.uzumSources}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center">
                <CheckCheck className="w-6 h-6 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-widget transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Company Transfers</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.companySources}</p>
                <p className="text-xs text-muted-foreground mt-1">Requires verification</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by student, parent, purpose, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Payment Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Payme">Payme</SelectItem>
                <SelectItem value="Uzum Bank">Uzum Bank</SelectItem>
                <SelectItem value="Company Transfer">Company Transfer</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full lg:w-auto"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              {sortBy === 'date' ? 'Date' : 'Amount'} ({sortOrder === 'desc' ? '↓' : '↑'})
            </Button>

            {/* Actions */}
            <Button variant="outline" onClick={handleExportCSV} className="w-full lg:w-auto">
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            
            <Button variant="outline" onClick={handleExportPDF} className="w-full lg:w-auto">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>

            <Button variant="wist" onClick={() => setShowManualEntry(true)} className="w-full lg:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment
            </Button>
          </div>

          {/* Transactions Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs">{transaction.transactionId}</TableCell>
                      <TableCell className="text-sm">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{transaction.studentName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{transaction.parentName}</TableCell>
                      <TableCell className="text-sm">{transaction.purpose}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getSourceBadgeColor(transaction.paymentSource)}>
                          {transaction.paymentSource}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>{getStatusBadge(transaction)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {transaction.paymentSource === 'Company Transfer' && transaction.verificationStatus === 'Pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerifyPayment(transaction.transactionId || '')}
                              className="text-xs"
                            >
                              <CheckCheck className="w-3 h-3 mr-1" />
                              Verify
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPayment(transaction.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No payments found matching your criteria.</p>
            </div>
          )}

          {/* Summary Footer */}
          <div className="mt-6 flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              Showing {filteredTransactions.length} of {mockTransactions.length} transactions
            </span>
            <span className="font-semibold">
              Total: {formatCurrency(filteredTransactions.reduce((sum, t) => sum + t.amount, 0))}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <PaymentDetailModal
        isOpen={showPaymentDetail}
        onClose={() => setShowPaymentDetail(false)}
        paymentId={selectedPayment || undefined}
      />

      <ManualPaymentModal
        isOpen={showManualEntry}
        onClose={() => setShowManualEntry(false)}
      />
    </div>
  );
};

export default Payments;
