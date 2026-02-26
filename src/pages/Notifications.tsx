import React, { useState } from 'react';
import { Bell, Plus, Search, Filter, Send, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { CreateNotificationModal } from '@/components/modals/CreateNotificationModal';
import { NotificationDetailModal } from '@/components/modals/NotificationDetailModal';

interface Notification {
  id: string;
  type: 'payment' | 'news' | 'event' | 'administrative';
  title: string;
  message: string;
  recipients: string[];
  recipientType: string;
  deliveryMethod: string[];
  status: 'sent' | 'scheduled' | 'failed';
  createdAt: string;
  sentBy: string;
  attachments?: string[];
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'payment',
    title: 'Tuition Payment Reminder',
    message: 'Please complete your tuition payment by the end of this month.',
    recipients: ['All Parents'],
    recipientType: 'Parents',
    deliveryMethod: ['in-app', 'email'],
    status: 'sent',
    createdAt: '2024-01-15T10:30:00',
    sentBy: 'Admin',
  },
  {
    id: '2',
    type: 'event',
    title: 'Parent-Teacher Meeting Tomorrow',
    message: 'Reminder: Parent-teacher conference scheduled for tomorrow at 2 PM.',
    recipients: ['Grade 8 Parents', 'Grade 10 Parents'],
    recipientType: 'Selected Groups',
    deliveryMethod: ['in-app', 'email', 'push'],
    status: 'sent',
    createdAt: '2024-01-14T14:00:00',
    sentBy: 'School Admin',
  },
  {
    id: '3',
    type: 'news',
    title: 'Winter Break Schedule',
    message: 'School will be closed from December 25 to January 5. Happy holidays!',
    recipients: ['All Users'],
    recipientType: 'All Users',
    deliveryMethod: ['in-app', 'email'],
    status: 'scheduled',
    createdAt: '2024-01-10T09:00:00',
    sentBy: 'Admin',
  },
  {
    id: '4',
    type: 'administrative',
    title: 'New Policy Update',
    message: 'Updated attendance policy has been implemented. Please review the changes.',
    recipients: ['All Staff'],
    recipientType: 'Staff',
    deliveryMethod: ['in-app'],
    status: 'sent',
    createdAt: '2024-01-12T11:15:00',
    sentBy: 'CEO',
  },
];

export const Notifications: React.FC = () => {
  const { t } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const filteredNotifications = mockNotifications.filter((notification) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'news': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'event': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'administrative': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'scheduled': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">Manage and send system notifications</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Notification
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Send className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">
                  {mockNotifications.filter(n => n.status === 'sent').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">
                  {mockNotifications.filter(n => n.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">
                  {mockNotifications.filter(n => n.status === 'failed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Bell className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{mockNotifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getTypeColor(notification.type)}>
                      {notification.type}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(notification.status)}
                      <span className="text-sm text-muted-foreground capitalize">
                        {notification.status}
                      </span>
                    </div>
                    {notification.deliveryMethod.map((method) => (
                      <Badge key={method} variant="secondary" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>To: {notification.recipientType}</span>
                    <span>•</span>
                    <span>Sent by: {notification.sentBy}</span>
                    <span>•</span>
                    <span>{new Date(notification.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedNotification(notification)}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredNotifications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications found</p>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateNotificationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          isOpen={!!selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
};
