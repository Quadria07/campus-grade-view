
-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sessions table (academic sessions/years)
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- e.g., "2023/2024", "2024/2025"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  level TEXT NOT NULL, -- "100L", "200L", "300L", "400L"
  units INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enhanced students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  matric_number TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  level TEXT NOT NULL, -- "100L", "200L", "300L", "400L"
  status TEXT NOT NULL DEFAULT 'active', -- "active", "inactive", "graduated"
  date_of_birth DATE,
  gender TEXT, -- "male", "female"
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_courses junction table (many-to-many relationship)
CREATE TABLE public.student_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id, session_id)
);

-- Insert sample departments
INSERT INTO public.departments (name, code) VALUES
('Computer Science', 'CSC'),
('Mathematics', 'MTH'),
('Physics', 'PHY'),
('Chemistry', 'CHM'),
('Biology', 'BIO');

-- Insert sample sessions
INSERT INTO public.sessions (name, start_date, end_date, is_active) VALUES
('2023/2024', '2023-09-01', '2024-08-31', false),
('2024/2025', '2024-09-01', '2025-08-31', true);

-- Insert sample courses
INSERT INTO public.courses (name, code, department_id, level, units) 
SELECT 'Introduction to Programming', 'CSC101', d.id, '100L', 3
FROM public.departments d WHERE d.code = 'CSC';

INSERT INTO public.courses (name, code, department_id, level, units) 
SELECT 'Data Structures', 'CSC201', d.id, '200L', 3
FROM public.departments d WHERE d.code = 'CSC';

INSERT INTO public.courses (name, code, department_id, level, units) 
SELECT 'Database Systems', 'CSC301', d.id, '300L', 3
FROM public.departments d WHERE d.code = 'CSC';

-- Enable Row Level Security
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_courses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - we'll refine these later)
CREATE POLICY "Allow all operations on departments" ON public.departments FOR ALL USING (true);
CREATE POLICY "Allow all operations on sessions" ON public.sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on courses" ON public.courses FOR ALL USING (true);
CREATE POLICY "Allow all operations on students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow all operations on student_courses" ON public.student_courses FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_students_matric_number ON public.students(matric_number);
CREATE INDEX idx_students_department_id ON public.students(department_id);
CREATE INDEX idx_students_session_id ON public.students(session_id);
CREATE INDEX idx_courses_department_id ON public.courses(department_id);
CREATE INDEX idx_student_courses_student_id ON public.student_courses(student_id);
CREATE INDEX idx_student_courses_course_id ON public.student_courses(course_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON public.students 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
