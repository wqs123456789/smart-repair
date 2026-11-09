import { supabase } from "./supabase";
import type { Area, Device, Status, Ticket, TicketRow } from "./types";

const TABLE = "tickets";

function toTicket(row: TicketRow): Ticket {
  return {
    id: row.id,
    name: row.name,
    area: row.area,
    device: row.device,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
  };
}

function explain(message: string): string {
  if (message.includes("row-level security")) {
    return "数据库拒绝了这次写入：tickets 表的 RLS 策略没有放行，请回到 Supabase SQL Editor 重新执行建表与策略语句。";
  }
  if (message.includes("relation") && message.includes("does not exist")) {
    return "找不到 tickets 表：请先在 Supabase SQL Editor 里执行建表语句。";
  }
  return message;
}

/** 按创建时间倒序返回全部工单 */
export async function listTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(explain(error.message));
  return ((data ?? []) as TicketRow[]).map(toTicket);
}

export async function getTicket(id: string): Promise<Ticket | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(explain(error.message));
  return data ? toTicket(data as TicketRow) : null;
}

export async function createTicket(input: {
  name: string;
  area: Area;
  device: Device;
  description: string;
}): Promise<Ticket> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      name: input.name,
      area: input.area,
      device: input.device,
      description: input.description,
    })
    .select("*")
    .single();

  if (error) throw new Error(explain(error.message));
  return toTicket(data as TicketRow);
}

export async function updateStatus(id: string, status: Status): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(explain(error.message));
}

export async function removeTicket(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(explain(error.message));
}
