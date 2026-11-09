import type { Status } from "@/lib/types";

const STYLES: Record<Status, string> = {
  待处理: "bg-amber-50 text-amber-700 ring-amber-200",
  处理中: "bg-sky-50 text-sky-700 ring-sky-200",
  已完成: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
