import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Clock, MapPin, User, Users, CheckCircle, XCircle, AlertCircle, 
  BookOpen, FileText, Edit, BarChart3
} from 'lucide-react';

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
}

interface HomeworkData {
  text: string;
  files: { name: string; url?: string }[];
  createdAt?: string;
}

interface LessonDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: LessonWithAttendance | null;
  homework?: HomeworkData | null;
  onOpenHomework: () => void;
  onEditLesson: () => void;
  onUpdateAttendance: (studentId: string, status: 'present' | 'absent' | 'late') => void;
}

export function LessonDetailModal({ 
  open, 
  onOpenChange, 
  lesson, 
  homework,
  onOpenHomework,
  onEditLesson,
  onUpdateAttendance
}: LessonDetailModalProps) {
  const [activeTab, setActiveTab] = useState('attendance');

  if (!lesson) return null;

  const stats = {
    total: lesson.attendance.length,
    present: lesson.attendance.filter(a => a.status === 'present').length,
    late: lesson.attendance.filter(a => a.status === 'late').length,
    absent: lesson.attendance.filter(a => a.status === 'absent').length,
    not_marked: lesson.attendance.filter(a => a.status === 'not_marked').length,
  };

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    onUpdateAttendance(studentId, status);
    toast.success(`Статус обновлен: ${status === 'present' ? 'Присутствует' : status === 'late' ? 'Опоздал' : 'Отсутствует'}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-success text-white">Присутствует</Badge>;
      case 'late':
        return <Badge className="bg-warning text-white">Опоздал</Badge>;
      case 'absent':
        return <Badge className="bg-destructive text-white">Отсутствует</Badge>;
      case 'excused':
        return <Badge variant="secondary">Уважительная</Badge>;
      default:
        return <Badge variant="outline">Не отмечен</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{lesson.subject}</DialogTitle>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {lesson.start_time?.slice(0, 5)} - {lesson.end_time?.slice(0, 5)}
                </span>
                {lesson.classroom && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Каб. {lesson.classroom}
                  </span>
                )}
                {lesson.teacher && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {lesson.teacher.full_name}
                  </span>
                )}
                {lesson.group && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {lesson.group.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onOpenHomework}>
                <FileText className="w-4 h-4 mr-1" />
                {homework ? 'ДЗ' : 'Добавить ДЗ'}
              </Button>
              <Button variant="ghost" size="sm" onClick={onEditLesson}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attendance" className="gap-2">
              <Users className="w-4 h-4" />
              Посещаемость
            </TabsTrigger>
            <TabsTrigger value="homework" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Домашнее задание
              {homework && <Badge variant="secondary" className="ml-1 h-5 px-1.5">1</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4 mt-4">
            {/* Stats Summary */}
            <div className="grid grid-cols-5 gap-2">
              <div className="text-center p-3 bg-muted/50 rounded-lg border">
                <div className="text-xl font-bold">{stats.total}</div>
                <div className="text-[10px] text-muted-foreground">Всего</div>
              </div>
              <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
                <div className="text-xl font-bold text-success">{stats.present}</div>
                <div className="text-[10px] text-muted-foreground">Присутств.</div>
              </div>
              <div className="text-center p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div className="text-xl font-bold text-warning">{stats.late}</div>
                <div className="text-[10px] text-muted-foreground">Опоздали</div>
              </div>
              <div className="text-center p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="text-xl font-bold text-destructive">{stats.absent}</div>
                <div className="text-[10px] text-muted-foreground">Отсутств.</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg border">
                <div className="text-xl font-bold text-muted-foreground">{stats.not_marked}</div>
                <div className="text-[10px] text-muted-foreground">Не отмечены</div>
              </div>
            </div>

            {/* Student List with Attendance Buttons */}
            <ScrollArea className="h-[350px]">
              <div className="space-y-2">
                {lesson.attendance.map((student) => (
                  <div 
                    key={student.id} 
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{student.name}</p>
                        {getStatusBadge(student.status)}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={student.status === 'present' ? 'default' : 'outline'}
                        className={`h-8 px-2 ${student.status === 'present' ? 'bg-success hover:bg-success/90' : ''}`}
                        onClick={() => handleMarkAttendance(student.id, 'present')}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={student.status === 'late' ? 'default' : 'outline'}
                        className={`h-8 px-2 ${student.status === 'late' ? 'bg-warning hover:bg-warning/90' : ''}`}
                        onClick={() => handleMarkAttendance(student.id, 'late')}
                      >
                        <AlertCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={student.status === 'absent' ? 'default' : 'outline'}
                        className={`h-8 px-2 ${student.status === 'absent' ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                        onClick={() => handleMarkAttendance(student.id, 'absent')}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="homework" className="space-y-4 mt-4">
            {homework ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Задание
                    </h3>
                    <Button variant="ghost" size="sm" onClick={onOpenHomework}>
                      <Edit className="w-4 h-4 mr-1" />
                      Редактировать
                    </Button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{homework.text}</p>
                  
                  {homework.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Прикрепленные файлы:</p>
                      {homework.files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                          <FileText className="w-4 h-4 text-primary" />
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}

                  {homework.createdAt && (
                    <p className="text-xs text-muted-foreground mt-4">
                      Добавлено: {new Date(homework.createdAt).toLocaleString('ru-RU')}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">Домашнее задание не добавлено</p>
                <Button onClick={onOpenHomework}>
                  <FileText className="w-4 h-4 mr-2" />
                  Добавить домашнее задание
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
