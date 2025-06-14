
-- Create semesters table
CREATE TABLE public.semesters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- e.g., "First Semester", "Second Semester"
  code TEXT NOT NULL UNIQUE, -- e.g., "1ST", "2ND"
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add semester_id to courses table
ALTER TABLE public.courses 
ADD COLUMN semester_id UUID REFERENCES public.semesters(id) ON DELETE SET NULL;

-- Add semester_id to students table
ALTER TABLE public.students 
ADD COLUMN semester_id UUID REFERENCES public.semesters(id) ON DELETE SET NULL;

-- Insert default semesters
INSERT INTO public.semesters (name, code) VALUES
('First Semester', '1ST'),
('Second Semester', '2ND');

-- Enable Row Level Security for semesters
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for semesters (allow all operations for now)
CREATE POLICY "Allow all operations on semesters" ON public.semesters FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_courses_semester_id ON public.courses(semester_id);
CREATE INDEX idx_students_semester_id ON public.students(semester_id);
