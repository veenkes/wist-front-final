import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Parent {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  address?: string;
  occupation?: string;
  created_at: string;
  updated_at: string;
  children?: Array<{
    id: string;
    name: string;
    group: string;
  }>;
}

export const useParents = () => {
  const queryClient = useQueryClient();

  const { data: parents = [], isLoading, error } = useQuery({
    queryKey: ['parents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parents')
        .select(`
          *,
          student_parents(
            student:students(
              id,
              full_name,
              student_groups(
                group:groups(name)
              )
            )
          )
        `)
        .order('full_name');

      if (error) throw error;

      return data.map((parent: any) => ({
        ...parent,
        children: parent.student_parents?.map((sp: any) => ({
          id: sp.student.id,
          name: sp.student.full_name,
          group: sp.student.student_groups?.[0]?.group?.name || 'No group'
        })) || []
      }));
    }
  });

  const createParent = useMutation({
    mutationFn: async (parentData: any) => {
      const { data, error } = await supabase
        .from('parents')
        .insert([parentData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      toast.success('Parent created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create parent: ${error.message}`);
    }
  });

  const updateParent = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Parent> & { id: string }) => {
      const { data, error } = await supabase
        .from('parents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      toast.success('Parent updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update parent: ${error.message}`);
    }
  });

  const deleteParent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('parents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      toast.success('Parent deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete parent: ${error.message}`);
    }
  });

  const linkParentToStudent = useMutation({
    mutationFn: async ({ 
      parentId, 
      studentId, 
      relationType, 
      isPrimaryContact = false 
    }: { 
      parentId: string; 
      studentId: string; 
      relationType: 'mother' | 'father' | 'guardian' | 'other';
      isPrimaryContact?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('student_parents')
        .insert([{
          parent_id: parentId,
          student_id: studentId,
          relation_type: relationType,
          is_primary_contact: isPrimaryContact
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Parent linked to student successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to link parent: ${error.message}`);
    }
  });

  return {
    parents,
    isLoading,
    error,
    createParent,
    updateParent,
    deleteParent,
    linkParentToStudent
  };
};
