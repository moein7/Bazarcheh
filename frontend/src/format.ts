export function formatPercent(part: number, total: number): string {
  if (!total) return '0.0%';
  return `${((part / total) * 100).toFixed(1)}%`;
}

export function formatCategory(cat: string): string {
  const labels: Record<string, string> = {
    delivery: 'ارسال و تحویل', payment: 'پرداخت', refund: 'بازپرداخت',
    product_quality: 'کیفیت کالا', account: 'حساب کاربری', other: 'سایر',
  };
  return labels[cat] ?? cat.replace(/_/g, ' ');
}

export function formatDate(iso: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Tehran' }).format(d);
}
