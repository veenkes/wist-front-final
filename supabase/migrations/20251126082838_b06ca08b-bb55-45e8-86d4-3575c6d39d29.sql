-- Create Groups/Classes table
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  grade_level INTEGER,
  curator_id UUID REFERENCES public.employees(id),
  student_count INTEGER DEFAULT 0,
  academic_year TEXT DEFAULT '2024-2025',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Lessons table (recurring lesson templates)
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  teacher_id UUID REFERENCES public.employees(id),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 5), -- 1=Monday, 5=Friday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  classroom TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Lesson Instances table (actual lesson occurrences)
CREATE TABLE public.lesson_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  topic TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Student-Group relationship table
CREATE TABLE public.student_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  left_at TIMESTAMPTZ,
  UNIQUE(student_id, group_id)
);

-- Create Attendance records table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_instance_id UUID REFERENCES public.lesson_instances(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  marked_at TIMESTAMPTZ DEFAULT now(),
  marked_by UUID REFERENCES public.employees(id),
  notes TEXT,
  UNIQUE(lesson_instance_id, student_id)
);

-- Enable RLS on all tables
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups
CREATE POLICY "CEOs can manage all groups"
ON public.groups FOR ALL
USING (has_role(auth.uid(), 'ceo'::app_role));

CREATE POLICY "Employees can view groups"
ON public.groups FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.employees WHERE user_id = auth.uid()
  )
);

-- RLS Policies for lessons
CREATE POLICY "CEOs can manage all lessons"
ON public.lessons FOR ALL
USING (has_role(auth.uid(), 'ceo'::app_role));

CREATE POLICY "Teachers can view their lessons"
ON public.lessons FOR SELECT
USING (
  teacher_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
);

CREATE POLICY "Employees can view all lessons"
ON public.lessons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.employees WHERE user_id = auth.uid()
  )
);

-- RLS Policies for lesson_instances
CREATE POLICY "CEOs can manage all lesson instances"
ON public.lesson_instances FOR ALL
USING (has_role(auth.uid(), 'ceo'::app_role));

CREATE POLICY "Teachers can manage their lesson instances"
ON public.lesson_instances FOR ALL
USING (
  lesson_id IN (
    SELECT id FROM public.lessons 
    WHERE teacher_id IN (
      SELECT id FROM public.employees WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Employees can view lesson instances"
ON public.lesson_instances FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.employees WHERE user_id = auth.uid()
  )
);

-- RLS Policies for student_groups
CREATE POLICY "CEOs can manage student groups"
ON public.student_groups FOR ALL
USING (has_role(auth.uid(), 'ceo'::app_role));

CREATE POLICY "Employees can view student groups"
ON public.student_groups FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.employees WHERE user_id = auth.uid()
  )
);

-- RLS Policies for attendance
CREATE POLICY "CEOs can manage all attendance"
ON public.attendance FOR ALL
USING (has_role(auth.uid(), 'ceo'::app_role));

CREATE POLICY "Teachers can manage attendance for their lessons"
ON public.attendance FOR ALL
USING (
  lesson_instance_id IN (
    SELECT li.id FROM public.lesson_instances li
    JOIN public.lessons l ON li.lesson_id = l.id
    WHERE l.teacher_id IN (
      SELECT id FROM public.employees WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Employees can view attendance"
ON public.attendance FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.employees WHERE user_id = auth.uid()
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_groups_updated_at
BEFORE UPDATE ON public.groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_lesson_instances_updated_at
BEFORE UPDATE ON public.lesson_instances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_lessons_teacher ON public.lessons(teacher_id);
CREATE INDEX idx_lessons_group ON public.lessons(group_id);
CREATE INDEX idx_lessons_day ON public.lessons(day_of_week);
CREATE INDEX idx_lesson_instances_lesson ON public.lesson_instances(lesson_id);
CREATE INDEX idx_lesson_instances_date ON public.lesson_instances(date);
CREATE INDEX idx_attendance_lesson_instance ON public.attendance(lesson_instance_id);
CREATE INDEX idx_attendance_student ON public.attendance(student_id);
CREATE INDEX idx_student_groups_student ON public.student_groups(student_id);
CREATE INDEX idx_student_groups_group ON public.student_groups(group_id);