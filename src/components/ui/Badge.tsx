import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "blue" | "green" | "red" | "gray" | "amber";
  className?: string;
}

export default function Badge({
  children,
  tone = "gray",
  className = "",
}: BadgeProps) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    red: "bg-rose-50 text-rose-700 ring-rose-200",
    gray: "bg-slate-100 text-slate-700 ring-slate-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
