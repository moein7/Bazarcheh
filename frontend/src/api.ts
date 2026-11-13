import type { ActivityLogResponse, AnalyzeResult, Draft } from './types';

export async function analyze(file: File, now?: string): Promise<AnalyzeResult> {
  const form = new FormData();
  form.append('file', file);
  const qs = now ? `?now=${encodeURIComponent(now)}` : '';
  const res = await fetch(`/api/analyze${qs}`, { method: 'POST', body: form });
  if (!res.ok) {
    throw new Error(`Analyze failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

export function createLocalFallbackDraft(message: { subject: string; body: string }): Draft {
  const text = `${message.subject ?? ''} ${message.body ?? ''}`;
  const persianCount = (text.match(/[\u0600-\u06ff]/g) ?? []).length;
  const latinCount = (text.match(/[a-z]/gi) ?? []).length;
  const finglish = /\b(salam|lotfan|sefaresh|kharab|nashode|pardakht|rahgiri|mamnoon|mersi)\b/i.test(text);
  const language = persianCount > 0 && persianCount >= latinCount * 0.5 || finglish ? 'fa' : 'en';
  const draft = language === 'fa'
    ? 'از اینکه موضوع را با ما در میان گذاشتید سپاسگزاریم. متوجه نگرانی شما هستیم. لطفاً اگر جزئیات دیگری وجود دارد، برای بررسی دقیق‌تر با ما در میان بگذارید.'
    : 'Thank you for contacting us. We understand your concern. If you can share any additional details, we can better understand the issue. Thank you for your patience.';
  return { message_id: '', draft, language, blocked: false, source: 'fallback', warnings: ['ارتباط با سرویس پاسخ‌گویی برقرار نشد؛ یک متن عمومی و قابل ویرایش آماده شد.'] };
}

export async function requestDraft(m: {
  message_id: string;
  customer_id: string;
  subject: string;
  body: string;
}): Promise<Draft> {
  const res = await fetch('/api/draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(m),
    signal: AbortSignal.timeout(40_000),
  });
  if (!res.ok) {
    throw new Error(`Draft failed (${res.status})`);
  }
  return res.json();
}


export async function refreshSla(receivedAt: string[], now: string): Promise<{ items: { received_at: string; business_minutes_left: number; is_urgent: boolean }[] }> {
  const res = await fetch('/api/sla/refresh', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ received_at: receivedAt, now }),
  });
  if (!res.ok) throw new Error(`SLA refresh failed (${res.status})`);
  return res.json();
}

export async function logActivity(action: string, messageId?: string, details: Record<string, string | number | boolean> = {}): Promise<void> {
  try {
    await fetch('/api/activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, message_id: messageId, details }) });
  } catch { /* Activity logging must never block support work. */ }
}

export async function submitDraftFeedback(payload: { message_id: string; language: string; generated_draft: string; approved_text: string; source?: 'ai' | 'manual' | 'fallback' }): Promise<void> {
  const res = await fetch('/api/draft/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(`Draft feedback failed (${res.status})`);
}

export async function getActivityLogs(eventType = 'all'): Promise<ActivityLogResponse> {
  const qs = eventType === 'all' ? '' : `?event_type=${encodeURIComponent(eventType)}`;
  const res = await fetch(`/api/logs${qs}`);
  if (!res.ok) throw new Error(`Could not load activity logs (${res.status})`);
  return res.json();
}
