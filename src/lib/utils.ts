import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatCurrency(amountPaise: number, currency: 'INR' | 'USD' = 'INR'): string {
  const amount = currency === 'INR' ? amountPaise / 100 : amountPaise / 100
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatFileSize(sizeKb: number): string {
  if (sizeKb < 1024) return `${sizeKb} KB`
  return `${(sizeKb / 1024).toFixed(1)} MB`
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'  // emerald
  if (score >= 60) return '#06b6d4'  // cyan
  if (score >= 40) return '#f59e0b'  // amber
  return '#ef4444'                    // red
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Average'
  return 'Needs Work'
}

export function getScoreClass(score: number): string {
  if (score >= 80) return 'score-excellent'
  if (score >= 60) return 'score-good'
  if (score >= 40) return 'score-average'
  return 'score-poor'
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).slice(2, 10)
  return prefix ? `${prefix}_${id}` : id
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  const masked = user.slice(0, 2) + '*'.repeat(Math.max(0, user.length - 2))
  return `${masked}@${domain}`
}

export function bytesToKb(bytes: number): number {
  return Math.round(bytes / 1024)
}

export function getGradientByScore(score: number): string {
  if (score >= 80) return 'linear-gradient(135deg, #10b981, #06b6d4)'
  if (score >= 60) return 'linear-gradient(135deg, #06b6d4, #4f5eff)'
  if (score >= 40) return 'linear-gradient(135deg, #f59e0b, #f97316)'
  return 'linear-gradient(135deg, #ef4444, #f97316)'
}
