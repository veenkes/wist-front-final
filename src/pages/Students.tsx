import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Download, 
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Filter,
  MoreVertical,
  Mail,
  Phone
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { mockStudents, formatCurrency, Student } from '@/data/mockData';
import { AddStudentModal } from '@/components/modals/AddStudentModal';
import { StudentDetailModal } from '@/components/modals/StudentDetailModal';
import { GroupDetailModal } from '@/components/modals/GroupDetailModal';
import { useGroups, Group } from '@/hooks/useGroups';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Students() {
  const { t } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAcademicStatus, setSelectedAcademicStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  
  const { groups, isLoading: groupsLoading } = useGroups();

  // Calculate statistics
  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter(s => s.status === 'active').length;
  const totalRevenue = mockStudents.reduce((sum, s) => sum + s.totalPaid, 0);
  const totalOwed = mockStudents.reduce((sum, s) => sum + s.totalOwed, 0);
  const averageAttendance = mockStudents.reduce((sum, s) => sum + s.attendance, 0) / mockStudents.length;

  // Filter students
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = 
      `${student.name} ${student.surname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = selectedGrade === 'all' || student.grade.toString() === selectedGrade;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    const matchesAcademicStatus = selectedAcademicStatus === 'all' || student.academicStatus === selectedAcademicStatus;
    const matchesTab = activeTab === 'all' || student.status === activeTab;
    
    return matchesSearch && matchesGrade && matchesStatus && matchesAcademicStatus && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'graduated': return 'bg-blue-500';
      case 'suspended': return 'bg-orange-500';
      case 'debt': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAcademicStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'average': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'needs-improvement': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Surname', 'Grade', 'Class', 'Status', 'Academic Status', 'Balance', 'Attendance', 'GPA'];
    const rows = filteredStudents.map(s => [
      s.id,
      s.name,
      s.surname,
      s.grade.toString(),
      s.className,
      s.status,
      s.academicStatus,
      s.balance.toString(),
      s.attendance.toString(),
      s.gpa?.toString() || 'N/A'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('students.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('students.subtitle')}</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('students.addStudent')}
        </Button>
      </div>

      {/* Groups Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-foreground">{t('students.groupsChart')}</h2>
        {groupsLoading ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            {t('common.loading')}
          </div>
        ) : groups.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            {t('common.noData')}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groups.map(g => ({ 
              name: g.name, 
              students: g.student_count || 0,
              id: g.id 
            }))}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-xs" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar 
                dataKey="students" 
                fill="hsl(var(--primary))"
                radius={[8, 8, 0, 0]}
                cursor="pointer"
                onClick={(data) => {
                  const group = groups.find(g => g.id === data.id);
                  if (group) setSelectedGroup(group);
                }}
              >
                {groups.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={`hsl(var(--primary) / ${1 - index * 0.05})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        <p className="text-xs text-muted-foreground mt-3 text-center">
          {t('students.clickForDetails')}
        </p>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('students.totalStudents')}</p>
              <p className="text-2xl font-bold mt-1">{totalStudents}</p>
              <p className="text-sm text-muted-foreground mt-1">{activeStudents} {t('students.active').toLowerCase()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('students.totalRevenue')}</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-green-500 mt-1">{t('students.allTime')}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('students.totalOwed')}</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalOwed)}</p>
              <p className="text-sm text-red-500 mt-1">{t('students.outstanding')}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('students.avgAttendance')}</p>
              <p className="text-2xl font-bold mt-1">{averageAttendance.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground mt-1">{t('students.acrossAll')}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('students.debtCases')}</p>
              <p className="text-2xl font-bold mt-1">
                {mockStudents.filter(s => s.status === 'debt').length}
              </p>
              <p className="text-sm text-red-500 mt-1">{t('students.requiresAttention')}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">{t('students.allStudents')}</TabsTrigger>
          <TabsTrigger value="active">{t('students.active')}</TabsTrigger>
          <TabsTrigger value="debt">{t('students.withDebt')}</TabsTrigger>
          <TabsTrigger value="suspended">{t('students.suspended')}</TabsTrigger>
          <TabsTrigger value="graduated">{t('students.graduated')}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t('students.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={t('students.grade')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('students.allGrades')}</SelectItem>
                  {[1,2,3,4,5,6,7,8,9,10,11].map(grade => (
                    <SelectItem key={grade} value={grade.toString()}>{t('students.grade')} {grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder={t('students.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('students.allStatus')}</SelectItem>
                  <SelectItem value="active">{t('students.active')}</SelectItem>
                  <SelectItem value="debt">{t('students.withDebt')}</SelectItem>
                  <SelectItem value="suspended">{t('students.suspended')}</SelectItem>
                  <SelectItem value="graduated">{t('students.graduated')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAcademicStatus} onValueChange={setSelectedAcademicStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('students.academicStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('students.allPerformance')}</SelectItem>
                  <SelectItem value="excellent">{t('students.excellent')}</SelectItem>
                  <SelectItem value="good">{t('students.good')}</SelectItem>
                  <SelectItem value="average">{t('students.average')}</SelectItem>
                  <SelectItem value="needs-improvement">{t('students.needsImprovement')}</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={exportToCSV} className="gap-2">
                <Download className="w-4 h-4" />
                {t('common.export')}
              </Button>
            </div>
          </Card>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback className="text-lg">
                      {student.name[0]}{student.surname[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedStudent(student)}>
                        {t('common.viewDetails')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>{t('common.edit')} {t('nav.students')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('common.sendMessage')}</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">{t('common.delete')}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg">
                      {student.name} {student.surname}
                    </h3>
                    <p className="text-sm text-muted-foreground">{student.className} • Grade {student.grade}</p>
                  </div>

                  <div className="flex gap-2">
                    <Badge className={`${getStatusColor(student.status)} text-white`}>
                      {student.status}
                    </Badge>
                    <Badge className={getAcademicStatusColor(student.academicStatus)}>
                      {student.academicStatus}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{student.phone}</span>
                    </div>
                    {student.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{student.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('students.attendance')}</span>
                      <span className="font-semibold">{student.attendance}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('students.gpa')}</span>
                      <span className="font-semibold">{student.gpa?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('students.balance')}</span>
                      <span className={`font-semibold ${student.balance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {formatCurrency(student.balance)}
                      </span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setSelectedStudent(student)}
                  >
                    {t('common.viewDetails')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No students found matching your criteria</p>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddStudentModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
      />
      
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          open={!!selectedStudent}
          onOpenChange={(open) => !open && setSelectedStudent(null)}
        />
      )}

      <GroupDetailModal
        group={selectedGroup}
        open={!!selectedGroup}
        onOpenChange={(open) => !open && setSelectedGroup(null)}
      />
    </div>
  );
}
