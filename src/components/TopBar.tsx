import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, Sun, Moon, Globe, Search, MessageCircle, AlertTriangle
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const EMERGENCY_TYPES = [
  { value: 'fire', label: '🔥 Пожарная тревога' },
  { value: 'earthquake', label: '🌍 Землетрясение' },
  { value: 'evacuation', label: '🚨 Эвакуация' },
  { value: 'lockdown', label: '🔒 Блокировка здания' },
  { value: 'medical', label: '🏥 Медицинская ЧС' },
  { value: 'other', label: '⚠️ Другое' },
];

const TopBar: React.FC = () => {
  const { theme, language, toggleTheme, toggleLanguage, t } = useTheme();
  const { user } = useAuth();
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState('fire');
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendEmergency = async () => {
    if (!emergencyType) {
      toast.error('Выберите тип чрезвычайной ситуации');
      return;
    }

    setIsSending(true);
    // Simulate sending emergency notification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const typeLabel = EMERGENCY_TYPES.find(t => t.value === emergencyType)?.label || 'Неизвестно';
    toast.success(`🚨 ЭКСТРЕННОЕ УВЕДОМЛЕНИЕ ОТПРАВЛЕНО ВСЕМ ПОЛЬЗОВАТЕЛЯМ!`, {
      description: `Тип: ${typeLabel}. ${emergencyMessage || 'Немедленно следуйте инструкциям по эвакуации.'}`,
      duration: 10000,
    });
    
    setIsSending(false);
    setEmergencyOpen(false);
    setEmergencyMessage('');
  };

  return (
    <>
      <header className="bg-card/90 backdrop-blur-md border-b border-border shadow-card">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Search */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('common.search.placeholder')}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Emergency Button */}
            <Button
              variant="destructive"
              size="sm"
              className="relative gap-1.5 font-semibold"
              onClick={() => setEmergencyOpen(true)}
            >
              <AlertTriangle className="w-4 h-4" />
              SOS
            </Button>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            {/* Language Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleLanguage} className="relative">
              <Globe className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 text-xs font-bold">{language.toUpperCase()}</span>
            </Button>

            {/* Messages */}
            <Button variant="ghost" size="icon" className="relative">
              <MessageCircle className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">3</Badge>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-warning text-warning-foreground">5</Badge>
            </Button>

            {/* User Role Badge */}
            <Badge variant="outline" className="capitalize">{user?.role?.replace('-', ' ')}</Badge>
          </div>
        </div>
      </header>

      {/* Emergency Dialog */}
      <Dialog open={emergencyOpen} onOpenChange={setEmergencyOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Экстренное уведомление
            </DialogTitle>
            <DialogDescription>
              Это уведомление будет немедленно отправлено ВСЕМ пользователям системы — учителям, ученикам, родителям и персоналу.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-xs font-medium text-destructive">⚠️ Используйте только в реальных чрезвычайных ситуациях!</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Тип ЧС</label>
              <Select value={emergencyType} onValueChange={setEmergencyType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EMERGENCY_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Дополнительное сообщение (опционально)</label>
              <Textarea
                value={emergencyMessage}
                onChange={(e) => setEmergencyMessage(e.target.value)}
                placeholder="Например: Немедленно покиньте здание через запасной выход №2..."
                className="min-h-[80px]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setEmergencyOpen(false)} disabled={isSending}>
                Отмена
              </Button>
              <Button
                variant="destructive"
                className="flex-1 font-semibold"
                onClick={handleSendEmergency}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin mr-2" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    ОТПРАВИТЬ ВСЕМ
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TopBar;
