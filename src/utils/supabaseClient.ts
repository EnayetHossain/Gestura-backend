import config from '@config/config';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(config.supbase_url, config.supabase_service_role_key)
