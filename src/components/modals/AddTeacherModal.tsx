import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeachers } from '@/hooks/useTeachers';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

interface AddTeacherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTeacherModal({ open, onOpenChange }: AddTeacherModalProps) {
  const { t } = useTheme();
  const { addTeacher } = useTeachers();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    preferred_name: '',
    staff_id: '',
    gender: '',
    date_of_birth: '',
    nationality: '',
    passport_number: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    country: '',
    postal_code: '',
    status: 'active',
    employment_type: 'full_time',
    role: 'teacher',
    department: '',
    hiring_date: '',
    subject_specialization: '',
    certification_level: '',
    sen_expertise: false,
    school_division: 'secondary',
    teaching_load: '',
    tutor_group: '',
    assigned_classes: '',
    assigned_year_groups: '',
    home_room: '',
    staff_category: 'academic',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email) {
      toast.error(t('teachers.validationError'));
      return;
    }

    setIsSubmitting(true);
    try {
      await addTeacher.mutateAsync({
        ...formData,
        subject_specialization: formData.subject_specialization ? formData.subject_specialization.split(',').map(s => s.trim()) : null,
        assigned_classes: formData.assigned_classes ? formData.assigned_classes.split(',').map(s => s.trim()) : null,
        assigned_year_groups: formData.assigned_year_groups ? formData.assigned_year_groups.split(',').map(s => s.trim()) : null,
        user_id: null,
        photo_url: null,
        address_line3: null,
        end_date: null,
        previous_schools: null,
        house_division: null,
        documents: [],
        training_records: [],
        performance_records: [],
      });
      toast.success(t('teachers.addSuccess'));
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error(t('teachers.addError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      preferred_name: '',
      staff_id: '',
      gender: '',
      date_of_birth: '',
      nationality: '',
      passport_number: '',
      email: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      country: '',
      postal_code: '',
      status: 'active',
      employment_type: 'full_time',
      role: 'teacher',
      department: '',
      hiring_date: '',
      subject_specialization: '',
      certification_level: '',
      sen_expertise: false,
      school_division: 'secondary',
      teaching_load: '',
      tutor_group: '',
      assigned_classes: '',
      assigned_year_groups: '',
      home_room: '',
      staff_category: 'academic',
      notes: '',
    });
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('teachers.addTeacher')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">{t('teachers.generalDetails')}</TabsTrigger>
              <TabsTrigger value="contact">{t('teachers.contactInfo')}</TabsTrigger>
              <TabsTrigger value="employment">{t('teachers.employment')}</TabsTrigger>
              <TabsTrigger value="academic">{t('teachers.academic')}</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">{t('teachers.fullName')} *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => updateField('full_name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred_name">{t('teachers.preferredName')}</Label>
                  <Input
                    id="preferred_name"
                    value={formData.preferred_name}
                    onChange={(e) => updateField('preferred_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff_id">{t('teachers.staffId')}</Label>
                  <Input
                    id="staff_id"
                    value={formData.staff_id}
                    onChange={(e) => updateField('staff_id', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('teachers.gender')}</Label>
                  <Select value={formData.gender} onValueChange={(v) => updateField('gender', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('teachers.selectGender')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t('common.male')}</SelectItem>
                      <SelectItem value="female">{t('common.female')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">{t('teachers.dateOfBirth')}</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => updateField('date_of_birth', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">{t('teachers.nationality')}</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => updateField('nationality', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passport_number">{t('teachers.passportId')}</Label>
                  <Input
                    id="passport_number"
                    value={formData.passport_number}
                    onChange={(e) => updateField('passport_number', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('teachers.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('teachers.phone')}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address_line1">{t('teachers.addressLine1')}</Label>
                  <Input
                    id="address_line1"
                    value={formData.address_line1}
                    onChange={(e) => updateField('address_line1', e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address_line2">{t('teachers.addressLine2')}</Label>
                  <Input
                    id="address_line2"
                    value={formData.address_line2}
                    onChange={(e) => updateField('address_line2', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">{t('teachers.city')}</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{t('teachers.country')}</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">{t('teachers.postalCode')}</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => updateField('postal_code', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="employment" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('teachers.status')}</Label>
                  <Select value={formData.status} onValueChange={(v) => updateField('status', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('teachers.statusActive')}</SelectItem>
                      <SelectItem value="on_leave">{t('teachers.statusOnLeave')}</SelectItem>
                      <SelectItem value="former">{t('teachers.statusFormer')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('teachers.employmentType')}</Label>
                  <Select value={formData.employment_type} onValueChange={(v) => updateField('employment_type', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">{t('teachers.fullTime')}</SelectItem>
                      <SelectItem value="part_time">{t('teachers.partTime')}</SelectItem>
                      <SelectItem value="contract">{t('teachers.contract')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('teachers.role')}</Label>
                  <Select value={formData.role} onValueChange={(v) => updateField('role', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">{t('teachers.roleTeacher')}</SelectItem>
                      <SelectItem value="senior_teacher">{t('teachers.roleSeniorTeacher')}</SelectItem>
                      <SelectItem value="coordinator">{t('teachers.roleCoordinator')}</SelectItem>
                      <SelectItem value="hod">{t('teachers.roleHOD')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">{t('teachers.department')}</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => updateField('department', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hiring_date">{t('teachers.hiringDate')}</Label>
                  <Input
                    id="hiring_date"
                    type="date"
                    value={formData.hiring_date}
                    onChange={(e) => updateField('hiring_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('teachers.staffCategory')}</Label>
                  <Select value={formData.staff_category} onValueChange={(v) => updateField('staff_category', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">{t('teachers.categoryAcademic')}</SelectItem>
                      <SelectItem value="support">{t('teachers.categorySupport')}</SelectItem>
                      <SelectItem value="administration">{t('teachers.categoryAdmin')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="academic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject_specialization">{t('teachers.subjects')}</Label>
                  <Input
                    id="subject_specialization"
                    value={formData.subject_specialization}
                    onChange={(e) => updateField('subject_specialization', e.target.value)}
                    placeholder={t('teachers.subjectsPlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certification_level">{t('teachers.certificationLevel')}</Label>
                  <Input
                    id="certification_level"
                    value={formData.certification_level}
                    onChange={(e) => updateField('certification_level', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('teachers.schoolDivision')}</Label>
                  <Select value={formData.school_division} onValueChange={(v) => updateField('school_division', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">{t('teachers.divisionPrimary')}</SelectItem>
                      <SelectItem value="secondary">{t('teachers.divisionSecondary')}</SelectItem>
                      <SelectItem value="sixth_form">{t('teachers.divisionSixthForm')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teaching_load">{t('teachers.teachingLoad')}</Label>
                  <Input
                    id="teaching_load"
                    value={formData.teaching_load}
                    onChange={(e) => updateField('teaching_load', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assigned_classes">{t('teachers.assignedClasses')}</Label>
                  <Input
                    id="assigned_classes"
                    value={formData.assigned_classes}
                    onChange={(e) => updateField('assigned_classes', e.target.value)}
                    placeholder={t('teachers.classesPlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assigned_year_groups">{t('teachers.yearGroups')}</Label>
                  <Input
                    id="assigned_year_groups"
                    value={formData.assigned_year_groups}
                    onChange={(e) => updateField('assigned_year_groups', e.target.value)}
                    placeholder={t('teachers.yearGroupsPlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tutor_group">{t('teachers.tutorGroup')}</Label>
                  <Input
                    id="tutor_group"
                    value={formData.tutor_group}
                    onChange={(e) => updateField('tutor_group', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="home_room">{t('teachers.homeRoom')}</Label>
                  <Input
                    id="home_room"
                    value={formData.home_room}
                    onChange={(e) => updateField('home_room', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2 col-span-2">
                  <Checkbox
                    id="sen_expertise"
                    checked={formData.sen_expertise}
                    onCheckedChange={(checked) => updateField('sen_expertise', checked)}
                  />
                  <Label htmlFor="sen_expertise">{t('teachers.senExpertise')}</Label>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">{t('teachers.notes')}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('common.saving') : t('teachers.addTeacher')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
