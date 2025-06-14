
-- Create users table for lecturers and students
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('lecturer', 'student')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lecturer profiles table
CREATE TABLE public.lecturer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  employee_id TEXT UNIQUE,
  department TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student profiles table (extending existing students table relationship)
ALTER TABLE public.students ADD COLUMN user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_lecturer_profiles_user_id ON public.lecturer_profiles(user_id);
CREATE INDEX idx_students_user_id ON public.students(user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lecturer_profiles_updated_at
  BEFORE UPDATE ON public.lecturer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on new tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecturer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for users table (only allow users to see their own data)
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (id = auth.uid() OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (id = auth.uid());

-- RLS policies for lecturer profiles
CREATE POLICY "Lecturers can view own profile" ON public.lecturer_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Lecturers can update own profile" ON public.lecturer_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Lecturers can insert own profile" ON public.lecturer_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Function to create user with hashed password
CREATE OR REPLACE FUNCTION public.create_user_with_password(
  p_email TEXT,
  p_password TEXT,
  p_role TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert new user with hashed password
  INSERT INTO public.users (email, password_hash, role)
  VALUES (p_email, crypt(p_password, gen_salt('bf')), p_role)
  RETURNING id INTO new_user_id;
  
  RETURN new_user_id;
END;
$$;

-- Function to verify user password
CREATE OR REPLACE FUNCTION public.verify_user_password(
  p_email TEXT,
  p_password TEXT
) RETURNS TABLE(user_id UUID, role TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.role
  FROM public.users u
  WHERE u.email = p_email 
    AND u.password_hash = crypt(p_password, u.password_hash)
    AND u.is_active = true;
END;
$$;

-- Function to update user password
CREATE OR REPLACE FUNCTION public.update_user_password(
  p_user_id UUID,
  p_new_password TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET password_hash = crypt(p_new_password, gen_salt('bf')),
      updated_at = now()
  WHERE id = p_user_id;
  
  RETURN FOUND;
END;
$$;
