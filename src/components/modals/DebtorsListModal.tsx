import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockStudents, mockTransactions, formatCurrency } from '@/data/mockData';
import { ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DebtorsListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Debtor {
  studentId: string;
  studentName: string;
  amountDue: number;
  dueDate: Date;
  daysOverdue: number;
}

export const DebtorsListModal: React.FC<DebtorsListModalProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  const debtors: Debtor[] = mockStudents
    .filter(student => student.balance < 0)
    .map(student => {
      const pendingTransactions = mockTransactions.filter(
        t => t.studentId === student.id && t.status === 'Pending'
      );
      const oldestDue = pendingTransactions.reduce((oldest, t) => {
        const tDate = typeof t.date === 'string' ? new Date(t.date) : t.date;
        return !oldest || tDate < oldest ? tDate : oldest;
      }, null as Date | null);

      const daysOverdue = oldestDue
        ? Math.floor((new Date().getTime() - oldestDue.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      return {
        studentId: student.id,
        studentName: student.name,
        amountDue: Math.abs(student.balance),
        dueDate: oldestDue || new Date(),
        daysOverdue,
      };
    })
    .sort((a, b) => b.daysOverdue - a.daysOverdue);

  const handleViewStudent = (studentId: string) => {
    onOpenChange(false);
    navigate('/students');
  };

  const handleViewPayments = () => {
    onOpenChange(false);
    navigate('/payments');
  };

  const getSeverityColor = (days: number) => {
    if (days > 60) return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (days > 30) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  };

  const totalDebt = debtors.reduce((sum, d) => sum + d.amountDue, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Outstanding Debtors
          </DialogTitle>
          <DialogDescription>
            Students with overdue payments - {debtors.length} total debtors
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total Outstanding</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalDebt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Number of Debtors</p>
              <p className="text-2xl font-bold text-foreground">{debtors.length}</p>
            </div>
          </div>

          {/* Debtors List */}
          <div className="space-y-3">
            {debtors.map(debtor => (
              <div
                key={debtor.studentId}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{debtor.studentName}</h3>
                    <Badge variant="outline" className={getSeverityColor(debtor.daysOverdue)}>
                      <Clock className="w-3 h-3 mr-1" />
                      {debtor.daysOverdue} days overdue
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Due Date: {debtor.dueDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Amount Due</p>
                    <p className="text-xl font-bold text-red-500">{formatCurrency(debtor.amountDue)}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewStudent(debtor.studentId)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {debtors.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No outstanding debtors</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleViewPayments} className="flex-1">
              View All Payments
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
