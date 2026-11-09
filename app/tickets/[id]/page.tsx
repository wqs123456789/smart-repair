"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import StatusBadge from "@/components/status-badge";
import { STATUSES, type Status, type Ticket } from "@/lib/types";
import { getTicket, removeTicket, updateStatus } from "@/lib/tickets";

const FIELDS: {
  label: string;
  key: keyof Pick<Ticket, "name" | "area" | "device">;
}[] = [
  { label: "提交人", key: "name" },
  { label: "办公区", key: "area" },
  { label: "设备类型", key: "device" },
];

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const found = await getTicket(id);
        if (!cancelled) setTicket(found);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "读取工单失败");
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleStatusChange(status: Status) {
    if (!ticket) return;
    const previous = ticket;
    setTicket({ ...ticket, status });
    try {
      await updateStatus(ticket.id, status);
      setError("");
    } catch (err) {
      setTicket(previous);
      setError(err instanceof Error ? err.message : "状态更新失败");
    }
  }

  async function handleDelete() {
    if (!ticket) return;
    setBusy(true);
    try {
      await removeTicket(ticket.id);
      router.push("/tickets");
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
      setBusy(false);
    }
  }

  if (!loaded) {
    return <p className="py-16 text-center text-sm text-slate-400">加载中…</p>;
  }

  if (!ticket) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <p className="text-sm text-slate-500">
          {error || "找不到这条工单，可能已经删除了。"}
        </p>
        <Link
          href="/tickets"
          className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          返回工单列表 →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/tickets"
        className="text-sm text-slate-500 transition hover:text-slate-900"
      >
        ← 返回工单列表
      </Link>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {ticket.device}故障 · {ticket.area}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              工单编号 {ticket.id.slice(0, 8)} · 提交于{" "}
              {new Date(ticket.createdAt).toLocaleString("zh-CN")}
            </p>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <dl className="grid gap-x-6 gap-y-4 py-5 sm:grid-cols-3">
          {FIELDS.map((field) => (
            <div key={field.key}>
              <dt className="text-xs text-slate-400">{field.label}</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">
                {ticket[field.key]}
              </dd>
            </div>
          ))}
        </dl>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-400">故障描述</p>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {ticket.description}
          </p>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm leading-relaxed text-rose-700">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">处理状态</span>
            <select
              value={ticket.status}
              onChange={(event) =>
                handleStatusChange(event.target.value as Status)
              }
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="rounded-lg px-3 py-1.5 text-sm text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
          >
            {busy ? "删除中…" : "删除这条工单"}
          </button>
        </div>
      </div>

      {/* 下一步：这里接 /api/suggest，显示 DeepSeek 生成的自助排查建议 */}
      <div className="mt-4 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-5">
        <p className="text-sm font-medium text-indigo-900">AI 自助排查建议</p>
        <p className="mt-1 text-xs leading-relaxed text-indigo-700/70">
          预留位置。下一步接入 DeepSeek，提交报修后自动生成 3 条排查建议显示在这里。
        </p>
      </div>
    </div>
  );
}
