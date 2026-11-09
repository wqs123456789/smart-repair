"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { STATUSES, type Status, type Ticket } from "@/lib/types";
import { listTickets, updateStatus } from "@/lib/tickets";

const SELECT_STYLES: Record<Status, string> = {
  待处理: "border-amber-300 bg-amber-50 text-amber-700",
  处理中: "border-sky-300 bg-sky-50 text-sky-700",
  已完成: "border-emerald-300 bg-emerald-50 text-emerald-700",
};

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setTickets(await listTickets());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "读取工单失败");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleStatusChange(id: string, status: Status) {
    const previous = tickets;
    setTickets(
      tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, status } : ticket,
      ),
    );
    try {
      await updateStatus(id, status);
    } catch (err) {
      setTickets(previous);
      setError(err instanceof Error ? err.message : "状态更新失败");
    }
  }

  if (!loaded) {
    return <p className="py-16 text-center text-sm text-slate-400">加载中…</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">工单列表</h1>
          <p className="mt-1 text-sm text-slate-500">
            共 {tickets.length} 条工单，点标题可以看全部信息和处理详情。
          </p>
        </div>
        <Link
          href="/"
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          + 新建报修
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-700">
          {error}
        </p>
      )}

      {tickets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <p className="text-sm text-slate-500">还没有工单</p>
          <Link
            href="/"
            className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            去提交第一条报修 →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">提交人</th>
                <th className="px-5 py-3 font-medium">办公区</th>
                <th className="px-5 py-3 font-medium">设备</th>
                <th className="px-5 py-3 font-medium">状态</th>
                <th className="px-5 py-3 font-medium">提交时间</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="font-medium text-slate-900 hover:text-indigo-600"
                    >
                      {ticket.name}
                    </Link>
                    <p className="mt-0.5 line-clamp-1 max-w-xs text-xs text-slate-400">
                      {ticket.description}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                    {ticket.area}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                    {ticket.device}
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={ticket.status}
                      onChange={(event) =>
                        handleStatusChange(
                          ticket.id,
                          event.target.value as Status,
                        )
                      }
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium outline-none transition focus:ring-2 focus:ring-indigo-100 ${SELECT_STYLES[ticket.status]}`}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
                    {formatTime(ticket.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      详情 →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
