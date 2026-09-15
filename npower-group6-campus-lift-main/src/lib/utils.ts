import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtNum(n: number, digits = 0) {
  return n.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

export function fmtSigned(n: number, digits = 2) {
  const v = n.toFixed(digits);
  return n > 0 ? `+${v}` : v;
}
