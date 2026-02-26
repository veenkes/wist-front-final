import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  UserCheck,
  UserX,
  Clock,
  Mail,
  User
} from 'lucide-react';
import { Group, useGroupStudents } from '@/hooks/useGroups';

interface GroupDetailModalProps {
  group: Group | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupDetailModal({ group, open, onOpenChange }: GroupDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { students, isLoading } = useGroupStudents(group?.id || null);

  if (!group) return null;

  const activeStudents = students.filter((s: any) => s.status === 'active').length;
  const inactiveStudents = students.length - activeStudents;
  const attendanceRate = 92; // Mock data - можно подсчитать реально

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'graduated': return 'bg-blue-500';
      case 'suspended': return 'bg-orange-500';
      case 'debt': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Группа {group.name}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="students">Студенты ({students.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Curator Info */}
            <Card className="p-4">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Куратор группы
              </h3>
              {group.curator ? (
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={group.curator.avatar_url || ''} />
                    <AvatarFallback>
                      {group.curator.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{group.curator.full_name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {group.curator.email}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Куратор не назначен</p>
              )}
            </Card>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-xs text-muted-foreground">Всего студентов</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <UserCheck className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-2xl font-bold">{activeStudents}</p>
                <p className="text-xs text-muted-foreground">Активные</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <UserX className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-2xl font-bold">{inactiveStudents}</p>
                <p className="text-xs text-muted-foreground">Неактивные</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <p className="text-2xl font-bold">{attendanceRate}%</p>
                <p className="text-xs text-muted-foreground">Посещаемость</p>
              </Card>
            </div>

            {/* Group Info */}
            <Card className="p-4">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Информация о группе
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Уровень класса</p>
                  <p className="font-medium">{group.grade_level || 'Не указан'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Учебный год</p>
                  <p className="font-medium">{group.academic_year || 'Не указан'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Дата создания</p>
                  <p className="font-medium">
                    {group.created_at ? new Date(group.created_at).toLocaleDateString('ru-RU') : 'Н/Д'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Последнее обновление</p>
                  <p className="font-medium">
                    {group.updated_at ? new Date(group.updated_at).toLocaleDateString('ru-RU') : 'Н/Д'}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Загрузка...</div>
              ) : students.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Нет студентов в группе</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {students.map((student: any) => (
                    <Card key={student.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={student.photo_url || ''} />
                          <AvatarFallback>
                            {student.full_name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-foreground">{student.full_name}</p>
                            <Badge className={`${getStatusColor(student.status)} text-white`}>
                              {student.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" />
                              {student.academic_level || 'Не указан'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {student.enrollment_date ? 
                                new Date(student.enrollment_date).toLocaleDateString('ru-RU') : 
                                'Н/Д'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
