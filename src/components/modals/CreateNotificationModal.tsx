import React, { useState } from 'react';
import { X, Send, Upload, Users, User, UserCheck, Building } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface CreateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateNotificationModal: React.FC<CreateNotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const [type, setType] = useState('news');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('all');
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>(['in-app']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Here you would send the notification
    console.log('Creating notification:', { type, title, message, recipientType, deliveryMethods });
    
    toast({
      title: 'Success',
      description: 'Notification sent successfully!',
    });

    // Reset form
    setType('news');
    setTitle('');
    setMessage('');
    setRecipientType('all');
    setDeliveryMethods(['in-app']);
    onClose();
  };

  const toggleDeliveryMethod = (method: string) => {
    setDeliveryMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const recipientOptions = [
    { value: 'all', label: 'All Users', icon: Users },
    { value: 'students', label: 'All Students', icon: User },
    { value: 'parents', label: 'All Parents', icon: UserCheck },
    { value: 'staff', label: 'All Staff', icon: Building },
    { value: 'custom', label: 'Custom Selection', icon: Users },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Create Notification
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type */}
          <div className="space-y-2">
            <Label>Notification Type *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payment">Payment Reminder</SelectItem>
                <SelectItem value="news">News & Announcement</SelectItem>
                <SelectItem value="event">Event Update</SelectItem>
                <SelectItem value="administrative">Administrative Notice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label>Message *</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              className="min-h-[120px]"
              required
            />
          </div>

          {/* Recipients */}
          <div className="space-y-2">
            <Label>Recipients *</Label>
            <div className="grid grid-cols-2 gap-3">
              {recipientOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Card
                    key={option.value}
                    className={`p-4 cursor-pointer transition-all ${
                      recipientType === option.value
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setRecipientType(option.value)}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <span className="font-medium text-sm">{option.label}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Delivery Methods */}
          <div className="space-y-2">
            <Label>Delivery Methods *</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-app"
                  checked={deliveryMethods.includes('in-app')}
                  onCheckedChange={() => toggleDeliveryMethod('in-app')}
                />
                <label htmlFor="in-app" className="text-sm cursor-pointer">
                  In-App Notification
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={deliveryMethods.includes('email')}
                  onCheckedChange={() => toggleDeliveryMethod('email')}
                />
                <label htmlFor="email" className="text-sm cursor-pointer">
                  Email
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="push"
                  checked={deliveryMethods.includes('push')}
                  onCheckedChange={() => toggleDeliveryMethod('push')}
                />
                <label htmlFor="push" className="text-sm cursor-pointer">
                  Push Notification
                </label>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, Images, or Documents
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Send className="w-4 h-4" />
              Send Notification
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
