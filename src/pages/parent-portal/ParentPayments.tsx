import { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  Building2, 
  Banknote,
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const mockPaymentStatus = {
  total: 30000000,
  paid: 22500000,
  remaining: 7500000,
  hasDebt: true,
  debtAmount: 2500000,
};

const mockInvoices = [
  { id: '1', month: 'Февраль 2025', amount: 2500000, status: 'unpaid' as const, dueDate: new Date(2025, 1, 1) },
  { id: '2', month: 'Январь 2025', amount: 2500000, status: 'overdue' as const, dueDate: new Date(2025, 0, 1), overdueDays: 15 },
  { id: '3', month: 'Декабрь 2024', amount: 2500000, status: 'paid' as const, paidDate: new Date(2024, 11, 28) },
  { id: '4', month: 'Ноябрь 2024', amount: 2500000, status: 'paid' as const, paidDate: new Date(2024, 10, 25) },
];

const mockPaymentHistory = [
  { id: '1', date: new Date(2024, 11, 28), amount: 2500000, method: 'Payme' },
  { id: '2', date: new Date(2024, 10, 25), amount: 2500000, method: 'Uzum' },
  { id: '3', date: new Date(2024, 9, 30), amount: 2500000, method: 'Перевод' },
];

const paymentMethods = [
  { id: 'payme', name: 'Payme', icon: Wallet },
  { id: 'click', name: 'Click', icon: CreditCard },
  { id: 'uzum', name: 'Uzum', icon: Building2 },
  { id: 'cash', name: 'Наличные', icon: Banknote },
];

const ParentPayments = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<typeof mockInvoices[0] | null>(null);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('uz-UZ').format(amount) + ' сум';
  const progressPercent = (mockPaymentStatus.paid / mockPaymentStatus.total) * 100;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Оплата</h1>

      {/* Balance Card */}
      <Card className="shadow-card border-0 bg-gradient-to-br from-wist-navy to-wist-navy-light overflow-hidden">
        <CardContent className="p-4 text-white">
          <p className="text-xs text-white/60 uppercase tracking-wider">Баланс</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(mockPaymentStatus.remaining)}</p>
          <p className="text-xs text-white/60">из {formatCurrency(mockPaymentStatus.total)}</p>
          
          <div className="mt-4">
            <Progress value={progressPercent} className="h-1.5 bg-white/20" />
            <div className="flex justify-between mt-1.5 text-[10px] text-white/60">
              <span>Оплачено {Math.round(progressPercent)}%</span>
              <span>{formatCurrency(mockPaymentStatus.paid)}</span>
            </div>
          </div>

          {mockPaymentStatus.hasDebt && (
            <div className="mt-3 p-2 bg-destructive/20 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-xs">Задолженность: {formatCurrency(mockPaymentStatus.debtAmount)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="shadow-card border-0">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Способы оплаты
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Button key={method.id} variant="outline" className="h-16 flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[10px]">{method.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="shadow-card border-0">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Счета</h3>
          <div className="space-y-2">
            {mockInvoices.map((invoice) => (
              <button
                key={invoice.id}
                className="w-full flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                onClick={() => setSelectedInvoice(invoice)}
              >
                <div className="text-left">
                  <p className="font-medium text-foreground text-sm">{invoice.month}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(invoice.amount)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'overdue' ? 'destructive' : 'secondary'} className="text-[10px]">
                    {invoice.status === 'paid' ? 'Оплачен' : invoice.status === 'overdue' ? 'Просрочен' : 'Ожидает'}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="shadow-card border-0">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">История</h3>
          <div className="space-y-2">
            {mockPaymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-2.5 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{formatCurrency(payment.amount)}</p>
                    <p className="text-[10px] text-muted-foreground">{format(payment.date, 'd MMM yyyy', { locale: ru })}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">{payment.method}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Modal */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-[360px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">Счёт: {selectedInvoice?.month}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Сумма:</span>
                <span className="font-semibold">{selectedInvoice && formatCurrency(selectedInvoice.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Срок:</span>
                <span>{selectedInvoice && format(selectedInvoice.dueDate, 'd MMM yyyy', { locale: ru })}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />PDF
              </Button>
              {selectedInvoice?.status !== 'paid' && (
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary-hover">Оплатить</Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParentPayments;
