export type Area = "A区" | "B区" | "C区";
export type Device = "电脑" | "打印机" | "投影仪";
export type Status = "待处理" | "处理中" | "已完成";

export interface Ticket {
  id: string;
  name: string;
  area: Area;
  device: Device;
  description: string;
  status: Status;
  createdAt: string;
}

export const AREAS: Area[] = ["A区", "B区", "C区"];
export const DEVICES: Device[] = ["电脑", "打印机", "投影仪"];
export const STATUSES: Status[] = ["待处理", "处理中", "已完成"];

const STORAGE_KEY = "smart-repair:tickets";

function readAll(): Ticket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Ticket[]) : [];
  } catch {
    return [];
  }
}

function writeAll(tickets: Ticket[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

/** 按创建时间倒序返回全部工单 */
export function listTickets(): Ticket[] {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getTicket(id: string): Ticket | null {
  return readAll().find((ticket) => ticket.id === id) ?? null;
}

export function createTicket(input: {
  name: string;
  area: Area;
  device: Device;
  description: string;
}): Ticket {
  const ticket: Ticket = {
    ...input,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    status: "待处理",
    createdAt: new Date().toISOString(),
  };
  const all = readAll();
  all.push(ticket);
  writeAll(all);
  return ticket;
}

export function updateStatus(id: string, status: Status): void {
  const all = readAll();
  const index = all.findIndex((ticket) => ticket.id === id);
  if (index === -1) return;
  all[index] = { ...all[index], status };
  writeAll(all);
}

export function removeTicket(id: string): void {
  writeAll(readAll().filter((ticket) => ticket.id !== id));
}
