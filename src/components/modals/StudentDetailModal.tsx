import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Student, formatCurrency, mockTransactions } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Download, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  User,
  GraduationCap,
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface StudentDetailModalProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailModal({ student, open, onOpenChange }: StudentDetailModalProps) {
  // Get student's payment history
  const studentPayments = mockTransactions.filter(t => t.studentId === student.id);
  const recentPayments = studentPayments.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'graduated': return 'bg-blue-500';
      case 'suspended': return 'bg-orange-500';
      case 'debt': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAcademicStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'average': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'needs-improvement': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Profile</DialogTitle>
          <DialogDescription>Complete student information and activity</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Header Section */}
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={student.avatar} />
                <AvatarFallback className="text-2xl">
                  {student.name[0]}{student.surname[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {student.name} {student.surname}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      {student.className} • Grade {student.grade} • ID: {student.id}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`${getStatusColor(student.status)} text-white`}>
                      {student.status}
                    </Badge>
                    <Badge className={getAcademicStatusColor(student.academicStatus)}>
                      {student.academicStatus}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">GPA</p>
                        <p className="text-xl font-bold">{student.gpa?.toFixed(2) || 'N/A'}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Attendance</p>
                        <p className="text-xl font-bold">{student.attendance}%</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Balance</p>
                        <p className={`text-xl font-bold ${student.balance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {formatCurrency(student.balance)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabbed Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="parents">Parents</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{student.name} {student.surname}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{student.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{student.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{student.address || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">ID/Passport</p>
                      <p className="font-medium">{student.idPassport || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Enrollment Date</p>
                      <p className="font-medium">{new Date(student.enrollmentDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Academic Status</p>
                      <Badge className={getAcademicStatusColor(student.academicStatus)}>
                        {student.academicStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {student.notes && (
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Notes</h3>
                  <p className="text-muted-foreground">{student.notes}</p>
                </Card>
              )}
            </TabsContent>

            {/* Academic Tab */}
            <TabsContent value="academic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">GPA</span>
                        <span className="font-semibold">{student.gpa?.toFixed(2)}/5.0</span>
                      </div>
                      <Progress value={(student.gpa || 0) * 20} />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Attendance</span>
                        <span className="font-semibold">{student.attendance}%</span>
                      </div>
                      <Progress value={student.attendance} />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Academic Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Grade</span>
                      <span className="font-semibold">Grade {student.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Class</span>
                      <span className="font-semibold">{student.className}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className={getAcademicStatusColor(student.academicStatus)}>
                        {student.academicStatus}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Progress Timeline</h3>
                <p className="text-muted-foreground text-center py-8">
                  Progress tracking feature coming soon
                </p>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold text-green-500">
                    {formatCurrency(student.totalPaid)}
                  </p>
                </Card>

                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Total Owed</p>
                  <p className="text-2xl font-bold text-red-500">
                    {formatCurrency(student.totalOwed)}
                  </p>
                </Card>

                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className={`text-2xl font-bold ${student.balance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {formatCurrency(student.balance)}
                  </p>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Recent Payments</h3>
                <div className="space-y-3">
                  {recentPayments.length > 0 ? (
                    recentPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{payment.purpose}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.date).toLocaleDateString()} • {payment.paymentSource}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                          <Badge variant="outline">{payment.status}</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No payment history</p>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Parents Tab */}
            <TabsContent value="parents" className="space-y-4">
              {student.parents.map((parent, index) => (
                <Card key={parent.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          {parent.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{parent.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {parent.relationship}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{parent.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{parent.email}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Attached Documents</h3>
                {student.documents && student.documents.length > 0 ? (
                  <div className="space-y-2">
                    {student.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">{doc}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No documents attached</p>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Contact Parents
            </Button>
            <Button>
              Edit Student
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
