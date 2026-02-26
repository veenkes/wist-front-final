-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  phone TEXT,
  email TEXT,
  address TEXT,
  id_passport_number TEXT,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'suspended', 'debt')),
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  academic_level TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create parents table
CREATE TABLE public.parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  occupation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create student_parents junction table (many-to-many)
CREATE TABLE public.student_parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL CHECK (relation_type IN ('mother', 'father', 'guardian', 'other')),
  is_primary_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, parent_id)
);

-- Create caretakers table (drivers, nannies, etc.)
CREATE TABLE public.caretakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  caretaker_type TEXT NOT NULL CHECK (caretaker_type IN ('driver', 'nanny', 'other')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create student_caretakers junction table
CREATE TABLE public.student_caretakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  caretaker_id UUID NOT NULL REFERENCES public.caretakers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, caretaker_id)
);

-- Create violations table
CREATE TABLE public.violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  reported_by UUID REFERENCES public.employees(id),
  violation_type TEXT NOT NULL CHECK (violation_type IN ('behavior', 'academic', 'attendance', 'safety', 'other')),
  severity TEXT NOT NULL CHECK (severity IN ('minor', 'moderate', 'severe')),
  description TEXT NOT NULL,
  location TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  corrective_action TEXT,
  student_statement TEXT,
  status TEXT NOT NULL DEFAULT 'unresolved' CHECK (status IN ('unresolved', 'resolved', 'under_review')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create violation_attachments table
CREATE TABLE public.violation_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  violation_id UUID NOT NULL REFERENCES public.violations(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('tuition', 'fee', 'supplies', 'event', 'other')),
  payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'card', 'cash', 'e-wallet', 'payme', 'uzum')),
  payment_date DATE,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue', 'refunded')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create student_documents table
CREATE TABLE public.student_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('photo', 'video', 'certificate', 'report', 'other')),
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.employees(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);

-- Add updated_at triggers
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON public.parents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_caretakers_updated_at BEFORE UPDATE ON public.caretakers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_violations_updated_at BEFORE UPDATE ON public.violations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Create indexes for performance
CREATE INDEX idx_students_status ON public.students(status);
CREATE INDEX idx_students_enrollment_date ON public.students(enrollment_date);
CREATE INDEX idx_student_parents_student_id ON public.student_parents(student_id);
CREATE INDEX idx_student_parents_parent_id ON public.student_parents(parent_id);
CREATE INDEX idx_student_caretakers_student_id ON public.student_caretakers(student_id);
CREATE INDEX idx_violations_student_id ON public.violations(student_id);
CREATE INDEX idx_violations_status ON public.violations(status);
CREATE INDEX idx_payments_student_id ON public.payments(student_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_student_documents_student_id ON public.student_documents(student_id);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caretakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_caretakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violation_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students
CREATE POLICY "CEOs can manage all students" ON public.students
  FOR ALL USING (has_role(auth.uid(), 'ceo'));

CREATE POLICY "Admins can manage all students" ON public.students
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view students" ON public.students
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.employees WHERE user_id = auth.uid()
  ));

-- RLS Policies for parents
CREATE POLICY "CEOs can manage all parents" ON public.parents
  FOR ALL USING (has_role(auth.uid(), 'ceo'));

CREATE POLICY "Admins can manage all parents" ON public.parents
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view parents" ON public.parents
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.employees WHERE user_id = auth.uid()
  ));

-- RLS Policies for student_parents
CREATE POLICY "CEOs can manage student_parents" ON public.student_parents
  FOR ALL USING (has_role(auth.uid(), 'ceo'));

CREATE POLICY "Admins can manage student_parents" ON public.student_parents
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view student_parents" ON public.student_parents
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.employees WHERE user_id = auth.uid()
  ));

-- RLS Policies for caretakers
CREATE POLICY "CEOs can manage caretakers" ON public.caretakers
  FOR ALL USING (has_role(auth.uid(), 'ceo'));

CREATE POLICY "Admins can manage caretakers" ON public.caretakers
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view caretakers" ON public.caretakers
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.employees WHERE user_id = auth.uid()
  ));

-- RLS Policies for student_caretakers
CREATE POLICY "CEOs can manage student_caretakers" ON public.student_caretakers
  FOR ALL USING (has_role(auth.uid(), 'ceo'));

CREATE POLICY "Admins can manage student_caretakers" ON public.student_caretakers
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view student_caretakers" ON public.student_caretakers
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.employees WHERE user_id = auth.uid()
  ));

-- RLS Policies for violations
CREATE POLICY "CEOs can manage all violations" ON public.violations
  FOR ALL USING (has_role(auth.uid(), 'ceo'));

CREATE POLICY "Admins can manage all violations" ON public.violations
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view violations" ON public.violations
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.employees WHERE user_id = auth.uid()
  ));

CREATE POLICY "Teachers can create violations" ON public.violations
  FOR INSERT WITH CHECK (
    reported_by IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );

-- RLS Policies for violation_attachments
CREATE POLICY "CEOs can manage violation_attachments" ON public.violation_attachments
  FOR ALL USING (has_role(auth.uid(), 'ceo'));

CREATE POLICY "Admins can manage violation_attachments" ON public.violation_attachments
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view violation_attachments" ON public.violation_attachments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.employees WHERE user_id = auth.uid()
  ));

-- RLS Policies for payments
CREATE POLICY "CEOs can manage all payments" ON public.payments
  FOR ALL USING (has_role(auth.uid(), 'ceo'));

CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Accountants can manage payments" ON public.payments
  FOR ALL USING (has_role(auth.uid(), 'accountant'));

CREATE POLICY "Employees can view payments" ON public.payments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.employees WHERE user_id = auth.uid()
  ));

-- RLS Policies for student_documents
CREATE POLICY "CEOs can manage student_documents" ON public.student_documents
  FOR ALL USING (has_role(auth.uid(), 'ceo'));

CREATE POLICY "Admins can manage student_documents" ON public.student_documents
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view student_documents" ON public.student_documents
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.employees WHERE user_id = auth.uid()
  ));

CREATE POLICY "Employees can upload student_documents" ON public.student_documents
  FOR INSERT WITH CHECK (
    uploaded_by IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );