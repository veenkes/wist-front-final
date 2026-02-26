import React from 'react';
import { X, Send, Users, Calendar, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  recipients: string[];
  recipientType: string;
  deliveryMethod: string[];
  status: string;
  createdAt: string;
  sentBy: string;
  attachments?: string[];
}

interface NotificationDetailModalProps {
  notification: Notification;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  notification,
  isOpen,
  onClose,
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'news': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'event': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'administrative': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Notification Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className={getTypeColor(notification.type)}>
                {notification.type}
              </Badge>
              <Badge variant={notification.status === 'sent' ? 'default' : 'secondary'}>
                {notification.status}
              </Badge>
              {notification.deliveryMethod.map((method) => (
                <Badge key={method} variant="outline" className="text-xs">
                  {method}
                </Badge>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-foreground">{notification.title}</h2>
          </div>

          {/* Message Content */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Message</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{notification.message}</p>
            </CardContent>
          </Card>

          {/* Recipients Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Recipients</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Recipient Type: <span className="font-medium text-foreground">{notification.recipientType}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {notification.recipients.map((recipient, index) => (
                      <Badge key={index} variant="secondary">
                        {recipient}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Sent Date</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Sent By</h3>
                    <p className="text-sm text-muted-foreground">{notification.sentBy}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {notification.attachments && notification.attachments.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Attachments</h3>
                <div className="space-y-2">
                  {notification.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{attachment}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="gap-2">
              <Send className="w-4 h-4" />
              Resend Notification
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
