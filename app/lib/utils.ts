import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function renderUnit(value: number, unit: string, precision = 2) {
  return `${value.toFixed(precision)} ${unit}`;
}

export function formatSecondsInHHMM(seconds: number) {
  return `${Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0")}:${(Math.floor(seconds / 60) % 60)
    .toString()
    .padStart(2, "0")} (${seconds}s)`;
}
