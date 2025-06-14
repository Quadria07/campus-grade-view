
-- Create test lecturer account
DO $$
DECLARE
  lecturer_user_id UUID;
BEGIN
  -- Create lecturer user
  lecturer_user_id := public.create_user_with_password(
    'john.smith@university.edu',
    'lecturer123',
    'lecturer'
  );
  
  -- Create lecturer profile
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
END $$;

-- Create test student account
DO $$
DECLARE
  student_user_id UUID;
  student_id UUID;
BEGIN
  -- Create student user (using matric number as email format)
  student_user_id := public.create_user_with_password(
    'STU001@student.edu',
    'student123',
    'student'
  );
  
  -- Create student record
  INSERT INTO public.students (
    first_name,
    last_name,
    matric_number,
    email,
    level,
    department_id,
    phone,
    user_id
  ) VALUES (
    'Jane',
    'Doe',
    'STU001',
    'STU001@student.edu',
    '200',
    (SELECT id FROM public.departments LIMIT 1),
    '+234 800 987 6543',
    student_user_id
  ) RETURNING id INTO student_id;
  
  -- Add some sample results for the student
  INSERT INTO public.results (
    student_id,
    course_id,
    semester_id,
    session_id,
    score,
    remarks
  ) VALUES 
    (
      student_id,
      (SELECT id FROM public.courses WHERE code = 'CSC401' LIMIT 1),
      (SELECT id FROM public.semesters WHERE code = 'FIRST' LIMIT 1),
      (SELECT id FROM public.sessions WHERE name = '2023/2024' LIMIT 1),
      78,
      'Good performance'
    ),
    (
      student_id,
      (SELECT id FROM public.courses WHERE code = 'CSC402' LIMIT 1),
      (SELECT id FROM public.semesters WHERE code = 'FIRST' LIMIT 1),
      (SELECT id FROM public.sessions WHERE name = '2023/2024' LIMIT 1),
      85,
      'Excellent work'
    );
END $$;
