import React, { useState, useMemo, useCallback } from 'react';
import { Calendar as CalendarIcon, Clock, Users, MapPin, BookOpen, ChevronLeft, ChevronRight, Plus, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, startOfWeek, addDays, isSameWeek, isToday, addWeeks, subWeeks } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AddLessonModal } from '@/components/modals/AddLessonModal';
import { LessonDetailModal } from '@/components/modals/LessonDetailModal';
import { HomeworkModal } from '@/components/modals/HomeworkModal';
import { toast } from 'sonner';

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];

const MOCK_STUDENTS = [
  { id: 'mock-1', full_name: 'Иванов Алексей' },
  { id: 'mock-2', full_name: 'Петрова Мария' },
  { id: 'mock-3', full_name: 'Сидоров Дмитрий' },
  { id: 'mock-4', full_name: 'Козлова Анна' },
  { id: 'mock-5', full_name: 'Новиков Андрей' },
  { id: 'mock-6', full_name: 'Морозова Елена' },
  { id: 'mock-7', full_name: 'Волков Сергей' },
  { id: 'mock-8', full_name: 'Соколова Ольга' },
  { id: 'mock-9', full_name: 'Лебедев Максим' },
  { id: 'mock-10', full_name: 'Егорова Дарья' },
  { id: 'mock-11', full_name: 'Васильев Никита' },
  { id: 'mock-12', full_name: 'Павлова София' },
];

const MOCK_LESSONS_BY_DAY = [
  [
    { subject: 'Математика', start_time: '09:00', end_time: '10:30', classroom: '301', group: 'Группа А', teacher: 'Смирнова Е.И.' },
    { subject: 'Русский язык', start_time: '10:45', end_time: '12:15', classroom: '205', group: 'Группа А', teacher: 'Кузнецова О.П.' },
    { subject: 'История', start_time: '12:30', end_time: '14:00', classroom: '108', group: 'Группа А', teacher: 'Попов А.В.' },
  ],
  [
    { subject: 'Физика', start_time: '09:00', end_time: '10:30', classroom: '402', group: 'Группа Б', teacher: 'Иванов П.Н.' },
    { subject: 'Английский язык', start_time: '10:45', end_time: '12:15', classroom: '210', group: 'Группа Б', teacher: 'Белова М.А.' },
    { subject: 'Химия', start_time: '12:30', end_time: '14:00', classroom: '305', group: 'Группа Б', teacher: 'Николаева Т.В.' },
  ],
  [
    { subject: 'Литература', start_time: '09:00', end_time: '10:30', classroom: '207', group: 'Группа А', teacher: 'Кузнецова О.П.' },
    { subject: 'Алгебра', start_time: '10:45', end_time: '12:15', classroom: '301', group: 'Группа А', teacher: 'Смирнова Е.И.' },
    { subject: 'Биология', start_time: '12:30', end_time: '14:00', classroom: '304', group: 'Группа А', teacher: 'Зайцева Л.П.' },
  ],
  [
    { subject: 'Геометрия', start_time: '09:00', end_time: '10:30', classroom: '301', group: 'Группа Б', teacher: 'Смирнова Е.И.' },
    { subject: 'Обществознание', start_time: '10:45', end_time: '12:15', classroom: '109', group: 'Группа Б', teacher: 'Волкова Н.С.' },
    { subject: 'Английский язык', start_time: '12:30', end_time: '14:00', classroom: '210', group: 'Группа Б', teacher: 'Белова М.А.' },
  ],
  [
    { subject: 'Физика', start_time: '09:00', end_time: '10:30', classroom: '402', group: 'Группа А', teacher: 'Иванов П.Н.' },
    { subject: 'Русский язык', start_time: '10:45', end_time: '12:15', classroom: '205', group: 'Группа А', teacher: 'Кузнецова О.П.' },
    { subject: 'Информатика', start_time: '12:30', end_time: '14:00', classroom: '401', group: 'Группа А', teacher: 'Медведев К.А.' },
  ],
];

interface AttendanceStudent {
  id: string;
  name: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'not_marked';
}

interface LessonWithAttendance {
  id: string;
  subject: string;
  start_time: string;
  end_time: string;
  classroom: string | null;
  teacher: { id: string; full_name: string } | null;
  group: { id: string; name: string } | null;
  attendance: AttendanceStudent[];
  day_of_week?: number;
  group_id?: string;
  teacher_id?: string;
}

interface HomeworkData {
  text: string;
  files: { name: string; url?: string }[];
  createdAt?: string;
}

export const Schedule: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [selectedLesson, setSelectedLesson] = useState<LessonWithAttendance | null>(null);
  
  const [addLessonModal, setAddLessonModal] = useState(false);
  const [editLessonData, setEditLessonData] = useState<any>(null);
  const [homeworkModal, setHomeworkModal] = useState(false);
  const [homeworkLesson, setHomeworkLesson] = useState<LessonWithAttendance | null>(null);
  
  const [savedHomeworks, setSavedHomeworks] = useState<Record<string, HomeworkData>>({});
  const [attendanceUpdates, setAttendanceUpdates] = useState<Record<string, Record<string, 'present' | 'absent' | 'late'>>>({});

  const weekDates = useMemo(() => DAYS.map((_, index) => addDays(selectedWeek, index)), [selectedWeek]);
  const isCurrentWeek = isSameWeek(selectedWeek, new Date(), { weekStartsOn: 1 });

  // Fetch groups
  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase.from('groups').select('*').order('name');
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch teachers
  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('teachers').select('id, full_name').eq('status', 'active').order('full_name');
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch lessons - removed week dependency since lessons are recurring
  const { data: lessonsData = [], isLoading } = useQuery({
    queryKey: ['schedule-lessons', selectedGroup, selectedTeacher],
    queryFn: async () => {
      let query = supabase
        .from('lessons')
        .select(`
          *,
          teacher:teachers!lessons_teacher_id_fkey(id, full_name),
          group:groups!lessons_group_id_fkey(id, name)
        `);

      if (selectedGroup !== 'all') query = query.eq('group_id', selectedGroup);
      if (selectedTeacher !== 'all') query = query.eq('teacher_id', selectedTeacher);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });

  // Organize lessons by day
  const lessonsByDay = useMemo(() => {
    const organized: Record<number, LessonWithAttendance[]> = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    
    if (lessonsData.length > 0) {
      lessonsData.forEach((lesson: any) => {
        const dayIndex = lesson.day_of_week - 1;
        if (dayIndex >= 0 && dayIndex <= 4) {
          const lessonId = lesson.id;
          const lessonAttendanceUpdates = attendanceUpdates[lessonId] || {};
          
          organized[dayIndex].push({
            id: lesson.id,
            subject: lesson.subject,
            start_time: lesson.start_time,
            end_time: lesson.end_time,
            classroom: lesson.classroom,
            teacher: lesson.teacher,
            group: lesson.group,
            attendance: MOCK_STUDENTS.map((student, idx) => ({
              id: `att-${lessonId}-${idx}`,
              name: student.full_name,
              status: lessonAttendanceUpdates[`att-${lessonId}-${idx}`] || 'not_marked',
            })),
            day_of_week: lesson.day_of_week,
            group_id: lesson.group_id,
            teacher_id: lesson.teacher_id,
          });
        }
      });
    } else {
      MOCK_LESSONS_BY_DAY.forEach((dayLessons, dayIndex) => {
        dayLessons.forEach((lesson, lessonIndex) => {
          const lessonId = `mock-lesson-${dayIndex}-${lessonIndex}`;
          const lessonAttendanceUpdates = attendanceUpdates[lessonId] || {};
          
          organized[dayIndex].push({
            id: lessonId,
            subject: lesson.subject,
            start_time: lesson.start_time,
            end_time: lesson.end_time,
            classroom: lesson.classroom,
            teacher: { id: `mock-teacher-${lessonIndex}`, full_name: lesson.teacher },
            group: { id: 'mock-group-1', name: lesson.group },
            attendance: MOCK_STUDENTS.map((student, idx) => ({
              id: `att-${lessonId}-${idx}`,
              name: student.full_name,
              status: lessonAttendanceUpdates[`att-${lessonId}-${idx}`] || 'not_marked',
            })),
          });
        });
      });
    }

    Object.keys(organized).forEach((key) => {
      organized[Number(key)].sort((a, b) => a.start_time.localeCompare(b.start_time));
    });

    return organized;
  }, [lessonsData, attendanceUpdates]);

  const handleOpenLesson = useCallback((lesson: LessonWithAttendance) => {
    setSelectedLesson(lesson);
  }, []);

  const handleOpenHomework = useCallback(() => {
    if (selectedLesson) {
      setHomeworkLesson(selectedLesson);
      setHomeworkModal(true);
    }
  }, [selectedLesson]);

  const handleSaveHomework = useCallback((lessonId: string, homework: HomeworkData) => {
    setSavedHomeworks(prev => ({ ...prev, [lessonId]: homework }));
  }, []);

  const handleUpdateAttendance = useCallback((studentId: string, status: 'present' | 'absent' | 'late') => {
    if (!selectedLesson) return;
    
    setAttendanceUpdates(prev => ({
      ...prev,
      [selectedLesson.id]: {
        ...(prev[selectedLesson.id] || {}),
        [studentId]: status,
      }
    }));

    setSelectedLesson(prev => {
      if (!prev) return null;
      return {
        ...prev,
        attendance: prev.attendance.map(a => 
          a.id === studentId ? { ...a, status } : a
        ),
      };
    });
  }, [selectedLesson]);

  const handleEditLesson = useCallback(() => {
    if (selectedLesson) {
      setEditLessonData({
        id: selectedLesson.id,
        subject: selectedLesson.subject,
        day_of_week: selectedLesson.day_of_week,
        start_time: selectedLesson.start_time,
        end_time: selectedLesson.end_time,
        classroom: selectedLesson.classroom || '',
        group_id: selectedLesson.group?.id || '',
        teacher_id: selectedLesson.teacher?.id || '',
      });
      setSelectedLesson(null);
      setAddLessonModal(true);
    }
  }, [selectedLesson]);

  const handleAddNewLesson = useCallback(() => {
    setEditLessonData(null);
    setAddLessonModal(true);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Расписание</h1>
          <p className="text-sm text-muted-foreground">
            {format(selectedWeek, 'd MMM', { locale: ru })} — {format(addDays(selectedWeek, 4), 'd MMM yyyy', { locale: ru })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSelectedWeek(subWeeks(selectedWeek, 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant={isCurrentWeek ? "default" : "outline"} 
                size="sm"
                className="gap-1.5"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                {isCurrentWeek ? 'Сегодня' : format(selectedWeek, 'd MMM', { locale: ru })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={addDays(selectedWeek, isToday(selectedWeek) ? 0 : 0)}
                onSelect={(date) => {
                  if (date) setSelectedWeek(startOfWeek(date, { weekStartsOn: 1 }));
                }}
                locale={ru}
                className="p-3 pointer-events-auto"
              />
              <div className="px-3 pb-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => setSelectedWeek(startOfWeek(new Date(), { weekStartsOn: 1 }))}
                >
                  Перейти к сегодня
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="icon" onClick={() => setSelectedWeek(addWeeks(selectedWeek, 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-2" />
          <Button onClick={handleAddNewLesson}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить урок
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Группа" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все группы</SelectItem>
            {groups.map((g: any) => (
              <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Преподаватель" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            {teachers.map((t: any) => (
              <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Schedule Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {DAYS.map((day, dayIndex) => {
            const dateForDay = weekDates[dayIndex];
            const isTodayDate = isToday(dateForDay);
            const dayLessons = lessonsByDay[dayIndex] || [];

            return (
              <div key={day} className="space-y-2">
                <div className={`text-center p-2 rounded-lg ${isTodayDate ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <div className="font-medium text-sm">{day}</div>
                  <div className={`text-xs ${isTodayDate ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {format(dateForDay, 'd MMM', { locale: ru })}
                  </div>
                </div>

                <div className="space-y-2 min-h-[200px]">
                  {dayLessons.length > 0 ? (
                    dayLessons.map((lesson) => {
                      const hasHomework = savedHomeworks[lesson.id];
                      
                      return (
                        <Card 
                          key={lesson.id} 
                          className="p-3 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all border-l-4 border-l-primary/50 hover:border-l-primary group"
                          onClick={() => handleOpenLesson(lesson)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="font-semibold truncate text-sm group-hover:text-primary transition-colors flex-1">
                              {lesson.subject}
                            </div>
                            {hasHomework && (
                              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                                <FileText className="w-3 h-3" />
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1.5 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-primary/70" />
                              <span className="font-medium">
                                {lesson.start_time?.slice(0, 5)} - {lesson.end_time?.slice(0, 5)}
                              </span>
                            </div>
                            {lesson.classroom && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-primary/70" />
                                Каб. {lesson.classroom}
                              </div>
                            )}
                            {lesson.group && (
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3 h-3 text-primary/70" />
                                {lesson.group.name}
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-xs">
                      <CalendarIcon className="w-6 h-6 mx-auto mb-1 opacity-30" />
                      Нет уроков
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full border border-dashed h-8 text-xs text-muted-foreground hover:text-primary"
                    onClick={handleAddNewLesson}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Добавить
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lesson Detail Modal */}
      <LessonDetailModal
        open={!!selectedLesson}
        onOpenChange={(open) => !open && setSelectedLesson(null)}
        lesson={selectedLesson}
        homework={selectedLesson ? savedHomeworks[selectedLesson.id] : null}
        onOpenHomework={handleOpenHomework}
        onEditLesson={handleEditLesson}
        onUpdateAttendance={handleUpdateAttendance}
      />

      {/* Homework Modal */}
      <HomeworkModal
        open={homeworkModal}
        onOpenChange={setHomeworkModal}
        lesson={homeworkLesson}
        savedHomework={homeworkLesson ? savedHomeworks[homeworkLesson.id] : null}
        onSave={handleSaveHomework}
      />

      {/* Add/Edit Lesson Modal */}
      <AddLessonModal
        open={addLessonModal}
        onOpenChange={(open) => {
          setAddLessonModal(open);
          if (!open) setEditLessonData(null);
        }}
        editLesson={editLessonData}
      />
    </div>
  );
};

export default Schedule;
