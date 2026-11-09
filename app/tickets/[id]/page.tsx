"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StatusBadge from "@/components/status-badge";
import {
  STATUSES,
  getTicket,
  removeTicket,
  updateStatus,
  type Status,
  type Ticket,
} from "@/lib/storage";

const FIELDS: { label: string; key: keyof Pick<Ticket, "name" | "area" | "device"> }[] = [
  { label: "提交人", key: "name" },
  { label: "办公区", key: "area" },
  { label: "设备类型", key: "device" },
];

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setTicket(getTicket(id));
    setLoaded(true);
  }, [id]);

  function handleStatusChange(status: Status) {
    if (!ticket) return;
    updateStatus(ticket.id, status);
    setTicket({ ...ticket, status });
  }

  function handleDelete() {
    if (!ticket) return;
    removeTicket(ticket.id);
    window.location.href = "/tickets";
  }

  if (!loaded) {
    return <p className="py-16 text-center text-sm text-slate-400">加载中…</p>;
  }

  if (!ticket) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <p className="text-sm text-slate-500">找不到这条工单，可能已经删除了。</p>
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
            className="rounded-lg px-3 py-1.5 text-sm text-rose-600 transition hover:bg-rose-50"
          >
            删除这条工单
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
