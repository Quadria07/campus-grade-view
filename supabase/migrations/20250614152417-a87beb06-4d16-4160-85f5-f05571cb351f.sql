
-- First, let's create accounts for all existing students
DO $$
DECLARE
  student_record RECORD;
  new_user_id UUID;
  student_password TEXT;
BEGIN
  -- Loop through all existing students and create user accounts
  FOR student_record IN SELECT * FROM public.students LOOP
    -- Generate a simple password based on matric number (you can change this)
    student_password := student_record.matric_number || '123';
    
    -- Create user account using the existing email or generate one from matric number
    new_user_id := public.create_user_with_password(
      COALESCE(student_record.email, student_record.matric_number || '@student.edu'),
      student_password,
      'student'
    );
    
    -- Link the student record to the new user
    UPDATE public.students 
    SET user_id = new_user_id,
        email = COALESCE(student_record.email, student_record.matric_number || '@student.edu')
    WHERE id = student_record.id;
    
  END LOOP;
END $$;

-- Create some lecturer accounts
DO $$
DECLARE
  lecturer_user_id UUID;
BEGIN
  -- Create first lecturer account
  lecturer_user_id := public.create_user_with_password(
    'john.smith@university.edu',
    'lecturer123',
    'lecturer'
  );
  
  INSERT INTO public.lecturer_profiles (
    user_id,
    first_name,
    last_name,
    employee_id,
    department,
    phone
  ) VALUES (
    lecturer_user_id,
    'John',
    'Smith',
    'EMP001',
    'Computer Science',
    '+234 800 123 4567'
  );
  
  -- Create second lecturer account
  lecturer_user_id := public.create_user_with_password(
    'mary.johnson@university.edu',
    'lecturer456',
    'lecturer'
  );
  
  INSERT INTO public.lecturer_profiles (
    user_id,
    first_name,
    last_name,
    employee_id,
    department,
    phone
  ) VALUES (
    lecturer_user_id,
    'Mary',
    'Johnson',
    'EMP002',
    'Mathematics',
    '+234 800 234 5678'
  );
  
  -- Create third lecturer account
  lecturer_user_id := public.create_user_with_password(
    'david.brown@university.edu',
    'lecturer789',
    'lecturer'
  );
  
  INSERT INTO public.lecturer_profiles (
    user_id,
    first_name,
    last_name,
    employee_id,
    department,
    phone
  ) VALUES (
    lecturer_user_id,
    'David',
    'Brown',
    'EMP003',
    'Physics',
    '+234 800 345 6789'
  );
END $$;
