import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Phone, Mail, Loader2, AlertCircle,
  Edit, MoreHorizontal, MapPin, User, GraduationCap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/hooks/useStudents';
import { format, differenceInYears } from 'date-fns';
import { PersonalInfoTab } from '@/components/student-profile/PersonalInfoTab';
import { ParentsTab } from '@/components/student-profile/ParentsTab';
import { CaretakersTab } from '@/components/student-profile/CaretakersTab';
import { PaymentsTab } from '@/components/student-profile/PaymentsTab';
import { AttendanceTab } from '@/components/student-profile/AttendanceTab';
import { ViolationsTab } from '@/components/student-profile/ViolationsTab';
import { DocumentsTab } from '@/components/student-profile/DocumentsTab';
import { GradesTab } from '@/components/student-profile/GradesTab';
import { ScheduleTab } from '@/components/student-profile/ScheduleTab';
import { ReportsTab } from '@/components/student-profile/ReportsTab';

// Mock students
const MOCK_STUDENTS: Record<string, any> = {
  '1': { id: '1', full_name: 'Ivanov Alex', date_of_birth: '2010-03-15', gender: 'male', phone: '+998901001001', email: 'ivanov@school.uz', address: 'Tashkent, Navoi St. 12, apt. 5', id_passport_number: 'AB1234567', status: 'active', enrollment_date: '2023-09-01', academic_level: 'Year 8', notes: 'Active student, participates in maths olympiads', group: 'Group 8A', parentName: 'Ivanova Svetlana', parentPhone: '+998901234567', parentEmail: 'ivanova.s@mail.uz', parentOccupation: 'Accountant' },
  '2': { id: '2', full_name: 'Petrova Maria', date_of_birth: '2013-07-22', gender: 'female', phone: '+998901001002', email: 'petrova@school.uz', address: 'Tashkent, Mirzo Ulugbek St. 45', id_passport_number: 'AB2345678', status: 'active', enrollment_date: '2023-09-01', academic_level: 'Year 5', notes: 'Good academic performance, enjoys drawing', group: 'Group 5B', parentName: 'Petrova Olga', parentPhone: '+998901234568', parentEmail: 'petrova.o@mail.uz', parentOccupation: 'Teacher' },
  '3': { id: '3', full_name: 'Sidorov Dmitry', date_of_birth: '2008-11-30', gender: 'male', phone: '+998901001003', email: 'sidorov@school.uz', address: 'Tashkent, Babur St. 78', id_passport_number: 'AB3456789', status: 'active', enrollment_date: '2022-09-01', academic_level: 'Year 10', notes: 'Preparing for university, physics profile', group: 'Group 10A', parentName: 'Sidorova Natalia', parentPhone: '+998901234569', parentEmail: 'sidorova.n@mail.uz', parentOccupation: 'Doctor' },
  '4': { id: '4', full_name: 'Kozlova Anna', date_of_birth: '2016-01-10', gender: 'female', phone: '+998901001004', email: null, address: 'Tashkent, Farabi St. 33', id_passport_number: 'AB4567890', status: 'active', enrollment_date: '2024-09-01', academic_level: 'Year 2', notes: null, group: 'Group 2A', parentName: 'Kozlova Elena', parentPhone: '+998901234570', parentEmail: 'kozlova.e@mail.uz', parentOccupation: 'Designer' },
  '5': { id: '5', full_name: 'Novikov Andrew', date_of_birth: '2011-05-18', gender: 'male', phone: '+998901001005', email: 'novikov@school.uz', address: 'Tashkent, Shota Rustaveli St. 91', id_passport_number: 'AB5678901', status: 'active', enrollment_date: '2023-09-01', academic_level: 'Year 7', notes: 'Captain of the school football team', group: 'Group 7B', parentName: 'Novikova Marina', parentPhone: '+998901234571', parentEmail: 'novikova.m@mail.uz', parentOccupation: 'Manager' },
  '6': { id: '6', full_name: 'Morozova Elena', date_of_birth: '2010-09-05', gender: 'female', phone: '+998901001006', email: 'morozova@school.uz', address: 'Tashkent, Amir Temur St. 56', id_passport_number: 'AB6789012', status: 'active', enrollment_date: '2023-09-01', academic_level: 'Year 8', notes: 'Winner of city biology olympiad', group: 'Group 8A', parentName: 'Morozova Irina', parentPhone: '+998901234572', parentEmail: 'morozova.i@mail.uz', parentOccupation: 'Engineer' },
  '7': { id: '7', full_name: 'Volkov Sergey', date_of_birth: '2013-12-14', gender: 'male', phone: '+998901001007', email: null, address: 'Tashkent, Istiqbol St. 22', id_passport_number: 'AB7890123', status: 'debt', enrollment_date: '2023-09-01', academic_level: 'Year 5', notes: 'Outstanding tuition debt for 2 months', group: 'Group 5B', parentName: 'Volkova Anna', parentPhone: '+998901234573', parentEmail: 'volkova.a@mail.uz', parentOccupation: 'Sales' },
  '8': { id: '8', full_name: 'Sokolova Olga', date_of_birth: '2008-06-28', gender: 'female', phone: '+998901001008', email: 'sokolova@school.uz', address: 'Tashkent, Mukimi St. 15', id_passport_number: 'AB8901234', status: 'active', enrollment_date: '2022-09-01', academic_level: 'Year 10', notes: 'Top student, preparing for medical faculty', group: 'Group 10A', parentName: 'Sokolova Tatiana', parentPhone: '+998901234574', parentEmail: 'sokolova.t@mail.uz', parentOccupation: 'Lawyer' },
  '9': { id: '9', full_name: 'Lebedev Maxim', date_of_birth: '2016-04-03', gender: 'male', phone: null, email: null, address: 'Tashkent, Katta Darvoza St. 8', id_passport_number: 'AB9012345', status: 'active', enrollment_date: '2024-09-01', academic_level: 'Year 2', notes: null, group: 'Group 2A', parentName: 'Lebedeva Yulia', parentPhone: '+998901234575', parentEmail: 'lebedeva.y@mail.uz', parentOccupation: 'Economist' },
  '10': { id: '10', full_name: 'Egorova Daria', date_of_birth: '2011-08-20', gender: 'female', phone: '+998901001010', email: 'egorova@school.uz', address: 'Tashkent, Buyuk Ipak Yuli St. 67', id_passport_number: 'AB0123456', status: 'active', enrollment_date: '2023-09-01', academic_level: 'Year 7', notes: 'Studies dance, represents school in competitions', group: 'Group 7B', parentName: 'Egorova Nadezhda', parentPhone: '+998901234576', parentEmail: 'egorova.n@mail.uz', parentOccupation: 'Lecturer' },
  '11': { id: '11', full_name: 'Vasiliev Nikita', date_of_birth: '2010-02-11', gender: 'male', phone: '+998901001011', email: 'vasiliev@school.uz', address: 'Tashkent, Chilanzar 14/3', id_passport_number: 'AC1234567', status: 'active', enrollment_date: '2023-09-01', academic_level: 'Year 8', notes: 'Interested in programming', group: 'Group 8A', parentName: 'Vasilieva Maria', parentPhone: '+998901234577', parentEmail: 'vasilieva.m@mail.uz', parentOccupation: 'Programmer' },
  '12': { id: '12', full_name: 'Pavlova Sofia', date_of_birth: '2013-10-25', gender: 'female', phone: '+998901001012', email: null, address: 'Tashkent, Yunusabad 4/7', id_passport_number: 'AC2345678', status: 'active', enrollment_date: '2023-09-01', academic_level: 'Year 5', notes: 'Loves reading, participates in literature club', group: 'Group 5B', parentName: 'Pavlova Veronika', parentPhone: '+998901234578', parentEmail: 'pavlova.v@mail.uz', parentOccupation: 'Journalist' },
  '13': { id: '13', full_name: 'Fedorov Ilya', date_of_birth: '2008-04-17', gender: 'male', phone: '+998901001013', email: 'fedorov@school.uz', address: 'Tashkent, Bektemir St. 23', id_passport_number: 'AC3456789', status: 'suspended', enrollment_date: '2022-09-01', academic_level: 'Year 10', notes: 'Temporarily suspended for disciplinary reasons', group: 'Group 10A', parentName: 'Fedorova Oksana', parentPhone: '+998901234579', parentEmail: 'fedorova.o@mail.uz', parentOccupation: 'Architect' },
  '14': { id: '14', full_name: 'Mikhailova Victoria', date_of_birth: '2016-06-09', gender: 'female', phone: null, email: null, address: 'Tashkent, Sergeli 5/12', id_passport_number: 'AC4567890', status: 'active', enrollment_date: '2024-09-01', academic_level: 'Year 2', notes: null, group: 'Group 2A', parentName: 'Mikhailova Daria', parentPhone: '+998901234580', parentEmail: 'mihaylova.d@mail.uz', parentOccupation: 'Pharmacist' },
  '15': { id: '15', full_name: 'Alekseev Artem', date_of_birth: '2011-12-01', gender: 'male', phone: '+998901001015', email: 'alekseev@school.uz', address: 'Tashkent, Mirabad St. 41', id_passport_number: 'AC5678901', status: 'active', enrollment_date: '2023-09-01', academic_level: 'Year 7', notes: 'Plays chess, 2nd category', group: 'Group 7B', parentName: 'Alekseeva Lyudmila', parentPhone: '+998901234581', parentEmail: 'alekseeva.l@mail.uz', parentOccupation: 'Bank employee' },
  'sample-1': { id: 'sample-1', full_name: 'Aruzhan Karimova', date_of_birth: '2015-03-15', gender: 'female', phone: '+998 90 123 45 67', email: 'aruzhan@example.com', address: 'Tashkent, Mirzo Ulugbek district', id_passport_number: 'AD1234567', status: 'active', enrollment_date: '2023-09-01', academic_level: 'Year 8', notes: 'Excellent student, participates in school events', group: 'Group A (Year 8)', parentName: 'Karim Karimov', parentPhone: '+998 90 111 22 33', parentEmail: 'karim@example.com', parentOccupation: 'Engineer', parent2Name: 'Madina Karimova', parent2Phone: '+998 90 444 55 66', parent2Relation: 'Mother' },
  'sample-2': { id: 'sample-2', full_name: 'Murod Ismoilov', date_of_birth: '2018-07-22', gender: 'male', phone: '+998 91 234 56 78', email: 'murod@example.com', address: 'Tashkent, Chilanzar district', id_passport_number: 'AD2345678', status: 'active', enrollment_date: '2023-09-01', academic_level: 'Year 5', notes: null, group: 'Group B (Year 5)', parentName: 'Ismoil Ismoilov', parentPhone: '+998 91 777 88 99', parentEmail: 'ismoil@example.com', parentOccupation: 'Teacher' },
  'sample-3': { id: 'sample-3', full_name: 'Lola Tursunova', date_of_birth: '2008-11-10', gender: 'female', phone: '+998 93 345 67 89', email: 'lola@example.com', address: 'Tashkent, Sergeli district', id_passport_number: 'AD3456789', status: 'debt', enrollment_date: '2022-09-01', academic_level: 'Year 10', notes: 'Has outstanding tuition debt', group: 'Group C (Year 10)', parentName: 'Tursun Tursunov', parentPhone: '+998 93 222 33 44', parentEmail: 'tursun@example.com', parentOccupation: 'Doctor', parent2Name: 'Dilnoza Tursunova', parent2Phone: '+998 93 555 66 77', parent2Relation: 'Mother' },
  'sample-4': { id: 'sample-4', full_name: 'Bekzod Rasulov', date_of_birth: '2021-05-08', gender: 'male', phone: '+998 94 456 78 90', email: null, address: 'Tashkent, Yakkasaray district', id_passport_number: 'AD4567890', status: 'active', enrollment_date: '2024-09-01', academic_level: 'Kindergarten', notes: null, group: 'Group K1 (Kindergarten)', parentName: 'Rasul Rasulov', parentPhone: '+998 94 888 99 00', parentEmail: 'rasul@example.com', parentOccupation: 'Businessman' },
};

const generateMockPayments = (studentId: string) => {
  const months = ['September', 'October', 'November', 'December', 'January', 'February'];
  return months.map((month, i) => ({
    id: `pay-${studentId}-${i}`,
    amount: 1500000,
    payment_type: 'tuition',
    status: i < 4 ? 'paid' : i === 4 ? 'pending' : 'overdue',
    due_date: `2024-${String(9 + i).padStart(2, '0')}-05`,
    payment_date: i < 4 ? `2024-${String(9 + i).padStart(2, '0')}-03` : null,
    payment_method: i < 4 ? (i % 2 === 0 ? 'card' : 'cash') : null,
    notes: month + ' 2024',
  }));
};

const generateMockViolations = (studentId: string, name: string) => {
  const id = parseInt(studentId);
  if (id % 3 !== 0) return [];
  return [
    {
      id: `viol-${studentId}-1`,
      violation_type: 'Tardiness',
      severity: 'low',
      description: `${name} is systematically late for the first lesson`,
      occurred_at: '2024-11-15T08:20:00',
      status: 'resolved',
      corrective_action: 'Meeting held with student and parents',
      location: 'School entrance',
    },
  ];
};

const buildMockStudent = (mock: any) => {
  const now = new Date().toISOString();
  return {
    ...mock,
    created_at: mock.enrollment_date + 'T00:00:00',
    updated_at: now,
    photo_url: null,
    groups: [{ id: `grp-${mock.group}`, name: mock.group }],
    parents: [
      {
        id: `parent-${mock.id}`,
        full_name: mock.parentName,
        phone: mock.parentPhone,
        email: mock.parentEmail,
        occupation: mock.parentOccupation,
        relation_type: 'father',
        is_primary_contact: true,
      },
      ...(mock.parent2Name ? [{
        id: `parent2-${mock.id}`,
        full_name: mock.parent2Name,
        phone: mock.parent2Phone,
        email: null,
        occupation: null,
        relation_type: mock.parent2Relation || 'mother',
        is_primary_contact: false,
      }] : []),
    ],
    caretakers: [],
    payments: generateMockPayments(mock.id),
    violations: generateMockViolations(mock.id, mock.full_name),
    documents: [],
  };
};

export const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const isUUID = id && id.length > 10;
  const { data: dbStudent, isLoading } = useStudent(isUUID ? id : '');

  const student = useMemo(() => {
    if (dbStudent) return dbStudent;
    if (id && MOCK_STUDENTS[id]) return buildMockStudent(MOCK_STUDENTS[id]);
    return null;
  }, [dbStudent, id]);

  if (isLoading && isUUID) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Student Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested student was not found in the system</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border-success/20';
      case 'suspended': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'graduated': return 'bg-primary/10 text-primary border-primary/20';
      case 'debt': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'suspended': return 'Suspended';
      case 'graduated': return 'Graduated';
      case 'debt': return 'Debt';
      default: return status;
    }
  };

  const age = differenceInYears(new Date(), new Date(student.date_of_birth));

  return (
    <div className="space-y-4">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-1.5" />
            Edit
          </Button>
        </div>
      </div>

      {/* Header */}
      <Card className="p-5">
        <div className="flex flex-col lg:flex-row gap-5">
          <Avatar className="w-24 h-24 mx-auto lg:mx-0">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-2xl font-bold">
              {student.full_name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">{student.full_name}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {student.groups?.[0]?.name || student.group || 'No group'} • ID: {student.id}
                </p>
              </div>
              <Badge className={`${getStatusColor(student.status)} text-sm px-3 py-1 self-center lg:self-start`}>
                {getStatusLabel(student.status)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div className="flex items-center gap-2.5 p-2.5 bg-muted/50 rounded-lg">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-[10px] text-muted-foreground">Date of Birth</p>
                  <p className="font-medium text-sm">{format(new Date(student.date_of_birth), 'dd.MM.yyyy')}</p>
                  <p className="text-[10px] text-muted-foreground">{age} years old</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 bg-muted/50 rounded-lg">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-[10px] text-muted-foreground">Phone</p>
                  <p className="font-medium text-sm truncate">{student.phone || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 bg-muted/50 rounded-lg">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-[10px] text-muted-foreground">Email</p>
                  <p className="font-medium text-xs truncate">{student.email || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 bg-muted/50 rounded-lg">
                <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-[10px] text-muted-foreground">Enrolled</p>
                  <p className="font-medium text-sm">{format(new Date(student.enrollment_date), 'dd.MM.yyyy')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 p-1 bg-muted/50">
          <TabsTrigger value="personal" className="flex-1 min-w-[80px] text-xs">Personal</TabsTrigger>
          <TabsTrigger value="parents" className="flex-1 min-w-[80px] text-xs">Parents</TabsTrigger>
          <TabsTrigger value="payments" className="flex-1 min-w-[80px] text-xs">Payments</TabsTrigger>
          <TabsTrigger value="grades" className="flex-1 min-w-[80px] text-xs">Grades</TabsTrigger>
          <TabsTrigger value="attendance" className="flex-1 min-w-[80px] text-xs">Attendance</TabsTrigger>
          <TabsTrigger value="schedule" className="flex-1 min-w-[80px] text-xs">Schedule</TabsTrigger>
          <TabsTrigger value="incidents" className="flex-1 min-w-[80px] text-xs">Incidents</TabsTrigger>
          <TabsTrigger value="reports" className="flex-1 min-w-[80px] text-xs">Reports</TabsTrigger>
          <TabsTrigger value="documents" className="flex-1 min-w-[80px] text-xs">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4">
          <PersonalInfoTab student={student} />
        </TabsContent>

        <TabsContent value="parents" className="mt-4">
          <ParentsTab parents={student.parents || []} />
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <PaymentsTab payments={student.payments || []} />
        </TabsContent>

        <TabsContent value="grades" className="mt-4">
          <GradesTab studentId={student.id} />
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <AttendanceTab studentId={student.id} />
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <ScheduleTab studentId={student.id} />
        </TabsContent>

        <TabsContent value="incidents" className="mt-4">
          <ViolationsTab violations={student.violations || []} />
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <ReportsTab studentId={student.id} studentName={student.full_name} />
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <DocumentsTab documents={student.documents || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentProfile;
