
-- First, let's add the missing semesters table
CREATE TABLE IF NOT EXISTS public.semesters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add some default semesters if they don't exist
INSERT INTO public.semesters (name, code) 
VALUES 
  ('First Semester', '1ST'),
  ('Second Semester', '2ND')
ON CONFLICT DO NOTHING;

-- Update students table to properly link to users
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_matric_number ON public.students(matric_number);
CREATE INDEX IF NOT EXISTS idx_results_student_id ON public.results(student_id);

-- Update lecturer_profiles to use proper UUID references
ALTER TABLE public.lecturer_profiles 
DROP CONSTRAINT IF EXISTS lecturer_profiles_user_id_fkey;

ALTER TABLE public.lecturer_profiles 
ADD CONSTRAINT lecturer_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Create course registrations table for students
CREATE TABLE IF NOT EXISTS public.course_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(student_id, course_id, session_id, semester_id)
);

-- Add indexes for course registrations
CREATE INDEX IF NOT EXISTS idx_course_registrations_student_id ON public.course_registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_course_registrations_course_id ON public.course_registrations(course_id);

-- Add foreign key constraints one by one
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'courses_department_id_fkey'
    ) THEN
        ALTER TABLE public.courses 
        ADD CONSTRAINT courses_department_id_fkey 
        FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'courses_semester_id_fkey'
    ) THEN
        ALTER TABLE public.courses 
        ADD CONSTRAINT courses_semester_id_fkey 
        FOREIGN KEY (semester_id) REFERENCES public.semesters(id) ON DELETE SET NULL;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'results_student_id_fkey'
    ) THEN
        ALTER TABLE public.results 
        ADD CONSTRAINT results_student_id_fkey 
        FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'results_course_id_fkey'
    ) THEN
        ALTER TABLE public.results 
        ADD CONSTRAINT results_course_id_fkey 
        FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'results_semester_id_fkey'
    ) THEN
        ALTER TABLE public.results 
        ADD CONSTRAINT results_semester_id_fkey 
        FOREIGN KEY (semester_id) REFERENCES public.semesters(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'results_session_id_fkey'
    ) THEN
        ALTER TABLE public.results 
        ADD CONSTRAINT results_session_id_fkey 
        FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create activity log table for recent activities
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
