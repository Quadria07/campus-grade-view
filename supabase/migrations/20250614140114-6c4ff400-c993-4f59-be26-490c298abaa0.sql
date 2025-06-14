
-- Create results table
CREATE TABLE public.results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  grade VARCHAR(2) NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id, semester_id, session_id)
);

-- Enable Row Level Security for results
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for results (allow all operations for now)
CREATE POLICY "Allow all operations on results" ON public.results FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_results_student_id ON public.results(student_id);
CREATE INDEX idx_results_course_id ON public.results(course_id);
CREATE INDEX idx_results_semester_id ON public.results(semester_id);
CREATE INDEX idx_results_session_id ON public.results(session_id);
CREATE INDEX idx_results_grade ON public.results(grade);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_results_updated_at 
  BEFORE UPDATE ON public.results 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate grade from score
CREATE OR REPLACE FUNCTION public.calculate_grade(score DECIMAL)
RETURNS VARCHAR(2) AS $$
BEGIN
  IF score >= 90 THEN RETURN 'A';
  ELSIF score >= 80 THEN RETURN 'AB';
  ELSIF score >= 70 THEN RETURN 'B';
  ELSIF score >= 65 THEN RETURN 'BC';
  ELSIF score >= 60 THEN RETURN 'C';
  ELSIF score >= 55 THEN RETURN 'CD';
  ELSIF score >= 50 THEN RETURN 'D';
  ELSIF score >= 45 THEN RETURN 'E';
  ELSE RETURN 'F';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate grade when score is inserted/updated
CREATE OR REPLACE FUNCTION public.auto_calculate_grade()
RETURNS TRIGGER AS $$
BEGIN
  NEW.grade = public.calculate_grade(NEW.score);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_grade_trigger
  BEFORE INSERT OR UPDATE OF score ON public.results
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_calculate_grade();
