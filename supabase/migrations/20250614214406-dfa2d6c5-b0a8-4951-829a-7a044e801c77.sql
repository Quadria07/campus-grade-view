
-- Add foreign key constraints only if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'courses_department_id_fkey'
    ) THEN
        ALTER TABLE courses ADD CONSTRAINT courses_department_id_fkey 
        FOREIGN KEY (department_id) REFERENCES departments(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'courses_semester_id_fkey'
    ) THEN
        ALTER TABLE courses ADD CONSTRAINT courses_semester_id_fkey 
        FOREIGN KEY (semester_id) REFERENCES semesters(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'students_department_id_fkey'
    ) THEN
        ALTER TABLE students ADD CONSTRAINT students_department_id_fkey 
        FOREIGN KEY (department_id) REFERENCES departments(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'students_session_id_fkey'
    ) THEN
        ALTER TABLE students ADD CONSTRAINT students_session_id_fkey 
        FOREIGN KEY (session_id) REFERENCES sessions(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'students_semester_id_fkey'
    ) THEN
        ALTER TABLE students ADD CONSTRAINT students_semester_id_fkey 
        FOREIGN KEY (semester_id) REFERENCES semesters(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'students_user_id_fkey'
    ) THEN
        ALTER TABLE students ADD CONSTRAINT students_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'lecturer_profiles_user_id_fkey'
    ) THEN
        ALTER TABLE lecturer_profiles ADD CONSTRAINT lecturer_profiles_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'results_student_id_fkey'
    ) THEN
        ALTER TABLE results ADD CONSTRAINT results_student_id_fkey 
        FOREIGN KEY (student_id) REFERENCES students(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'results_course_id_fkey'
    ) THEN
        ALTER TABLE results ADD CONSTRAINT results_course_id_fkey 
        FOREIGN KEY (course_id) REFERENCES courses(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'results_semester_id_fkey'
    ) THEN
        ALTER TABLE results ADD CONSTRAINT results_semester_id_fkey 
        FOREIGN KEY (semester_id) REFERENCES semesters(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'results_session_id_fkey'
    ) THEN
        ALTER TABLE results ADD CONSTRAINT results_session_id_fkey 
        FOREIGN KEY (session_id) REFERENCES sessions(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'student_courses_student_id_fkey'
    ) THEN
        ALTER TABLE student_courses ADD CONSTRAINT student_courses_student_id_fkey 
        FOREIGN KEY (student_id) REFERENCES students(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'student_courses_course_id_fkey'
    ) THEN
        ALTER TABLE student_courses ADD CONSTRAINT student_courses_course_id_fkey 
        FOREIGN KEY (course_id) REFERENCES courses(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'student_courses_session_id_fkey'
    ) THEN
        ALTER TABLE student_courses ADD CONSTRAINT student_courses_session_id_fkey 
        FOREIGN KEY (session_id) REFERENCES sessions(id);
    END IF;
END $$;

-- Add unique constraints only if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_student_course_session'
    ) THEN
        ALTER TABLE student_courses ADD CONSTRAINT unique_student_course_session 
        UNIQUE (student_id, course_id, session_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_matric_number'
    ) THEN
        ALTER TABLE students ADD CONSTRAINT unique_matric_number 
        UNIQUE (matric_number);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_employee_id'
    ) THEN
        ALTER TABLE lecturer_profiles ADD CONSTRAINT unique_employee_id 
        UNIQUE (employee_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_user_email'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT unique_user_email 
        UNIQUE (email);
    END IF;
END $$;

-- Create triggers only if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'trigger_auto_calculate_grade'
    ) THEN
        CREATE TRIGGER trigger_auto_calculate_grade
          BEFORE INSERT OR UPDATE ON results
          FOR EACH ROW
          EXECUTE FUNCTION auto_calculate_grade();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'trigger_update_students_updated_at'
    ) THEN
        CREATE TRIGGER trigger_update_students_updated_at
          BEFORE UPDATE ON students
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'trigger_update_lecturer_profiles_updated_at'
    ) THEN
        CREATE TRIGGER trigger_update_lecturer_profiles_updated_at
          BEFORE UPDATE ON lecturer_profiles
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'trigger_update_users_updated_at'
    ) THEN
        CREATE TRIGGER trigger_update_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'trigger_update_results_updated_at'
    ) THEN
        CREATE TRIGGER trigger_update_results_updated_at
          BEFORE UPDATE ON results
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Insert sample data
INSERT INTO departments (name, code) VALUES 
('Computer Science', 'CSC'),
('Mathematics', 'MTH'),
('Physics', 'PHY'),
('Chemistry', 'CHM'),
('Biology', 'BIO'),
('English', 'ENG'),
('Economics', 'ECO'),
('Accounting', 'ACC')
ON CONFLICT (name) DO NOTHING;

INSERT INTO semesters (name, code) VALUES 
('First Semester', 'FIRST'),
('Second Semester', 'SECOND')
ON CONFLICT (name) DO NOTHING;

INSERT INTO sessions (name, start_date, end_date, is_active) VALUES 
('2023/2024', '2023-09-01', '2024-07-31', true),
('2022/2023', '2022-09-01', '2023-07-31', false),
('2024/2025', '2024-09-01', '2025-07-31', false)
ON CONFLICT (name) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (name, code, level, units, department_id, semester_id) 
SELECT 
  'Software Engineering', 'CSC401', '400', 3, d.id, s.id
FROM departments d, semesters s 
WHERE d.code = 'CSC' AND s.code = 'FIRST'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (name, code, level, units, department_id, semester_id) 
SELECT 
  'Database Systems', 'CSC402', '400', 3, d.id, s.id
FROM departments d, semesters s 
WHERE d.code = 'CSC' AND s.code = 'FIRST'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (name, code, level, units, department_id, semester_id) 
SELECT 
  'Computer Networks', 'CSC403', '400', 2, d.id, s.id
FROM departments d, semesters s 
WHERE d.code = 'CSC' AND s.code = 'FIRST'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (name, code, level, units, department_id, semester_id) 
SELECT 
  'Web Development', 'CSC404', '400', 3, d.id, s.id
FROM departments d, semesters s 
WHERE d.code = 'CSC' AND s.code = 'SECOND'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (name, code, level, units, department_id, semester_id) 
SELECT 
  'Data Structures', 'CSC301', '300', 3, d.id, s.id
FROM departments d, semesters s 
WHERE d.code = 'CSC' AND s.code = 'FIRST'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (name, code, level, units, department_id, semester_id) 
SELECT 
  'Linear Algebra', 'MTH201', '200', 3, d.id, s.id
FROM departments d, semesters s 
WHERE d.code = 'MTH' AND s.code = 'SECOND'
ON CONFLICT (code) DO NOTHING;

-- Create demo accounts
INSERT INTO users (email, password_hash, role) VALUES 
('lecturer@demo.com', crypt('demo123', gen_salt('bf')), 'lecturer'),
('student@demo.com', crypt('demo123', gen_salt('bf')), 'student')
ON CONFLICT (email) DO NOTHING;

INSERT INTO lecturer_profiles (user_id, first_name, last_name, employee_id, department)
SELECT u.id, 'Demo', 'Lecturer', 'LEC001', 'Computer Science'
FROM users u 
WHERE u.email = 'lecturer@demo.com'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO students (user_id, first_name, last_name, matric_number, email, level, status, department_id, session_id, semester_id)
SELECT 
  u.id, 'Demo', 'Student', 'STU001', 'student@demo.com', '400', 'active', 
  d.id, sess.id, sem.id
FROM users u, departments d, sessions sess, semesters sem
WHERE u.email = 'student@demo.com' 
  AND d.code = 'CSC' 
  AND sess.name = '2023/2024'
  AND sem.code = 'FIRST'
ON CONFLICT (matric_number) DO NOTHING;

-- Insert sample results
INSERT INTO results (student_id, course_id, semester_id, session_id, score, remarks)
SELECT 
  st.id, c.id, sem.id, sess.id, 78, 'Good performance'
FROM students st, courses c, semesters sem, sessions sess
WHERE st.matric_number = 'STU001' 
  AND c.code = 'CSC401'
  AND sem.code = 'FIRST'
  AND sess.name = '2023/2024'
ON CONFLICT (student_id, course_id, semester_id, session_id) DO NOTHING;

INSERT INTO results (student_id, course_id, semester_id, session_id, score, remarks)
SELECT 
  st.id, c.id, sem.id, sess.id, 85, 'Excellent work'
FROM students st, courses c, semesters sem, sessions sess
WHERE st.matric_number = 'STU001' 
  AND c.code = 'CSC402'
  AND sem.code = 'FIRST'
  AND sess.name = '2023/2024'
ON CONFLICT (student_id, course_id, semester_id, session_id) DO NOTHING;

INSERT INTO results (student_id, course_id, semester_id, session_id, score, remarks)
SELECT 
  st.id, c.id, sem.id, sess.id, 72, 'Good understanding'
FROM students st, courses c, semesters sem, sessions sess
WHERE st.matric_number = 'STU001' 
  AND c.code = 'CSC403'
  AND sem.code = 'FIRST'
  AND sess.name = '2023/2024'
ON CONFLICT (student_id, course_id, semester_id, session_id) DO NOTHING;

-- Register demo student for courses
INSERT INTO student_courses (student_id, course_id, session_id)
SELECT 
  st.id, c.id, sess.id
FROM students st, courses c, sessions sess
WHERE st.matric_number = 'STU001' 
  AND c.code IN ('CSC401', 'CSC402', 'CSC403')
  AND sess.name = '2023/2024'
ON CONFLICT (student_id, course_id, session_id) DO NOTHING;
