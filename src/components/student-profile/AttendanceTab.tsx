import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, Calendar, BookOpen, MapPin, User, ExternalLink, MessageSquare } from 'lucide-react';
import { format, addWeeks, subWeeks, addDays } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface AttendanceTabProps {
  studentId?: string;
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

interface LessonAttendance {
  id: string;
  time: string;
  subject: string;
  status: AttendanceStatus;
  notes: string | null;
  date: string;
  dayName: string;
  teacher: string;
  classroom: string;
  topic: string;
  reason?: string;
}

const statusConfig: Record<AttendanceStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  present: { label: 'Present', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800', icon: <CheckCircle className="w-4 h-4" /> },
  absent: { label: 'Absent', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800', icon: <XCircle className="w-4 h-4" /> },
  late: { label: 'Late', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800', icon: <Clock className="w-4 h-4" /> },
  excused: { label: 'Excused', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800', icon: <Calendar className="w-4 h-4" /> },
};

const CHART_COLORS = {
  present: 'hsl(142, 76%, 36%)',
  absent: 'hsl(0, 84%, 60%)',
  late: 'hsl(45, 93%, 47%)',
  excused: 'hsl(221, 83%, 53%)',
};

const dayNamesShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const dayNamesFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const SUBJECTS = ['Mathematics', 'English', 'Physics', 'Chemistry', 'History', 'Biology', 'Geography', 'Literature'];
const TEACHERS: Record<string, string> = {
  'Mathematics': 'Akhmedov R.',
  'English': 'Nazarova D.',
  'Physics': 'Khamidov B.',
  'Chemistry': 'Yuldashev A.',
  'History': 'Toshmatov U.',
  'Biology': 'Rahimova G.',
  'Geography': 'Karimov S.',
  'Literature': 'Karimova N.',
};
const TOPICS: Record<string, string[]> = {
  'Mathematics': ['Quadratic equations', 'Linear systems', 'Functions & graphs', 'Pythagorean theorem'],
  'English': ['Present Perfect', 'Conditionals', 'Passive Voice', 'Essay Writing'],
  'Physics': ["Ohm's law", 'Mechanical energy', 'Optics', 'Kinematics'],
  'Chemistry': ['Acids & bases', 'Organic chemistry', 'Reactions', 'Solutions'],
  'History': ['Great Reforms', 'World War I', 'Middle Ages', 'Renaissance'],
  'Biology': ['Cell structure', 'Genetics', 'Evolution', 'Photosynthesis'],
  'Geography': ['Climate zones', 'Population', 'Resources', 'Map skills'],
  'Literature': ['War and Peace', 'Eugene Onegin', 'Crime and Punishment', 'Poetry'],
};
const ABSENT_REASONS = ['Illness (with note)', 'Illness (no note)', 'Family reasons', 'Doctor appointment', 'Olympiad participation', 'Unexcused'];
const LATE_REASONS = ['Traffic', 'Overslept', 'Delayed from previous class', 'Morning doctor visit', 'Transport issues'];
const ROOMS = ['101', '102', '103', '201', '202', '301'];
const TIMES = [
  { start: '08:30', end: '09:15' },
  { start: '09:30', end: '10:15' },
  { start: '10:30', end: '11:15' },
  { start: '11:30', end: '12:15' },
  { start: '13:00', end: '13:45' },
  { start: '14:00', end: '14:45' },
];

const seeded = (seed: number) => {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateMockAttendance = (): LessonAttendance[] => {
  const lessons: LessonAttendance[] = [];
  let seed = 77;
  const baseDate = new Date(2025, 0, 6);

  for (let week = 0; week < 8; week++) {
    for (let day = 0; day < 5; day++) {
      const date = addDays(baseDate, week * 7 + day);
      const dateStr = format(date, 'yyyy-MM-dd');
      const numLessons = 3 + Math.floor(seeded(seed++) * 3);

      for (let l = 0; l < numLessons; l++) {
        const subjectIdx = Math.floor(seeded(seed++) * SUBJECTS.length);
        const subject = SUBJECTS[subjectIdx];
        const timeSlot = TIMES[Math.min(l, TIMES.length - 1)];
        const r = seeded(seed++);
        let status: AttendanceStatus;
        if (r < 0.7) status = 'present';
        else if (r < 0.82) status = 'absent';
        else if (r < 0.92) status = 'late';
        else status = 'excused';

        const topics = TOPICS[subject] || ['Topic'];
        const topic = topics[Math.floor(seeded(seed++) * topics.length)];
        const room = ROOMS[Math.floor(seeded(seed++) * ROOMS.length)];

        let reason: string | undefined;
        let notes: string | null = null;
        if (status === 'absent') {
          reason = ABSENT_REASONS[Math.floor(seeded(seed++) * ABSENT_REASONS.length)];
          notes = reason;
        } else if (status === 'late') {
          reason = LATE_REASONS[Math.floor(seeded(seed++) * LATE_REASONS.length)];
          notes = `Late by ${5 + Math.floor(seeded(seed++) * 20)} min. ${reason}`;
        }

        lessons.push({
          id: `att-${week}-${day}-${l}`,
          time: `${timeSlot.start}–${timeSlot.end}`,
          subject,
          status,
          notes,
          date: dateStr,
          dayName: dayNamesFull[day],
          teacher: TEACHERS[subject] || 'Teacher',
          classroom: room,
          topic,
          reason,
        });
      }
    }
  }
  return lessons;
};

export const AttendanceTab: React.FC<AttendanceTabProps> = ({ studentId }) => {
  const navigate = useNavigate();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => new Date(2025, 0, 6));
  const [allLessonsData] = useState<LessonAttendance[]>(generateMockAttendance);
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | null>(null);

  const weekEnd = addDays(currentWeekStart, 4);

  const weeklyLessons = useMemo(() => {
    return allLessonsData.filter(l => {
      const d = new Date(l.date);
      return d >= currentWeekStart && d <= weekEnd;
    });
  }, [allLessonsData, currentWeekStart, weekEnd]);

  const weeklyData = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const dayDate = addDays(currentWeekStart, i);
      const dayStr = format(dayDate, 'yyyy-MM-dd');
      return {
        date: dayDate,
        lessons: weeklyLessons.filter(l => l.date === dayStr).sort((a, b) => a.time.localeCompare(b.time)),
      };
    });
  }, [weeklyLessons, currentWeekStart]);

  const totalStats = useMemo(() => {
    const present = allLessonsData.filter(l => l.status === 'present').length;
    const absent = allLessonsData.filter(l => l.status === 'absent').length;
    const late = allLessonsData.filter(l => l.status === 'late').length;
    const excused = allLessonsData.filter(l => l.status === 'excused').length;
    const total = allLessonsData.length;
    return { present, absent, late, excused, total, rate: total > 0 ? Math.round((present / total) * 100) : 0 };
  }, [allLessonsData]);

  const filteredByStatus = useMemo(() => {
    if (!statusFilter) return [];
    return allLessonsData
      .filter(l => l.status === statusFilter)
      .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  }, [allLessonsData, statusFilter]);

  const chartData = [
    { name: 'Present', value: totalStats.present, color: CHART_COLORS.present },
    { name: 'Absent', value: totalStats.absent, color: CHART_COLORS.absent },
    { name: 'Late', value: totalStats.late, color: CHART_COLORS.late },
    { name: 'Excused', value: totalStats.excused, color: CHART_COLORS.excused },
  ].filter(item => item.value > 0);

  const handlePrevWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));

  return (
    <div className="space-y-4">
      {/* Week selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Attendance</h3>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePrevWeek}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs font-medium min-w-[160px] text-center">
            {format(currentWeekStart, 'dd.MM.yyyy')} – {format(weekEnd, 'dd.MM.yyyy')}
          </span>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextWeek}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-5 gap-2">
        {([
          { key: null, label: 'Total', value: totalStats.total, icon: <BookOpen className="w-4 h-4 text-primary" />, colorClass: 'text-primary' },
          { key: 'present' as AttendanceStatus, label: 'Present', value: totalStats.present, icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, colorClass: 'text-emerald-600 dark:text-emerald-400' },
          { key: 'absent' as AttendanceStatus, label: 'Absent', value: totalStats.absent, icon: <XCircle className="w-4 h-4 text-red-500" />, colorClass: 'text-red-600 dark:text-red-400' },
          { key: 'late' as AttendanceStatus, label: 'Late', value: totalStats.late, icon: <Clock className="w-4 h-4 text-amber-500" />, colorClass: 'text-amber-600 dark:text-amber-400' },
          { key: null, label: 'Rate', value: `${totalStats.rate}%`, icon: null, colorClass: 'text-primary' },
        ] as const).map((item, idx) => (
          <Card
            key={idx}
            className={`p-2.5 text-center cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${item.key && statusFilter === item.key ? 'ring-2 ring-primary' : ''}`}
            onClick={() => {
              if (item.key) setStatusFilter(item.key === statusFilter ? null : item.key);
            }}
          >
            <div className="flex items-center justify-center gap-1 mb-0.5">
              {item.icon}
              <p className={`text-lg font-bold ${item.colorClass}`}>{item.value}</p>
            </div>
            <p className="text-[10px] text-muted-foreground">{item.label}</p>
          </Card>
        ))}
      </div>

      {/* Weekly grid + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-3">
          <h4 className="text-xs font-semibold mb-2">Week: {format(currentWeekStart, 'dd.MM')} – {format(weekEnd, 'dd.MM')}</h4>
          <div className="grid grid-cols-5 gap-2">
            {weeklyData.map((day, index) => (
              <div key={index} className="space-y-1.5">
                <div className="text-center p-1.5 bg-muted rounded-md">
                  <p className="font-semibold text-xs">{dayNamesShort[index]}</p>
                  <p className="text-[10px] text-muted-foreground">{format(day.date, 'dd.MM')}</p>
                </div>
                <div className="space-y-1 min-h-[80px]">
                  {day.lessons.length > 0 ? day.lessons.map(lesson => {
                    const config = statusConfig[lesson.status];
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setStatusFilter(lesson.status)}
                        className={`w-full p-1.5 rounded-md border text-left transition-all hover:shadow-sm hover:scale-[1.02] ${config.bgColor}`}
                      >
                        <p className="text-[9px] text-muted-foreground">{lesson.time.split('–')[0]}</p>
                        <p className="text-[10px] font-medium truncate">{lesson.subject}</p>
                        <div className={`flex items-center gap-0.5 text-[9px] mt-0.5 ${config.color}`}>
                          {config.icon}
                        </div>
                      </button>
                    );
                  }) : (
                    <p className="text-[9px] text-muted-foreground text-center pt-4">—</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-3">
          <h4 className="text-xs font-semibold mb-2">Distribution (all weeks)</h4>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={2} dataKey="value">
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value} lessons`, name]}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-8">No data</p>
          )}
          <div className="space-y-1.5 mt-2">
            {[
              { label: 'Present', count: totalStats.present, color: 'bg-emerald-500', key: 'present' as AttendanceStatus },
              { label: 'Absent', count: totalStats.absent, color: 'bg-red-500', key: 'absent' as AttendanceStatus },
              { label: 'Late', count: totalStats.late, color: 'bg-amber-500', key: 'late' as AttendanceStatus },
              { label: 'Excused', count: totalStats.excused, color: 'bg-blue-500', key: 'excused' as AttendanceStatus },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => setStatusFilter(item.key === statusFilter ? null : item.key)}
                className={`flex items-center justify-between text-xs w-full px-2 py-1 rounded-md transition-colors hover:bg-muted ${statusFilter === item.key ? 'bg-muted' : ''}`}
              >
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span>{item.label}</span>
                </div>
                <span className="font-medium">{item.count}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Status detail modal */}
      <Dialog open={!!statusFilter} onOpenChange={(open) => !open && setStatusFilter(null)}>
        <DialogContent className="max-w-lg max-h-[80vh]">
          {statusFilter && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">
                  <span className={statusConfig[statusFilter].color}>{statusConfig[statusFilter].icon}</span>
                  {statusConfig[statusFilter].label} — {filteredByStatus.length} records
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="max-h-[55vh] pr-2">
                <div className="space-y-2">
                  {filteredByStatus.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`p-3 rounded-lg border ${statusConfig[lesson.status].bgColor}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold">{lesson.subject}</span>
                            <Badge variant="outline" className="text-[9px] h-4">{lesson.dayName}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />{lesson.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />{lesson.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />Room {lesson.classroom}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />{lesson.teacher}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            <BookOpen className="w-3 h-3 inline mr-1" />
                            {lesson.topic}
                          </p>
                        </div>
                      </div>

                      {lesson.notes && (
                        <div className="mt-2 p-2 rounded-md bg-background/60 border border-border/50">
                          <div className="flex items-center gap-1 mb-0.5">
                            <MessageSquare className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] font-medium">
                              {statusFilter === 'absent' ? 'Reason for absence' : 'Note'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{lesson.notes}</p>
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] mt-1.5 gap-1 px-2"
                        onClick={() => {
                          setStatusFilter(null);
                          navigate('/schedule');
                        }}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open in Schedule
                      </Button>
                    </div>
                  ))}

                  {filteredByStatus.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No records</p>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
