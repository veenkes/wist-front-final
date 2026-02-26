import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, UserCircle, Mail, Phone, DollarSign, Activity as ActivityIcon, Users, Clock, Download, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import AddEmployeeModal from '@/components/modals/AddEmployeeModal';
import EmployeeDetailModal from '@/components/modals/EmployeeDetailModal';

interface Employee {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  salary: number | null;
  payment_schedule: string | null;
  status: string;
  permissions: any;
  role: string;
  created_at: string;
  last_active?: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  avatar?: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  timestamp: Date;
  currentPage?: string;
  isOnline: boolean;
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Aliya Rakhimova',
    userRole: 'Admin',
    action: 'Edited student profile',
    entityType: 'student',
    entityId: 's1',
    entityName: 'Aruzhan Karimova',
    timestamp: new Date(Date.now() - 5 * 60000),
    currentPage: '/students',
    isOnline: true,
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Sanjar Yusupov',
    userRole: 'Accountant',
    action: 'Approved payment',
    entityType: 'payment',
    entityId: 'p1',
    entityName: 'Payment #1024',
    timestamp: new Date(Date.now() - 15 * 60000),
    currentPage: '/payments',
    isOnline: true,
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Dilnoza Nazarova',
    userRole: 'Finance Analyst',
    action: 'Added new expense',
    entityType: 'expense',
    entityId: 'e1',
    entityName: 'Office Supplies',
    timestamp: new Date(Date.now() - 30 * 60000),
    currentPage: '/expenses',
    isOnline: true,
  },
  {
    id: '4',
    userId: 'u4',
    userName: 'Rustam Karimov',
    userRole: 'Admin',
    action: 'Created new event',
    entityType: 'event',
    entityId: 'ev1',
    entityName: 'Parent-Teacher Conference',
    timestamp: new Date(Date.now() - 60 * 60000),
    isOnline: false,
  },
  {
    id: '5',
    userId: 'u5',
    userName: 'Malika Sharipova',
    userRole: 'Cashier',
    action: 'Processed cash payment',
    entityType: 'payment',
    entityId: 'p2',
    entityName: 'Payment #1025',
    timestamp: new Date(Date.now() - 90 * 60000),
    isOnline: false,
  },
  {
    id: '6',
    userId: 'u2',
    userName: 'Sanjar Yusupov',
    userRole: 'Accountant',
    action: 'Updated student balance',
    entityType: 'student',
    entityId: 's2',
    entityName: 'Murod Ismoilov',
    timestamp: new Date(Date.now() - 120 * 60000),
    currentPage: '/payments',
    isOnline: true,
  },
  {
    id: '7',
    userId: 'u1',
    userName: 'Aliya Rakhimova',
    userRole: 'Admin',
    action: 'Sent notification',
    entityType: 'notification',
    entityId: 'n1',
    entityName: 'Tuition Reminder',
    timestamp: new Date(Date.now() - 180 * 60000),
    currentPage: '/students',
    isOnline: true,
  },
];

const onlineUsers = mockActivityLogs.filter(log => log.isOnline).reduce((acc, log) => {
  if (!acc.find(u => u.userId === log.userId)) {
    acc.push(log);
  }
  return acc;
}, [] as ActivityLog[]);

export const Employees: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterEmployeeRole, setFilterEmployeeRole] = useState<string>('all');
  
  // Activity log states
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      
      // Fetch employees with their roles
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (employeesError) {
        console.error('Error fetching employees:', employeesError);
        setEmployees([]);
        setFilteredEmployees([]);
        return;
      }

      if (!employeesData || employeesData.length === 0) {
        setEmployees([]);
        setFilteredEmployees([]);
        return;
      }

      // Fetch roles for each employee
      const employeesWithRoles = await Promise.all(
        employeesData.map(async (emp) => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', emp.user_id)
            .maybeSingle();

          return {
            ...emp,
            role: roleData?.role || 'unknown',
          };
        })
      );

      setEmployees(employeesWithRoles);
      setFilteredEmployees(employeesWithRoles);
    } catch (error: any) {
      console.error('Error loading employees:', error);
      setEmployees([]);
      setFilteredEmployees([]);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список сотрудников',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadEmployees();
    }
  }, [user]);

  useEffect(() => {
    let filtered = employees.filter(
      (emp) =>
        emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(emp => emp.status === filterStatus);
    }

    // Apply role filter
    if (filterEmployeeRole !== 'all') {
      filtered = filtered.filter(emp => emp.role === filterEmployeeRole);
    }

    setFilteredEmployees(filtered);
  }, [searchQuery, employees, filterStatus, filterEmployeeRole]);

  const handleEmployeeClick = (employee: Employee) => {
    if (user?.role === 'ceo') {
      setSelectedEmployee(employee);
      setIsDetailModalOpen(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
      case 'suspended':
        return 'bg-red-500/20 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ceo':
        return 'bg-purple-500/20 text-purple-700 dark:text-purple-300';
      case 'admin':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'accountant':
        return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'teacher':
        return 'bg-orange-500/20 text-orange-700 dark:text-orange-300';
      case 'support':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  // Activity Log functions
  const filteredLogs = mockActivityLogs.filter((log) => {
    const matchesSearch = log.userName.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
                         log.action.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
                         log.entityName.toLowerCase().includes(activitySearchQuery.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action.toLowerCase().includes(filterAction.toLowerCase());
    const matchesRole = filterRole === 'all' || log.userRole === filterRole;
    const matchesOnline = !showOnlineOnly || log.isOnline;

    return matchesSearch && matchesAction && matchesRole && matchesOnline;
  });

  const handleEntityClick = (entityType: string, entityId: string) => {
    switch (entityType) {
      case 'student':
        navigate('/students');
        break;
      case 'payment':
        navigate('/payments');
        break;
      case 'expense':
        navigate('/expenses');
        break;
      case 'event':
        navigate('/events');
        break;
      case 'notification':
        navigate('/notifications');
        break;
    }
  };

  const getActivityRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Accountant':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Finance Analyst':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Cashier':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const exportToCSV = () => {
    const headers = ['User', 'Role', 'Action', 'Entity', 'Timestamp'];
    const rows = filteredLogs.map(log => [
      log.userName,
      log.userRole,
      log.action,
      log.entityName,
      log.timestamp.toLocaleString(),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activity-log.csv';
    a.click();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">Please wait...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employees & Activity</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members and monitor system activity
          </p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)} 
          className="gap-2"
          disabled={user?.role !== 'ceo'}
        >
          <Plus size={18} />
          Add Employee
        </Button>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="employees" className="gap-2">
            <Users size={16} />
            Employees
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <ActivityIcon size={16} />
            Activity Log
          </TabsTrigger>
        </TabsList>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, phone, role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterEmployeeRole} onValueChange={setFilterEmployeeRole}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="ceo">CEO</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>

                {(filterStatus !== 'all' || filterEmployeeRole !== 'all' || searchQuery) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterStatus('all');
                      setFilterEmployeeRole('all');
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total: {filteredEmployees.length} employees</span>
                <span>Active: {filteredEmployees.filter(e => e.status === 'active').length}</span>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading employees...</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <UserCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No employees found</h3>
                {employees.length === 0 ? (
                  <div className="space-y-2">
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Get started by adding your first employee using the "Add Employee" button above.
                    </p>
                    <Button 
                      onClick={() => setIsAddModalOpen(true)} 
                      className="mt-4"
                      disabled={user?.role !== 'ceo'}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Employee
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((employee) => (
                  <Card
                    key={employee.id}
                    className={`p-4 transition-all border-2 ${
                      employee.status === 'active' 
                        ? 'border-green-500/20' 
                        : employee.status === 'suspended'
                        ? 'border-red-500/20'
                        : 'border-border'
                    } ${user?.role === 'ceo' ? 'cursor-pointer hover:shadow-lg hover:border-primary/50' : ''}`}
                    onClick={() => handleEmployeeClick(employee)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={employee.avatar_url || undefined} />
                          <AvatarFallback className="text-lg font-semibold">
                            {employee.full_name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {Math.random() > 0.5 && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" 
                               title="Online" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground truncate text-lg">
                              {employee.full_name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getRoleBadgeColor(employee.role)}`}>
                                {employee.role.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(employee.status)}>
                                {employee.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1.5 text-sm text-muted-foreground mt-3">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="flex-shrink-0" />
                            <span className="truncate">{employee.email}</span>
                          </div>
                          {employee.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="flex-shrink-0" />
                              <span>{employee.phone}</span>
                            </div>
                          )}
                          {employee.salary && (
                            <div className="flex items-center gap-2">
                              <DollarSign size={14} className="flex-shrink-0" />
                              <span className="font-medium text-foreground">
                                ${employee.salary.toLocaleString()} / {employee.payment_schedule}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {employee.permissions && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <div className="flex flex-wrap gap-1">
                              {employee.permissions.edit_students && (
                                <Badge variant="outline" className="text-xs">Edit Students</Badge>
                              )}
                              {employee.permissions.access_payments && (
                                <Badge variant="outline" className="text-xs">Payments</Badge>
                              )}
                              {employee.permissions.access_expenses && (
                                <Badge variant="outline" className="text-xs">Expenses</Badge>
                              )}
                              {employee.permissions.send_notifications && (
                                <Badge variant="outline" className="text-xs">Notifications</Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Online Users</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{onlineUsers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Currently active</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Actions Today</CardTitle>
                <ActivityIcon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockActivityLogs.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Total recorded</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Response Time</CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">2.3h</div>
                <p className="text-xs text-muted-foreground mt-1">Average today</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user, action, or entity..."
                    value={activitySearchQuery}
                    onChange={(e) => setActivitySearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={exportToCSV} variant="outline" className="gap-2">
                  <Download size={16} />
                  Export CSV
                </Button>
              </div>

              <div className="flex flex-wrap gap-4">
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="edited">Edited</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="added">Added</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Accountant">Accountant</SelectItem>
                    <SelectItem value="Finance Analyst">Finance Analyst</SelectItem>
                    <SelectItem value="Cashier">Cashier</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={showOnlineOnly ? 'default' : 'outline'}
                  onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                  className="gap-2"
                >
                  <Users size={16} />
                  {showOnlineOnly ? 'Show All' : 'Online Only'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Activity List */}
          <Card className="p-6">
            <div className="space-y-4">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <ActivityIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No activity logs found</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-border"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={log.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {log.userName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground">{log.userName}</span>
                            <Badge className={getActivityRoleBadgeColor(log.userRole)} variant="outline">
                              {log.userRole}
                            </Badge>
                            {log.isOnline && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                Online
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <span className="text-foreground font-medium">{log.action}</span>
                            {' on '}
                            <button
                              onClick={() => handleEntityClick(log.entityType, log.entityId)}
                              className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                            >
                              {log.entityName}
                              <Eye size={12} />
                            </button>
                          </p>
                          {log.currentPage && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Current page: {log.currentPage}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock size={12} />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <AddEmployeeModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          loadEmployees();
          setIsAddModalOpen(false);
        }}
      />

      {selectedEmployee && (
        <EmployeeDetailModal
          open={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
          onUpdate={loadEmployees}
        />
      )}
    </div>
  );
};