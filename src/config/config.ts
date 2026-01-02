import 'dotenv/config.js';

interface Config {
  supbase_url: string;
  supabase_service_role_key: string;
  bucket_name: string;
  db_url: string;
  port: number;
  node_env: string;
}

const config: Config = {
  supbase_url: String(process.env.SUPABASE_URL),
  supabase_service_role_key: String(process.env.SUPABASE_SERVICE_ROLE_KEY),
  bucket_name: String(process.env.BUCKET_NAME),
  db_url: String(process.env.DB_URI),
  port: Number(process.env.PORT) || 5000,
  node_env: String(process.env.NODE_ENV)
};

export default config;
