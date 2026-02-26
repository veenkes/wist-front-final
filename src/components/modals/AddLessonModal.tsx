import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  ChevronDown, BookOpen, Clock, Users, User, FileText, Award, Bell, Tag,
  Save, Send, Copy, X, Plus, Trash2, Upload, Link, Video, CalendarIcon,
  MapPin, Monitor, Projector, Laptop, FlaskConical, PenTool, HelpCircle,
  GripVertical, CheckCircle2, AlertCircle, Info
} from 'lucide-react';

interface AddLessonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editLesson?: {
    id: string;
    subject: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    classroom: string;
    group_id: string;
    teacher_id: string;
  } | null;
}

const SUBJECTS = [
  'Математика', 'Алгебра', 'Геометрия', 'Русский язык', 'Литература',
  'Английский язык', 'Физика', 'Химия', 'Биология', 'История',
  'Обществознание', 'География', 'Информатика', 'Физкультура',
  'Музыка', 'ИЗО', 'Технология', 'ОБЖ', 'Развитие речи', 'Основы счёта'
];

const LESSON_TYPES = [
  { value: 'regular', label: 'Обычный урок', icon: BookOpen },
  { value: 'exam', label: 'Экзамен', icon: Award },
  { value: 'practice', label: 'Практика', icon: PenTool },
  { value: 'laboratory', label: 'Лабораторная', icon: FlaskConical },
  { value: 'online', label: 'Онлайн', icon: Monitor },
  { value: 'extra', label: 'Дополнительный', icon: Plus },
];

const ACADEMIC_YEARS = ['2024-2025', '2025-2026', '2026-2027'];
const SEMESTERS = ['1 семестр', '2 семестр', '3 триместр', '4 триместр'];

const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];

const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'Без повторения' },
  { value: 'daily', label: 'Ежедневно' },
  { value: 'weekly', label: 'Еженедельно' },
  { value: 'custom', label: 'Настроить...' },
];

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Запланирован', color: 'bg-blue-500' },
  { value: 'completed', label: 'Завершён', color: 'bg-green-500' },
  { value: 'cancelled', label: 'Отменён', color: 'bg-red-500' },
  { value: 'postponed', label: 'Перенесён', color: 'bg-yellow-500' },
];

const EQUIPMENT_OPTIONS = [
  { value: 'projector', label: 'Проектор', icon: Projector },
  { value: 'computer', label: 'Компьютер', icon: Laptop },
  { value: 'lab', label: 'Лаб. оборудование', icon: FlaskConical },
  { value: 'whiteboard', label: 'Доска', icon: PenTool },
  { value: 'other', label: 'Другое', icon: GripVertical },
];

const ATTENDANCE_MODES = [
  { value: 'manual', label: 'Вручную' },
  { value: 'qr', label: 'QR-код' },
  { value: 'auto', label: 'Автоматически (онлайн)' },
];

const ASSESSMENT_TYPES = [
  { value: 'none', label: 'Без оценки' },
  { value: 'quiz', label: 'Тест' },
  { value: 'test', label: 'Контрольная' },
  { value: 'assignment', label: 'Задание' },
];

const GRADING_SCALES = [
  { value: '5point', label: '5-балльная' },
  { value: '10point', label: '10-балльная' },
  { value: '100point', label: '100-балльная' },
  { value: 'passfail', label: 'Зачёт/Незачёт' },
];

const PRIORITY_LEVELS = [
  { value: 'normal', label: 'Обычный', color: 'bg-muted' },
  { value: 'high', label: 'Высокий', color: 'bg-warning' },
  { value: 'critical', label: 'Критический', color: 'bg-destructive' },
];

const COLOR_LABELS = [
  { value: 'blue', label: 'Синий', class: 'bg-blue-500' },
  { value: 'green', label: 'Зелёный', class: 'bg-green-500' },
  { value: 'yellow', label: 'Жёлтый', class: 'bg-yellow-500' },
  { value: 'red', label: 'Красный', class: 'bg-red-500' },
  { value: 'purple', label: 'Фиолетовый', class: 'bg-purple-500' },
  { value: 'orange', label: 'Оранжевый', class: 'bg-orange-500' },
  { value: 'pink', label: 'Розовый', class: 'bg-pink-500' },
  { value: 'gray', label: 'Серый', class: 'bg-gray-500' },
];

const VISIBILITY_OPTIONS = [
  { value: 'visible', label: 'Видим ученикам' },
  { value: 'draft', label: 'Черновик' },
  { value: 'admin', label: 'Только для администрации' },
];

function SectionHeader({ 
  icon: Icon, title, isOpen, badge, required 
}: { 
  icon: React.ElementType; title: string; isOpen: boolean; badge?: string; required?: boolean;
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-3 py-3 px-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer w-full text-left"
    >
      <Icon className="h-4 w-4 text-primary" />
      <span className="font-medium text-sm flex-1">{title}</span>
      {required && <Badge variant="outline" className="text-xs">Обязательно</Badge>}
      {badge && <Badge className="text-xs bg-primary/10 text-primary">{badge}</Badge>}
      <ChevronDown className={cn(
        "h-4 w-4 text-muted-foreground transition-transform duration-200",
        isOpen && "rotate-180"
      )} />
    </button>
  );
}

function FieldTooltip({ text }: { text: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="ml-1 text-muted-foreground hover:text-foreground">
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="text-xs max-w-xs" side="top">
        {text}
      </PopoverContent>
    </Popover>
  );
}

export function AddLessonModal({ open, onOpenChange, editLesson }: AddLessonModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  
  const [openSections, setOpenSections] = useState({
    basic: false,
    schedule: false,
    teacher: false,
    students: false,
    content: false,
    assessment: false,
    notifications: false,
    tags: false,
  });

  const [formData, setFormData] = useState({
    title: '', subject: '', lessonType: 'regular',
    classes: [] as string[], academicYear: '2024-2025', semester: '1 семестр',
    date: new Date(), startTime: '09:00', endTime: '09:45', duration: 45,
    timezone: 'Europe/Moscow', recurrence: 'none', status: 'scheduled',
    teacherId: '', assistantTeacherId: '', classroom: '', onlineLink: '',
    equipment: [] as string[],
    groupId: '', individualStudents: [] as string[],
    attendanceEnabled: true, attendanceMode: 'manual',
    description: '', objectives: [''], homeworkText: '',
    homeworkFiles: [] as string[],
    materials: [] as { type: string; url: string; name: string }[],
    estimatedHomeworkTime: 30,
    assessmentType: 'none', maxScore: 100, passingScore: 60,
    gradingScale: '5point', autoGrade: false,
    notifyStudents: true, notifyParents: false, notifyTeacher: true,
    notificationTime: 'immediately', visibility: 'visible',
    tags: [] as string[], priority: 'normal', colorLabel: 'blue', internalNotes: '',
  });

  const [newTag, setNewTag] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase.from('groups').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('teachers').select('id, full_name, email, photo_url').eq('status', 'active').order('full_name');
      if (error) throw error;
      return data;
    },
  });

  const { data: students = [] } = useQuery({
    queryKey: ['students-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('students').select('id, full_name').eq('status', 'active').order('full_name');
      if (error) throw error;
      return data;
    },
  });

  const filteredSubjects = useMemo(() => {
    if (!subjectSearch) return SUBJECTS;
    return SUBJECTS.filter(s => s.toLowerCase().includes(subjectSearch.toLowerCase()));
  }, [subjectSearch]);

  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const [startH, startM] = formData.startTime.split(':').map(Number);
      const [endH, endM] = formData.endTime.split(':').map(Number);
      const duration = (endH * 60 + endM) - (startH * 60 + startM);
      if (duration > 0) {
        setFormData(prev => ({ ...prev, duration }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  useEffect(() => {
    if (editLesson) {
      setFormData(prev => ({
        ...prev,
        subject: editLesson.subject,
        startTime: editLesson.start_time.slice(0, 5),
        endTime: editLesson.end_time.slice(0, 5),
        classroom: editLesson.classroom || '',
        groupId: editLesson.group_id || '',
        teacherId: editLesson.teacher_id || '',
      }));
    }
  }, [editLesson, open]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        objectives: [...prev.objectives.filter(o => o), newObjective.trim()] 
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const toggleEquipment = (value: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(value)
        ? prev.equipment.filter(e => e !== value)
        : [...prev.equipment, value]
    }));
  };

  const toggleClass = (value: string) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(value)
        ? prev.classes.filter(c => c !== value)
        : [...prev.classes, value]
    }));
  };

  const toggleStudent = (studentId: string) => {
    setFormData(prev => ({
      ...prev,
      individualStudents: prev.individualStudents.includes(studentId)
        ? prev.individualStudents.filter(s => s !== studentId)
        : [...prev.individualStudents, studentId]
    }));
  };

  const handleSubmit = async (asDraft = false) => {
    if (!formData.subject) {
      toast.error('Выберите предмет');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      toast.error('Укажите время урока');
      return;
    }

    setIsSubmitting(true);
    setIsDraft(asDraft);

    try {
      const lessonData = {
        subject: formData.subject,
        day_of_week: formData.date.getDay() || 7,
        start_time: formData.startTime,
        end_time: formData.endTime,
        classroom: formData.classroom || null,
        group_id: formData.groupId || null,
        teacher_id: formData.teacherId || null,
      };

      if (editLesson) {
        const { error } = await supabase.from('lessons').update(lessonData).eq('id', editLesson.id);
        if (error) throw error;
        toast.success('Урок обновлён');
      } else {
        const { error } = await supabase.from('lessons').insert([lessonData]);
        if (error) throw error;
        toast.success(asDraft ? 'Сохранено как черновик' : 'Урок добавлен в расписание');
      }

      queryClient.invalidateQueries({ queryKey: ['schedule-lessons'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast.error('Ошибка при сохранении урока');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editLesson) return;
    if (!confirm('Вы уверены, что хотите удалить этот урок?')) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('lessons').delete().eq('id', editLesson.id);
      if (error) throw error;
      toast.success('Урок удалён');
      queryClient.invalidateQueries({ queryKey: ['schedule-lessons'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Ошибка при удалении урока');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDuplicate = () => {
    toast.success('Урок скопирован. Внесите изменения и сохраните.');
  };

  const selectedTeacher = teachers.find((t: any) => t.id === formData.teacherId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">
                {editLesson ? 'Редактировать урок' : 'Добавить урок'}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Заполните информацию для создания урока
              </p>
            </div>
            <div className="flex items-center gap-2">
              {formData.status && (
                <Badge variant="outline" className="text-xs">
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full mr-1.5",
                    STATUS_OPTIONS.find(s => s.value === formData.status)?.color
                  )} />
                  {STATUS_OPTIONS.find(s => s.value === formData.status)?.label}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[calc(90vh-180px)]">
          <div className="p-4 space-y-3">
            
            {/* SECTION 1: Basic */}
            <Collapsible open={openSections.basic} onOpenChange={() => toggleSection('basic')}>
              <CollapsibleTrigger className="w-full">
                <SectionHeader icon={BookOpen} title="Основная информация" isOpen={openSections.basic} required />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-3 space-y-4 border-x border-b rounded-b-lg bg-background">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label className="text-xs font-medium flex items-center">
                        Название урока
                        <FieldTooltip text="Опциональное название для урока" />
                      </Label>
                      <Input
                        placeholder="Например: Введение в алгебру"
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Предмет *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full h-9 justify-start text-left font-normal">
                            {formData.subject || 'Выберите предмет'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-2" align="start">
                          <Input
                            placeholder="Поиск предмета..."
                            value={subjectSearch}
                            onChange={(e) => setSubjectSearch(e.target.value)}
                            className="h-8 text-sm mb-2"
                          />
                          <div className="space-y-0.5 max-h-48 overflow-y-auto">
                            {filteredSubjects.map((subject) => (
                              <button
                                key={subject}
                                type="button"
                                className={cn(
                                  "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors",
                                  formData.subject === subject && "bg-primary/10 text-primary font-medium"
                                )}
                                onClick={() => {
                                  updateFormData('subject', subject);
                                  setSubjectSearch('');
                                }}
                              >
                                {subject}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Тип урока</Label>
                      <Select value={formData.lessonType} onValueChange={(v) => updateFormData('lessonType', v)}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LESSON_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <type.icon className="h-3.5 w-3.5" />
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Классы / Группы</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full h-9 justify-start text-left font-normal">
                            {formData.classes.length > 0 
                              ? `${formData.classes.length} выбрано`
                              : 'Выберите классы'
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-2" align="start">
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {groups.map((group: any) => (
                              <div key={group.id} className="flex items-center space-x-2 p-1.5 hover:bg-muted rounded">
                                <Checkbox
                                  checked={formData.classes.includes(group.id)}
                                  onCheckedChange={() => toggleClass(group.id)}
                                />
                                <span className="text-sm">{group.name}</span>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Учебный год</Label>
                      <Select value={formData.academicYear} onValueChange={(v) => updateFormData('academicYear', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ACADEMIC_YEARS.map((year) => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Семестр</Label>
                      <Select value={formData.semester} onValueChange={(v) => updateFormData('semester', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SEMESTERS.map((sem) => (
                            <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* SECTION 2: Schedule */}
            <Collapsible open={openSections.schedule} onOpenChange={() => toggleSection('schedule')}>
              <CollapsibleTrigger className="w-full">
                <SectionHeader icon={Clock} title="Расписание и время" isOpen={openSections.schedule} required />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-3 space-y-4 border-x border-b rounded-b-lg bg-background">
                  <div className="flex gap-4">
                    {/* Left side: time fields */}
                    <div className="flex-1 grid grid-cols-2 gap-4">

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Начало *</Label>
                      <Select value={formData.startTime} onValueChange={(v) => updateFormData('startTime', v)}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="--:--" /></SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Окончание *</Label>
                      <Select value={formData.endTime} onValueChange={(v) => updateFormData('endTime', v)}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="--:--" /></SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Длительность (мин)</Label>
                      <Input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => updateFormData('duration', parseInt(e.target.value) || 0)}
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Повторение</Label>
                      <Select value={formData.recurrence} onValueChange={(v) => updateFormData('recurrence', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {RECURRENCE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Статус</Label>
                      <Select value={formData.status} onValueChange={(v) => updateFormData('status', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <div className="flex items-center gap-2">
                                <span className={cn("w-2 h-2 rounded-full", opt.color)} />
                                {opt.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    </div>

                    {/* Right side: inline calendar */}
                    <div className="flex-shrink-0">
                      <Label className="text-xs font-medium mb-2 block">Дата</Label>
                      <div className="border rounded-lg overflow-hidden">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => date && updateFormData('date', date)}
                          locale={ru}
                          className="p-2 pointer-events-auto"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 text-center">
                        {format(formData.date, 'EEEE, d MMMM yyyy', { locale: ru })}
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* SECTION 3: Teacher */}
            <Collapsible open={openSections.teacher} onOpenChange={() => toggleSection('teacher')}>
              <CollapsibleTrigger className="w-full">
                <SectionHeader 
                  icon={User} title="Преподаватель и кабинет" isOpen={openSections.teacher}
                  badge={selectedTeacher?.full_name?.split(' ')[0]}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-3 space-y-4 border-x border-b rounded-b-lg bg-background">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Преподаватель</Label>
                      <Select value={formData.teacherId} onValueChange={(v) => updateFormData('teacherId', v)}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Выберите преподавателя" /></SelectTrigger>
                        <SelectContent>
                          {teachers.map((teacher: any) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
                                  {teacher.full_name?.charAt(0)}
                                </div>
                                {teacher.full_name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Ассистент (опционально)</Label>
                      <Select value={formData.assistantTeacherId} onValueChange={(v) => updateFormData('assistantTeacherId', v)}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Не выбрано" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Не выбрано</SelectItem>
                          {teachers.map((teacher: any) => (
                            <SelectItem key={teacher.id} value={teacher.id}>{teacher.full_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        Кабинет
                      </Label>
                      <Input
                        value={formData.classroom}
                        onChange={(e) => updateFormData('classroom', e.target.value)}
                        placeholder="Например: 301 (30 мест)"
                        className="h-9"
                      />
                    </div>

                    {formData.lessonType === 'online' && (
                      <div className="space-y-2">
                        <Label className="text-xs font-medium flex items-center">
                          <Link className="h-3 w-3 mr-1" />
                          Ссылка на онлайн-урок
                        </Label>
                        <Input
                          value={formData.onlineLink}
                          onChange={(e) => updateFormData('onlineLink', e.target.value)}
                          placeholder="https://meet.google.com/..."
                          className="h-9"
                        />
                      </div>
                    )}

                    <div className="col-span-2 space-y-2">
                      <Label className="text-xs font-medium">Необходимое оборудование</Label>
                      <div className="flex flex-wrap gap-2">
                        {EQUIPMENT_OPTIONS.map((eq) => (
                          <Button
                            key={eq.value}
                            type="button"
                            variant={formData.equipment.includes(eq.value) ? "default" : "outline"}
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => toggleEquipment(eq.value)}
                          >
                            <eq.icon className="h-3 w-3 mr-1" />
                            {eq.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* SECTION 4: Students */}
            <Collapsible open={openSections.students} onOpenChange={() => toggleSection('students')}>
              <CollapsibleTrigger className="w-full">
                <SectionHeader icon={Users} title="Ученики и посещаемость" isOpen={openSections.students} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-3 space-y-4 border-x border-b rounded-b-lg bg-background">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Группа учеников</Label>
                      <Select value={formData.groupId} onValueChange={(v) => updateFormData('groupId', v)}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Выберите группу" /></SelectTrigger>
                        <SelectContent>
                          {groups.map((group: any) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name} ({group.student_count || 0} уч.)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Режим посещаемости</Label>
                      <Select value={formData.attendanceMode} onValueChange={(v) => updateFormData('attendanceMode', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ATTENDANCE_MODES.map((mode) => (
                            <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2 flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-sm">Отслеживание посещаемости</span>
                      </div>
                      <Switch
                        checked={formData.attendanceEnabled}
                        onCheckedChange={(checked) => updateFormData('attendanceEnabled', checked)}
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <Label className="text-xs font-medium">Индивидуальный выбор учеников</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full h-9 justify-start text-left font-normal">
                            {formData.individualStudents.length > 0 
                              ? `${formData.individualStudents.length} учеников выбрано`
                              : 'Выбрать учеников вручную'
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-2" align="start">
                          <ScrollArea className="max-h-48">
                            <div className="space-y-1">
                              {students.map((student: any) => (
                                <div key={student.id} className="flex items-center space-x-2 p-1.5 hover:bg-muted rounded">
                                  <Checkbox
                                    checked={formData.individualStudents.includes(student.id)}
                                    onCheckedChange={() => toggleStudent(student.id)}
                                  />
                                  <span className="text-sm">{student.full_name}</span>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* SECTION 5: Content */}
            <Collapsible open={openSections.content} onOpenChange={() => toggleSection('content')}>
              <CollapsibleTrigger className="w-full">
                <SectionHeader icon={FileText} title="Содержание и материалы" isOpen={openSections.content} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-3 space-y-4 border-x border-b rounded-b-lg bg-background">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Описание урока</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="Краткое описание темы и целей урока..."
                      className="min-h-[80px] text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Цели урока</Label>
                    <div className="space-y-2">
                      {formData.objectives.filter(o => o).map((obj, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                            {idx + 1}
                          </span>
                          <span className="flex-1 text-sm">{obj}</span>
                          <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeObjective(idx)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          value={newObjective}
                          onChange={(e) => setNewObjective(e.target.value)}
                          placeholder="Добавить цель..."
                          className="h-8 text-sm"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                        />
                        <Button type="button" size="sm" variant="outline" className="h-8" onClick={addObjective}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Домашнее задание</Label>
                    <Textarea
                      value={formData.homeworkText}
                      onChange={(e) => updateFormData('homeworkText', e.target.value)}
                      placeholder="Описание домашнего задания..."
                      className="min-h-[60px] text-sm"
                    />
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" className="h-7 text-xs">
                        <Upload className="h-3 w-3 mr-1" />
                        Загрузить файл
                      </Button>
                      <Button type="button" variant="outline" size="sm" className="h-7 text-xs">
                        <Link className="h-3 w-3 mr-1" />
                        Добавить ссылку
                      </Button>
                      <Button type="button" variant="outline" size="sm" className="h-7 text-xs">
                        <Video className="h-3 w-3 mr-1" />
                        Видео
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Время на ДЗ (мин)</Label>
                    <Input
                      type="number"
                      value={formData.estimatedHomeworkTime}
                      onChange={(e) => updateFormData('estimatedHomeworkTime', parseInt(e.target.value) || 0)}
                      className="h-9 w-32"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* SECTION 6: Assessment */}
            <Collapsible open={openSections.assessment} onOpenChange={() => toggleSection('assessment')}>
              <CollapsibleTrigger className="w-full">
                <SectionHeader icon={Award} title="Оценивание" isOpen={openSections.assessment} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-3 space-y-4 border-x border-b rounded-b-lg bg-background">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Тип оценки</Label>
                      <Select value={formData.assessmentType} onValueChange={(v) => updateFormData('assessmentType', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ASSESSMENT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Шкала оценок</Label>
                      <Select value={formData.gradingScale} onValueChange={(v) => updateFormData('gradingScale', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {GRADING_SCALES.map((scale) => (
                            <SelectItem key={scale.value} value={scale.value}>{scale.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.assessmentType !== 'none' && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Максимальный балл</Label>
                          <Input type="number" value={formData.maxScore} onChange={(e) => updateFormData('maxScore', parseInt(e.target.value) || 0)} className="h-9" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Проходной балл</Label>
                          <Input type="number" value={formData.passingScore} onChange={(e) => updateFormData('passingScore', parseInt(e.target.value) || 0)} className="h-9" />
                        </div>
                        <div className="col-span-2 flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className="text-sm">Автоматическая проверка</span>
                          </div>
                          <Switch checked={formData.autoGrade} onCheckedChange={(checked) => updateFormData('autoGrade', checked)} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* SECTION 7: Notifications */}
            <Collapsible open={openSections.notifications} onOpenChange={() => toggleSection('notifications')}>
              <CollapsibleTrigger className="w-full">
                <SectionHeader icon={Bell} title="Уведомления и видимость" isOpen={openSections.notifications} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-3 space-y-4 border-x border-b rounded-b-lg bg-background">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                      <span className="text-xs">Ученикам</span>
                      <Switch checked={formData.notifyStudents} onCheckedChange={(checked) => updateFormData('notifyStudents', checked)} />
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                      <span className="text-xs">Родителям</span>
                      <Switch checked={formData.notifyParents} onCheckedChange={(checked) => updateFormData('notifyParents', checked)} />
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                      <span className="text-xs">Учителю</span>
                      <Switch checked={formData.notifyTeacher} onCheckedChange={(checked) => updateFormData('notifyTeacher', checked)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Время уведомления</Label>
                      <Select value={formData.notificationTime} onValueChange={(v) => updateFormData('notificationTime', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediately">Сразу</SelectItem>
                          <SelectItem value="1hour">За 1 час</SelectItem>
                          <SelectItem value="1day">За 1 день</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Видимость</Label>
                      <Select value={formData.visibility} onValueChange={(v) => updateFormData('visibility', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {VISIBILITY_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* SECTION 8: Tags */}
            <Collapsible open={openSections.tags} onOpenChange={() => toggleSection('tags')}>
              <CollapsibleTrigger className="w-full">
                <SectionHeader icon={Tag} title="Теги и метаданные" isOpen={openSections.tags} badge={formData.tags.length > 0 ? `${formData.tags.length}` : undefined} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-3 space-y-4 border-x border-b rounded-b-lg bg-background">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Теги</Label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs pl-2 pr-1 py-0.5">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:bg-muted rounded">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Добавить тег..."
                        className="h-8 text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" size="sm" variant="outline" className="h-8" onClick={addTag}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Приоритет</Label>
                      <Select value={formData.priority} onValueChange={(v) => updateFormData('priority', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PRIORITY_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              <div className="flex items-center gap-2">
                                <span className={cn("w-2 h-2 rounded-full", level.color)} />
                                {level.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Цвет в календаре</Label>
                      <div className="flex gap-1.5">
                        {COLOR_LABELS.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            className={cn(
                              "w-6 h-6 rounded-full transition-transform",
                              color.class,
                              formData.colorLabel === color.value && "ring-2 ring-offset-2 ring-foreground scale-110"
                            )}
                            onClick={() => updateFormData('colorLabel', color.value)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      Внутренние заметки (только для администрации)
                    </Label>
                    <Textarea
                      value={formData.internalNotes}
                      onChange={(e) => updateFormData('internalNotes', e.target.value)}
                      placeholder="Заметки, не видимые ученикам..."
                      className="min-h-[60px] text-sm"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

          </div>
        </ScrollArea>

        {/* SECTION 9: Actions */}
        <div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {editLesson && (
              <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={isSubmitting}>
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Удалить
              </Button>
            )}
            <Button type="button" variant="outline" size="sm" onClick={handleDuplicate}>
              <Copy className="h-3.5 w-3.5 mr-1" />
              Дублировать
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-3.5 w-3.5 mr-1" />
              Отмена
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => handleSubmit(true)} disabled={isSubmitting}>
              <Save className="h-3.5 w-3.5 mr-1" />
              {isSubmitting && isDraft ? 'Сохранение...' : 'Черновик'}
            </Button>
            <Button type="button" size="sm" onClick={() => handleSubmit(false)} disabled={isSubmitting}>
              <Send className="h-3.5 w-3.5 mr-1" />
              {isSubmitting && !isDraft ? 'Публикация...' : 'Опубликовать'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
