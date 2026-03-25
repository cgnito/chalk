export const formatNaira = (amount: number): string =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid": return { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400" };
    case "Partial": return { bg: "bg-amber-500/15", text: "text-amber-400", dot: "bg-amber-400" };
    default: return { bg: "bg-red-500/15", text: "text-red-400", dot: "bg-red-400" };
  }
};