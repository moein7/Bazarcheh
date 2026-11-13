import { useMemo, useState } from 'react';
import type { Message } from '../types';
import { createLocalFallbackDraft, logActivity, requestDraft, submitDraftFeedback } from '../api';
import { formatCategory, formatDate } from '../format';

type SortMode = 'newest' | 'oldest' | 'urgent' | 'category';

export default function MessagesTable({ messages, initialCategory = 'all', showCategoryFilter = true }: { messages: Message[]; initialCategory?: string; showCategoryFilter?: boolean }) {
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortMode>('newest');
  const [query, setQuery] = useState('');
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);
  const [draft, setDraft] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [draftLanguage, setDraftLanguage] = useState('fa');
  const [draftWarning, setDraftWarning] = useState('');
  const [draftBusy, setDraftBusy] = useState(false);
  const [draftCopied, setDraftCopied] = useState(false);

  const rows = useMemo(() => {
    const filtered = messages.filter(message => {
      const categoryMatch = category === 'all' || message.category === category;
      const needle = query.trim().toLocaleLowerCase();
      const searchMatch = !needle || [message.message_id, message.customer_id, message.order_ref ?? '', message.subject, message.body]
        .some(value => value.toLocaleLowerCase().includes(needle));
      return categoryMatch && searchMatch;
    });
    return filtered.sort((a, b) => {
      if (sort === 'oldest') return Date.parse(a.received_at) - Date.parse(b.received_at);
      if (sort === 'urgent') return Number(b.is_urgent) - Number(a.is_urgent) || Date.parse(a.received_at) - Date.parse(b.received_at);
      if (sort === 'category') return a.category.localeCompare(b.category) || Date.parse(b.received_at) - Date.parse(a.received_at);
      return Date.parse(b.received_at) - Date.parse(a.received_at);
    });
  }, [messages, category, sort, query]);

  function changeCategory(value: string) {
    setCategory(value);
    void logActivity('category_filter_changed', undefined, { category: value });
  }
  function changeSort(value: SortMode) {
    setSort(value);
    void logActivity('sort_changed', undefined, { sort: value });
  }

  async function openReply(message: Message) {
    setReplyMessage(message);
    setDraft('');
    setGeneratedDraft('');
    setManualMode(false);
    setDraftWarning('');
    setDraftCopied(false);
    setDraftBusy(true);
    void logActivity('draft_requested_from_all_messages', message.message_id);
    try {
      const response = await requestDraft({ message_id: message.message_id, customer_id: message.customer_id, subject: message.subject, body: message.body });
      setDraftLanguage(response.language);
      if (response.blocked || !response.draft.trim()) {
        const fallback = createLocalFallbackDraft(message);
        setDraft(fallback.draft);
        setGeneratedDraft('');
        setDraftLanguage(fallback.language);
        setDraftWarning(response.warnings.join(' ') || 'پیش‌نویس امن تولید نشد؛ متن عمومی آماده شد.');
      } else {
        setDraft(response.draft);
        setGeneratedDraft(response.draft);
        setDraftWarning(response.warnings.join(' '));
      }
    } catch (error) {
      const fallback = createLocalFallbackDraft(message);
      setDraft(fallback.draft);
      setGeneratedDraft('');
      setDraftLanguage(fallback.language);
      setDraftWarning(fallback.warnings.join(' '));
    } finally {
      setDraftBusy(false);
    }
  }

  async function approveReply() {
    if (!replyMessage || !draft.trim()) return;
    try {
      await navigator.clipboard.writeText(draft);
      setDraftCopied(true);
      try {
        await submitDraftFeedback({ message_id: replyMessage.message_id, language: draftLanguage, generated_draft: manualMode ? '' : generatedDraft, approved_text: draft, source: manualMode ? 'manual' : 'ai' });
        // The feedback endpoint records AI and manual copy events with the correct source.
      } catch {
        setDraftWarning('متن کپی شد، اما ثبت بازخورد در تاریخچه انجام نشد.');
      }
    } catch {
      setDraftWarning('دسترسی کپی در مرورگر فعال نیست؛ متن را دستی کپی کنید.');
    }
  }

  function startManualReply() {
    if (!replyMessage) return;
    setDraft('');
    setGeneratedDraft('');
    setManualMode(true);
    setDraftCopied(false);
    setDraftWarning('');
    void logActivity('draft_cleared_for_manual_reply', replyMessage.message_id);
  }

  return <>
    <section className="card messages-view-card">
      <div className="messages-toolbar-heading"><div><h2>همه پیام‌ها</h2><p className="muted">پیام‌ها را بر اساس دسته‌بندی، زمان و اولویت مرتب و فیلتر کنید؛ برای هر پیام هم می‌توانید پیش‌نویس پاسخ بسازید.</p></div><span className="messages-result-count">{rows.length.toLocaleString('fa-IR')} نتیجه</span></div>
      <div className="messages-filters">
        {showCategoryFilter && <label>دسته‌بندی
          <select data-testid="category-filter" value={category} onChange={e => changeCategory(e.target.value)}>
            <option value="all">همه دسته‌ها</option>
            <option value="delivery">ارسال و تحویل</option><option value="payment">پرداخت</option><option value="refund">بازپرداخت</option>
            <option value="product_quality">کیفیت کالا</option><option value="account">حساب کاربری</option><option value="other">سایر</option>
          </select>
        </label>}
        <label>مرتب‌سازی
          <select data-testid="message-sort" value={sort} onChange={e => changeSort(e.target.value as SortMode)}>
            <option value="newest">جدیدترین ابتدا</option><option value="oldest">قدیمی‌ترین ابتدا</option><option value="urgent">فوری‌ها ابتدا</option><option value="category">بر اساس دسته‌بندی</option>
          </select>
        </label>
        <label className="message-search">جست‌وجو
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="شناسه، مشتری، سفارش یا متن پیام…" />
        </label>
      </div>
      <div className="table-wrap"><table><thead><tr><th>شناسه</th><th>دسته</th><th>فوری</th><th>سفارش</th><th>کانال</th><th>زمان دریافت (تهران)</th><th>موضوع</th><th>متن پیام</th><th>پاسخ</th></tr></thead><tbody>
        {rows.map(m => <tr key={m.message_id}><td><code>{m.message_id}</code></td><td>{formatCategory(m.category)}</td><td>{m.is_urgent ? 'بله' : '-'}</td><td>{m.order_ref ?? '-'}</td><td>{m.channel}</td><td>{formatDate(m.received_at)}</td><td dir="auto">{m.subject}</td><td dir="auto" className="body-cell">{m.body}</td><td><button type="button" className="table-reply-button" data-testid="message-reply-button" onClick={() => void openReply(m)}>✦ پاسخ</button></td></tr>)}
        {!rows.length && <tr><td colSpan={9} className="table-empty">پیامی با این فیلتر پیدا نشد.</td></tr>}
      </tbody></table></div>
    </section>

    {replyMessage && <div className="message-reply-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !draftBusy) setReplyMessage(null); }}>
      <section className="message-reply-dialog" role="dialog" aria-modal="true" aria-labelledby="message-reply-title">
        <header className="message-reply-dialog-header"><div><span className="eyebrow">AI REPLY ASSISTANT</span><h2 id="message-reply-title">پاسخ به پیام مشتری</h2><p>{replyMessage.message_id} · {replyMessage.customer_id} · {replyMessage.channel}</p></div><button type="button" className="message-reply-close" aria-label="بستن" onClick={() => !draftBusy && setReplyMessage(null)}>×</button></header>
        <article className="message-reply-customer"><strong>پیام مشتری</strong>{replyMessage.subject && <b dir="auto">{replyMessage.subject}</b>}<p dir="auto">{replyMessage.body}</p></article>
        <div className="message-reply-result"><div className="message-reply-result-heading"><strong>{manualMode ? 'پاسخ دستی اپراتور' : 'پیش‌نویس پیشنهادی دستیار'}</strong><span>{manualMode ? 'متن مستقل اپراتور' : 'قابل ویرایش'}</span></div>
          {draftBusy ? <div className="generating-state"><span className="generating-dots"><i /><i /><i /></span><div><strong>در حال آماده‌سازی پاسخ…</strong><small>مدل محلی در حال بررسی پیام است.</small></div></div> : (draft || manualMode) ? <><textarea className="assistant-draft-editor" data-testid="all-message-draft" dir="auto" value={draft} onChange={event => { setDraft(event.target.value); setDraftCopied(false); }} /><div className="draft-editor-footer"><span>پاسخ را بررسی و در صورت نیاز ویرایش کنید.</span><span>{draft.length.toLocaleString('fa-IR')} نویسه</span></div><div className="assistant-actions"><button type="button" className="copy-draft-button" disabled={!draft.trim()} onClick={() => void approveReply()}>{draftCopied ? '✓ متن کپی شد' : 'تأیید و کپی پاسخ'}</button>{!manualMode && <button type="button" className="manual-reply-button" onClick={startManualReply}>پاک کردن و نوشتن دستی</button>}<span>پیام مستقیماً برای مشتری ارسال نمی‌شود.</span></div></> : <div className="draft-placeholder"><strong>پیش‌نویس در دسترس نیست</strong><p>در صورت اختلال سرویس، متن عمومی قابل ویرایش نمایش داده می‌شود.</p></div>}
          {draftWarning && <div className="assistant-warning" role="alert"><strong>وضعیت پیش‌نویس</strong><span>{draftWarning}</span></div>}
        </div>
        <footer className="message-reply-dialog-footer"><span>پاسخ تولیدشده باید پیش از استفاده توسط شما بررسی شود.</span><button type="button" onClick={() => setReplyMessage(null)} disabled={draftBusy}>بستن</button></footer>
      </section>
    </div>}
  </>;
}
