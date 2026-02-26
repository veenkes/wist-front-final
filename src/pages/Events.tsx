import React, { useState, useMemo } from 'react';
import { Calendar, Plus, Search, Filter, Download, Bell, CalendarDays, MapPin, Users, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockEvents, Event } from '@/data/mockData';
import { AddEventModal } from '@/components/modals/AddEventModal';
import { EventDetailModal } from '@/components/modals/EventDetailModal';
import { SendNotificationModal } from '@/components/modals/SendNotificationModal';
import { format, parseISO, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

export const Events: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Filter and search events
  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      const matchesType = typeFilter === 'all' || event.type === typeFilter;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesType;
    });
  }, [searchQuery, categoryFilter, statusFilter, typeFilter]);

  // Sort events by date
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time);
      const dateB = new Date(b.date + 'T' + b.time);
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredEvents]);

  // Calculate statistics
  const stats = useMemo(() => {
    const upcoming = mockEvents.filter(e => e.status === 'Upcoming').length;
    const today = new Date();
    const thisMonth = mockEvents.filter(e => {
      const eventDate = parseISO(e.date);
      return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
    }).length;
    const totalAttendees = mockEvents.reduce((sum, e) => sum + (e.attendees || 0), 0);
    
    return { upcoming, thisMonth, totalAttendees, total: mockEvents.length };
  }, []);

  // Get unique categories and types
  const categories = useMemo(() => {
    const cats = new Set(mockEvents.map(e => e.category));
    return Array.from(cats);
  }, []);

  const types = useMemo(() => {
    const t = new Set(mockEvents.map(e => e.type));
    return Array.from(t);
  }, []);

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Ongoing': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Completed': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'Canceled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'Meeting': return 'bg-purple-500/10 text-purple-500';
      case 'Sports': return 'bg-green-500/10 text-green-500';
      case 'Academic': return 'bg-blue-500/10 text-blue-500';
      case 'Social': return 'bg-pink-500/10 text-pink-500';
      case 'Administrative': return 'bg-orange-500/10 text-orange-500';
      case 'Training': return 'bg-indigo-500/10 text-indigo-500';
      case 'Celebration': return 'bg-yellow-500/10 text-yellow-500';
      case 'Announcement': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleSendNotification = (event: Event) => {
    setSelectedEvent(event);
    setIsNotificationModalOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Type', 'Date', 'Time', 'Location', 'Status', 'Organizer', 'Attendees'];
    const rows = filteredEvents.map(event => [
      event.id,
      event.title,
      event.type,
      event.date,
      event.time,
      event.location,
      event.status,
      event.organizer,
      event.attendees || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
          <p className="text-muted-foreground mt-1">Organize and track all school events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">Current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{stats.totalAttendees}</div>
            <p className="text-xs text-muted-foreground mt-1">Expected attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search events by title, description, or organizer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {sortedEvents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or create a new event
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sortedEvents.map(event => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-16 h-16 rounded-lg flex flex-col items-center justify-center text-white font-bold"
                          style={{ backgroundColor: event.color || 'hsl(var(--primary))' }}
                        >
                          <div className="text-xs">{format(parseISO(event.date), 'MMM')}</div>
                          <div className="text-2xl">{format(parseISO(event.date), 'd')}</div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                            <Badge className={getStatusColor(event.status)} variant="outline">
                              {event.status}
                            </Badge>
                            <Badge className={getTypeColor(event.type)} variant="secondary">
                              {event.type}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {event.description}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{event.time} {event.endTime && `- ${event.endTime}`}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{event.attendees || 0} attendees</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {event.locationType}
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium">Organizer:</span>
                            <span>{event.organizer}</span>
                            {event.reminderSet && (
                              <Badge variant="secondary" className="ml-2">
                                <Bell className="h-3 w-3 mr-1" />
                                Reminder Set
                              </Badge>
                            )}
                          </div>

                          {event.notifications && event.notifications.length > 0 && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <AlertCircle className="h-4 w-4" />
                              <span>{event.notifications.length} notification(s) sent</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(event)}
                      >
                        Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendNotification(event)}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddEventModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedEvent && (
        <>
          <EventDetailModal
            event={selectedEvent}
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedEvent(null);
            }}
          />

          <SendNotificationModal
            event={selectedEvent}
            isOpen={isNotificationModalOpen}
            onClose={() => {
              setIsNotificationModalOpen(false);
              setSelectedEvent(null);
            }}
          />
        </>
      )}
    </div>
  );
};
