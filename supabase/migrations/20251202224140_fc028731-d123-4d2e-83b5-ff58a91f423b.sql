-- Create teachers table with comprehensive fields
CREATE TABLE public.teachers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Personal Information
  full_name text NOT NULL,
  preferred_name text,
  staff_id text UNIQUE,
  photo_url text,
  gender text,
  date_of_birth date,
  nationality text,
  passport_number text,
  
  -- Contact Information
  email text NOT NULL,
  phone text,
  address_line1 text,
  address_line2 text,
  address_line3 text,
  city text,
  country text,
  postal_code text,
  
  -- Employment Information
  status text NOT NULL DEFAULT 'active', -- active, on_leave, former
  employment_type text DEFAULT 'full_time', -- full_time, part_time, contract
  role text DEFAULT 'teacher', -- teacher, senior_teacher, coordinator, hod
  department text,
  hiring_date date,
  end_date date,
  
  -- Academic Information
  subject_specialization text[],
  certification_level text,
  sen_expertise boolean DEFAULT false,
  previous_schools text[],
  
  -- School Assignment
  house_division text,
  school_division text, -- primary, secondary, sixth_form
  teaching_load text,
  tutor_group text,
  assigned_classes text[],
  assigned_year_groups text[],
  home_room text,
  
  -- Staff Category
  staff_category text DEFAULT 'academic', -- academic, support, administration
  
  -- Documents & Notes
  documents jsonb DEFAULT '[]'::jsonb,
  notes text,
  training_records jsonb DEFAULT '[]'::jsonb,
  performance_records jsonb DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "CEOs can manage all teachers"
ON public.teachers FOR ALL
USING (has_role(auth.uid(), 'ceo'::app_role));

CREATE POLICY "Admins can manage all teachers"
ON public.teachers FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Employees can view teachers"
ON public.teachers FOR SELECT
USING (EXISTS (SELECT 1 FROM employees WHERE employees.user_id = auth.uid()));

CREATE POLICY "Teachers can view own record"
ON public.teachers FOR SELECT
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_teachers_updated_at
BEFORE UPDATE ON public.teachers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Insert sample teachers data
INSERT INTO public.teachers (
  full_name, preferred_name, staff_id, gender, date_of_birth, nationality,
  email, phone, address_line1, city, country, postal_code,
  status, employment_type, role, department, hiring_date,
  subject_specialization, certification_level, sen_expertise,
  school_division, teaching_load, assigned_classes, assigned_year_groups, staff_category
) VALUES
  ('John Smith', 'John', 'TCH001', 'male', '1985-03-15', 'British',
   'john.smith@school.edu', '+998901234567', '123 Main Street', 'Tashkent', 'Uzbekistan', '100000',
   'active', 'full_time', 'senior_teacher', 'Mathematics', '2018-09-01',
   ARRAY['Mathematics', 'Statistics'], 'Masters', false,
   'secondary', 'Full Load', ARRAY['10A', '10B', '11A'], ARRAY['10', '11'], 'academic'),
   
  ('Sarah Johnson', 'Sarah', 'TCH002', 'female', '1990-07-22', 'American',
   'sarah.johnson@school.edu', '+998901234568', '456 Oak Avenue', 'Tashkent', 'Uzbekistan', '100001',
   'active', 'full_time', 'teacher', 'English', '2020-09-01',
   ARRAY['English Literature', 'Creative Writing'], 'Bachelors', false,
   'secondary', 'Full Load', ARRAY['9A', '9B', '10A'], ARRAY['9', '10'], 'academic'),
   
  ('Michael Brown', 'Mike', 'TCH003', 'male', '1982-11-08', 'Canadian',
   'michael.brown@school.edu', '+998901234569', '789 Elm Street', 'Tashkent', 'Uzbekistan', '100002',
   'active', 'full_time', 'hod', 'Science', '2015-09-01',
   ARRAY['Physics', 'Chemistry'], 'PhD', true,
   'secondary', 'Reduced (HOD)', ARRAY['11A', '11B', '12A'], ARRAY['11', '12'], 'academic'),
   
  ('Emma Wilson', 'Emma', 'TCH004', 'female', '1988-04-30', 'Australian',
   'emma.wilson@school.edu', '+998901234570', '321 Pine Road', 'Tashkent', 'Uzbekistan', '100003',
   'active', 'part_time', 'teacher', 'Art', '2021-01-15',
   ARRAY['Art', 'Design Technology'], 'Bachelors', false,
   'primary', 'Part Time', ARRAY['5A', '5B', '6A'], ARRAY['5', '6'], 'academic'),
   
  ('David Lee', 'David', 'TCH005', 'male', '1979-09-12', 'Korean',
   'david.lee@school.edu', '+998901234571', '654 Birch Lane', 'Tashkent', 'Uzbekistan', '100004',
   'on_leave', 'full_time', 'coordinator', 'IT', '2017-09-01',
   ARRAY['Computer Science', 'ICT'], 'Masters', false,
   'secondary', 'Full Load', ARRAY['8A', '8B', '9A', '9B'], ARRAY['8', '9'], 'academic'),
   
  ('Maria Garcia', 'Maria', 'TCH006', 'female', '1992-12-25', 'Spanish',
   'maria.garcia@school.edu', '+998901234572', '987 Cedar Drive', 'Tashkent', 'Uzbekistan', '100005',
   'active', 'full_time', 'teacher', 'Languages', '2022-09-01',
   ARRAY['Spanish', 'French'], 'Masters', false,
   'secondary', 'Full Load', ARRAY['7A', '7B', '8A', '8B'], ARRAY['7', '8'], 'academic');