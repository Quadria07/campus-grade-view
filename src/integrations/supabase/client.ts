// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fvqpjavuybvjphyvjmjw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2cXBqYXZ1eWJ2anBoeXZqbWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MDM2NjUsImV4cCI6MjA2NTQ3OTY2NX0.6yVMVc1LMxj7Q8Evhgn6jMYwt7hQjePSFNWm8f1vLbI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);