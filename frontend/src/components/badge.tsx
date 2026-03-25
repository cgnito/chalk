import { clsx } from "clsx";
import { getStatusColor } from "../utils/formatters";

export const StatusBadge = ({ status }: { status: string }) => {
  const colors = getStatusColor(status);
  return (
    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", colors.bg, colors.text)}>
      <span className={clsx("w-1.5 h-1.5 rounded-full", colors.dot)} />
      {status}
    </span>
  );
};