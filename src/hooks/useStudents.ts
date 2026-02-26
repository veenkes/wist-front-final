import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Student {
  id: string;
  full_name: string;
  date_of_birth: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  email?: string;
  address?: string;
  id_passport_number?: string;
  photo_url?: string;
  status: 'active' | 'graduated' | 'suspended' | 'debt';
  enrollment_date: string;
  academic_level?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  parents?: Array<{
    id: string;
    full_name: string;
    phone: string;
    relation_type: string;
  }>;
  group?: {
    id: string;
    name: string;
  };
}

export const useStudents = () => {
  const queryClient = useQueryClient();

  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          student_parents(
            parent:parents(id, full_name, phone),
            relation_type
          ),
          student_groups(
            group:groups(id, name)
          )
        `)
        .order('full_name');

      if (error) throw error;

      return data.map((student: any) => ({
        ...student,
        parents: student.student_parents?.map((sp: any) => ({
          ...sp.parent,
          relation_type: sp.relation_type
        })) || [],
        group: student.student_groups?.[0]?.group || null
      }));
    }
  });

  const createStudent = useMutation({
    mutationFn: async (studentData: any) => {
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create student: ${error.message}`);
    }
  });

  const updateStudent = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Student> & { id: string }) => {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update student: ${error.message}`);
    }
  });

  const deleteStudent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete student: ${error.message}`);
    }
  });

  return {
    students,
    isLoading,
    error,
    createStudent,
    updateStudent,
    deleteStudent
  };
};

export const useStudent = (id: string) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      // Fetch student data
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();

      if (studentError) throw studentError;

      // Fetch related parents
      const { data: parentsData } = await supabase
        .from('student_parents')
        .select(`
          relation_type,
          is_primary_contact,
          parent:parents(*)
        `)
        .eq('student_id', id);

      // Fetch related groups
      const { data: groupsData } = await supabase
        .from('student_groups')
        .select(`group:groups(*)`)
        .eq('student_id', id);

      // Fetch caretakers
      const { data: caretakersData } = await supabase
        .from('student_caretakers')
        .select(`caretaker:caretakers(*)`)
        .eq('student_id', id);

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', id);

      // Fetch violations
      const { data: violationsData } = await supabase
        .from('violations')
        .select('*')
        .eq('student_id', id);

      // Fetch documents
      const { data: documentsData } = await supabase
        .from('student_documents')
        .select('*')
        .eq('student_id', id);

      return {
        ...studentData,
        parents: parentsData?.map((sp: any) => ({
          ...sp.parent,
          relation_type: sp.relation_type,
          is_primary_contact: sp.is_primary_contact
        })) || [],
        groups: groupsData?.map((sg: any) => sg.group).filter(Boolean) || [],
        caretakers: caretakersData?.map((sc: any) => sc.caretaker).filter(Boolean) || [],
        payments: paymentsData || [],
        violations: violationsData || [],
        documents: documentsData || []
      };
    },
    enabled: !!id
  });
};
