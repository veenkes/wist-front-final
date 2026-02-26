import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTeachers } from '@/hooks/useTeachers';
import { useStudents } from '@/hooks/useStudents';
import { useGroups } from '@/hooks/useGroups';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  AlertCircle,
  Search,
  Eye,
  Clock,
  GraduationCap,
  Baby,
  School,
  Building2,
  TrendingUp,
  BarChart3,
  ChevronRight,
  Mail,
  Phone
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, Legend, LineChart, Line 
} from 'recharts';

type LevelFilter = 'all' | 'kindergarten' | 'primary' | 'secondary';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useTheme();
  const { teachers } = useTeachers();
  const { students } = useStudents();
  const { groups } = useGroups();

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');

  // Find current teacher
  const currentTeacher = useMemo(() => {
    if (!user) return null;
    return teachers.find(t => t.user_id === user.id || t.email === user.email) || teachers[0];
  }, [teachers, user]);

  // Determine student level based on academic_level or group
  const getStudentLevel = (student: typeof students[0]): LevelFilter => {
    const level = student.academic_level?.toLowerCase() || '';
    const groupNames = student.groups?.map(g => g.name.toLowerCase()).join(' ') || '';
    
    if (level.includes('kindergarten') || level.includes('k') || groupNames.includes('k')) {
      return 'kindergarten';
    }
    if (level.includes('secondary') || level.includes('year 10') || level.includes('year 11') || level.includes('year 12') || level.includes('y10') || level.includes('y11') || level.includes('y12')) {
      return 'secondary';
    }
    return 'primary';
  };

  // Get level display info
  const getLevelInfo = (level: LevelFilter) => {
    const info = {
      kindergarten: { 
        label: language === 'ru' ? 'Детский сад' : 'Kindergarten', 
        icon: Baby, 
        color: 'text-pink-500',
        bg: 'bg-pink-500/10'
      },
      primary: { 
        label: language === 'ru' ? 'Школа' : 'Primary School', 
        icon: School, 
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
      },
      secondary: { 
        label: language === 'ru' ? 'Старшие классы' : 'Secondary', 
        icon: Building2, 
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
      },
      all: { 
        label: language === 'ru' ? 'Все уровни' : 'All Levels', 
        icon: GraduationCap, 
        color: 'text-primary',
        bg: 'bg-primary/10'
      }
    };
    return info[level];
  };

  // Color palette for chart bars
  const GROUP_COLORS = [
    'hsl(142, 76%, 36%)',   // green
    'hsl(221, 83%, 53%)',   // blue
    'hsl(262, 83%, 58%)',   // purple
    'hsl(25, 95%, 53%)',    // orange
    'hsl(346, 77%, 49%)',   // rose
    'hsl(174, 72%, 40%)',   // teal
    'hsl(45, 93%, 47%)',    // amber
    'hsl(280, 67%, 51%)',   // violet
    'hsl(199, 89%, 48%)',   // sky
    'hsl(12, 76%, 61%)',    // coral
  ];

  // Sample groups with teachers for demo
  const sampleGroupsWithTeachers = useMemo(() => [
    {
      id: 'g1',
      name: 'K1 Stars',
      level: 'Kindergarten',
      color: GROUP_COLORS[0],
      teacher: { id: 't1', name: 'Alimova Sevara', subject: 'Early Education', email: 's.alimova@wist.uz', phone: '+998 90 111 22 33' },
      students: [
        { id: 's1', full_name: 'Bekzod Rasulov', status: 'active', academic_level: 'Kindergarten' },
        { id: 's2', full_name: 'Madina Akbarova', status: 'active', academic_level: 'Kindergarten' },
        { id: 's3', full_name: 'Amir Saidov', status: 'active', academic_level: 'Kindergarten' },
      ]
    },
    {
      id: 'g2',
      name: 'K2 Moon',
      level: 'Kindergarten',
      color: GROUP_COLORS[1],
      teacher: { id: 't2', name: 'Karimova Nilufar', subject: 'Art & Music', email: 'n.karimova@wist.uz', phone: '+998 90 222 33 44' },
      students: [
        { id: 's4', full_name: 'Jasmin Tosheva', status: 'active', academic_level: 'Kindergarten' },
        { id: 's5', full_name: 'Bobur Rahmonov', status: 'active', academic_level: 'Kindergarten' },
      ]
    },
    {
      id: 'g3',
      name: 'Year 3 Alpha',
      level: 'Primary',
      color: GROUP_COLORS[2],
      teacher: { id: 't3', name: 'Mirzaeva Ozoda', subject: 'Science', email: 'o.mirzaeva@wist.uz', phone: '+998 90 333 44 55' },
      students: [
        { id: 's6', full_name: 'Sanjar Normatov', status: 'active', academic_level: 'Year 3' },
        { id: 's7', full_name: 'Dildora Karimova', status: 'active', academic_level: 'Year 3' },
        { id: 's8', full_name: 'Rustam Yuldashev', status: 'debt', academic_level: 'Year 3' },
      ]
    },
    {
      id: 'g4',
      name: 'Year 5 Beta',
      level: 'Primary',
      color: GROUP_COLORS[3],
      teacher: { id: 't4', name: 'Nazarova Dilnoza', subject: 'English', email: 'd.nazarova@wist.uz', phone: '+998 90 444 55 66' },
      students: [
        { id: 's9', full_name: 'Murod Ismoilov', status: 'active', academic_level: 'Year 5' },
        { id: 's10', full_name: 'Laylo Tursunova', status: 'active', academic_level: 'Year 5' },
        { id: 's11', full_name: 'Jasur Karimov', status: 'active', academic_level: 'Year 5' },
        { id: 's12', full_name: 'Malika Saidova', status: 'active', academic_level: 'Year 5' },
      ]
    },
    {
      id: 'g5',
      name: 'Year 7 Gamma',
      level: 'Primary',
      color: GROUP_COLORS[4],
      teacher: { id: 't5', name: 'Toshmatov Ulugbek', subject: 'Geography', email: 'u.toshmatov@wist.uz', phone: '+998 90 555 66 77' },
      students: [
        { id: 's13', full_name: 'Kamila Rashidova', status: 'active', academic_level: 'Year 7' },
        { id: 's14', full_name: 'Sardor Aliyev', status: 'debt', academic_level: 'Year 7' },
        { id: 's15', full_name: 'Nodira Umarova', status: 'active', academic_level: 'Year 7' },
      ]
    },
    {
      id: 'g6',
      name: 'Year 8 Delta',
      level: 'Primary',
      color: GROUP_COLORS[5],
      teacher: { id: 't6', name: 'Akhmedov Rustam', subject: 'Mathematics', email: 'r.akhmedov@wist.uz', phone: '+998 90 666 77 88' },
      students: [
        { id: 's16', full_name: 'Aruzhan Karimova', status: 'active', academic_level: 'Year 8' },
        { id: 's17', full_name: 'Malika Rahimova', status: 'debt', academic_level: 'Year 8' },
        { id: 's18', full_name: 'Dilshod Ergashev', status: 'active', academic_level: 'Year 8' },
        { id: 's19', full_name: 'Zarina Tursunova', status: 'active', academic_level: 'Year 8' },
      ]
    },
    {
      id: 'g7',
      name: 'Year 10 Epsilon',
      level: 'Secondary',
      color: GROUP_COLORS[6],
      teacher: { id: 't7', name: 'Khamidov Bobur', subject: 'Physics', email: 'b.khamidov@wist.uz', phone: '+998 90 777 88 99' },
      students: [
        { id: 's20', full_name: 'Lola Tursunova', status: 'debt', academic_level: 'Year 10' },
        { id: 's21', full_name: 'Aziz Yusupov', status: 'active', academic_level: 'Year 10' },
        { id: 's22', full_name: 'Timur Ergashev', status: 'active', academic_level: 'Year 10' },
        { id: 's23', full_name: 'Shaxnoza Mirzoeva', status: 'active', academic_level: 'Year 10' },
        { id: 's24', full_name: 'Farhod Karimov', status: 'active', academic_level: 'Year 10' },
      ]
    },
    {
      id: 'g8',
      name: 'Year 11 Zeta',
      level: 'Secondary',
      color: GROUP_COLORS[7],
      teacher: { id: 't8', name: 'Yuldashev Anvar', subject: 'Chemistry', email: 'a.yuldashev@wist.uz', phone: '+998 90 888 99 00' },
      students: [
        { id: 's25', full_name: 'Javlon Oripov', status: 'active', academic_level: 'Year 11' },
        { id: 's26', full_name: 'Nilufar Hamidova', status: 'active', academic_level: 'Year 11' },
        { id: 's27', full_name: 'Bobur Toshmatov', status: 'active', academic_level: 'Year 11' },
        { id: 's28', full_name: 'Gulnoza Abdullaeva', status: 'debt', academic_level: 'Year 11' },
      ]
    },
    {
      id: 'g9',
      name: 'Year 12 Omega',
      level: 'Secondary',
      color: GROUP_COLORS[8],
      teacher: { id: 't9', name: 'Rahimova Gulshan', subject: 'Biology', email: 'g.rahimova@wist.uz', phone: '+998 90 999 00 11' },
      students: [
        { id: 's29', full_name: 'Shahzod Mirzaev', status: 'active', academic_level: 'Year 12' },
        { id: 's30', full_name: 'Madina Yusupova', status: 'active', academic_level: 'Year 12' },
        { id: 's31', full_name: 'Otabek Karimov', status: 'active', academic_level: 'Year 12' },
      ]
    },
    {
      id: 'g10',
      name: 'K3 Sun',
      level: 'Kindergarten',
      color: GROUP_COLORS[9],
      teacher: { id: 't10', name: 'Saidova Feruza', subject: 'Play & Learn', email: 'f.saidova@wist.uz', phone: '+998 90 000 11 22' },
      students: [
        { id: 's32', full_name: 'Umid Toshev', status: 'active', academic_level: 'Kindergarten' },
        { id: 's33', full_name: 'Sabina Rahmonova', status: 'active', academic_level: 'Kindergarten' },
        { id: 's34', full_name: 'Jasur Aliev', status: 'active', academic_level: 'Kindergarten' },
        { id: 's35', full_name: 'Sevinch Karimova', status: 'active', academic_level: 'Kindergarten' },
      ]
    },
  ], []);

  // Filter students by level
  const filteredStudents = useMemo(() => {
    const allSampleStudents = sampleGroupsWithTeachers.flatMap(g => 
      g.students.map(s => ({ ...s, groups: [{ name: g.name }] }))
    );
    const combined = [...allSampleStudents, ...students];
    
    if (levelFilter === 'all') return combined;
    return combined.filter(s => getStudentLevel(s) === levelFilter);
  }, [students, levelFilter, sampleGroupsWithTeachers]);

  // Get groups with data (filtered by level)
  const groupsWithData = useMemo(() => {
    return sampleGroupsWithTeachers.filter(group => {
      if (levelFilter === 'all') return true;
      const levelMap: Record<string, LevelFilter> = {
        'Kindergarten': 'kindergarten',
        'Primary': 'primary',
        'Secondary': 'secondary'
      };
      return levelMap[group.level] === levelFilter;
    }).map(group => ({
      ...group,
      attendance: Math.floor(Math.random() * 15) + 85,
      activeCount: group.students.filter(s => s.status === 'active').length
    }));
  }, [sampleGroupsWithTeachers, levelFilter]);

  // Chart data for groups
  const groupChartData = useMemo(() => {
    return groupsWithData.map((group, index) => ({
      name: group.name,
      students: group.students.length,
      level: group.level,
      attendance: group.attendance,
      active: group.activeCount,
      teacher: group.teacher.name,
      color: group.color || GROUP_COLORS[index % GROUP_COLORS.length],
    }));
  }, [groupsWithData]);

  // Selected group data
  const selectedGroupData = useMemo(() => {
    return groupsWithData.find(g => g.name === selectedGroup);
  }, [groupsWithData, selectedGroup]);

  // Filtered students for selected group modal
  const filteredGroupStudents = useMemo(() => {
    if (!selectedGroupData) return [];
    const groupStudents = selectedGroupData.students;
    if (!searchQuery) return groupStudents;
    return groupStudents.filter(s => 
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedGroupData, searchQuery]);

  // Mock today's schedule
  const todaySchedule = [
    { time: '08:30', subject: 'Mathematics', group: 'Group A', room: '101', level: 'Primary' },
    { time: '09:30', subject: 'Mathematics', group: 'Group B', room: '102', level: 'Primary' },
    { time: '10:30', subject: 'Algebra', group: 'Group C', room: '101', level: 'Secondary' },
    { time: '12:00', subject: 'Geometry', group: 'Group A', room: '103', level: 'Primary' },
    { time: '13:30', subject: 'Math Basics', group: 'K1', room: '001', level: 'Kindergarten' },
    { time: '14:30', subject: 'Algebra', group: 'Group D', room: '201', level: 'Secondary' },
  ];

  // Lessons by level for pie chart
  const lessonsByLevel = useMemo(() => {
    return [
      { name: language === 'ru' ? 'Детсад' : 'Kindergarten', value: todaySchedule.filter(l => l.level === 'Kindergarten').length, fill: 'hsl(var(--chart-1))' },
      { name: language === 'ru' ? 'Школа' : 'Primary', value: todaySchedule.filter(l => l.level === 'Primary').length, fill: 'hsl(var(--chart-2))' },
      { name: language === 'ru' ? 'Старшие' : 'Secondary', value: todaySchedule.filter(l => l.level === 'Secondary').length, fill: 'hsl(var(--chart-3))' },
    ];
  }, [todaySchedule, language]);

  // Mock attendance trend data
  const attendanceTrend = [
    { week: 'Week 1', attendance: 94 },
    { week: 'Week 2', attendance: 92 },
    { week: 'Week 3', attendance: 96 },
    { week: 'Week 4', attendance: 93 },
    { week: 'Week 5', attendance: 95 },
  ];

  // Mock average grades by group
  const gradesByGroup = useMemo(() => {
    return groupChartData.slice(0, 6).map(g => ({
      name: g.name,
      grade: (Math.random() * 1.5 + 3.5).toFixed(1),
    }));
  }, [groupChartData]);

  // Recent violations
  const recentViolations = [
    { id: 1, student: 'Иван Петров', type: 'Опоздание', date: '2024-12-08', status: 'new', group: 'Group B' },
    { id: 2, student: 'Мария Сидорова', type: 'Нарушение дисциплины', date: '2024-12-07', status: 'in_progress', group: 'Group A' },
  ];

  // Stats by level
  const levelStats = useMemo(() => {
    const allStudents = sampleGroupsWithTeachers.flatMap(g => 
      g.students.map(s => ({ ...s, groups: [{ name: g.name }], academic_level: s.academic_level }))
    );
    return {
      kindergarten: allStudents.filter(s => getStudentLevel(s) === 'kindergarten').length,
      primary: allStudents.filter(s => getStudentLevel(s) === 'primary').length,
      secondary: allStudents.filter(s => getStudentLevel(s) === 'secondary').length,
    };
  }, [sampleGroupsWithTeachers]);

  // Calculate total stats
  const totalStudents = filteredStudents.length;
  const totalGroups = groupsWithData.length;
  const todayLessons = 6; // Mock

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'ru' ? 'Доброе утро' : 'Good morning';
    if (hour < 18) return language === 'ru' ? 'Добрый день' : 'Good afternoon';
    return language === 'ru' ? 'Добрый вечер' : 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {currentTeacher?.preferred_name || currentTeacher?.full_name || user?.name}!
          </h1>
          <p className="text-muted-foreground">
            {language === 'ru' ? 'Ваши классы и группы сегодня' : 'Your classes and groups today'}
          </p>
        </div>
        
        {/* Level Filter Tabs */}
        <Tabs value={levelFilter} onValueChange={(v) => setLevelFilter(v as LevelFilter)} className="w-auto">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all" className="text-xs px-3">
              {language === 'ru' ? 'Все' : 'All'}
            </TabsTrigger>
            <TabsTrigger value="kindergarten" className="text-xs px-3">
              <Baby className="w-3 h-3 mr-1" />
              {language === 'ru' ? 'Детсад' : 'KG'}
            </TabsTrigger>
            <TabsTrigger value="primary" className="text-xs px-3">
              <School className="w-3 h-3 mr-1" />
              {language === 'ru' ? 'Школа' : 'Pri'}
            </TabsTrigger>
            <TabsTrigger value="secondary" className="text-xs px-3">
              <Building2 className="w-3 h-3 mr-1" />
              {language === 'ru' ? 'Старшие' : 'Sec'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Students Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {language === 'ru' ? 'Всего студентов' : 'Total Students'}
                </p>
                <p className="text-4xl font-bold text-foreground">{totalStudents}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {language === 'ru' ? 'которых вы ведёте' : 'that you teach'}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            {/* Level breakdown */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <Baby className="w-3 h-3 text-pink-500" /> {language === 'ru' ? 'Детсад' : 'KG'}
                </span>
                <span className="font-medium">{levelStats.kindergarten}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <School className="w-3 h-3 text-blue-500" /> {language === 'ru' ? 'Школа' : 'Primary'}
                </span>
                <span className="font-medium">{levelStats.primary}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-purple-500" /> {language === 'ru' ? 'Старшие' : 'Secondary'}
                </span>
                <span className="font-medium">{levelStats.secondary}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Groups Card */}
        <Card className="bg-gradient-to-br from-chart-2/5 to-chart-2/10 border-chart-2/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {language === 'ru' ? 'Группы' : 'Groups'}
                </p>
                <p className="text-4xl font-bold text-foreground">{totalGroups}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {language === 'ru' ? 'в вашем расписании' : 'in your schedule'}
                </p>
              </div>
              <div className="p-3 bg-chart-2/10 rounded-xl">
                <GraduationCap className="w-6 h-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Lessons Card */}
        <Card className="bg-gradient-to-br from-chart-3/5 to-chart-3/10 border-chart-3/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {language === 'ru' ? 'Уроков сегодня' : 'Lessons Today'}
                </p>
                <p className="text-4xl font-bold text-foreground">{todayLessons}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {language === 'ru' ? 'запланировано' : 'scheduled'}
                </p>
              </div>
              <div className="p-3 bg-chart-3/10 rounded-xl">
                <Calendar className="w-6 h-6 text-chart-3" />
              </div>
            </div>
            {/* Mini pie chart for lessons by level */}
            <div className="mt-3 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lessonsByLevel}
                    innerRadius={15}
                    outerRadius={25}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {lessonsByLevel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Groups Chart - Main Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Distribution Chart */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  {language === 'ru' ? 'Структура учеников по группам' : 'Student Distribution by Groups'}
                </CardTitle>
                <Badge variant="outline" className={getLevelInfo(levelFilter).bg}>
                  {getLevelInfo(levelFilter).label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={groupChartData} 
                    onClick={(data) => {
                      if (data?.activePayload?.[0]?.payload?.name) {
                        setSelectedGroup(data.activePayload[0].payload.name);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs fill-muted-foreground" tick={{ fontSize: 10 }} />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number, name: string) => [
                        value, 
                        name === 'students' ? (language === 'ru' ? 'Учеников' : 'Students') : name
                      ]}
                      labelFormatter={(label) => `${language === 'ru' ? 'Группа' : 'Group'}: ${label}`}
                    />
                    <Bar dataKey="students" radius={[4, 4, 0, 0]} cursor="pointer">
                      {groupChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          className="hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Groups Table */}
              <div className="mt-4 border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-2 font-medium text-xs">{language === 'ru' ? 'Группа' : 'Group'}</th>
                      <th className="text-center p-2 font-medium text-xs">{language === 'ru' ? 'Уровень' : 'Level'}</th>
                      <th className="text-center p-2 font-medium text-xs">{language === 'ru' ? 'Студенты' : 'Students'}</th>
                      <th className="text-center p-2 font-medium text-xs">{language === 'ru' ? 'Посещ.' : 'Attend.'}</th>
                      <th className="text-right p-2 font-medium text-xs">{language === 'ru' ? 'Действия' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupChartData.map((group) => (
                      <tr key={group.name} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: group.color }}
                            />
                            <span className="text-xs font-medium">{group.name}</span>
                          </div>
                        </td>
                        <td className="text-center p-2">
                          <Badge variant="outline" className="text-xs">{group.level}</Badge>
                        </td>
                        <td className="text-center p-2">
                          <span className="text-xs font-medium">{group.students}</span>
                        </td>
                        <td className="text-center p-2">
                          <div className="flex items-center justify-center gap-1">
                            <Progress value={group.attendance} className="w-12 h-1.5" />
                            <span className="text-xs text-muted-foreground">{group.attendance}%</span>
                          </div>
                        </td>
                        <td className="text-right p-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setSelectedGroup(group.name)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            {language === 'ru' ? 'Список' : 'View'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Attendance Trend */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  {language === 'ru' ? 'Посещаемость по неделям' : 'Attendance Trend'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="week" tick={{ fontSize: 9 }} className="fill-muted-foreground" />
                      <YAxis domain={[85, 100]} tick={{ fontSize: 9 }} className="fill-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          fontSize: '11px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="attendance" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Average Grades */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-chart-2" />
                  {language === 'ru' ? 'Средние оценки по группам' : 'Average Grades'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradesByGroup} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" domain={[3, 5]} tick={{ fontSize: 9 }} className="fill-muted-foreground" />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={50} className="fill-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          fontSize: '11px'
                        }}
                      />
                      <Bar dataKey="grade" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar - Today's Info */}
        <div className="space-y-4">
          {/* Today's Schedule */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {language === 'ru' ? 'Сегодня по расписанию' : "Today's Schedule"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {todaySchedule.slice(0, 5).map((lesson, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="text-xs text-muted-foreground font-mono w-10">
                      {lesson.time}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{lesson.subject}</p>
                      <p className="text-[10px] text-muted-foreground">{lesson.group} • {lesson.room}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] px-1.5 ${
                        lesson.level === 'Kindergarten' ? 'border-pink-500/50 text-pink-500' :
                        lesson.level === 'Secondary' ? 'border-purple-500/50 text-purple-500' :
                        'border-blue-500/50 text-blue-500'
                      }`}
                    >
                      {lesson.level.slice(0, 3)}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-2 text-xs h-7">
                {language === 'ru' ? 'Все расписание' : 'Full Schedule'}
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Recent Violations */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                {language === 'ru' ? 'Новые жалобы' : 'Recent Violations'}
                {recentViolations.length > 0 && (
                  <Badge variant="destructive" className="text-[10px] h-4 px-1.5">
                    {recentViolations.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              {recentViolations.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  {language === 'ru' ? 'Нет новых жалоб' : 'No new violations'}
                </p>
              ) : (
                <div className="space-y-2">
                  {recentViolations.map((violation) => (
                    <div 
                      key={violation.id}
                      className="p-2 rounded-lg border bg-card hover:shadow-sm transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{violation.student}</p>
                          <p className="text-[10px] text-muted-foreground">{violation.type}</p>
                        </div>
                        <Badge 
                          variant={violation.status === 'new' ? 'destructive' : 'secondary'}
                          className="text-[10px] h-4 px-1.5"
                        >
                          {violation.status === 'new' 
                            ? (language === 'ru' ? 'Новая' : 'New')
                            : (language === 'ru' ? 'В работе' : 'In progress')
                          }
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px] text-muted-foreground">{violation.date}</p>
                        <Badge variant="outline" className="text-[10px] h-4 px-1">{violation.group}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="ghost" size="sm" className="w-full mt-2 text-xs h-7">
                {language === 'ru' ? 'Все жалобы' : 'All Violations'}
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Lessons Distribution Pie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-chart-3" />
                {language === 'ru' ? 'Уроки по уровням' : 'Lessons by Level'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={lessonsByLevel}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={45}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value }) => `${value}`}
                      labelLine={false}
                    >
                      {lessonsByLevel.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        fontSize: '11px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '10px' }}
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Group Students Modal */}
      <Dialog open={!!selectedGroup} onOpenChange={() => { setSelectedGroup(null); setSearchQuery(''); }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {selectedGroup} - {language === 'ru' ? 'Список учеников' : 'Student List'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Teacher Info Card */}
            {selectedGroupData?.teacher && (
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{language === 'ru' ? 'Преподаватель' : 'Teacher'}</p>
                      <p className="font-semibold text-foreground">{selectedGroupData.teacher.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedGroupData.teacher.subject}</p>
                    </div>
                    <div className="text-right text-xs space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {selectedGroupData.teacher.email}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {selectedGroupData.teacher.phone}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={language === 'ru' ? 'Поиск по ФИО...' : 'Search by name...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-4 text-sm">
              <Badge variant="secondary" className="gap-1">
                <Users className="w-3 h-3" />
                {language === 'ru' ? 'Всего' : 'Total'}: {filteredGroupStudents.length}
              </Badge>
              <Badge variant="outline" className="gap-1 text-green-600 border-green-500/50">
                {language === 'ru' ? 'Активные' : 'Active'}: {filteredGroupStudents.filter(s => s.status === 'active').length}
              </Badge>
              {selectedGroupData && (
                <Badge variant="outline" className="gap-1">
                  {selectedGroupData.level}
                </Badge>
              )}
            </div>

            <ScrollArea className="h-72">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left p-2 font-medium text-xs">{language === 'ru' ? 'ФИО' : 'Full Name'}</th>
                      <th className="text-center p-2 font-medium text-xs">{language === 'ru' ? 'Уровень' : 'Level'}</th>
                      <th className="text-center p-2 font-medium text-xs">{language === 'ru' ? 'Посещ.' : 'Attend.'}</th>
                      <th className="text-center p-2 font-medium text-xs">{language === 'ru' ? 'Оценка' : 'Grade'}</th>
                      <th className="text-center p-2 font-medium text-xs">{language === 'ru' ? 'Статус' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGroupStudents.map((student) => {
                      const mockAttendance = Math.floor(Math.random() * 15) + 85;
                      const mockGrade = (Math.random() * 1.5 + 3.5).toFixed(1);
                      return (
                        <tr key={student.id} className="border-t hover:bg-muted/30 transition-colors cursor-pointer">
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-[10px] font-medium text-primary">
                                  {student.full_name.charAt(0)}
                                </span>
                              </div>
                              <span className="text-xs">{student.full_name}</span>
                            </div>
                          </td>
                          <td className="text-center p-2">
                            <Badge variant="outline" className="text-[10px]">
                              {student.academic_level}
                            </Badge>
                          </td>
                          <td className="text-center p-2">
                            <div className="flex items-center justify-center gap-1">
                              <Progress value={mockAttendance} className="w-10 h-1" />
                              <span className="text-[10px] text-muted-foreground">{mockAttendance}%</span>
                            </div>
                          </td>
                          <td className="text-center p-2">
                            <span className="text-xs font-medium">{mockGrade}</span>
                          </td>
                          <td className="text-center p-2">
                            <Badge 
                              variant={student.status === 'active' ? 'default' : 'secondary'}
                              className={`text-[10px] ${student.status === 'active' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' : 'bg-destructive/10 text-destructive'}`}
                            >
                              {student.status === 'active' 
                                ? (language === 'ru' ? 'Активный' : 'Active')
                                : (language === 'ru' ? 'Долг' : 'Debt')
                              }
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredGroupStudents.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">
                          {language === 'ru' ? 'Ученики не найдены' : 'No students found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherDashboard;
