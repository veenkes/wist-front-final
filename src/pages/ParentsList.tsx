import React, { useState } from 'react';
import { Search, Users, Phone, Mail, MapPin, User, Briefcase, Eye, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useParents } from '@/hooks/useParents';
import { AddParentModal } from '@/components/modals/AddParentModal';
import { toast } from 'sonner';

// Sample parents data
const sampleParents = [
  {
    id: 'sp1',
    full_name: 'Каримова Малика Рустамовна',
    phone: '+998 90 123 45 67',
    email: 'malika.karimova@mail.uz',
    address: 'Ташкент, ул. Навои 15, кв. 42',
    occupation: 'Бухгалтер в IT компании',
    children: [
      { id: 'c1', name: 'Каримова Аружан', group: '8A класс' },
      { id: 'c2', name: 'Каримов Азиз', group: '5B класс' }
    ]
  },
  {
    id: 'sp2',
    full_name: 'Исмоилов Рустам Шухратович',
    phone: '+998 90 234 56 78',
    email: 'rustam.ismoilov@gmail.com',
    address: 'Ташкент, Мирзо-Улугбекский р-н, 45',
    occupation: 'Директор ООО "СтройИнвест"',
    children: [
      { id: 'c3', name: 'Исмоилов Мурод', group: '5B класс' }
    ]
  },
  {
    id: 'sp3',
    full_name: 'Турсунова Нигора Алишеровна',
    phone: '+998 90 345 67 89',
    email: 'nigora.tursunova@yahoo.com',
    address: 'Ташкент, ул. Бабура 78',
    occupation: 'Врач-терапевт',
    children: [
      { id: 'c4', name: 'Турсунова Лола', group: '10A класс' }
    ]
  },
  {
    id: 'sp4',
    full_name: 'Расулов Бахтиёр Камолович',
    phone: '+998 90 456 78 90',
    email: 'bakhtiyor.rasulov@mail.ru',
    address: 'Ташкент, Чиланзарский р-н, кв. 156',
    occupation: 'Инженер на заводе',
    children: [
      { id: 'c5', name: 'Расулов Бекзод', group: '2A класс' }
    ]
  },
  {
    id: 'sp5',
    full_name: 'Ахмедова Дилором Файзуллаевна',
    phone: '+998 90 567 89 01',
    email: 'dilorom.akhmedova@gmail.com',
    address: 'Ташкент, Юнусабадский р-н, 34',
    occupation: 'Преподаватель университета',
    children: [
      { id: 'c6', name: 'Ахмедова Дилноза', group: '7B класс' },
      { id: 'c7', name: 'Ахмедов Жасур', group: '4A класс' }
    ]
  },
  {
    id: 'sp6',
    full_name: 'Юсупов Шерзод Абдуллаевич',
    phone: '+998 90 678 90 12',
    email: 'sherzod.yusupov@company.uz',
    address: 'Ташкент, ул. Амира Темура 112',
    occupation: 'Менеджер банка',
    children: [
      { id: 'c8', name: 'Юсупов Тимур', group: '9A класс' }
    ]
  }
];

export const ParentsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const { parents: dbParents, isLoading } = useParents();

  // Combine sample parents with database parents
  const allParents = [...sampleParents, ...dbParents.map(p => ({
    ...p,
    children: p.children || []
  }))];

  const filteredParents = allParents.filter(parent =>
    parent.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.children?.some(child => child.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewProfile = (parentId: string) => {
    toast.info(`Просмотр профиля родителя`);
  };

  const handleEdit = (parentId: string) => {
    toast.info(`Редактирование родителя`);
  };

  const handleContact = (phone: string) => {
    window.open(`tel:${phone.replace(/\s/g, '')}`);
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Список родителей
          </h1>
          <p className="text-muted-foreground mt-1">
            Полный справочник родителей и опекунов ({filteredParents.length})
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <User className="w-4 h-4 mr-2" />
          Добавить родителя
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Поиск по имени родителя или ребёнка..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Parents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredParents.map((parent) => (
          <Card key={parent.id} className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
                  {parent.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{parent.full_name}</h3>
                {parent.occupation && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="w-3 h-3" />
                    <span>{parent.occupation}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleViewProfile(parent.id)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(parent.id)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {/* Contact Information */}
              <div className="space-y-2">
                <div 
                  className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleContact(parent.phone)}
                >
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{parent.phone}</span>
                </div>
                <div 
                  className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleEmail(parent.email || '')}
                >
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{parent.email || 'Нет email'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{parent.address || 'Адрес не указан'}</span>
                </div>
              </div>

              {/* Children */}
              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Дети ({parent.children?.length || 0}):
                  </span>
                </div>
                <div className="space-y-2">
                  {parent.children && parent.children.length > 0 ? (
                    parent.children.map((child) => (
                      <div 
                        key={child.id} 
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="font-medium text-sm">{child.name}</p>
                          <p className="text-xs text-muted-foreground">{child.group}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">Профиль</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Нет привязанных детей</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredParents.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Родители не найдены</h3>
          <p className="text-muted-foreground">Попробуйте изменить поисковый запрос</p>
        </Card>
      )}

      <AddParentModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
};

export default ParentsList;