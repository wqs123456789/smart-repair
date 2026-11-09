export type Area = "A区" | "B区" | "C区";
export type Device = "电脑" | "打印机" | "投影仪";
export type Status = "待处理" | "处理中" | "已完成";

/** 前端使用的工单模型（驼峰命名） */
export interface Ticket {
  id: string;
  name: string;
  area: Area;
  device: Device;
  description: string;
  status: Status;
  createdAt: string;
}

/** 数据库原始行（下划线命名），与 public.tickets 表结构一一对应 */
export interface TicketRow {
  id: string;
  name: string;
  area: Area;
  device: Device;
  description: string;
  status: Status;
  created_at: string;
}

export const AREAS: Area[] = ["A区", "B区", "C区"];
export const DEVICES: Device[] = ["电脑", "打印机", "投影仪"];
export const STATUSES: Status[] = ["待处理", "处理中", "已完成"];
