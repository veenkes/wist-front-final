import React, { useState } from 'react';
import { Search, Users, Phone, MapPin, Loader2, Eye, Edit, Trash2, MoreVertical, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '@/hooks/useStudents';
import { AddStudentModal } from '@/components/modals/AddStudentModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// Sample students for demonstration
const sampleStudents = [
  {
    id: 'sample-1',
    full_name: 'Aruzhan Karimova',
    date_of_birth: '2015-03-15',
    gender: 'female' as const,
    phone: '+998 90 123 45 67',
    email: 'aruzhan@example.com',
    address: 'Tashkent, Mirzo Ulugbek district',
    status: 'active' as const,
    enrollment_date: '2023-09-01',
    academic_level: 'Year 8',
    photo_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parents: [
      { id: 'p1', full_name: 'Karim Karimov', phone: '+998 90 111 22 33', relation_type: 'Father' },
      { id: 'p2', full_name: 'Madina Karimova', phone: '+998 90 444 55 66', relation_type: 'Mother' }
    ],
    group: { id: 'g1', name: 'Group A (Year 8)' }
  },
  {
    id: 'sample-2',
    full_name: 'Murod Ismoilov',
    date_of_birth: '2018-07-22',
    gender: 'male' as const,
    phone: '+998 91 234 56 78',
    email: 'murod@example.com',
    address: 'Tashkent, Chilanzar district',
    status: 'active' as const,
    enrollment_date: '2023-09-01',
    academic_level: 'Year 5',
    photo_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parents: [
      { id: 'p3', full_name: 'Ismoil Ismoilov', phone: '+998 91 777 88 99', relation_type: 'Father' }
    ],
    group: { id: 'g2', name: 'Group B (Year 5)' }
  },
  {
    id: 'sample-3',
    full_name: 'Lola Tursunova',
    date_of_birth: '2008-11-10',
    gender: 'female' as const,
    phone: '+998 93 345 67 89',
    email: 'lola@example.com',
    address: 'Tashkent, Sergeli district',
    status: 'debt' as const,
    enrollment_date: '2022-09-01',
    academic_level: 'Year 10',
    photo_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parents: [
      { id: 'p4', full_name: 'Tursun Tursunov', phone: '+998 93 222 33 44', relation_type: 'Father' },
      { id: 'p5', full_name: 'Dilnoza Tursunova', phone: '+998 93 555 66 77', relation_type: 'Mother' }
    ],
    group: { id: 'g3', name: 'Group C (Year 10)' }
  },
  {
    id: 'sample-4',
    full_name: 'Bekzod Rasulov',
    date_of_birth: '2021-05-08',
    gender: 'male' as const,
    phone: '+998 94 456 78 90',
    email: null,
    address: 'Tashkent, Yakkasaray district',
    status: 'active' as const,
    enrollment_date: '2024-09-01',
    academic_level: 'Kindergarten',
    photo_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parents: [
      { id: 'p6', full_name: 'Rasul Rasulov', phone: '+998 94 888 99 00', relation_type: 'Father' }
    ],
    group: { id: 'g4', name: 'Group K1 (Kindergarten)' }
  }
];

export const StudentsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const { students: dbStudents, isLoading, deleteStudent } = useStudents();

  // Combine database students with sample students for demo
  const allStudents = [...sampleStudents, ...dbStudents];

  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = groupFilter === 'all' || student.group?.name === groupFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesGroup && matchesStatus;
  });

  const uniqueGroups = Array.from(new Set(allStudents.map(s => s.group?.name).filter(Boolean)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border-success/20';
      case 'suspended': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'graduated': return 'bg-primary/10 text-primary border-primary/20';
      case 'debt': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted';
    }
  };

  const handleView = (studentId: string) => {
    navigate(`/student/${studentId}`);
  };

  const handleEdit = (studentId: string) => {
    toast.info('Edit student: ' + studentId);
  };

  const handleDelete = (studentId: string, studentName: string) => {
    if (studentId.startsWith('sample-')) {
      toast.error('Cannot delete sample students');
      return;
    }
    if (confirm(`Are you sure you want to delete ${studentName}?`)) {
      deleteStudent.mutate(studentId);
    }
  };

  const handleContact = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
    toast.success('Calling ' + phone);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Students List
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete list of all students with parent information
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Users className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search students by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="All Groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {uniqueGroups.map(group => (
                <SelectItem key={group} value={group!}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="graduated">Graduated</SelectItem>
              <SelectItem value="debt">Debt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <Card 
            key={student.id} 
            className="p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 cursor-pointer" onClick={() => handleView(student.id)}>
                <AvatarImage src={student.photo_url || undefined} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
                  {student.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-semibold text-lg truncate cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleView(student.id)}
                >
                  {student.full_name}
                </h3>
                <p className="text-sm text-muted-foreground">{student.group?.name || 'No group'}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className={getStatusColor(student.status)}>
                    {student.status}
                  </Badge>
                  {student.academic_level && (
                    <Badge variant="outline" className="text-xs">
                      {student.academic_level}
                    </Badge>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleView(student.id)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(student.id)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  {student.phone && (
                    <DropdownMenuItem onClick={() => handleContact(student.phone!)}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDelete(student.id, student.full_name)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Parents:</span>
                <div className="mt-1 space-y-1">
                  {student.parents && student.parents.length > 0 ? (
                    student.parents.map((parent) => (
                      <div key={parent.id} className="text-foreground font-medium flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        {parent.full_name} ({parent.relation_type})
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No parents linked</p>
                  )}
                </div>
              </div>
              
              {student.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  {student.phone}
                </div>
              )}

              {student.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  {student.email}
                </div>
              )}
              
              {student.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {student.address}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleView(student.id)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleEdit(student.id)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              {student.phone && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleContact(student.phone!)}
                >
                  <Phone className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No students found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </Card>
      )}

      <AddStudentModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
};

export default StudentsList;
