import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Eye, ArrowLeft } from 'lucide-react';
import { formatCurrency, mockTransactions } from '@/data/mockData';
import wistLogo from '@/assets/wist-logo.png';

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId?: string;
}

const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({ isOpen, onClose, paymentId }) => {
  const payment = mockTransactions.find(t => t.id === paymentId) || mockTransactions[0];

  const receiptData = {
    receiptNumber: `RCP-${Date.now()}`,
    issueDate: new Date().toLocaleDateString(),
    qrCode: `WIST-${payment.id}-${Date.now()}`
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            Transaction Details - {payment.id}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Details */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Payment Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Student</label>
                  <p className="font-medium">{payment.studentName}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Parent</label>
                  <p className="font-medium">{payment.parentName}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Amount</label>
                  <p className="font-medium text-xl">{formatCurrency(payment.amount)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <Badge variant={payment.status === 'Paid' || payment.status === 'Verified' ? 'default' : payment.status === 'Pending' ? 'secondary' : 'destructive'}>
                    {payment.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Payment Source</label>
                  <p className="font-medium">{payment.paymentSource}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Payment Method</label>
                  <p className="font-medium">{payment.paymentMethod}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Transaction ID</label>
                  <p className="font-mono text-sm">{payment.transactionId || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Date</label>
                  <p className="font-medium">{new Date(payment.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Purpose</label>
                <p className="font-medium">{payment.purpose}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View Receipt
                </Button>
                <Button variant="wist" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Preview */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Receipt Preview</h3>
              
              {/* Receipt Design */}
              <div className="bg-background border border-border rounded-lg p-6 space-y-4">
                {/* Header */}
                <div className="text-center border-b border-border pb-4">
                  <img src={wistLogo} alt="WIST Logo" className="h-12 w-auto mx-auto mb-2" />
                  <h4 className="font-bold text-lg">Westminster International School Tashkent</h4>
                  <p className="text-sm text-muted-foreground">Payment Receipt</p>
                </div>

                {/* Receipt Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Receipt No:</span>
                    <span className="font-medium">{receiptData.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{receiptData.issueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Student:</span>
                    <span className="font-medium">{payment.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purpose:</span>
                    <span className="font-medium">{payment.purpose}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground">Amount Paid:</span>
                    <span className="font-bold text-lg">{formatCurrency(payment.amount)}</span>
                  </div>
                </div>

                {/* QR Code Area */}
                <div className="text-center border-t border-border pt-4">
                  <div className="w-16 h-16 bg-muted mx-auto rounded flex items-center justify-center mb-2">
                    <span className="text-xs">QR</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{receiptData.qrCode}</p>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-muted-foreground border-t border-border pt-4">
                  <p>This is an official receipt from WIST</p>
                  <p>For inquiries: finance@wist.uz | +998 71 123-45-67</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Email Receipt
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  Print Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailModal;