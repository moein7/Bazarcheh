import { useEffect, useState } from 'react';
import { getActivityLogs } from '../api';
import type { ActivityLogItem, ActivityLogResponse } from '../types';

const labels: Record<string, string> = {
  csv_analyzed: 'تحلیل فایل پیام‌ها', draft_generated: 'تولید پیش‌نویس هوشمند', draft_fallback: 'استفاده از پاسخ جایگزین بدون AI', draft_blocked: 'توقف تولید پاسخ ناامن',
  message_selected: 'انتخاب پیام', category_filter_changed: 'تغییر فیلتر دسته‌بندی', sort_changed: 'تغییر مرتب‌سازی',
  draft_requested: 'درخواست پیش‌نویس', draft_approved_and_copied: 'تأیید و کپی پاسخ هوشمند', draft_copied: 'کپی پاسخ', view_opened: 'باز کردن بخش',
  draft_cleared_for_manual_reply: 'پاک کردن پیش‌نویس و شروع پاسخ دستی', manual_reply_copied: 'کپی پاسخ دستی اپراتور', draft_approved_and_copied_from_all_messages: 'تأیید و کپی پاسخ از همه پیام‌ها',
  app_started: 'راه‌اندازی سرویس', analysis_failed: 'خطا در تحلیل فایل',
};
const dateTime = (value: string) => new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Tehran' }).format(new Date(value));

export default function ActivityLog() {
  const [filter, setFilter] = useState('all');
  const [data, setData] = useState<ActivityLogResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function load() {
    setLoading(true); setError('');
    try { setData(await getActivityLogs(filter)); } catch (e) { setError(e instanceof Error ? e.message : 'خطا در دریافت تاریخچه'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, [filter]);
  const items: ActivityLogItem[] = data?.items ?? [];
  return <section className="card activity-page">
    <div className="messages-toolbar-heading"><div><h2>تاریخچه فعالیت‌ها و حافظه دستیار</h2><p className="muted">رویدادهای کاربر و هوش مصنوعی ثبت می‌شوند. متن کامل مشتری و پرامپت‌ها در گزارش ذخیره نمی‌شوند.</p></div><button className="activity-refresh" onClick={() => void load()} disabled={loading}>{loading ? 'در حال دریافت…' : 'به‌روزرسانی'}</button></div>
    <div className="learning-memory-card"><div className="learning-memory-icon">✦</div><div><strong>حافظه سبک پاسخ‌گویی</strong><p>پاسخ‌هایی که اپراتور تأیید و کپی می‌کند، پس از حذف شناسه‌ها و اعداد به‌عنوان نمونه سبک نگهداری می‌شوند. مدل از آن‌ها برای لحن استفاده می‌کند، نه برای یادگیری خودکار پارامترها یا استفاده از اطلاعات پرونده‌های قبلی.</p></div><div className="memory-count"><b>{(data?.memory.approved_examples ?? 0).toLocaleString('fa-IR')}</b><span>نمونه تأییدشده</span></div></div>
    <div className="activity-filter-row"><label>نوع فعالیت <select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">همه فعالیت‌ها</option><option value="user">فعالیت کاربر</option><option value="ai">فعالیت هوش مصنوعی</option><option value="system">سیستم</option></select></label><span>{items.length.toLocaleString('fa-IR')} رویداد اخیر</span></div>
    {error && <div className="error-banner">{error}</div>}
    <div className="activity-list">{items.map(item => <article className="activity-row" key={item.id}><span className={`activity-type ${item.event_type}`}>{item.event_type === 'ai' ? 'AI' : item.event_type === 'user' ? 'کاربر' : 'سیستم'}</span><div className="activity-main"><strong>{labels[item.action] ?? item.action}</strong><span>{item.message_id ? `شناسه پیام: ${item.message_id}` : 'رویداد عمومی'}{typeof item.details.duration_ms === 'number' ? ` · ${(item.details.duration_ms / 1000).toLocaleString('fa-IR')} ثانیه` : ''}{typeof item.details.unique_messages === 'number' ? ` · ${item.details.unique_messages.toLocaleString('fa-IR')} پیام یکتا` : ''}{typeof item.details.model === 'string' ? ` · مدل ${item.details.model}` : ''}{typeof item.details.language === 'string' ? ` · زبان ${item.details.language === 'fa' ? 'فارسی' : item.details.language === 'en' ? 'انگلیسی' : 'تشخیص خودکار / چندزبانه'}` : ''}{typeof item.details.edited === 'boolean' ? ` · ${item.details.edited ? 'ویرایش‌شده' : 'بدون ویرایش'}` : ''}</span>{Array.isArray(item.details.warnings) && item.details.warnings.length > 0 && <small>{(item.details.warnings as string[]).join('، ')}</small>}</div><time>{dateTime(item.created_at)}</time></article>)}
    {!items.length && !loading && !error && <div className="table-empty">هنوز فعالیتی ثبت نشده است.</div>}</div>
  </section>;
}
