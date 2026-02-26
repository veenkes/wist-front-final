-- Add missing foreign key constraint for student_groups to students
ALTER TABLE public.student_groups 
  ADD CONSTRAINT student_groups_student_id_fkey 
  FOREIGN KEY (student_id) 
  REFERENCES public.students(id) 
  ON DELETE CASCADE;