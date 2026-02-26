import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen } from 'lucide-react';

interface ScheduleTabProps {
  studentId: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

interface LessonSlot {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

const SCHEDULE: Record<string, LessonSlot[]> = {
  'Monday': [
    { time: '08:00–08:45', subject: 'Mathematics', teacher: 'Smirnova A.V.', room: '201' },
    { time: '09:00–09:45', subject: 'English', teacher: 'Popov I.N.', room: '305' },
    { time: '10:00–10:45', subject: 'Physics', teacher: 'Kuznetsova O.P.', room: '102' },
  ],
  'Tuesday': [
    { time: '08:00–08:45', subject: 'English', teacher: 'Mironov D.S.', room: '204' },
    { time: '09:00–09:45', subject: 'History', teacher: 'Popov I.N.', room: '301' },
    { time: '10:00–10:45', subject: 'Chemistry', teacher: 'Kuznetsova O.P.', room: '103' },
    { time: '11:00–11:45', subject: 'PE', teacher: 'Mironov D.S.', room: 'Gym' },
  ],
  'Wednesday': [
    { time: '08:00–08:45', subject: 'Mathematics', teacher: 'Smirnova A.V.', room: '201' },
    { time: '09:00–09:45', subject: 'Biology', teacher: 'Kuznetsova O.P.', room: '104' },
    { time: '10:00–10:45', subject: 'Literature', teacher: 'Popov I.N.', room: '305' },
  ],
  'Thursday': [
    { time: '08:00–08:45', subject: 'Physics', teacher: 'Kuznetsova O.P.', room: '102' },
    { time: '09:00–09:45', subject: 'English', teacher: 'Mironov D.S.', room: '204' },
    { time: '10:00–10:45', subject: 'Mathematics', teacher: 'Smirnova A.V.', room: '201' },
  ],
  'Friday': [
    { time: '08:00–08:45', subject: 'English', teacher: 'Popov I.N.', room: '305' },
    { time: '09:00–09:45', subject: 'History', teacher: 'Popov I.N.', room: '301' },
    { time: '10:00–10:45', subject: 'Chemistry', teacher: 'Kuznetsova O.P.', room: '103' },
  ],
};

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ studentId }) => {
  const totalLessons = useMemo(() => Object.values(SCHEDULE).reduce((s, l) => s + l.length, 0), []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <BookOpen className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-2xl font-bold">{totalLessons}</p>
          <p className="text-xs text-muted-foreground">Lessons per week</p>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-2xl font-bold">08:00</p>
          <p className="text-xs text-muted-foreground">Start time</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{new Set(Object.values(SCHEDULE).flat().map(l => l.subject)).size}</p>
          <p className="text-xs text-muted-foreground">Subjects</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {DAYS.map(day => (
          <Card key={day} className="p-4">
            <h4 className="font-semibold text-sm mb-3 text-center bg-muted/50 rounded-lg p-2">{day}</h4>
            <div className="space-y-2">
              {(SCHEDULE[day] || []).map((lesson, i) => (
                <div key={i} className="p-2.5 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                  <p className="text-xs text-muted-foreground">{lesson.time}</p>
                  <p className="font-medium text-sm mt-0.5">{lesson.subject}</p>
                  <p className="text-xs text-muted-foreground">{lesson.teacher}</p>
                  <Badge variant="outline" className="mt-1 text-xs">Room {lesson.room}</Badge>
                </div>
              ))}
              {(!SCHEDULE[day] || SCHEDULE[day].length === 0) && (
                <p className="text-xs text-muted-foreground text-center py-4 italic">No lessons</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
