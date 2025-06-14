
-- Let's check what students actually exist in the database
SELECT matric_number, first_name, last_name, email, user_id 
FROM public.students 
ORDER BY matric_number;

-- Let's also check the users table to see what accounts were created
SELECT id, email, role, is_active 
FROM public.users 
WHERE role = 'student'
ORDER BY email;

-- Check lecturer profiles and users
SELECT 
  u.id as user_id,
  u.email,
  u.role,
  lp.first_name,
  lp.last_name,
  lp.employee_id,
  lp.department,
  lp.phone
FROM public.users u
LEFT JOIN public.lecturer_profiles lp ON u.id = lp.user_id
WHERE u.role = 'lecturer';
