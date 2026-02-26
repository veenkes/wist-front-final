import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CEODashboard from './CEODashboard';
import TeacherDashboard from '@/pages/TeacherDashboard';
import Payments from '@/pages/Payments';
import { Expenses } from '@/pages/Expenses';
import { Students } from '@/pages/Students';
import { Events } from '@/pages/Events';
import { Notifications } from '@/pages/Notifications';
import { Support } from '@/pages/Support';
import { Employees } from '@/pages/Employees';
import { Schedule } from '@/pages/Schedule';
import { StudentsList } from '@/pages/StudentsList';
import { ParentsList } from '@/pages/ParentsList';
import { StudentProfile } from '@/pages/StudentProfile';
import { Violations } from '@/pages/Violations';
import { Attendance } from '@/pages/Attendance';
import { Teachers } from '@/pages/Teachers';
import { Grades } from '@/pages/Grades';
import { Reports } from '@/pages/Reports';
import { Library } from '@/pages/Library';

const Layout: React.FC = () => {
  const location = useLocation();

  const renderContent = () => {
    // Check for dynamic routes first
    if (location.pathname.startsWith('/student/')) {
      return <StudentProfile />;
    }

    // Then check static routes
    switch (location.pathname) {
      case '/dashboard':
        return <CEODashboard />;
      case '/teacher-dashboard':
        return <TeacherDashboard />;
      case '/payments':
        return <Payments />;
      case '/expenses':
        return <Expenses />;
      case '/students':
        return <Students />;
      case '/students-list':
        return <StudentsList />;
      case '/parents':
        return <ParentsList />;
      case '/events':
        return <Events />;
      case '/notifications':
        return <Notifications />;
      case '/support':
        return <Support />;
      case '/employees':
        return <Employees />;
      case '/schedule':
        return <Schedule />;
      case '/incidents':
        return <Violations />;
      case '/attendance':
        return <Attendance />;
      case '/grades':
        return <Grades />;
      case '/reports':
        return <Reports />;
      case '/library':
        return <Library />;
      case '/teachers':
        return <Teachers />;
      default:
        return <CEODashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout;