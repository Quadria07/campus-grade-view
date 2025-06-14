
-- Delete all existing user accounts and profiles
DELETE FROM public.lecturer_profiles;
DELETE FROM public.students WHERE user_id IS NOT NULL;
DELETE FROM public.users;

-- Update students table to remove user_id references
UPDATE public.students SET user_id = NULL WHERE user_id IS NOT NULL;
