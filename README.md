# smart-repair · 智能报修小助手

两人协作实训项目。基于 Next.js + Tailwind CSS 的报修系统，已接入 Supabase 数据库，后续演进为接 DeepSeek AI 建议并部署上线。

## 技术栈

- **前端**：Next.js 16（App Router）+ Tailwind CSS 4 + TypeScript
- **数据**：Supabase Postgres（通过 `@supabase/supabase-js` 直连 REST API）
- **AI**：DeepSeek `deepseek-chat`（规划中）
- **部署**：Vercel

## 功能

- 报修表单：姓名、办公区（A/B/C 区）、设备类型（电脑/打印机/投影仪）、故障描述
- 工单列表：提交人、办公区、设备、状态（待处理 / 处理中 / 已完成），可在列表直接切换状态
- 工单详情：全部信息 + 删除 + AI 自助排查建议（预留位）

## 项目结构

```
app/
  layout.tsx            全局布局与导航
  page.tsx              报修表单（首页）
  tickets/page.tsx      工单列表
  tickets/[id]/page.tsx 工单详情
  globals.css           Tailwind 入口
components/
  status-badge.tsx      状态徽章
lib/
  supabase.ts           Supabase 客户端（读环境变量）
  tickets.ts            工单数据读写（增删改查）
  types.ts              类型与枚举常量
```

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## 环境变量

在项目根目录新建 `.env.local`（**已被 `.gitignore` 忽略，不要提交**）：

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable / anon key>
```

> ⚠️ 只使用 publishable（anon）key。`service_role` / `secret` key 会绕过 RLS，**绝不能**出现在前端代码或仓库里。

## 数据库

表 `public.tickets`，在 Supabase SQL Editor 中执行：

```sql
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text not null check (area in ('A区','B区','C区')),
  device text not null check (device in ('电脑','打印机','投影仪')),
  description text not null,
  status text not null default '待处理' check (status in ('待处理','处理中','已完成')),
  created_at timestamptz not null default now()
);

create index if not exists tickets_created_at_idx on public.tickets (created_at desc);

alter table public.tickets enable row level security;

create policy "tickets_select" on public.tickets for select using (true);
create policy "tickets_insert" on public.tickets for insert with check (true);
create policy "tickets_update" on public.tickets for update using (true) with check (true);
create policy "tickets_delete" on public.tickets for delete using (true);
```

> 实训简化：四条 RLS 策略全部放行，等于任何拿到 anon key 的人都能读写全部工单。生产环境应改为按用户身份限制，这是当前已知的安全债。

## 协作约定（所有人都要遵守）

1. **`main` 分支受保护，任何人不得直接 push。** 已在仓库 Settings → Rulesets 里开启 `Require a pull request before merging`，手滑直推会被 GitHub 拦下。
2. **一律走分支 + PR 流程**：

   ```bash
   git checkout -b feature/工单列表
   git add .
   git commit -m "feat: 工单列表页"
   git push -u origin feature/工单列表
   ```

   然后在 GitHub 上发起 Pull Request，审阅 Files changed 后合并。
3. **合并后双方都要 `git pull`**，保持本地与主线同步。
4. **密钥永远不上仓库。** `.env.local` 只存在于本地。
5. **接口先定契约，再各写各的。** 传什么参数、返回什么 JSON，先说清楚再动手。
