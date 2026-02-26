import { 
  X, 
  User, 
  Calendar, 
  FileText, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Download
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

type AttendanceStatus = 'present' | 'absent' | 'late';

interface ChildProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: {
    id: string;
    name: string;
    photo: string;
    grade: string;
    group: string;
    teacher: string;
    todayStatus: AttendanceStatus;
    nextLesson: { time: string; subject: string; teacher: string };
    weekAttendance: AttendanceStatus[];
  } | null;
}

const mockGrades = [
  { subject: 'Математика', grade: 92 },
  { subject: 'Русский язык', grade: 85 },
  { subject: 'Английский', grade: 88 },
  { subject: 'История', grade: 78 },
];

const mockDocuments = [
  { name: 'Договор', type: 'pdf' },
  { name: 'Свидетельство', type: 'pdf' },
  { name: 'Мед. справка', type: 'pdf' },
];

const ChildProfileModal = ({ isOpen, onClose, child }: ChildProfileModalProps) => {
  if (!child) return null;

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-success';
      case 'absent': return 'bg-destructive';
      case 'late': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] max-h-[85vh] p-0 rounded-2xl overflow-hidden">
        <ScrollArea className="max-h-[85vh]">
          {/* Header */}
          <div className="bg-gradient-primary p-5 text-primary-foreground relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-primary-foreground/60 hover:text-primary-foreground">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-primary-foreground/20">
                <AvatarImage src={child.photo} />
                <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground text-lg font-semibold">
                  {child.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-bold">{child.name}</h2>
                <p className="text-sm text-primary-foreground/70">{child.grade} • {child.group}</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Info */}
            <Card className="shadow-card border-0">
              <CardContent className="p-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Информация
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Куратор:</span>
                    <span className="font-medium">{child.teacher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Расписание:</span>
                    <span className="font-medium">Пн-Пт, 08:00-14:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance */}
            <Card className="shadow-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Посещаемость
                  </h3>
                  <Button variant="link" size="sm" className="text-primary p-0 h-auto text-xs">
                    Подробнее <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
                <div className="flex justify-between">
                  {weekDays.map((day, idx) => (
                    <div key={day} className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">{day}</span>
                      <div className={`w-7 h-7 rounded-full ${getStatusColor(child.weekAttendance[idx])} flex items-center justify-center`}>
                        {child.weekAttendance[idx] === 'present' && <CheckCircle className="w-3.5 h-3.5 text-success-foreground" />}
                        {child.weekAttendance[idx] === 'absent' && <XCircle className="w-3.5 h-3.5 text-destructive-foreground" />}
                        {child.weekAttendance[idx] === 'late' && <Clock className="w-3.5 h-3.5 text-warning-foreground" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Grades */}
            <Card className="shadow-card border-0">
              <CardContent className="p-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Успеваемость
                </h3>
                <div className="space-y-3">
                  {mockGrades.map((item) => (
                    <div key={item.subject} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.subject}</span>
                        <span className="font-semibold">{item.grade}%</span>
                      </div>
                      <Progress value={item.grade} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="shadow-card border-0">
              <CardContent className="p-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Документы
                </h3>
                <div className="space-y-2">
                  {mockDocuments.map((doc) => (
                    <button key={doc.name} className="w-full flex items-center justify-between p-2.5 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-destructive" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ChildProfileModal;
