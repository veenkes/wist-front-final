import { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Settings, 
  LogOut, 
  ChevronRight,
  Bell,
  Globe,
  Shield,
  HelpCircle,
  MessageCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import ChildProfileModal from './components/ChildProfileModal';

type AttendanceStatus = 'present' | 'absent' | 'late';

const mockParent = {
  name: 'Каримова Айгуль Ахмедовна',
  phone: '+998 90 123 45 67',
  email: 'karimova@mail.uz',
};

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
    name: 'Мурод Каримов',
    photo: '',
    grade: '5 класс',
    group: 'Группа Б',
    teacher: 'Сидорова Н.В.',
    todayStatus: 'late' as AttendanceStatus,
    nextLesson: { time: '11:15', subject: 'Английский', teacher: 'Джонсон М.' },
    weekAttendance: ['present', 'absent', 'present', 'present', 'present'] as AttendanceStatus[],
  },
];

const ParentProfile = () => {
  const { theme, toggleTheme, language, toggleLanguage } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [selectedChild, setSelectedChild] = useState<typeof mockChildren[0] | null>(null);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Профиль</h1>

      {/* Parent Info */}
      <Card className="shadow-card border-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                {mockParent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{mockParent.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <Phone className="w-3 h-3" />
                <span>{mockParent.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3 h-3" />
                <span className="truncate">{mockParent.email}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children */}
      <Card className="shadow-card border-0">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Дети</h3>
          <div className="space-y-2">
            {mockChildren.map((child) => (
              <button
                key={child.id}
                className="w-full flex items-center gap-3 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors"
                onClick={() => setSelectedChild(child)}
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {child.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground text-sm">{child.name}</p>
                  <p className="text-xs text-muted-foreground">{child.grade}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="shadow-card border-0">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Настройки</h3>
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Sun className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm text-foreground">Тема</span>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={toggleTheme}
              />
            </div>

            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Язык</span>
              </div>
              <button 
                onClick={toggleLanguage}
                className="px-3 py-1 text-xs font-medium bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
              >
                {language === 'en' ? 'EN' : 'RU'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Уведомления</span>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <button className="w-full flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Конфиденциальность</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="shadow-card border-0">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Поддержка</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start h-11 text-sm">
              <MessageCircle className="w-4 h-4 mr-3 text-primary" />
              Написать администрации
            </Button>
            <Button variant="outline" className="w-full justify-start h-11 text-sm">
              <HelpCircle className="w-4 h-4 mr-3 text-muted-foreground" />
              Частые вопросы
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full h-11 text-destructive border-destructive/30 hover:bg-destructive/5">
        <LogOut className="w-4 h-4 mr-2" />
        Выйти
      </Button>

      <ChildProfileModal isOpen={!!selectedChild} onClose={() => setSelectedChild(null)} child={selectedChild} />
    </div>
  );
};

export default ParentProfile;
