import { useState } from 'react';
import { Home, Calendar, CreditCard, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import ParentHome from './ParentHome';
import ParentAttendance from './ParentAttendance';
import ParentPayments from './ParentPayments';
import ParentProfile from './ParentProfile';

type Tab = 'home' | 'attendance' | 'payments' | 'profile';

const ParentPortal = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const tabs = [
    { id: 'home' as Tab, label: 'Главная', icon: Home },
    { id: 'attendance' as Tab, label: 'Посещения', icon: Calendar },
    { id: 'payments' as Tab, label: 'Оплата', icon: CreditCard },
    { id: 'profile' as Tab, label: 'Профиль', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <ParentHome />;
      case 'attendance':
        return <ParentAttendance />;
      case 'payments':
        return <ParentPayments />;
      case 'profile':
        return <ParentProfile />;
      default:
        return <ParentHome />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[420px] mx-auto relative font-inter">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-card border-t border-border shadow-widget z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full min-w-[64px] py-2 transition-smooth relative",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon 
                  className={cn(
                    "w-5 h-5 mb-1 transition-all duration-200",
                    isActive && "scale-110"
                  )} 
                />
                <span className={cn(
                  "text-[10px] font-medium",
                  isActive && "font-semibold"
                )}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default ParentPortal;
