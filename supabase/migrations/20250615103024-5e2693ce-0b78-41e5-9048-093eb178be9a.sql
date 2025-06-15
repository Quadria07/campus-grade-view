
-- Update the create_user_with_password function to properly handle the role parameter
CREATE OR REPLACE FUNCTION public.create_user_with_password(p_email text, p_password text, p_role text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert new user with hashed password and cast role to app_role enum
  INSERT INTO public.users (email, password_hash, role)
  VALUES (p_email, crypt(p_password, gen_salt('bf')), p_role::app_role)
  RETURNING id INTO new_user_id;
  
  -- Insert into user_roles table as well
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, p_role::app_role);
  
  RETURN new_user_id;
END;
$$;
