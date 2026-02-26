import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, Search, Download, Users, GraduationCap, Briefcase, 
  Building, Filter, MoreVertical, Mail, Phone, BookOpen
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTeachers, Teacher } from '@/hooks/useTeachers';
import { AddTeacherModal } from '@/components/modals/AddTeacherModal';
import { TeacherDetailModal } from '@/components/modals/TeacherDetailModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

export function Teachers() {
  const { t } = useTheme();
  const { teachers, isLoading } = useTeachers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [includeFormer, setIncludeFormer] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(teachers.map(t => t.department).filter(Boolean));
    return Array.from(depts).sort();
  }, [teachers]);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeTeachers = teachers.filter(t => t.status === 'active').length;
    const onLeave = teachers.filter(t => t.status === 'on_leave').length;
    const byDepartment = teachers.reduce((acc, t) => {
      const dept = t.department || 'Other';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: teachers.length,
      active: activeTeachers,
      onLeave,
      byDepartment: Object.entries(byDepartment).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    };
  }, [teachers]);

  // Filter teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      const matchesSearch = 
        teacher.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.staff_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.department?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = selectedDepartment === 'all' || teacher.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || teacher.status === selectedStatus;
      const matchesRole = selectedRole === 'all' || teacher.role === selectedRole;
      const matchesDivision = selectedDivision === 'all' || teacher.school_division === selectedDivision;
      const matchesTab = activeTab === 'all' || teacher.status === activeTab;
      const matchesFormer = includeFormer || teacher.status !== 'former';
      
      return matchesSearch && matchesDepartment && matchesStatus && matchesRole && matchesDivision && matchesTab && matchesFormer;
    });
  }, [teachers, searchQuery, selectedDepartment, selectedStatus, selectedRole, selectedDivision, activeTab, includeFormer]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'on_leave': return 'bg-orange-500';
      case 'former': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case 'teacher': return t('teachers.roleTeacher');
      case 'senior_teacher': return t('teachers.roleSeniorTeacher');
      case 'coordinator': return t('teachers.roleCoordinator');
      case 'hod': return t('teachers.roleHOD');
      default: return role || t('teachers.roleTeacher');
    }
  };

  const exportToCSV = () => {
    const headers = ['Staff ID', 'Name', 'Email', 'Phone', 'Department', 'Role', 'Status', 'Division'];
    const rows = filteredTeachers.map(t => [
      t.staff_id || '',
      t.full_name,
      t.email,
      t.phone || '',
      t.department || '',
      t.role || '',
      t.status,
      t.school_division || ''
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teachers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('teachers.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('teachers.subtitle')}</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('teachers.addTeacher')}
        </Button>
      </div>

      {/* Department Distribution Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-foreground">{t('teachers.departmentChart')}</h2>
        {stats.byDepartment.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            {t('common.noData')}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.byDepartment}>
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
                dataKey="count" 
                fill="hsl(var(--primary))"
                radius={[8, 8, 0, 0]}
              >
                {stats.byDepartment.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={`hsl(var(--primary) / ${1 - index * 0.1})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('teachers.totalTeachers')}</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
              <p className="text-sm text-muted-foreground mt-1">{stats.active} {t('teachers.active')}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('teachers.onLeave')}</p>
              <p className="text-2xl font-bold mt-1">{stats.onLeave}</p>
              <p className="text-sm text-orange-500 mt-1">{t('teachers.currentlyAway')}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('teachers.departments')}</p>
              <p className="text-2xl font-bold mt-1">{departments.length}</p>
              <p className="text-sm text-muted-foreground mt-1">{t('teachers.uniqueDepts')}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('teachers.senSpecialists')}</p>
              <p className="text-2xl font-bold mt-1">
                {teachers.filter(t => t.sen_expertise).length}
              </p>
              <p className="text-sm text-green-500 mt-1">{t('teachers.certified')}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">{t('teachers.allTeachers')}</TabsTrigger>
          <TabsTrigger value="active">{t('teachers.active')}</TabsTrigger>
          <TabsTrigger value="on_leave">{t('teachers.onLeave')}</TabsTrigger>
          <TabsTrigger value="former">{t('teachers.former')}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t('teachers.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={t('teachers.department')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('teachers.allDepartments')}</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept!}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder={t('teachers.role')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('teachers.allRoles')}</SelectItem>
                  <SelectItem value="teacher">{t('teachers.roleTeacher')}</SelectItem>
                  <SelectItem value="senior_teacher">{t('teachers.roleSeniorTeacher')}</SelectItem>
                  <SelectItem value="coordinator">{t('teachers.roleCoordinator')}</SelectItem>
                  <SelectItem value="hod">{t('teachers.roleHOD')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                <SelectTrigger>
                  <SelectValue placeholder={t('teachers.division')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('teachers.allDivisions')}</SelectItem>
                  <SelectItem value="primary">{t('teachers.divisionPrimary')}</SelectItem>
                  <SelectItem value="secondary">{t('teachers.divisionSecondary')}</SelectItem>
                  <SelectItem value="sixth_form">{t('teachers.divisionSixthForm')}</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={exportToCSV} className="gap-2">
                <Download className="w-4 h-4" />
                {t('common.export')}
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeFormer"
                  checked={includeFormer}
                  onCheckedChange={(checked) => setIncludeFormer(checked as boolean)}
                />
                <label htmlFor="includeFormer" className="text-sm text-muted-foreground cursor-pointer">
                  {t('teachers.includeFormer')}
                </label>
              </div>
            </div>
          </Card>

          {/* Teachers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={teacher.photo_url || ''} />
                    <AvatarFallback className="text-lg bg-primary/10">
                      {teacher.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedTeacher(teacher)}>
                        {t('common.viewDetails')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>{t('common.edit')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('common.sendMessage')}</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">{t('common.delete')}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg">{teacher.full_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {teacher.department || t('teachers.noDepartment')} • {teacher.staff_id || 'N/A'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className={`${getStatusColor(teacher.status)} text-white`}>
                      {teacher.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">{getRoleLabel(teacher.role)}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                    {teacher.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                  </div>

                  {teacher.subject_specialization && teacher.subject_specialization.length > 0 && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{t('teachers.subjects')}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subject_specialization.slice(0, 3).map((subject, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{subject}</Badge>
                        ))}
                        {teacher.subject_specialization.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{teacher.subject_specialization.length - 3}</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setSelectedTeacher(teacher)}
                  >
                    {t('common.viewDetails')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredTeachers.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('teachers.noTeachersFound')}</p>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddTeacherModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
      />
      
      <TeacherDetailModal
        teacher={selectedTeacher}
        open={!!selectedTeacher}
        onOpenChange={(open) => !open && setSelectedTeacher(null)}
      />
    </div>
  );
}
