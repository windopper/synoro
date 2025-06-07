import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Vector3 } from "three"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 