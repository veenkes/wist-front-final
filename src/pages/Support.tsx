import React, { useState } from 'react';
import { MessageCircle, Users, Send, Search, Paperclip, Check, CheckCheck, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/contexts/ThemeContext';

interface Message {
  id: string;
  sender: string;
  senderType: 'admin' | 'staff' | 'parent' | 'student';
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

interface Conversation {
  id: string;
  participant: string;
  participantType: 'admin' | 'staff' | 'parent' | 'student';
  lastMessage: string;
  timestamp: string;
  unread: number;
  status?: 'pending' | 'resolved';
  messages: Message[];
}

const mockInternalChats: Conversation[] = [
  {
    id: '1',
    participant: 'Finance Team',
    participantType: 'staff',
    lastMessage: 'Budget review completed for Q1',
    timestamp: '2024-01-15T14:30:00',
    unread: 2,
    messages: [
      {
        id: 'm1',
        sender: 'Accountant',
        senderType: 'admin',
        content: 'Can we schedule a meeting to review the Q1 budget?',
        timestamp: '2024-01-15T10:00:00',
        read: true,
      },
      {
        id: 'm2',
        sender: 'Finance Team',
        senderType: 'staff',
        content: 'Budget review completed for Q1',
        timestamp: '2024-01-15T14:30:00',
        read: false,
      },
    ],
  },
  {
    id: '2',
    participant: 'Teachers Group',
    participantType: 'staff',
    lastMessage: 'Parent-teacher meetings scheduled',
    timestamp: '2024-01-14T16:00:00',
    unread: 0,
    messages: [
      {
        id: 'm3',
        sender: 'School Admin',
        senderType: 'admin',
        content: 'Please confirm availability for parent meetings next week',
        timestamp: '2024-01-14T09:00:00',
        read: true,
      },
      {
        id: 'm4',
        sender: 'Teachers Group',
        senderType: 'staff',
        content: 'Parent-teacher meetings scheduled',
        timestamp: '2024-01-14T16:00:00',
        read: true,
      },
    ],
  },
];

const mockExternalMessages: Conversation[] = [
  {
    id: '3',
    participant: 'Aziza Karimova (Parent)',
    participantType: 'parent',
    lastMessage: 'Question about tuition payment options',
    timestamp: '2024-01-15T11:20:00',
    unread: 1,
    status: 'pending',
    messages: [
      {
        id: 'm5',
        sender: 'Aziza Karimova',
        senderType: 'parent',
        content: 'Hello, I would like to know if there are installment options for tuition payment?',
        timestamp: '2024-01-15T11:20:00',
        read: false,
      },
    ],
  },
  {
    id: '4',
    participant: 'Murod Ismoilov (Student)',
    participantType: 'student',
    lastMessage: 'Request for transcript',
    timestamp: '2024-01-14T13:45:00',
    unread: 0,
    status: 'resolved',
    messages: [
      {
        id: 'm6',
        sender: 'Murod Ismoilov',
        senderType: 'student',
        content: 'I need my transcript for university application. How can I get it?',
        timestamp: '2024-01-14T13:45:00',
        read: true,
      },
      {
        id: 'm7',
        sender: 'Admin',
        senderType: 'admin',
        content: 'You can request it from the main office. It will be ready in 2-3 business days.',
        timestamp: '2024-01-14T15:00:00',
        read: true,
      },
    ],
  },
];

export const Support: React.FC = () => {
  const { t } = useTheme();
  const [activeTab, setActiveTab] = useState('internal');
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const currentChats = activeTab === 'internal' ? mockInternalChats : mockExternalMessages;
  
  const filteredChats = currentChats.filter((chat) =>
    chat.participant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    // Here you would send the message to the backend
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  const getParticipantInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    return (
      <Badge variant={status === 'pending' ? 'destructive' : 'secondary'} className="text-xs">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Support & Communication</h1>
        <p className="text-muted-foreground mt-1">Internal chat and external messages</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">
                  {mockInternalChats.length + mockExternalMessages.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Internal Chats</p>
                <p className="text-2xl font-bold">{mockInternalChats.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Circle className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {mockExternalMessages.filter(m => m.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <Badge className="bg-red-500">{mockInternalChats.reduce((acc, chat) => acc + chat.unread, 0) + mockExternalMessages.reduce((acc, chat) => acc + chat.unread, 0)}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold">
                  {mockInternalChats.reduce((acc, chat) => acc + chat.unread, 0) + 
                   mockExternalMessages.reduce((acc, chat) => acc + chat.unread, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-border px-6 pt-6">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="internal" className="gap-2">
                  <Users className="w-4 h-4" />
                  Internal Chat
                  {mockInternalChats.reduce((acc, chat) => acc + chat.unread, 0) > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                      {mockInternalChats.reduce((acc, chat) => acc + chat.unread, 0)}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="external" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  External Messages
                  {mockExternalMessages.reduce((acc, chat) => acc + chat.unread, 0) > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                      {mockExternalMessages.reduce((acc, chat) => acc + chat.unread, 0)}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-3 h-[600px]">
                {/* Chat List */}
                <div className="border-r border-border">
                  <div className="p-4 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-[536px]">
                    <div className="space-y-1 p-2">
                      {filteredChats.map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => setSelectedChat(chat)}
                          className={`p-4 rounded-lg cursor-pointer transition-colors ${
                            selectedChat?.id === chat.id
                              ? 'bg-primary/10'
                              : 'hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {getParticipantInitials(chat.participant)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-semibold text-sm truncate">
                                  {chat.participant}
                                </span>
                                {chat.unread > 0 && (
                                  <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                                    {chat.unread}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate mb-1">
                                {chat.lastMessage}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(chat.timestamp).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                                {getStatusBadge(chat.status)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Chat Messages */}
                <div className="col-span-2 flex flex-col">
                  {selectedChat ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {getParticipantInitials(selectedChat.participant)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{selectedChat.participant}</h3>
                            <p className="text-xs text-muted-foreground capitalize">
                              {selectedChat.participantType}
                            </p>
                          </div>
                        </div>
                        {selectedChat.status && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => console.log('Mark as resolved')}
                          >
                            Mark as {selectedChat.status === 'pending' ? 'Resolved' : 'Pending'}
                          </Button>
                        )}
                      </div>

                      {/* Messages */}
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {selectedChat.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.senderType === 'admin' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  message.senderType === 'admin'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm font-medium mb-1">{message.sender}</p>
                                <p className="text-sm">{message.content}</p>
                                <div className="flex items-center justify-end gap-1 mt-2">
                                  <span className="text-xs opacity-70">
                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                  {message.senderType === 'admin' && (
                                    message.read ? (
                                      <CheckCheck className="w-3 h-3 opacity-70" />
                                    ) : (
                                      <Check className="w-3 h-3 opacity-70" />
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Message Input */}
                      <div className="p-4 border-t border-border">
                        <div className="flex items-end gap-2">
                          <Button variant="outline" size="icon" className="shrink-0">
                            <Paperclip className="w-4 h-4" />
                          </Button>
                          <Textarea
                            placeholder="Type your message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            className="min-h-[60px] max-h-[120px] resize-none"
                          />
                          <Button onClick={handleSendMessage} className="shrink-0 gap-2">
                            <Send className="w-4 h-4" />
                            Send
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Select a conversation to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
