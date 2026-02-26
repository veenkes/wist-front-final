import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { 
  Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, 
  Building, Users, BookOpen, Award, Clock, FileText
} from 'lucide-react';
import { Teacher } from '@/hooks/useTeachers';
import { useTheme } from '@/contexts/ThemeContext';
import { format } from 'date-fns';

interface TeacherDetailModalProps {
  teacher: Teacher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeacherDetailModal({ teacher, open, onOpenChange }: TeacherDetailModalProps) {
  const { t } = useTheme();

  if (!teacher) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'on_leave': return 'bg-orange-500';
      case 'former': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case 'teacher': return 'Teacher';
      case 'senior_teacher': return 'Senior Teacher';
      case 'coordinator': return 'Coordinator';
      case 'hod': return 'Head of Department';
      default: return role || 'Teacher';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={teacher.photo_url || ''} />
              <AvatarFallback className="text-lg bg-primary/10">
                {teacher.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{teacher.full_name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${getStatusColor(teacher.status)} text-white`}>
                  {teacher.status.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">{getRoleLabel(teacher.role)}</Badge>
                {teacher.staff_id && (
                  <span className="text-sm text-muted-foreground">ID: {teacher.staff_id}</span>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">{t('teachers.personal')}</TabsTrigger>
            <TabsTrigger value="employment">{t('teachers.employment')}</TabsTrigger>
            <TabsTrigger value="academic">{t('teachers.academic')}</TabsTrigger>
            <TabsTrigger value="schedule">{t('teachers.schedule')}</TabsTrigger>
            <TabsTrigger value="documents">{t('teachers.documents')}</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {t('teachers.personalInfo')}
                </h3>
                <div className="space-y-2 text-sm">
                  {teacher.preferred_name && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('teachers.preferredName')}</span>
                      <span>{teacher.preferred_name}</span>
                    </div>
                  )}
                  {teacher.gender && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('teachers.gender')}</span>
                      <span className="capitalize">{teacher.gender}</span>
                    </div>
                  )}
                  {teacher.date_of_birth && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('teachers.dateOfBirth')}</span>
                      <span>{format(new Date(teacher.date_of_birth), 'PP')}</span>
                    </div>
                  )}
                  {teacher.nationality && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('teachers.nationality')}</span>
                      <span>{teacher.nationality}</span>
                    </div>
                  )}
                  {teacher.passport_number && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('teachers.passportId')}</span>
                      <span>{teacher.passport_number}</span>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t('teachers.contactInfo')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{teacher.email}</span>
                  </div>
                  {teacher.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{teacher.phone}</span>
                    </div>
                  )}
                  {(teacher.address_line1 || teacher.city) && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        {teacher.address_line1 && <p>{teacher.address_line1}</p>}
                        {teacher.address_line2 && <p>{teacher.address_line2}</p>}
                        {teacher.city && <p>{teacher.city}, {teacher.country} {teacher.postal_code}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employment" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {t('teachers.employmentDetails')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('teachers.employmentType')}</span>
                    <span className="capitalize">{teacher.employment_type?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('teachers.role')}</span>
                    <span>{getRoleLabel(teacher.role)}</span>
                  </div>
                  {teacher.department && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('teachers.department')}</span>
                      <span>{teacher.department}</span>
                    </div>
                  )}
                  {teacher.staff_category && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('teachers.staffCategory')}</span>
                      <span className="capitalize">{teacher.staff_category}</span>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('teachers.dates')}
                </h3>
                <div className="space-y-2 text-sm">
                  {teacher.hiring_date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('teachers.hiringDate')}</span>
                      <span>{format(new Date(teacher.hiring_date), 'PP')}</span>
                    </div>
                  )}
                  {teacher.end_date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('teachers.endDate')}</span>
                      <span>{format(new Date(teacher.end_date), 'PP')}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  {t('teachers.qualifications')}
                </h3>
                <div className="space-y-2 text-sm">
                  {teacher.certification_level && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('teachers.certificationLevel')}</span>
                      <span>{teacher.certification_level}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('teachers.senExpertise')}</span>
                    <span>{teacher.sen_expertise ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                {teacher.subject_specialization && teacher.subject_specialization.length > 0 && (
                  <div className="mt-3">
                    <span className="text-muted-foreground text-sm">{t('teachers.subjects')}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {teacher.subject_specialization.map((subject, i) => (
                        <Badge key={i} variant="secondary">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {t('teachers.schoolInfo')}
                </h3>
                <div className="space-y-2 text-sm">
                  {teacher.school_division && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('teachers.schoolDivision')}</span>
                      <span className="capitalize">{teacher.school_division.replace('_', ' ')}</span>
                    </div>
                  )}
                  {teacher.house_division && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('teachers.houseDivision')}</span>
                      <span>{teacher.house_division}</span>
                    </div>
                  )}
                  {teacher.teaching_load && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('teachers.teachingLoad')}</span>
                      <span>{teacher.teaching_load}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {t('teachers.assignedClasses')}
                </h3>
                {teacher.assigned_classes && teacher.assigned_classes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {teacher.assigned_classes.map((cls, i) => (
                      <Badge key={i} variant="outline">{cls}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('common.noData')}</p>
                )}
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {t('teachers.yearGroups')}
                </h3>
                {teacher.assigned_year_groups && teacher.assigned_year_groups.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {teacher.assigned_year_groups.map((year, i) => (
                      <Badge key={i} variant="outline">Year {year}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('common.noData')}</p>
                )}
              </Card>

              {teacher.tutor_group && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {t('teachers.tutorGroup')}
                  </h3>
                  <Badge>{teacher.tutor_group}</Badge>
                </Card>
              )}

              {teacher.home_room && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    {t('teachers.homeRoom')}
                  </h3>
                  <span>{teacher.home_room}</span>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t('teachers.documents')}
              </h3>
              {teacher.documents && teacher.documents.length > 0 ? (
                <div className="space-y-2">
                  {teacher.documents.map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span>{doc.name || 'Document'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t('common.noDocuments')}</p>
              )}
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                {t('teachers.trainingRecords')}
              </h3>
              {teacher.training_records && teacher.training_records.length > 0 ? (
                <div className="space-y-2">
                  {teacher.training_records.map((record: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span>{record.name || 'Training'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t('common.noData')}</p>
              )}
            </Card>

            {teacher.notes && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">{t('teachers.notes')}</h3>
                <p className="text-sm">{teacher.notes}</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
