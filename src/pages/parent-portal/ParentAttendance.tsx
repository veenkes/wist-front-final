import { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const generateMockAttendance = () => {
  const records: any[] = [];
  const lessons = [
    { time: '08:30', subject: 'Математика' },
    { time: '09:30', subject: 'Русский язык' },
    { time: '10:30', subject: 'Английский' },
    { time: '11:30', subject: 'История' },
  ];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    lessons.forEach((lesson, idx) => {
      const rand = Math.random();
      let status: 'present' | 'absent' | 'late' | 'excused';
      if (rand < 0.7) status = 'present';
      else if (rand < 0.85) status = 'late';
      else if (rand < 0.95) status = 'absent';
      else status = 'excused';
      
      records.push({ id: `${date.toISOString()}-${idx}`, date, time: lesson.time, subject: lesson.subject, status });
    });
  }
  return records;
};

const mockAttendance = generateMockAttendance();

const ParentAttendance = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd }).filter(day => day.getDay() !== 0 && day.getDay() !== 6);

  const weekAttendance = useMemo(() => {
    return weekDays.map(day => ({
      date: day,
      records: mockAttendance.filter(record => isSameDay(record.date, day)),
    }));
  }, [currentWeek]);

  const stats = useMemo(() => {
    const total = mockAttendance.length;
    const present = mockAttendance.filter(r => r.status === 'present').length;
    const absent = mockAttendance.filter(r => r.status === 'absent').length;
    const late = mockAttendance.filter(r => r.status === 'late').length;
    return { total, present, absent, late, percentage: Math.round((present / total) * 100) };
  }, []);

  const chartData = [
    { name: 'Присутствовал', value: stats.present, color: 'hsl(var(--success))' },
    { name: 'Отсутствовал', value: stats.absent, color: 'hsl(var(--destructive))' },
    { name: 'Опоздал', value: stats.late, color: 'hsl(var(--warning))' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'absent': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'late': return <Clock className="w-4 h-4 text-warning" />;
      case 'excused': return <FileText className="w-4 h-4 text-primary" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Посещаемость</h1>

      {/* Week Picker */}
      <Card className="shadow-card border-0">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <p className="font-medium text-foreground text-sm">
                {format(weekStart, 'd MMM', { locale: ru })} – {format(weekEnd, 'd MMM', { locale: ru })}
              </p>
              <Button variant="link" size="sm" className="text-primary p-0 h-auto text-xs" onClick={() => setCurrentWeek(new Date())}>
                Сегодня
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Всего', value: stats.total, color: 'bg-secondary' },
          { label: 'Был', value: stats.present, color: 'bg-success/10' },
          { label: 'Не был', value: stats.absent, color: 'bg-destructive/10' },
          { label: 'Опоздал', value: stats.late, color: 'bg-warning/10' },
        ].map((item) => (
          <Card key={item.label} className={`shadow-card border-0 ${item.color}`}>
            <CardContent className="p-2 text-center">
              <p className="text-lg font-bold text-foreground">{item.value}</p>
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart & Percentage */}
      <Card className="shadow-card border-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={2} dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <p className="text-3xl font-bold text-foreground">{stats.percentage}%</p>
              <p className="text-xs text-muted-foreground">Общая посещаемость</p>
              <div className="flex gap-3 mt-2">
                {chartData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] text-muted-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Records */}
      <Card className="shadow-card border-0">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Детали недели
          </h3>
          <div className="space-y-3">
            {weekAttendance.map(({ date, records }) => (
              <div key={date.toISOString()} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground text-sm capitalize">
                    {format(date, 'EEEE', { locale: ru })}
                  </p>
                  <p className="text-xs text-muted-foreground">{format(date, 'd MMM', { locale: ru })}</p>
                </div>
                {records.length > 0 ? (
                  <div className="space-y-1.5">
                    {records.map((record) => (
                      <div key={record.id} className="flex items-center justify-between bg-secondary/30 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <span className="text-sm text-foreground">{record.subject}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{record.time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Нет данных</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full h-11">
        <Download className="w-4 h-4 mr-2" />
        Скачать отчёт
      </Button>
    </div>
  );
};

export default ParentAttendance;
