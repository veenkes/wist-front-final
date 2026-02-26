import React, { useState } from 'react';
import { Search, AlertCircle, Plus, Camera, Clock, MapPin, User, FileText, Shield, MessageSquare, Calendar, ChevronRight, AlertTriangle, CheckCircle2, MessageCircleWarning } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

type ViolationCategory = 'C1' | 'C2' | 'C3' | 'C4' | 'C5';

interface Violation {
  id: string;
  studentName: string;
  studentId: string;
  studentGroup: string;
  date: string;
  time: string;
  type: string;
  category: ViolationCategory;
  description: string;
  location: string;
  status: 'pending' | 'resolved';
  reportedBy: string;
  involvedParties?: string;
  actionTaken?: string;
  preventiveMeasures?: string;
  studentResponse?: string;
  teacherComment?: string;
  hasEvidence: boolean;
}

interface Remark {
  id: string;
  studentName: string;
  studentGroup: string;
  date: string;
  remark: string;
  reportedBy: string;
}

// Category descriptions
const categoryDescriptions: Record<ViolationCategory, { label: string; description: string; color: string }> = {
  C1: { label: 'C1 - Незначительное', description: 'Опоздание, забытые принадлежности', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  C2: { label: 'C2 - Лёгкое', description: 'Разговоры на уроке, отвлечение', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
  C3: { label: 'C3 - Умеренное', description: 'Нарушение дисциплины, использование телефона', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  C4: { label: 'C4 - Серьёзное', description: 'Прогулы, конфликты, порча имущества', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  C5: { label: 'C5 - Критическое', description: 'Грубые нарушения, угрозы, насилие', color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const mockViolations: Violation[] = [
  {
    id: '1',
    studentName: 'Каримова Аружан',
    studentId: 'STU-2018-0234',
    studentGroup: '8A класс',
    date: '2024-12-20',
    time: '10:30',
    type: 'Опоздание на урок',
    category: 'C1',
    description: 'Ученица опоздала на урок математики на 15 минут без предварительного уведомления.',
    location: 'Кабинет 201',
    status: 'resolved',
    reportedBy: 'Каримова Амина',
    involvedParties: 'Только ученица',
    actionTaken: 'Проведена беседа о пунктуальности. Родители уведомлены.',
    preventiveMeasures: 'Рекомендовано выезжать из дома на 15 минут раньше.',
    studentResponse: 'Была пробка на дороге. Постараюсь выезжать раньше.',
    teacherComment: 'Ученица осознала ситуацию.',
    hasEvidence: false
  },
  {
    id: '2',
    studentName: 'Исмоилов Мурод',
    studentId: 'STU-2019-0456',
    studentGroup: '5B класс',
    date: '2024-12-19',
    time: '14:15',
    type: 'Нарушение дисциплины',
    category: 'C3',
    description: 'Ученик громко разговаривал во время урока и отвлекал других.',
    location: 'Кабинет 305',
    status: 'pending',
    reportedBy: 'Бек Рустам',
    involvedParties: 'Ученик + 2 соседа по парте',
    actionTaken: 'Сделано устное предупреждение. Пересажен на первую парту.',
    preventiveMeasures: 'Требуется встреча с родителями.',
    hasEvidence: false
  },
  {
    id: '3',
    studentName: 'Турсунова Лола',
    studentId: 'STU-2020-0789',
    studentGroup: '10A класс',
    date: '2024-12-18',
    time: '09:45',
    type: 'Использование телефона',
    category: 'C4',
    description: 'Ученица использовала телефон во время контрольной работы.',
    location: 'Кабинет 102',
    status: 'resolved',
    reportedBy: 'Ахмедова Нигора',
    involvedParties: 'Только ученица',
    actionTaken: 'Контрольная аннулирована. Телефон изъят до конца дня.',
    preventiveMeasures: 'Введено правило сдачи телефонов перед контрольными.',
    studentResponse: 'Не списывала, хотела посмотреть время. Сожалею.',
    teacherComment: 'Рекомендую пересдачу с усиленным контролем.',
    hasEvidence: true
  },
  {
    id: '4',
    studentName: 'Расулов Бекзод',
    studentId: 'STU-2021-0123',
    studentGroup: '2A класс',
    date: '2024-12-17',
    time: '11:20',
    type: 'Конфликт с одноклассником',
    category: 'C4',
    description: 'Словесная перепалка из-за места в столовой, переросшая в толкание.',
    location: 'Столовая',
    status: 'resolved',
    reportedBy: 'Дежурный учитель',
    involvedParties: 'Расулов Бекзод, Каримов Алишер',
    actionTaken: 'Проведена беседа с психологом. Написаны объяснительные.',
    preventiveMeasures: 'Назначены разные смены обеда.',
    studentResponse: 'Он первый начал. Но я понимаю, надо было позвать учителя.',
    teacherComment: 'Типичный конфликт для данного возраста.',
    hasEvidence: false
  },
  {
    id: '5',
    studentName: 'Ахмедова Дилноза',
    studentId: 'STU-2019-0567',
    studentGroup: '7B класс',
    date: '2024-12-16',
    time: '08:00',
    type: 'Прогул занятий',
    category: 'C4',
    description: 'Отсутствовала на первых трёх уроках без уважительной причины.',
    location: 'Школа',
    status: 'pending',
    reportedBy: 'Классный руководитель',
    involvedParties: 'Только ученица',
    actionTaken: 'Срочно связались с родителями. Ученица была дома (проспала).',
    preventiveMeasures: 'Рекомендовано установить контроль пробуждения.',
    teacherComment: 'Возможно переутомление. Проверить нагрузку.',
    hasEvidence: false
  },
  {
    id: '6',
    studentName: 'Юсупов Тимур',
    studentId: 'STU-2020-0890',
    studentGroup: '9A класс',
    date: '2024-12-15',
    time: '13:00',
    type: 'Порча школьного имущества',
    category: 'C2',
    description: 'Случайно разбил окно в спортзале во время игры в баскетбол.',
    location: 'Спортзал',
    status: 'resolved',
    reportedBy: 'Учитель физкультуры',
    involvedParties: 'Юсупов Тимур (случайно)',
    actionTaken: 'Составлен акт. Родители согласились компенсировать.',
    preventiveMeasures: 'Напоминание о правилах безопасности.',
    studentResponse: 'Это было случайно. Готов помочь с уборкой.',
    teacherComment: 'Инцидент непреднамеренный. Штраф не требуется.',
    hasEvidence: true
  }
];

const mockRemarks: Remark[] = [
  { id: 'r1', studentName: 'Иванов Алексей', studentGroup: '8A класс', date: '2024-12-20', remark: 'Не принёс учебник', reportedBy: 'Смирнова Е.И.' },
  { id: 'r2', studentName: 'Петрова Мария', studentGroup: '5B класс', date: '2024-12-19', remark: 'Забыл домашнее задание', reportedBy: 'Кузнецова О.П.' },
  { id: 'r3', studentName: 'Сидоров Дмитрий', studentGroup: '10A класс', date: '2024-12-18', remark: 'Отвлекался на уроке', reportedBy: 'Попов А.В.' },
];

export const Violations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('violations');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemarkDialogOpen, setIsRemarkDialogOpen] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [violations, setViolations] = useState(mockViolations);
  const [remarks, setRemarks] = useState(mockRemarks);

  const filteredViolations = violations.filter(violation => {
    const matchesSearch = violation.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          violation.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || violation.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || violation.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryConfig = (category: ViolationCategory) => {
    return categoryDescriptions[category];
  };

  const getStatusConfig = (status: string) => {
    return status === 'resolved' 
      ? { color: 'bg-success/10 text-success border-success/20', label: 'Решено', icon: CheckCircle2 }
      : { color: 'bg-warning/10 text-warning border-warning/20', label: 'На рассмотрении', icon: Clock };
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'd MMMM yyyy', { locale: ru });
  };

  const stats = {
    total: violations.length,
    pending: violations.filter(v => v.status === 'pending').length,
    resolved: violations.filter(v => v.status === 'resolved').length,
    byCategory: {
      C1: violations.filter(v => v.category === 'C1').length,
      C2: violations.filter(v => v.category === 'C2').length,
      C3: violations.filter(v => v.category === 'C3').length,
      C4: violations.filter(v => v.category === 'C4').length,
      C5: violations.filter(v => v.category === 'C5').length,
    }
  };

  const handleAddRemark = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Замечание добавлено');
    setIsRemarkDialogOpen(false);
  };

  const handleAddViolation = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Жалоба отправлена');
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Нарушения и дисциплина
          </h1>
          <p className="text-muted-foreground mt-1">
            Учёт нарушений и замечаний учеников
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isRemarkDialogOpen} onOpenChange={setIsRemarkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <MessageCircleWarning className="w-4 h-4" />
                Замечание
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новое замечание</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddRemark} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Ученик</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите ученика" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Каримова Аружан</SelectItem>
                      <SelectItem value="2">Исмоилов Мурод</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Замечание</Label>
                  <Textarea placeholder="Опишите замечание..." rows={3} />
                </div>
                <Button type="submit" className="w-full">Добавить замечание</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Сообщить о нарушении
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Новое нарушение</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddViolation} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ученик</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите ученика" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Каримова Аружан</SelectItem>
                        <SelectItem value="2">Исмоилов Мурод</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Категория (C1-C5)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryDescriptions).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            <div>
                              <span className="font-medium">{key}</span>
                              <span className="text-xs text-muted-foreground ml-2">{value.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Тип нарушения</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="late">Опоздание</SelectItem>
                        <SelectItem value="disruptive">Нарушение дисциплины</SelectItem>
                        <SelectItem value="absence">Прогул</SelectItem>
                        <SelectItem value="phone">Использование телефона</SelectItem>
                        <SelectItem value="conflict">Конфликт</SelectItem>
                        <SelectItem value="other">Другое</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Место</Label>
                    <Input placeholder="Кабинет, столовая и т.д." />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Дата</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Время</Label>
                    <Input type="time" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Описание инцидента</Label>
                  <Textarea placeholder="Опишите что произошло..." rows={3} />
                </div>

                <div className="space-y-2">
                  <Label>Принятые меры</Label>
                  <Textarea placeholder="Какие меры были приняты..." rows={2} />
                </div>

                <div className="space-y-2">
                  <Label>Доказательства</Label>
                  <Button type="button" variant="outline" className="w-full gap-2">
                    <Camera className="w-4 h-4" />
                    Прикрепить фото/видео
                  </Button>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Отправить
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Отмена
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards with Categories */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(categoryDescriptions).map(([key, value]) => (
          <Card 
            key={key} 
            className={`p-3 cursor-pointer transition-all hover:scale-105 ${categoryFilter === key ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setCategoryFilter(categoryFilter === key ? 'all' : key)}
          >
            <div className="text-xl font-bold">{stats.byCategory[key as ViolationCategory]}</div>
            <div className="text-xs text-muted-foreground">{key}</div>
            <Badge className={`text-xs mt-1 ${value.color}`}>{value.label.split(' - ')[1]}</Badge>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Всего нарушений</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <div className="text-2xl font-bold text-warning">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">На рассмотрении</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <div className="text-2xl font-bold text-success">{stats.resolved}</div>
          <div className="text-sm text-muted-foreground">Решено</div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="violations">Нарушения ({violations.length})</TabsTrigger>
          <TabsTrigger value="remarks">Замечания ({remarks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="violations" className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Поиск по имени или типу..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {Object.entries(categoryDescriptions).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">На рассмотрении</SelectItem>
                  <SelectItem value="resolved">Решено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Violations List */}
          <div className="space-y-3">
            {filteredViolations.map((violation) => {
              const categoryConfig = getCategoryConfig(violation.category);
              const statusConfig = getStatusConfig(violation.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card 
                  key={violation.id} 
                  className="p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedViolation(violation)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${categoryConfig.color}`}>
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{violation.studentName}</h3>
                          <p className="text-sm text-muted-foreground">{violation.studentGroup}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={categoryConfig.color}>{violation.category}</Badge>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm font-medium mt-2">{violation.type}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{violation.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(violation.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {violation.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {violation.location}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              );
            })}

            {filteredViolations.length === 0 && (
              <Card className="p-12 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Нарушения не найдены</h3>
                <p className="text-muted-foreground">Попробуйте изменить фильтры поиска</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="remarks" className="space-y-4">
          <div className="space-y-3">
            {remarks.map((remark) => (
              <Card key={remark.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <MessageCircleWarning className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{remark.studentName}</h3>
                        <p className="text-xs text-muted-foreground">{remark.studentGroup}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(remark.date)}</span>
                    </div>
                    <p className="text-sm mt-2">{remark.remark}</p>
                    <p className="text-xs text-muted-foreground mt-1">Учитель: {remark.reportedBy}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Violation Detail Modal */}
      <Dialog open={!!selectedViolation} onOpenChange={(open) => !open && setSelectedViolation(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedViolation && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Детали нарушения
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Student Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedViolation.studentName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedViolation.studentGroup} • {selectedViolation.studentId}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getCategoryConfig(selectedViolation.category).color}>
                      {selectedViolation.category}
                    </Badge>
                    <Badge className={getStatusConfig(selectedViolation.status).color}>
                      {getStatusConfig(selectedViolation.status).label}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Incident Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Тип нарушения</Label>
                    <p className="font-medium">{selectedViolation.type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Место</Label>
                    <p className="font-medium">{selectedViolation.location}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Дата и время</Label>
                    <p className="font-medium">{formatDate(selectedViolation.date)} в {selectedViolation.time}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Сообщил</Label>
                    <p className="font-medium">{selectedViolation.reportedBy}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Описание</Label>
                  <p className="mt-1">{selectedViolation.description}</p>
                </div>

                {selectedViolation.involvedParties && (
                  <div>
                    <Label className="text-muted-foreground">Участники</Label>
                    <p className="mt-1">{selectedViolation.involvedParties}</p>
                  </div>
                )}

                {selectedViolation.actionTaken && (
                  <div>
                    <Label className="text-muted-foreground">Принятые меры</Label>
                    <p className="mt-1">{selectedViolation.actionTaken}</p>
                  </div>
                )}

                {selectedViolation.preventiveMeasures && (
                  <div>
                    <Label className="text-muted-foreground">Профилактические меры</Label>
                    <p className="mt-1">{selectedViolation.preventiveMeasures}</p>
                  </div>
                )}

                {selectedViolation.studentResponse && (
                  <div>
                    <Label className="text-muted-foreground">Объяснение ученика</Label>
                    <p className="mt-1 italic">"{selectedViolation.studentResponse}"</p>
                  </div>
                )}

                {selectedViolation.teacherComment && (
                  <div>
                    <Label className="text-muted-foreground">Комментарий учителя</Label>
                    <p className="mt-1">{selectedViolation.teacherComment}</p>
                  </div>
                )}

                {selectedViolation.hasEvidence && (
                  <Badge variant="outline" className="gap-1">
                    <Camera className="w-3 h-3" />
                    Есть доказательства
                  </Badge>
                )}

                <div className="flex gap-2 pt-4">
                  {selectedViolation.status === 'pending' && (
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        setViolations(prev => prev.map(v => 
                          v.id === selectedViolation.id ? { ...v, status: 'resolved' } : v
                        ));
                        setSelectedViolation(null);
                        toast.success('Нарушение помечено как решённое');
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Отметить как решённое
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedViolation(null)}>
                    Закрыть
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Violations;