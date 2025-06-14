
-- Update the verify_user_password function to return proper types
CREATE OR REPLACE FUNCTION public.verify_user_password(p_email text, p_password text)
RETURNS TABLE(user_id uuid, role text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.role::text
  FROM public.users u
  WHERE u.email = p_email 
    AND u.password_hash = crypt(p_password, u.password_hash)
    AND u.is_active = true;
END;
$$;
