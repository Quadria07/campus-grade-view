
-- Update the calculate_grade function to use the new grading system
CREATE OR REPLACE FUNCTION public.calculate_grade(score DECIMAL)
RETURNS VARCHAR(2) AS $$
BEGIN
  IF score >= 75 THEN RETURN 'A';
  ELSIF score >= 70 THEN RETURN 'AB';
  ELSIF score >= 65 THEN RETURN 'B';
  ELSIF score >= 60 THEN RETURN 'BC';
  ELSIF score >= 55 THEN RETURN 'C';
  ELSIF score >= 50 THEN RETURN 'CD';
  ELSIF score >= 45 THEN RETURN 'D';
  ELSIF score >= 40 THEN RETURN 'E';
  ELSE RETURN 'F';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update existing results to use the new grading system
UPDATE public.results 
SET grade = public.calculate_grade(score);
