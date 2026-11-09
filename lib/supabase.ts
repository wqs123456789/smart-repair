import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "缺少 Supabase 环境变量：请在项目根目录创建 .env.local，写入 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY（部署到 Vercel 时要在 Settings → Environment Variables 里同样配一份）",
  );
}

export const supabase = createClient(url, anonKey);
