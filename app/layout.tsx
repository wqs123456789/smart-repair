import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "智能报修小助手",
  description: "办公室设备报修与工单跟踪",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                修
              </span>
              <span className="text-lg font-semibold tracking-tight">
                智能报修小助手
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm font-medium text-slate-600">
              <Link
                href="/"
                className="rounded-lg px-3 py-1.5 transition hover:bg-slate-100 hover:text-slate-900"
              >
                提交报修
              </Link>
              <Link
                href="/tickets"
                className="rounded-lg px-3 py-1.5 transition hover:bg-slate-100 hover:text-slate-900"
              >
                工单列表
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
        <footer className="mx-auto max-w-4xl px-6 pb-10 text-xs text-slate-400">
          smart-repair · 数据存于 Supabase，换设备也能看到同一批工单
        </footer>
      </body>
    </html>
  );
}
