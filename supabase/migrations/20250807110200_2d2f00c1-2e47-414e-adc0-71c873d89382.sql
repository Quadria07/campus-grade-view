-- Update level values from 100lv-400lv system to ND 1-ND 2 system

-- Update students table levels
UPDATE public.students 
SET level = CASE 
  WHEN level IN ('100', '100lv', '100 Level') THEN 'ND 1'
  WHEN level IN ('200', '200lv', '200 Level') THEN 'ND 2'
  WHEN level IN ('300', '300lv', '300 Level') THEN 'ND 2'
  WHEN level IN ('400', '400lv', '400 Level') THEN 'ND 2'
  ELSE 'ND 1'
END;

-- Update courses table levels
UPDATE public.courses 
SET level = CASE 
  WHEN level IN ('100', '100lv', '100 Level') THEN 'ND 1'
  WHEN level IN ('200', '200lv', '200 Level') THEN 'ND 2'
  WHEN level IN ('300', '300lv', '300 Level') THEN 'ND 2'
  WHEN level IN ('400', '400lv', '400 Level') THEN 'ND 2'
  ELSE 'ND 1'
END;