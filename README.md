# smart-repair · 智能报修小助手

两人协作实训项目。基于 Next.js + Tailwind CSS 的报修系统，逐步演进为接 Supabase 数据库、接 DeepSeek AI 建议、部署上线的完整应用。

## 技术栈

- **前端**：Next.js + Tailwind CSS
- **数据**：localStorage（第一阶段）→ Supabase Postgres（第二阶段）
- **AI**：DeepSeek `deepseek-chat`（第三阶段）
- **部署**：Vercel

## 功能

- 报修表单：姓名、办公区（A/B/C 区）、设备类型（电脑/打印机/投影仪）、故障描述
- 工单列表：提交人、办公区、设备、状态（待处理 / 处理中 / 已完成），可切换状态
- 工单详情：全部信息 + AI 自助排查建议

## 协作约定（所有人都要遵守）

1. **`main` 分支受保护，任何人不得直接 push。** 已在仓库 Settings → Rulesets 里开启 `Require a pull request before merging`，手滑直推会被 GitHub 拦下。
2. **一律走分支 + PR 流程**：

   ```bash
   git checkout -b feature/工单列表
   git add .
   git commit -m "feat: 工单列表页"
   git push -u origin feature/工单列表
   ```

   然后在 GitHub 上发起 Pull Request，由另一人在 Files changed 里审阅后合并。
3. **合并后双方都要 `git pull`**，保持本地与主线同步。
4. **密钥永远不上仓库。** `.env.local` 只存在于本地，`.gitignore` 已忽略它。
5. **接口先定契约，再各写各的。** 传什么参数、返回什么 JSON，先说清楚再动手。

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## 环境变量

在项目根目录新建 `.env.local`（**不要提交**）：

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DEEPSEEK_API_KEY=
```
