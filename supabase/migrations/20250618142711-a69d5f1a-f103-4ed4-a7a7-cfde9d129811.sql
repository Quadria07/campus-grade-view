
-- Enable Row Level Security on tables that are missing it
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_registrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for activity_logs
-- Users can view their own activity logs
CREATE POLICY "Users can view their own activity logs"
  ON public.activity_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own activity logs
CREATE POLICY "Users can insert their own activity logs"
  ON public.activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Super admins can view all activity logs
CREATE POLICY "Super admins can view all activity logs"
  ON public.activity_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Super admins can manage all activity logs
CREATE POLICY "Super admins can manage all activity logs"
  ON public.activity_logs
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Create RLS policies for course_registrations
-- Students can view their own course registrations
CREATE POLICY "Students can view their own course registrations"
  ON public.course_registrations
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

-- Students can insert their own course registrations
CREATE POLICY "Students can insert their own course registrations"
  ON public.course_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

-- Students can update their own course registrations
CREATE POLICY "Students can update their own course registrations"
  ON public.course_registrations
  FOR UPDATE
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

-- Students can delete their own course registrations
CREATE POLICY "Students can delete their own course registrations"
  ON public.course_registrations
  FOR DELETE
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

-- Super admins can manage all course registrations
CREATE POLICY "Super admins can manage all course registrations"
  ON public.course_registrations
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Lecturers can view course registrations for courses they teach
CREATE POLICY "Lecturers can view course registrations for their courses"
  ON public.course_registrations
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'lecturer'));
