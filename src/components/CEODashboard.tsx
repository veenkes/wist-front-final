import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '@/hooks/useStudents';
import { useGroups } from '@/hooks/useGroups';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
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
  Mail,
  Phone,
  FileText,
  Upload,
  Paperclip,
  Plus,
  X
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, PieChart, Pie, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

type LevelFilter = 'all' | 'kindergarten' | 'primary' | 'secondary';

interface Homework {
  id: string;
  lessonId: string;
  description: string;
  files: { name: string; url: string }[];
  createdAt: string;
}

// Color palette for chart bars
const GROUP_COLORS = [
  'hsl(142, 76%, 36%)',
  'hsl(221, 83%, 53%)',
  'hsl(262, 83%, 58%)',
  'hsl(25, 95%, 53%)',
  'hsl(346, 77%, 49%)',
  'hsl(174, 72%, 40%)',
  'hsl(45, 93%, 47%)',
  'hsl(280, 67%, 51%)',
  'hsl(199, 89%, 48%)',
  'hsl(12, 76%, 61%)',
];

// Sample groups with teachers
const sampleGroupsWithTeachers = [
  {
    id: 'g1',
    name: 'K1 Stars',
    level: 'Kindergarten',
    color: GROUP_COLORS[0],
    teacher: { id: 't1', name: 'Alimova Sevara', subject: 'Early Education', email: 's.alimova@wist.uz', phone: '+998 90 111 22 33' },
    students: [
      { id: 's1', full_name: 'Bekzod Rasulov', status: 'active', academic_level: 'Kindergarten', attendance: 95, grade: 'A' },
      { id: 's2', full_name: 'Madina Akbarova', status: 'active', academic_level: 'Kindergarten', attendance: 92, grade: 'A-' },
      { id: 's3', full_name: 'Amir Saidov', status: 'active', academic_level: 'Kindergarten', attendance: 88, grade: 'B+' },
    ]
  },
  {
    id: 'g2',
    name: 'K2 Moon',
    level: 'Kindergarten',
    color: GROUP_COLORS[1],
    teacher: { id: 't2', name: 'Karimova Nilufar', subject: 'Art & Music', email: 'n.karimova@wist.uz', phone: '+998 90 222 33 44' },
    students: [
      { id: 's4', full_name: 'Jasmin Tosheva', status: 'active', academic_level: 'Kindergarten', attendance: 97, grade: 'A' },
      { id: 's5', full_name: 'Bobur Rahmonov', status: 'active', academic_level: 'Kindergarten', attendance: 94, grade: 'A' },
    ]
  },
  {
    id: 'g3',
    name: 'Year 3 Alpha',
    level: 'Primary',
    color: GROUP_COLORS[2],
    teacher: { id: 't3', name: 'Mirzaeva Ozoda', subject: 'Science', email: 'o.mirzaeva@wist.uz', phone: '+998 90 333 44 55' },
    students: [
      { id: 's6', full_name: 'Sanjar Normatov', status: 'active', academic_level: 'Year 3', attendance: 91, grade: 'B+' },
      { id: 's7', full_name: 'Dildora Karimova', status: 'active', academic_level: 'Year 3', attendance: 89, grade: 'B' },
      { id: 's8', full_name: 'Rustam Yuldashev', status: 'debt', academic_level: 'Year 3', attendance: 85, grade: 'B-' },
    ]
  },
  {
    id: 'g4',
    name: 'Year 5 Beta',
    level: 'Primary',
    color: GROUP_COLORS[3],
    teacher: { id: 't4', name: 'Nazarova Dilnoza', subject: 'English', email: 'd.nazarova@wist.uz', phone: '+998 90 444 55 66' },
    students: [
      { id: 's9', full_name: 'Murod Ismoilov', status: 'active', academic_level: 'Year 5', attendance: 93, grade: 'A-' },
      { id: 's10', full_name: 'Laylo Tursunova', status: 'active', academic_level: 'Year 5', attendance: 96, grade: 'A' },
      { id: 's11', full_name: 'Jasur Karimov', status: 'active', academic_level: 'Year 5', attendance: 88, grade: 'B+' },
      { id: 's12', full_name: 'Malika Saidova', status: 'active', academic_level: 'Year 5', attendance: 92, grade: 'A-' },
    ]
  },
  {
    id: 'g5',
    name: 'Year 7 Gamma',
    level: 'Primary',
    color: GROUP_COLORS[4],
    teacher: { id: 't5', name: 'Toshmatov Ulugbek', subject: 'Geography', email: 'u.toshmatov@wist.uz', phone: '+998 90 555 66 77' },
    students: [
      { id: 's13', full_name: 'Kamila Rashidova', status: 'active', academic_level: 'Year 7', attendance: 94, grade: 'A' },
      { id: 's14', full_name: 'Sardor Aliyev', status: 'debt', academic_level: 'Year 7', attendance: 82, grade: 'C+' },
      { id: 's15', full_name: 'Nodira Umarova', status: 'active', academic_level: 'Year 7', attendance: 90, grade: 'B+' },
    ]
  },
  {
    id: 'g6',
    name: 'Year 8 Delta',
    level: 'Primary',
    color: GROUP_COLORS[5],
    teacher: { id: 't6', name: 'Akhmedov Rustam', subject: 'Mathematics', email: 'r.akhmedov@wist.uz', phone: '+998 90 666 77 88' },
    students: [
      { id: 's16', full_name: 'Aruzhan Karimova', status: 'active', academic_level: 'Year 8', attendance: 97, grade: 'A' },
      { id: 's17', full_name: 'Malika Rahimova', status: 'debt', academic_level: 'Year 8', attendance: 79, grade: 'C' },
      { id: 's18', full_name: 'Dilshod Ergashev', status: 'active', academic_level: 'Year 8', attendance: 91, grade: 'B+' },
      { id: 's19', full_name: 'Zarina Tursunova', status: 'active', academic_level: 'Year 8', attendance: 95, grade: 'A-' },
    ]
  },
  {
    id: 'g7',
    name: 'Year 10 Epsilon',
    level: 'Secondary',
    color: GROUP_COLORS[6],
    teacher: { id: 't7', name: 'Khamidov Bobur', subject: 'Physics', email: 'b.khamidov@wist.uz', phone: '+998 90 777 88 99' },
    students: [
      { id: 's20', full_name: 'Lola Tursunova', status: 'debt', academic_level: 'Year 10', attendance: 85, grade: 'B' },
      { id: 's21', full_name: 'Aziz Yusupov', status: 'active', academic_level: 'Year 10', attendance: 93, grade: 'A-' },
      { id: 's22', full_name: 'Timur Ergashev', status: 'active', academic_level: 'Year 10', attendance: 96, grade: 'A' },
      { id: 's23', full_name: 'Shaxnoza Mirzoeva', status: 'active', academic_level: 'Year 10', attendance: 91, grade: 'B+' },
      { id: 's24', full_name: 'Farhod Karimov', status: 'active', academic_level: 'Year 10', attendance: 89, grade: 'B+' },
    ]
  },
  {
    id: 'g8',
    name: 'Year 11 Zeta',
    level: 'Secondary',
    color: GROUP_COLORS[7],
    teacher: { id: 't8', name: 'Yuldashev Anvar', subject: 'Chemistry', email: 'a.yuldashev@wist.uz', phone: '+998 90 888 99 00' },
    students: [
      { id: 's25', full_name: 'Javlon Oripov', status: 'active', academic_level: 'Year 11', attendance: 94, grade: 'A-' },
      { id: 's26', full_name: 'Nilufar Hamidova', status: 'active', academic_level: 'Year 11', attendance: 97, grade: 'A' },
      { id: 's27', full_name: 'Bobur Toshmatov', status: 'active', academic_level: 'Year 11', attendance: 92, grade: 'A-' },
      { id: 's28', full_name: 'Gulnoza Abdullaeva', status: 'debt', academic_level: 'Year 11', attendance: 78, grade: 'C+' },
    ]
  },
  {
    id: 'g9',
    name: 'Year 12 Omega',
    level: 'Secondary',
    color: GROUP_COLORS[8],
    teacher: { id: 't9', name: 'Rahimova Gulshan', subject: 'Biology', email: 'g.rahimova@wist.uz', phone: '+998 90 999 00 11' },
    students: [
      { id: 's29', full_name: 'Shahzod Mirzaev', status: 'active', academic_level: 'Year 12', attendance: 98, grade: 'A' },
      { id: 's30', full_name: 'Madina Yusupova', status: 'active', academic_level: 'Year 12', attendance: 95, grade: 'A' },
      { id: 's31', full_name: 'Otabek Karimov', status: 'active', academic_level: 'Year 12', attendance: 93, grade: 'A-' },
    ]
  },
  {
    id: 'g10',
    name: 'K3 Sun',
    level: 'Kindergarten',
    color: GROUP_COLORS[9],
    teacher: { id: 't10', name: 'Saidova Feruza', subject: 'Play & Learn', email: 'f.saidova@wist.uz', phone: '+998 90 000 11 22' },
    students: [
      { id: 's32', full_name: 'Umid Toshev', status: 'active', academic_level: 'Kindergarten', attendance: 96, grade: 'A' },
      { id: 's33', full_name: 'Sabina Rahmonova', status: 'active', academic_level: 'Kindergarten', attendance: 94, grade: 'A-' },
      { id: 's34', full_name: 'Jasur Aliev', status: 'active', academic_level: 'Kindergarten', attendance: 91, grade: 'B+' },
      { id: 's35', full_name: 'Sevinch Karimova', status: 'active', academic_level: 'Kindergarten', attendance: 97, grade: 'A' },
    ]
  },
];

const CEODashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useTheme();
  const navigate = useNavigate();
  const { students: dbStudents } = useStudents();
  const { groups: dbGroups } = useGroups();

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  
  // Homework state
  const [homeworkModal, setHomeworkModal] = useState<{ open: boolean; lessonIndex: number | null }>({ open: false, lessonIndex: null });
  const [homeworkText, setHomeworkText] = useState('');
  const [homeworkFiles, setHomeworkFiles] = useState<{ name: string }[]>([]);
  const [savedHomeworks, setSavedHomeworks] = useState<Record<number, { text: string; files: { name: string }[] }>>({});

  // Build groups from real DB data, falling back to mock data
  const groupsWithData = useMemo(() => {
    // If we have real DB data, use it
    const realGroupsMap = new Map<string, typeof sampleGroupsWithTeachers[0]>();
    
    if (dbGroups.length > 0 && dbStudents.length > 0) {
      dbGroups.forEach((dbGroup, index) => {
        const groupStudents = dbStudents
          .filter((s: any) => s.group?.id === dbGroup.id)
          .map((s: any) => ({
            id: s.id, // Real UUID
            full_name: s.full_name,
            status: s.status || 'active',
            academic_level: s.academic_level || dbGroup.name,
            attendance: Math.floor(85 + Math.random() * 15),
            grade: ['A', 'A-', 'B+', 'B', 'B-', 'C+'][Math.floor(Math.random() * 6)],
          }));
        
        if (groupStudents.length > 0) {
          const gradeLevel = dbGroup.grade_level || 0;
          const level = gradeLevel <= 0 ? 'Kindergarten' : gradeLevel <= 8 ? 'Primary' : 'Secondary';
          
          realGroupsMap.set(dbGroup.name, {
            id: dbGroup.id,
            name: dbGroup.name,
            level,
            color: GROUP_COLORS[index % GROUP_COLORS.length],
            teacher: dbGroup.curator ? {
              id: dbGroup.curator.id,
              name: dbGroup.curator.full_name,
              subject: '',
              email: dbGroup.curator.email,
              phone: '',
            } : sampleGroupsWithTeachers[index % sampleGroupsWithTeachers.length]?.teacher || { id: '', name: 'Не назначен', subject: '', email: '', phone: '' },
            students: groupStudents,
          });
        }
      });
    }

    // Merge: use real groups first, then fill with mock groups
    const allGroups = realGroupsMap.size > 0
      ? [...realGroupsMap.values(), ...sampleGroupsWithTeachers.filter(g => !realGroupsMap.has(g.name))]
      : sampleGroupsWithTeachers;

    return allGroups.filter(group => {
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
  }, [levelFilter, dbStudents, dbGroups]);

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

  // Today's schedule
  const todaySchedule = [
    { time: '08:30', subject: 'Математика', group: 'Year 8 Delta', room: '101' },
    { time: '09:30', subject: 'Русский язык', group: 'Year 5 Beta', room: '102' },
    { time: '10:30', subject: 'Алгебра', group: 'Year 10 Epsilon', room: '101' },
    { time: '12:00', subject: 'Геометрия', group: 'Year 3 Alpha', room: '103' },
    { time: '13:30', subject: 'Основы счёта', group: 'K1 Stars', room: '001' },
    { time: '14:30', subject: 'Физика', group: 'Year 11 Zeta', room: '201' },
  ];

  // Recent violations
  const recentViolations = [
    { id: 1, student: 'Расулов Бекзод', type: 'Опоздание', date: '2024-12-08', status: 'new', group: 'Year 3 Alpha' },
    { id: 2, student: 'Алиев Сардор', type: 'Нарушение дисциплины', date: '2024-12-07', status: 'in_progress', group: 'Year 7 Gamma' },
  ];

  // Attendance period filter
  const [attendancePeriod, setAttendancePeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [gradeSubjectFilter, setGradeSubjectFilter] = useState('all');
  const [attendanceGroupFilter, setAttendanceGroupFilter] = useState('all');
  const [attendanceStudentFilter, setAttendanceStudentFilter] = useState('all');
  const [gradesGroupFilter, setGradesGroupFilter] = useState('all');
  const [gradesStudentFilter, setGradesStudentFilter] = useState('all');

  // All students flat list for filters
  const allStudentsFlat = useMemo(() => {
    return groupsWithData.flatMap(g => g.students.map(s => ({ ...s, group: g.name, groupId: g.id })));
  }, [groupsWithData]);

  // Filtered students for attendance group filter
  const attendanceFilteredStudents = useMemo(() => {
    if (attendanceGroupFilter === 'all') return allStudentsFlat;
    return allStudentsFlat.filter(s => s.group === attendanceGroupFilter);
  }, [allStudentsFlat, attendanceGroupFilter]);

  // Filtered students for grades group filter
  const gradesFilteredStudents = useMemo(() => {
    if (gradesGroupFilter === 'all') return allStudentsFlat;
    return allStudentsFlat.filter(s => s.group === gradesGroupFilter);
  }, [allStudentsFlat, gradesGroupFilter]);

  // Attendance weekly trend data
  // Seeded random helper based on string
  const seededRandom = (seed: string, index: number) => {
    let hash = 0;
    const str = seed + index;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return ((hash & 0x7fffffff) % 100) / 100;
  };

  // Attendance weekly trend data - reactive to filters
  const attendanceTrendData = useMemo(() => {
    const seed = `${attendancePeriod}-${attendanceGroupFilter}-${attendanceStudentFilter}`;
    const isStudent = attendanceStudentFilter !== 'all';
    const isGroup = attendanceGroupFilter !== 'all';
    const basePresent = isStudent ? 85 : isGroup ? 88 : 92;
    const baseAbsent = isStudent ? 8 : isGroup ? 7 : 5;
    const baseLate = isStudent ? 7 : isGroup ? 5 : 3;

    const generatePoint = (label: string, i: number) => {
      const r = seededRandom(seed + label, i);
      const present = Math.round(basePresent + r * 10 - 3);
      const absent = Math.round(baseAbsent + r * 4 - 2);
      const late = Math.round(baseLate + r * 3 - 1);
      return { label, present: Math.min(100, Math.max(70, present)), absent: Math.max(0, absent), late: Math.max(0, late) };
    };

    if (attendancePeriod === 'week') {
      return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'].map((d, i) => generatePoint(d, i));
    }
    if (attendancePeriod === 'month') {
      return ['Нед 1', 'Нед 2', 'Нед 3', 'Нед 4'].map((d, i) => generatePoint(d, i));
    }
    return ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'].map((d, i) => generatePoint(d, i));
  }, [attendancePeriod, attendanceGroupFilter, attendanceStudentFilter]);

  // Attendance distribution pie
  const attendanceDistribution = useMemo(() => {
    const avgPresent = attendanceTrendData.reduce((s, d) => s + d.present, 0) / attendanceTrendData.length;
    const avgAbsent = attendanceTrendData.reduce((s, d) => s + d.absent, 0) / attendanceTrendData.length;
    const avgLate = attendanceTrendData.reduce((s, d) => s + d.late, 0) / attendanceTrendData.length;
    return [
      { name: 'Присутствуют', value: Math.round(avgPresent), fill: 'hsl(142, 76%, 36%)' },
      { name: 'Отсутствуют', value: Math.round(avgAbsent), fill: 'hsl(0, 84%, 60%)' },
      { name: 'Опоздали', value: Math.round(avgLate), fill: 'hsl(45, 93%, 47%)' },
    ];
  }, [attendanceTrendData]);

  // Attendance by group - highlight selected
  const attendanceByGroup = useMemo(() => {
    const filtered = attendanceGroupFilter !== 'all' 
      ? groupsWithData.filter(g => g.name === attendanceGroupFilter)
      : groupsWithData;
    return filtered.map((g, i) => ({
      name: g.name.length > 8 ? g.name.slice(0, 8) + '..' : g.name,
      fullName: g.name,
      rate: Math.round(g.students.reduce((s, st) => s + st.attendance, 0) / g.students.length),
      color: g.color,
    }));
  }, [groupsWithData, attendanceGroupFilter]);

  // Grades subjects
  const SUBJECTS = ['Математика', 'Русский язык', 'Физика', 'Английский', 'История', 'Химия', 'Биология', 'Литература'];

  // Grades data per subject - reactive to filters
  const gradesData = useMemo(() => {
    const seed = `grades-${gradesGroupFilter}-${gradesStudentFilter}-${gradeSubjectFilter}`;
    return SUBJECTS.map((subject, i) => {
      const r = seededRandom(seed, i);
      const isStudent = gradesStudentFilter !== 'all';
      const baseAvg = isStudent ? 3.0 + r * 2 : 3.3 + r * 1.5;
      return {
        subject: subject.slice(0, 6),
        fullSubject: subject,
        avg: +baseAvg.toFixed(1),
        max: 5,
        min: +(2.5 + r * 0.8).toFixed(1),
      };
    });
  }, [gradesGroupFilter, gradesStudentFilter, gradeSubjectFilter]);

  // Grade distribution - reactive
  const gradeDistribution = useMemo(() => {
    const seed = `dist-${gradesGroupFilter}-${gradesStudentFilter}`;
    const r = (i: number) => seededRandom(seed, i);
    const isStudent = gradesStudentFilter !== 'all';
    return [
      { name: '5 (Отлично)', value: Math.round(isStudent ? 15 + r(0) * 30 : 25 + r(0) * 10), fill: 'hsl(142, 76%, 36%)' },
      { name: '4 (Хорошо)', value: Math.round(isStudent ? 20 + r(1) * 25 : 30 + r(1) * 10), fill: 'hsl(221, 83%, 53%)' },
      { name: '3 (Удовл.)', value: Math.round(isStudent ? 10 + r(2) * 20 : 18 + r(2) * 8), fill: 'hsl(45, 93%, 47%)' },
      { name: '2 (Неуд.)', value: Math.round(isStudent ? 2 + r(3) * 10 : 5 + r(3) * 6), fill: 'hsl(0, 84%, 60%)' },
      { name: 'Н/А', value: Math.round(3 + r(4) * 8), fill: 'hsl(var(--muted-foreground))' },
    ];
  }, [gradesGroupFilter, gradesStudentFilter]);

  // Grade trend per quarter - reactive
  const gradeTrend = useMemo(() => {
    const seed = `trend-${gradesGroupFilter}-${gradesStudentFilter}`;
    return ['1 четв.', '2 четв.', '3 четв.', '4 четв.'].map((q, i) => {
      const r = (j: number) => seededRandom(seed + q, j);
      return {
        quarter: q,
        avg: +(3.5 + r(0) * 1.0).toFixed(1),
        math: +(3.4 + r(1) * 1.2).toFixed(1),
        russian: +(3.2 + r(2) * 1.3).toFixed(1),
        english: +(3.6 + r(3) * 1.0).toFixed(1),
      };
    });
  }, [gradesGroupFilter, gradesStudentFilter]);

  // Radar data for subject performance - reactive
  const radarData = useMemo(() => {
    const seed = `radar-${gradesGroupFilter}-${gradesStudentFilter}`;
    return SUBJECTS.map((s, i) => ({
      subject: s.slice(0, 4),
      fullSubject: s,
      score: +(3.0 + seededRandom(seed, i) * 1.8).toFixed(1),
      fullMark: 5,
    }));
  }, [gradesGroupFilter, gradesStudentFilter]);

  // Top/bottom students - reactive to attendance group filter
  const topStudents = useMemo(() => {
    const source = attendanceGroupFilter !== 'all'
      ? groupsWithData.filter(g => g.name === attendanceGroupFilter)
      : groupsWithData;
    const all = source.flatMap(g => g.students.map(s => ({ ...s, group: g.name })));
    return all.sort((a, b) => b.attendance - a.attendance).slice(0, 5);
  }, [attendanceGroupFilter, groupsWithData]);

  const bottomStudents = useMemo(() => {
    const source = attendanceGroupFilter !== 'all'
      ? groupsWithData.filter(g => g.name === attendanceGroupFilter)
      : groupsWithData;
    const all = source.flatMap(g => g.students.map(s => ({ ...s, group: g.name })));
    return all.sort((a, b) => a.attendance - b.attendance).slice(0, 5);
  }, [attendanceGroupFilter, groupsWithData]);

  // Calculate total stats
  const totalStudents = groupsWithData.reduce((sum, g) => sum + g.students.length, 0);
  const totalGroups = groupsWithData.length;
  const todayLessons = todaySchedule.length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'ru' ? 'Доброе утро' : 'Good morning';
    if (hour < 18) return language === 'ru' ? 'Добрый день' : 'Good afternoon';
    return language === 'ru' ? 'Добрый вечер' : 'Good evening';
  };

  const handleOpenHomework = (index: number) => {
    const existing = savedHomeworks[index];
    if (existing) {
      setHomeworkText(existing.text);
      setHomeworkFiles(existing.files);
    } else {
      setHomeworkText('');
      setHomeworkFiles([]);
    }
    setHomeworkModal({ open: true, lessonIndex: index });
  };

  const handleSaveHomework = () => {
    if (homeworkModal.lessonIndex !== null) {
      setSavedHomeworks(prev => ({
        ...prev,
        [homeworkModal.lessonIndex!]: { text: homeworkText, files: homeworkFiles }
      }));
      toast.success(language === 'ru' ? 'Домашнее задание сохранено' : 'Homework saved');
      setHomeworkModal({ open: false, lessonIndex: null });
    }
  };

  const handleAddFile = () => {
    // Simulate file addition
    const fileName = `Файл_${homeworkFiles.length + 1}.pdf`;
    setHomeworkFiles(prev => [...prev, { name: fileName }]);
    toast.success(language === 'ru' ? 'Файл добавлен' : 'File added');
  };

  const handleRemoveFile = (index: number) => {
    setHomeworkFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-sm text-muted-foreground">
            {language === 'ru' ? 'Обзор классов и групп' : 'Classes and groups overview'}
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

      {/* Main Layout: Cards Left + Chart Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Side - KPI Cards */}
        <div className="space-y-3">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {language === 'ru' ? 'Всего студентов' : 'Total Students'}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {language === 'ru' ? 'Уроков сегодня' : 'Today\'s Lessons'}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{todayLessons}</p>
                </div>
                <div className="p-3 bg-success/10 rounded-xl">
                  <BookOpen className="w-5 h-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {language === 'ru' ? 'Групп всего' : 'Total Groups'}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{totalGroups}</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-xl">
                  <GraduationCap className="w-5 h-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="w-5 h-5 text-primary" />
                {language === 'ru' ? 'Распределение по группам' : 'Distribution by Groups'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={groupChartData} 
                    margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
                    onClick={(data) => {
                      if (data && data.activePayload) {
                        setSelectedGroup(data.activePayload[0].payload.name);
                        setSearchQuery('');
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{data.name}</p>
                              <p className="text-sm text-muted-foreground">{data.level}</p>
                              <p className="text-sm">Студентов: <span className="font-medium">{data.students}</span></p>
                              <p className="text-sm">Учитель: <span className="font-medium">{data.teacher}</span></p>
                              <p className="text-xs text-primary mt-1">Нажмите для просмотра</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="students" radius={[4, 4, 0, 0]} cursor="pointer">
                      {groupChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ===== ATTENDANCE ANALYTICS SECTION ===== */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            {language === 'ru' ? 'Аналитика посещаемости' : 'Attendance Analytics'}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={attendanceGroupFilter} onValueChange={(v) => { setAttendanceGroupFilter(v); setAttendanceStudentFilter('all'); }}>
              <SelectTrigger className="h-7 text-xs w-[140px]"><SelectValue placeholder="Группа" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все группы</SelectItem>
                {groupsWithData.map(g => <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={attendanceStudentFilter} onValueChange={setAttendanceStudentFilter}>
              <SelectTrigger className="h-7 text-xs w-[150px]"><SelectValue placeholder="Ученик" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все ученики</SelectItem>
                {attendanceFilteredStudents.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Tabs value={attendancePeriod} onValueChange={(v) => setAttendancePeriod(v as 'week' | 'month' | 'quarter')} className="w-auto">
              <TabsList className="h-7">
                <TabsTrigger value="week" className="text-[11px] px-2 h-6">Нед</TabsTrigger>
                <TabsTrigger value="month" className="text-[11px] px-2 h-6">Мес</TabsTrigger>
                <TabsTrigger value="quarter" className="text-[11px] px-2 h-6">Четв</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Attendance KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Card className="p-3 text-center bg-gradient-to-br from-success/5 to-success/10 border-success/20">
            <p className="text-xl font-bold text-success">{Math.round(attendanceDistribution[0].value)}%</p>
            <p className="text-[10px] text-muted-foreground">Средняя явка</p>
          </Card>
          <Card className="p-3 text-center bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
            <p className="text-xl font-bold text-destructive">{Math.round(attendanceDistribution[1].value)}%</p>
            <p className="text-[10px] text-muted-foreground">Отсутствуют</p>
          </Card>
          <Card className="p-3 text-center bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
            <p className="text-xl font-bold text-warning">{Math.round(attendanceDistribution[2].value)}%</p>
            <p className="text-[10px] text-muted-foreground">Опоздания</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-bold text-foreground">{attendanceStudentFilter !== 'all' ? 1 : attendanceFilteredStudents.length}</p>
            <p className="text-[10px] text-muted-foreground">Учеников</p>
          </Card>
        </div>

        {/* Attendance Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Trend Chart */}
          <Card className="lg:col-span-2 p-3">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              {language === 'ru' ? 'Динамика посещаемости' : 'Attendance Trend'}
            </h3>
            <div className="h-[185px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendData}>
                  <defs>
                    <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradAbsent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value: number, name: string) => [
                      `${value}%`,
                      name === 'present' ? 'Присутствуют' : name === 'absent' ? 'Отсутствуют' : 'Опоздали'
                    ]}
                  />
                  <Area type="monotone" dataKey="present" stroke="hsl(142, 76%, 36%)" fill="url(#gradPresent)" strokeWidth={2} />
                  <Area type="monotone" dataKey="absent" stroke="hsl(0, 84%, 60%)" fill="url(#gradAbsent)" strokeWidth={2} />
                  <Line type="monotone" dataKey="late" stroke="hsl(45, 93%, 47%)" strokeWidth={2} dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Distribution Pie */}
          <Card className="p-3">
            <h3 className="text-xs font-semibold mb-2">Распределение</h3>
            <div className="h-[165px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={attendanceDistribution} innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {attendanceDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    formatter={(value) => <span className="text-xs">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Attendance by group + top/bottom students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Attendance by Group Bar */}
          <Card className="p-3">
            <h3 className="text-xs font-semibold mb-2">Посещаемость по группам</h3>
            <div className="h-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceByGroup} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[70, 100]} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '12px' }}
                    formatter={(v: number) => [`${v}%`, 'Посещаемость']}
                    labelFormatter={(_, p) => p[0]?.payload?.fullName || ''}
                  />
                  <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                    {attendanceByGroup.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top/Bottom Students Tables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="p-3">
              <h3 className="text-xs font-semibold mb-1.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-success" />
                Лучшая явка
              </h3>
              <div className="space-y-1.5">
                {topStudents.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between text-xs p-1.5 rounded bg-muted/30">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-success w-4">{i + 1}</span>
                      <span className="truncate max-w-[100px]">{s.full_name}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] h-5 text-success border-success/30">{s.attendance}%</Badge>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-3">
              <h3 className="text-xs font-semibold mb-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-destructive" />
                Требуют внимания
              </h3>
              <div className="space-y-1.5">
                {bottomStudents.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between text-xs p-1.5 rounded bg-muted/30">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-destructive w-4">{i + 1}</span>
                      <span className="truncate max-w-[100px]">{s.full_name}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] h-5 text-destructive border-destructive/30">{s.attendance}%</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ===== GRADES ANALYTICS SECTION ===== */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-chart-2" />
            Аналитика оценок
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={gradesGroupFilter} onValueChange={(v) => { setGradesGroupFilter(v); setGradesStudentFilter('all'); }}>
              <SelectTrigger className="h-7 text-xs w-[140px]"><SelectValue placeholder="Группа" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все группы</SelectItem>
                {groupsWithData.map(g => <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={gradesStudentFilter} onValueChange={setGradesStudentFilter}>
              <SelectTrigger className="h-7 text-xs w-[150px]"><SelectValue placeholder="Ученик" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все ученики</SelectItem>
                {gradesFilteredStudents.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Tabs value={gradeSubjectFilter} onValueChange={setGradeSubjectFilter} className="w-auto">
              <TabsList className="h-7">
                <TabsTrigger value="all" className="text-[11px] px-2 h-6">Все</TabsTrigger>
                <TabsTrigger value="math" className="text-[11px] px-2 h-6">Мат</TabsTrigger>
                <TabsTrigger value="lang" className="text-[11px] px-2 h-6">Яз</TabsTrigger>
                <TabsTrigger value="science" className="text-[11px] px-2 h-6">Науки</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Grades KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {gradeDistribution.map((g, i) => (
            <Card key={i} className="p-2 text-center">
              <p className="text-lg font-bold" style={{ color: g.fill }}>{g.value}%</p>
              <p className="text-[10px] text-muted-foreground">{g.name}</p>
            </Card>
          ))}
        </div>

        {/* Grades Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Subject Averages Bar */}
          <Card className="p-3 lg:col-span-2">
            <h3 className="text-xs font-semibold mb-2">Средний балл по предметам</h3>
            <div className="h-[185px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="subject" tick={{ fontSize: 9 }} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '11px' }}
                    labelFormatter={(_, p) => p[0]?.payload?.fullSubject || ''}
                    formatter={(v: number) => [v.toFixed(1), 'Средний балл']}
                  />
                  <Bar dataKey="avg" name="Средний" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Radar Chart */}
          <Card className="p-3">
            <h3 className="text-xs font-semibold mb-2">Профиль успеваемости</h3>
            <div className="h-[185px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }} />
                  <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 8 }} />
                  <Radar name="Балл" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip formatter={(v: number) => [v.toFixed(1), 'Балл']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Grade Trend + Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Quarterly Trend */}
          <Card className="p-3">
            <h3 className="text-xs font-semibold mb-2">Динамика по четвертям</h3>
            <div className="h-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gradeTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 9 }} />
                  <YAxis domain={[3, 5]} tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '10px' }} />
                  <Legend iconSize={7} wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" dataKey="avg" name="Общий" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="math" name="Мат." stroke="hsl(221, 83%, 53%)" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="russian" name="Рус." stroke="hsl(25, 95%, 53%)" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="english" name="Англ." stroke="hsl(142, 76%, 36%)" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Grade Distribution Pie */}
          <Card className="p-3">
            <h3 className="text-xs font-semibold mb-2">Распределение оценок</h3>
            <div className="h-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={gradeDistribution} innerRadius={38} outerRadius={60} paddingAngle={2} dataKey="value">
                    {gradeDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Legend verticalAlign="bottom" iconSize={7} formatter={(value) => <span className="text-[10px]">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Row: Today's Schedule & Recent Violations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Today's Schedule with Homework */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5 text-primary" />
              {language === 'ru' ? 'Расписание на сегодня' : "Today's Schedule"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todaySchedule.map((lesson, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="text-xs font-mono text-muted-foreground w-10">
                    {lesson.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{lesson.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">{lesson.group} • Каб. {lesson.room}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {savedHomeworks[index] && (
                      <Badge variant="secondary" className="text-xs h-5">
                        <FileText className="w-3 h-3 mr-1" />
                        ДЗ
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => handleOpenHomework(index)}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Violations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="w-5 h-5 text-warning" />
              {language === 'ru' ? 'Недавние жалобы' : 'Recent Violations'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentViolations.map((violation) => (
                <div 
                  key={violation.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{violation.student}</p>
                    <p className="text-xs text-muted-foreground">{violation.type} • {violation.group}</p>
                  </div>
                  <Badge 
                    variant={violation.status === 'new' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {violation.status === 'new' ? 'Новое' : 'В работе'}
                  </Badge>
                </div>
              ))}
              {recentViolations.length === 0 && (
                <p className="text-center text-muted-foreground py-4 text-sm">
                  {language === 'ru' ? 'Нет новых жалоб' : 'No recent violations'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Groups Table - moved to bottom */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{language === 'ru' ? 'Все группы' : 'All Groups'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Группа</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Уровень</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Учитель</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground">Студенты</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground">Посещ.</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {groupsWithData.map((group) => (
                  <tr key={group.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
                        <span className="font-medium text-sm">{group.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <Badge variant="outline" className="text-xs">{group.level}</Badge>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground text-sm">{group.teacher.name}</td>
                    <td className="py-2 px-3 text-center font-medium">{group.students.length}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <Progress value={group.attendance} className="w-14 h-1.5" />
                        <span className="text-xs text-muted-foreground">{group.attendance}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setSelectedGroup(group.name); setSearchQuery(''); }}>
                        <Eye className="w-3 h-3 mr-1" />
                        Список
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Group Detail Modal */}
      <Dialog open={!!selectedGroup} onOpenChange={(open) => !open && setSelectedGroup(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {selectedGroupData?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedGroupData && (
            <div className="space-y-4">
              {/* Teacher Info */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{selectedGroupData.teacher.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedGroupData.teacher.subject}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => window.open(`mailto:${selectedGroupData.teacher.email}`)}>
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => window.open(`tel:${selectedGroupData.teacher.phone}`)}>
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по ФИО..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{selectedGroupData.students.length}</div>
                  <div className="text-xs text-muted-foreground">Всего</div>
                </div>
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">{selectedGroupData.activeCount}</div>
                  <div className="text-xs text-muted-foreground">Активных</div>
                </div>
                <div className="text-center p-3 bg-warning/10 rounded-lg">
                  <div className="text-2xl font-bold text-warning">{selectedGroupData.attendance}%</div>
                  <div className="text-xs text-muted-foreground">Посещаемость</div>
                </div>
              </div>

              {/* Student List */}
              <ScrollArea className="h-[300px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium">ФИО</th>
                      <th className="text-center py-2 px-3 font-medium">Уровень</th>
                      <th className="text-center py-2 px-3 font-medium">Посещаемость</th>
                      <th className="text-center py-2 px-3 font-medium">Оценка</th>
                      <th className="text-center py-2 px-3 font-medium">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGroupStudents.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/student/${student.id}`)}>
                        <td className="py-2 px-3 font-medium text-primary hover:underline">{student.full_name}</td>
                        <td className="py-2 px-3 text-center text-muted-foreground text-xs">
                          {student.academic_level}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={student.attendance >= 90 ? 'text-success' : student.attendance >= 80 ? 'text-warning' : 'text-destructive'}>
                            {student.attendance}%
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center font-medium">{student.grade}</td>
                        <td className="py-2 px-3 text-center">
                          <Badge 
                            variant={student.status === 'active' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {student.status === 'active' ? 'Активен' : 'Долг'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Homework Modal */}
      <Dialog open={homeworkModal.open} onOpenChange={(open) => !open && setHomeworkModal({ open: false, lessonIndex: null })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {language === 'ru' ? 'Домашнее задание' : 'Homework'}
            </DialogTitle>
          </DialogHeader>
          
          {homeworkModal.lessonIndex !== null && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium">{todaySchedule[homeworkModal.lessonIndex]?.subject}</p>
                <p className="text-sm text-muted-foreground">
                  {todaySchedule[homeworkModal.lessonIndex]?.group} • {todaySchedule[homeworkModal.lessonIndex]?.time}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'ru' ? 'Описание задания' : 'Assignment description'}
                </label>
                <Textarea
                  placeholder={language === 'ru' ? 'Введите описание домашнего задания...' : 'Enter homework description...'}
                  value={homeworkText}
                  onChange={(e) => setHomeworkText(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    {language === 'ru' ? 'Файлы' : 'Files'}
                  </label>
                  <Button variant="outline" size="sm" onClick={handleAddFile}>
                    <Upload className="w-4 h-4 mr-2" />
                    {language === 'ru' ? 'Добавить' : 'Add'}
                  </Button>
                </div>
                
                {homeworkFiles.length > 0 && (
                  <div className="space-y-2">
                    {homeworkFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveFile(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setHomeworkModal({ open: false, lessonIndex: null })}>
              {language === 'ru' ? 'Отмена' : 'Cancel'}
            </Button>
            <Button onClick={handleSaveHomework} disabled={!homeworkText.trim()}>
              {language === 'ru' ? 'Сохранить' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CEODashboard;
