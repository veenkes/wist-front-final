import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, differenceInYears } from 'date-fns';

interface PersonalInfoTabProps {
  student: any;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ student }) => {
  const age = differenceInYears(new Date(), new Date(student.date_of_birth));

  const genderLabel = (g: string) => {
    switch (g) {
      case 'male': return 'Male';
      case 'female': return 'Female';
      default: return g || 'Not specified';
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case 'active': return 'Active';
      case 'suspended': return 'Suspended';
      case 'graduated': return 'Graduated';
      case 'debt': return 'Debt';
      default: return s;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h3 className="text-sm font-semibold mb-3">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Full Name</label>
            <p className="font-medium text-sm">{student.full_name}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Date of Birth</label>
            <p className="font-medium text-sm">{format(new Date(student.date_of_birth), 'dd.MM.yyyy')}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Age</label>
            <p className="font-medium text-sm">{age} years</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Gender</label>
            <p className="font-medium text-sm">{genderLabel(student.gender)}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">ID/Passport</label>
            <p className="font-medium text-sm">{student.id_passport_number || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Status</label>
            <Badge className={
              student.status === 'active' ? 'bg-success/10 text-success' :
              student.status === 'suspended' ? 'bg-destructive/10 text-destructive' :
              student.status === 'graduated' ? 'bg-primary/10 text-primary' :
              'bg-warning/10 text-warning'
            }>
              {statusLabel(student.status)}
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold mb-3">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Phone</label>
            <p className="font-medium text-sm">{student.phone || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <p className="font-medium text-sm">{student.email || 'Not specified'}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-muted-foreground">Address</label>
            <p className="font-medium text-sm">{student.address || 'Not specified'}</p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold mb-3">Academic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Group</label>
            <p className="font-medium text-sm">{student.groups?.[0]?.name || student.group || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Level</label>
            <p className="font-medium text-sm">{student.academic_level || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Enrollment Date</label>
            <p className="font-medium text-sm">{format(new Date(student.enrollment_date), 'dd.MM.yyyy')}</p>
          </div>
        </div>
      </Card>

      {student.notes && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-3">Notes</h3>
          <p className="text-sm text-muted-foreground">{student.notes}</p>
        </Card>
      )}

      <Card className="p-5">
        <h3 className="text-sm font-semibold mb-3">System Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Profile Created</label>
            <p className="font-medium text-sm">{student.created_at ? format(new Date(student.created_at), 'dd.MM.yyyy HH:mm') : '—'}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Last Updated</label>
            <p className="font-medium text-sm">{student.updated_at ? format(new Date(student.updated_at), 'dd.MM.yyyy HH:mm') : '—'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
