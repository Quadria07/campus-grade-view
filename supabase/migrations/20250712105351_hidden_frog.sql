/*
  # Update Grading System to A, B, C, D

  1. Changes
    - Update the calculate_grade function to use A, B, C, D, F grading system
    - A: 80-100
    - B: 70-79
    - C: 60-69
    - D: 50-59
    - F: 0-49

  2. Security
    - No changes to RLS policies needed
    - Function remains security definer
*/

-- Update the calculate_grade function to use A, B, C, D, F system
CREATE OR REPLACE FUNCTION public.calculate_grade(score DECIMAL)
RETURNS VARCHAR(2) AS $$
BEGIN
  IF score >= 80 THEN RETURN 'A';
  ELSIF score >= 70 THEN RETURN 'B';
  ELSIF score >= 60 THEN RETURN 'C';
  ELSIF score >= 50 THEN RETURN 'D';
  ELSE RETURN 'F';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update existing results to use the new grading system
UPDATE public.results 
SET grade = public.calculate_grade(score);