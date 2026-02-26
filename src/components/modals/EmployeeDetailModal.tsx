import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Mail, Phone, DollarSign, Calendar, Ban, CheckCircle, Trash2, Edit, Save, X } from 'lucide-react';
import { format } from 'date-fns';

interface EmployeeDetailModalProps {
  open: boolean;
  onClose: () => void;
  employee: any;
  onUpdate: () => void;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  open,
  onClose,
  employee,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    full_name: employee.full_name,
    email: employee.email,
    phone: employee.phone || '',
    salary: employee.salary || '',
    payment_schedule: employee.payment_schedule || 'monthly',
    role: employee.role,
    permissions: employee.permissions || {
      edit_students: false,
      access_payments: false,
      access_expenses: false,
      send_notifications: false,
      access_events: false,
      access_activity_log: false,
      financial_access: 'none',
    },
  });

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('employees')
        .update({ status: newStatus })
        .eq('id', employee.id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Статус сотрудника обновлен',
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось обновить статус',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update employee data
      const { error: employeeError } = await supabase
        .from('employees')
        .update({
          full_name: editedData.full_name,
          email: editedData.email,
          phone: editedData.phone || null,
          salary: editedData.salary ? parseFloat(editedData.salary.toString()) : null,
          payment_schedule: editedData.payment_schedule,
          permissions: editedData.permissions,
        })
        .eq('id', employee.id);

      if (employeeError) throw employeeError;

      // Update role
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: editedData.role })
        .eq('user_id', employee.user_id);

      if (roleError) throw roleError;

      toast({
        title: 'Успешно',
        description: 'Данные сотрудника обновлены',
      });

      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось обновить данные',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить этого сотрудника? Это действие нельзя отменить.')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employee.id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Сотрудник удален',
      });

      onClose();
      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось удалить сотрудника',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Детали сотрудника</DialogTitle>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-2">
                <Edit size={16} />
                Редактировать
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" disabled={loading} className="gap-2">
                  <Save size={16} />
                  Сохранить
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="gap-2">
                  <X size={16} />
                  Отмена
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={employee.avatar_url || undefined} />
              <AvatarFallback className="text-xl">
                {employee.full_name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                {isEditing ? (
                  <Input
                    value={editedData.full_name}
                    onChange={(e) => setEditedData({ ...editedData, full_name: e.target.value })}
                    className="text-2xl font-bold max-w-md"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{employee.full_name}</h2>
                )}
                <Badge variant={employee.status === 'active' ? 'default' : 'destructive'}>
                  {employee.status}
                </Badge>
              </div>
              {isEditing ? (
                <Select
                  value={editedData.role}
                  onValueChange={(value) => setEditedData({ ...editedData, role: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className="mb-2">{employee.role?.toUpperCase()}</Badge>
              )}
            </div>
          </div>

          <Tabs defaultValue="information" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="information">Информация</TabsTrigger>
              <TabsTrigger value="permissions">Разрешения</TabsTrigger>
              <TabsTrigger value="actions">Действия</TabsTrigger>
            </TabsList>

            <TabsContent value="information" className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Mail size={18} />
                  Контактная информация
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label>Email</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editedData.email}
                        onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Mail size={14} className="text-muted-foreground" />
                        <span>{employee.email}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Телефон</Label>
                    {isEditing ? (
                      <Input
                        value={editedData.phone}
                        onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Phone size={14} className="text-muted-foreground" />
                        <span>{employee.phone || 'Не указан'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign size={18} />
                  Финансовая информация
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label>Зарплата</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedData.salary}
                        onChange={(e) => setEditedData({ ...editedData, salary: e.target.value })}
                      />
                    ) : (
                      <div className="text-lg font-medium mt-1">
                        {employee.salary ? `$${employee.salary.toLocaleString()}` : 'Не указана'}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>График выплат</Label>
                    {isEditing ? (
                      <Select
                        value={editedData.payment_schedule}
                        onValueChange={(value) => setEditedData({ ...editedData, payment_schedule: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Еженедельно</SelectItem>
                          <SelectItem value="bi-weekly">Раз в две недели</SelectItem>
                          <SelectItem value="monthly">Ежемесячно</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-1 capitalize">{employee.payment_schedule || 'Не указан'}</div>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar size={18} />
                  Информация об аккаунте
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Создан:</span>
                    <span className="font-medium">
                      {format(new Date(employee.created_at), 'dd MMM yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Статус:</span>
                    <Badge variant={employee.status === 'active' ? 'default' : 'destructive'}>
                      {employee.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Права доступа</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit_students"
                      checked={editedData.permissions.edit_students}
                      onCheckedChange={(checked) =>
                        setEditedData({
                          ...editedData,
                          permissions: { ...editedData.permissions, edit_students: checked as boolean },
                        })
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="edit_students" className="font-normal">
                      Редактировать данные студентов
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="access_payments"
                      checked={editedData.permissions.access_payments}
                      onCheckedChange={(checked) =>
                        setEditedData({
                          ...editedData,
                          permissions: { ...editedData.permissions, access_payments: checked as boolean },
                        })
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="access_payments" className="font-normal">
                      Доступ к платежам
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="access_expenses"
                      checked={editedData.permissions.access_expenses}
                      onCheckedChange={(checked) =>
                        setEditedData({
                          ...editedData,
                          permissions: { ...editedData.permissions, access_expenses: checked as boolean },
                        })
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="access_expenses" className="font-normal">
                      Доступ к расходам
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="send_notifications"
                      checked={editedData.permissions.send_notifications}
                      onCheckedChange={(checked) =>
                        setEditedData({
                          ...editedData,
                          permissions: { ...editedData.permissions, send_notifications: checked as boolean },
                        })
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="send_notifications" className="font-normal">
                      Отправлять уведомления
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="access_events"
                      checked={editedData.permissions.access_events}
                      onCheckedChange={(checked) =>
                        setEditedData({
                          ...editedData,
                          permissions: { ...editedData.permissions, access_events: checked as boolean },
                        })
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="access_events" className="font-normal">
                      Доступ к событиям
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="access_activity_log"
                      checked={editedData.permissions.access_activity_log}
                      onCheckedChange={(checked) =>
                        setEditedData({
                          ...editedData,
                          permissions: { ...editedData.permissions, access_activity_log: checked as boolean },
                        })
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="access_activity_log" className="font-normal">
                      Доступ к журналу активности
                    </Label>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Label>Доступ к финансам</Label>
                  <Select
                    value={editedData.permissions.financial_access}
                    onValueChange={(value) =>
                      setEditedData({
                        ...editedData,
                        permissions: { ...editedData.permissions, financial_access: value },
                      })
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Нет доступа</SelectItem>
                      <SelectItem value="view_only">Только просмотр</SelectItem>
                      <SelectItem value="limited">Ограниченный</SelectItem>
                      <SelectItem value="full">Полный доступ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-3">
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold mb-3">Действия с сотрудником</h3>
                
                {employee.status === 'active' ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => handleStatusChange('suspended')}
                    disabled={loading}
                  >
                    <Ban size={18} />
                    Приостановить сотрудника
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => handleStatusChange('active')}
                    disabled={loading}
                  >
                    <CheckCircle size={18} />
                    Активировать сотрудника
                  </Button>
                )}

                <Button
                  variant="destructive"
                  className="w-full justify-start gap-2"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <Trash2 size={18} />
                  Удалить сотрудника
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailModal;
