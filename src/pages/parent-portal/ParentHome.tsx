import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Bell,
  CreditCard,
  Calendar,
  XCircle,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import ChildProfileModal from './components/ChildProfileModal';

type AttendanceStatus = 'present' | 'absent' | 'late';

const mockChildren = [
  {
    id: '1',
    name: 'Аруzhan Каримова',
    photo: '',
    grade: '8 класс',
    group: 'Группа А',
    teacher: 'Иванова А.М.',
    todayStatus: 'present' as AttendanceStatus,
    nextLesson: { time: '10:30', subject: 'Математика', teacher: 'Петрова Е.С.' },
    weekAttendance: ['present', 'present', 'late', 'present', 'absent'] as AttendanceStatus[],
  },
  {
    id: '2',
    name: 'Мурод Исмоилов',
    photo: '',
    grade: '5 класс',
    group: 'Группа Б',
    teacher: 'Сидорова Н.В.',
    todayStatus: 'late' as AttendanceStatus,
    nextLesson: { time: '11:15', subject: 'Английский', teacher: 'Джонсон М.' },
    weekAttendance: ['present', 'absent', 'present', 'present', 'present'] as AttendanceStatus[],
  },
];

const mockNotifications = [
  { id: 1, type: 'alert', title: 'Урок отменён', message: 'Математика 25.01 отменена', time: '2ч' },
  { id: 2, type: 'message', title: 'Сообщение от учителя', message: 'Домашнее задание обновлено', time: '5ч' },
  { id: 3, type: 'payment', title: 'Напоминание', message: 'Оплата до 01.02.2025', time: '1д' },
];

const mockUpcomingPayment = {
  amount: 2500000,
  dueDate: new Date(2025, 1, 1),
};

const ParentHome = () => {
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [showChildProfile, setShowChildProfile] = useState(false);
  const selectedChild = mockChildren[selectedChildIndex];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-success';
      case 'absent': return 'bg-destructive';
      case 'late': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Присутствует';
      case 'absent': return 'Отсутствует';
      case 'late': return 'Опоздал';
      default: return 'Не отмечен';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + ' сум';
  };

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {format(new Date(), 'EEEE', { locale: ru })}
          </p>
          <h1 className="text-xl font-semibold text-foreground">
            {format(new Date(), 'd MMMM', { locale: ru })}
          </h1>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center font-medium">
            3
          </span>
        </Button>
      </div>

      {/* Child Selector Card */}
      <Card className="shadow-card border-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-primary p-4">
            <div className="flex items-center justify-between">
              {mockChildren.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8"
                  onClick={() => setSelectedChildIndex(Math.max(0, selectedChildIndex - 1))}
                  disabled={selectedChildIndex === 0}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}

              <button 
                onClick={() => setShowChildProfile(true)}
                className="flex items-center gap-3 flex-1 justify-center hover:opacity-90 transition-opacity"
              >
                <Avatar className="w-12 h-12 border-2 border-primary-foreground/20">
                  <AvatarImage src={selectedChild.photo} />
                  <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground font-medium text-sm">
                    {selectedChild.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <h3 className="font-semibold text-primary-foreground text-sm">{selectedChild.name}</h3>
                  <p className="text-xs text-primary-foreground/70">{selectedChild.grade} • {selectedChild.group}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-primary-foreground/50" />
              </button>

              {mockChildren.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8"
                  onClick={() => setSelectedChildIndex(Math.min(mockChildren.length - 1, selectedChildIndex + 1))}
                  disabled={selectedChildIndex === mockChildren.length - 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              )}
            </div>

            {mockChildren.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {mockChildren.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedChildIndex(idx)}
                    className={`h-1 rounded-full transition-all ${
                      idx === selectedChildIndex ? 'bg-primary-foreground w-4' : 'bg-primary-foreground/30 w-1'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="shadow-card border-0">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">След. урок</span>
            </div>
            <p className="font-semibold text-foreground text-sm">{selectedChild.nextLesson.subject}</p>
            <p className="text-xs text-muted-foreground">{selectedChild.nextLesson.time}</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                selectedChild.todayStatus === 'present' ? 'bg-success/10' :
                selectedChild.todayStatus === 'late' ? 'bg-warning/10' : 'bg-destructive/10'
              }`}>
                {selectedChild.todayStatus === 'present' ? (
                  <CheckCircle className="w-3.5 h-3.5 text-success" />
                ) : selectedChild.todayStatus === 'late' ? (
                  <Clock className="w-3.5 h-3.5 text-warning" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-destructive" />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Сегодня</span>
            </div>
            <p className="font-semibold text-foreground text-sm">{getStatusText(selectedChild.todayStatus)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Attendance */}
      <Card className="shadow-card border-0">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Посещаемость за неделю
          </h3>
          <div className="flex justify-between">
            {weekDays.map((day, idx) => (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground font-medium">{day}</span>
                <div className={`w-8 h-8 rounded-full ${getStatusColor(selectedChild.weekAttendance[idx])} flex items-center justify-center`}>
                  {selectedChild.weekAttendance[idx] === 'present' && <CheckCircle className="w-4 h-4 text-success-foreground" />}
                  {selectedChild.weekAttendance[idx] === 'absent' && <XCircle className="w-4 h-4 text-destructive-foreground" />}
                  {selectedChild.weekAttendance[idx] === 'late' && <Clock className="w-4 h-4 text-warning-foreground" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Card */}
      <Card className="shadow-card border-0 bg-gradient-to-r from-wist-navy to-wist-navy-light">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">К оплате</p>
              <p className="text-lg font-bold text-white">{formatCurrency(mockUpcomingPayment.amount)}</p>
              <p className="text-xs text-white/60">до {format(mockUpcomingPayment.dueDate, 'd MMM', { locale: ru })}</p>
            </div>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-hover">
              Оплатить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="shadow-card border-0">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Уведомления
          </h3>
          <div className="space-y-2">
            {mockNotifications.map((notification) => (
              <div 
                key={notification.id}
                className="flex items-center gap-3 p-2.5 bg-secondary/50 rounded-lg"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  notification.type === 'alert' ? 'bg-destructive/10' :
                  notification.type === 'message' ? 'bg-primary/10' : 'bg-warning/10'
                }`}>
                  {notification.type === 'alert' && <AlertCircle className="w-4 h-4 text-destructive" />}
                  {notification.type === 'message' && <Bell className="w-4 h-4 text-primary" />}
                  {notification.type === 'payment' && <CreditCard className="w-4 h-4 text-warning" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{notification.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{notification.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ChildProfileModal
        isOpen={showChildProfile}
        onClose={() => setShowChildProfile(false)}
        child={selectedChild}
      />
    </div>
  );
};

export default ParentHome;
