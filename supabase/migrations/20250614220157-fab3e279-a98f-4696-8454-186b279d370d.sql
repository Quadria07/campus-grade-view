
-- Drop the existing check constraint on users.role
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- Create the app_role enum type first
CREATE TYPE public.app_role AS ENUM ('user', 'lecturer', 'super_admin');

-- First, let's check what values exist in the role column and map them properly
-- Update any existing roles to match our enum values
UPDATE public.users 
SET role = CASE 
  WHEN role = 'student' THEN 'user'
  WHEN role = 'lecturer' THEN 'lecturer'
  ELSE 'user'
END;

-- Now safely convert the column type
ALTER TABLE public.users 
ALTER COLUMN role TYPE app_role USING 
  CASE 
    WHEN role = 'user' THEN 'user'::app_role
    WHEN role = 'lecturer' THEN 'lecturer'::app_role
    WHEN role = 'super_admin' THEN 'super_admin'::app_role
    ELSE 'user'::app_role
  END;

-- Create user_roles table for proper role management
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS app_role[]
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT ARRAY_AGG(role)
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- Create RLS policies for user_roles
CREATE POLICY "Super admins can view all user roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage all user roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create RLS policies for other tables that super admins should access
CREATE POLICY "Super admins can manage all users"
  ON public.users
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage all students"
  ON public.students
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage all lecturer profiles"
  ON public.lecturer_profiles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage all courses"
  ON public.courses
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage all results"
  ON public.results
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage all departments"
  ON public.departments
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage all sessions"
  ON public.sessions
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage all semesters"
  ON public.semesters
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage all student courses"
  ON public.student_courses
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecturer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_courses ENABLE ROW LEVEL SECURITY;

-- Create function to create super admin account
CREATE OR REPLACE FUNCTION public.create_super_admin(
  p_email text,
  p_password text,
  p_first_name text,
  p_last_name text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Create user account
  INSERT INTO public.users (email, password_hash, role)
  VALUES (p_email, crypt(p_password, gen_salt('bf')), 'super_admin'::app_role)
  RETURNING id INTO new_user_id;
  
  -- Assign super admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'super_admin'::app_role);
  
  -- Create profile in lecturer_profiles (super admin can also be lecturer)
  INSERT INTO public.lecturer_profiles (
    user_id,
    first_name,
    last_name,
    employee_id,
    department
  ) VALUES (
    new_user_id,
    p_first_name,
    p_last_name,
    'ADMIN001',
    'Administration'
  );
  
  RETURN new_user_id;
END;
$$;

-- Create the initial super admin account
SELECT public.create_super_admin(
  'superadmin@university.edu',
  'SuperAdmin123!',
  'Super',
  'Admin'
);

-- Populate user_roles table with existing user roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role FROM public.users
ON CONFLICT (user_id, role) DO NOTHING;

-- Add updated_at trigger to user_roles
CREATE TRIGGER trigger_update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
