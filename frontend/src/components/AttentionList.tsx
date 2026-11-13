import { useEffect, useMemo, useState } from 'react';
import type { Message } from '../types';
import { createLocalFallbackDraft, logActivity, refreshSla, requestDraft, submitDraftFeedback } from '../api';

function formatDuration(minutes: number) {
  const amount = Math.abs(minutes);
  const hours = Math.floor(amount / 60);
  const mins = amount % 60;
  const duration = `${hours.toLocaleString('fa-IR')} ساعت و ${mins.toLocaleString('fa-IR')} دقیقه`;
  if (minutes > 0) return `${duration} تا پایان مهلت`;
  return `${duration} از مهلت گذشته`;
}

function formatReceived(value: string) {
  return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Tehran' }).format(new Date(value));
}

export default function AttentionList({ messages, onUrgentCount }: {
  ids?: string[];
  messages: Message[];
  onUrgentCount: (count: number) => void;
}) {
  const [slaById, setSlaById] = useState<Record<string, number>>(() => Object.fromEntries(messages.map(m => [m.message_id, m.business_minutes_left ?? 120])));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [generatedDrafts, setGeneratedDrafts] = useState<Record<string, string>>({});
  const [manualMode, setManualMode] = useState<Record<string, boolean>>({});
  const [draftLanguages, setDraftLanguages] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [slaUpdatedAt, setSlaUpdatedAt] = useState<Date>(new Date());

  const candidates = useMemo(() => messages.filter(m => !m.duplicate_of && m.severity_hint === 'high' && !m.answered_at), [messages]);

  // The browser supplies 
  // The browser supplies its current clock; the backend applies the official Tehran calendar.
  useEffect(() => {
    let cancelled = false;
    const update = async () => {
      if (!candidates.length) {
        setSlaById({});
        setSlaUpdatedAt(new Date());
        return;
      }
      try {
        const response = await refreshSla(candidates.map(m => m.received_at), new Date().toISOString());
        if (cancelled) return;
        const next: Record<string, number> = {};
        response.items.forEach((item, index) => { next[candidates[index].message_id] = item.business_minutes_left; });
        setSlaById(previous => ({ ...previous, ...next }));
        setSlaUpdatedAt(new Date());
      } catch {
        // Keep the last known server-calculated values if a refresh is temporarily unavailable.
      }
    };
    void update();
    const timer = window.setInterval(() => void update(), 60_000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [candidates]);

  const items = useMemo(() => candidates
    .map(message => ({ ...message, left: slaById[message.message_id] ?? message.business_minutes_left ?? 120 }))
    .sort((a, b) => a.left - b.left || Date.parse(a.received_at) - Date.parse(b.received_at)), [candidates, slaById]);

  const urgent = items.filter(message => message.left <= 0).length;
  useEffect(() => onUrgentCount(urgent), [urgent, onUrgentCount]);

  useEffect(() => {
    if (!items.length) { setSelectedId(null); return; }
    if (!selectedId || !items.some(message => message.message_id === selectedId)) setSelectedId(items[0].message_id);
  }, [items, selectedId]);

  const selected = items.find(message => message.message_id === selectedId) ?? items[0] ?? null;
  const selectedDraft = selected ? (drafts[selected.message_id] ?? '') : '';
  const selectedWarning = selected ? warnings[selected.message_id] : '';

  async function createDraft(message: Message) {
    setSelectedId(message.message_id);
    setBusy(message.message_id);
    setCopied(null);
    setManualMode(previous => ({ ...previous, [message.message_id]: false }));
    setWarnings(previous => ({ ...previous, [message.message_id]: '' }));
    setDrafts(previous => ({ ...previous, [message.message_id]: '' }));
    void logActivity('draft_requested', message.message_id);
    try {
      const response = await requestDraft({ message_id: message.message_id, customer_id: message.customer_id, subject: message.subject, body: message.body });
      setDraftLanguages(previous => ({ ...previous, [message.message_id]: response.language }));
      if (response.blocked || !response.draft.trim()) {
        const fallback = createLocalFallbackDraft(message);
        setDraftLanguages(previous => ({ ...previous, [message.message_id]: fallback.language }));
        setDrafts(previous => ({ ...previous, [message.message_id]: fallback.draft }));
        setGeneratedDrafts(previous => ({ ...previous, [message.message_id]: '' }));
        setWarnings(previous => ({ ...previous, [message.message_id]: response.warnings.join(' ') || 'پیش‌نویس امن تولید نشد؛ متن عمومی آماده شد.' }));
      } else {
        setDrafts(previous => ({ ...previous, [message.message_id]: response.draft }));
        setGeneratedDrafts(previous => ({ ...previous, [message.message_id]: response.draft }));
        setWarnings(previous => ({ ...previous, [message.message_id]: response.warnings.join(' ') }));
      }
    } catch {
      const fallback = createLocalFallbackDraft(message);
      setDraftLanguages(previous => ({ ...previous, [message.message_id]: fallback.language }));
      setDrafts(previous => ({ ...previous, [message.message_id]: fallback.draft }));
      setGeneratedDrafts(previous => ({ ...previous, [message.message_id]: '' }));
      setWarnings(previous => ({ ...previous, [message.message_id]: fallback.warnings.join(' ') }));
    } finally { setBusy(null); }
  }

  async function approveDraft() {
    if (!selected || selectedDraft === undefined || !selectedDraft.trim()) return;
    try {
      await navigator.clipboard.writeText(selectedDraft);
      setCopied(selected.message_id);
      setWarnings(previous => ({ ...previous, [selected.message_id]: '' }));
      try {
        await submitDraftFeedback({
          message_id: selected.message_id,
          language: draftLanguages[selected.message_id] ?? 'fa',
          generated_draft: manualMode[selected.message_id] ? '' : (generatedDrafts[selected.message_id] ?? ''),
          approved_text: selectedDraft,
          source: manualMode[selected.message_id] ? 'manual' : 'ai',
        });
      } catch {
        setWarnings(previous => ({ ...previous, [selected.message_id]: 'متن کپی شد، اما ثبت بازخورد در تاریخچه انجام نشد.' }));
      }
    } catch {
      setWarnings(previous => ({ ...previous, [selected.message_id]: 'دسترسی کپی در مرورگر فعال نیست؛ متن را دستی کپی کنید.' }));
    }
  }

  function startManualReply(message: Message) {
    setSelectedId(message.message_id);
    setDrafts(previous => ({ ...previous, [message.message_id]: '' }));
    setGeneratedDrafts(previous => ({ ...previous, [message.message_id]: '' }));
    setManualMode(previous => ({ ...previous, [message.message_id]: true }));
    setCopied(null);
    setWarnings(previous => ({ ...previous, [message.message_id]: '' }));
    void logActivity('draft_cleared_for_manual_reply', message.message_id);
  }

  return (
    <section className="ai-triage-card">
      <div className="ai-triage-heading">
        <div><div className="eyebrow">SMART REPLY WORKSPACE</div><h2>دستیار هوشمند پاسخ‌گویی</h2><p>پیام را از صف انتخاب کنید، پیش‌نویس را با Ollama بسازید و پس از ویرایش تأیید و کپی کنید.</p></div>
        <div className="assistant-model-chip"><span className="assistant-pulse" /> مدل محلی · Qwen3-Coder 30B</div>
      </div>
      <div className="ai-workspace-grid">
        <aside className="queue-panel" aria-label="صف پیام‌های نیازمند رسیدگی">
          <div className="queue-panel-heading"><div><strong>صف نیازمند رسیدگی</strong><span>{items.length.toLocaleString('fa-IR')} پیام مهمِ بدون پاسخ</span></div><span className="queue-urgent-count">{urgent.toLocaleString('fa-IR')} فوری</span></div>
          {items.length === 0 ? <div className="queue-empty"><span>✓</span><strong>صف رسیدگی خالی است</strong><small>در حال حاضر پیام مهمِ بدون پاسخ وجود ندارد.</small></div> : (
            <ul className="attention-queue">{items.map(message => {
              const active = selected?.message_id === message.message_id;
              return <li key={message.message_id} className={`attention-queue-item ${active ? 'selected' : ''}`} data-testid="attention-row" data-message-id={message.message_id} data-business-minutes-left={message.left}>
                <button type="button" className="queue-select" onClick={() => { setSelectedId(message.message_id); setCopied(null); void logActivity('message_selected', message.message_id); }} aria-pressed={active}>
                  <span className="queue-item-top"><code>{message.message_id}</code><span className={message.left <= 0 ? 'sla-overdue' : 'sla-safe'}>{formatDuration(message.left)}</span></span>
                  <strong dir="auto">{message.subject || 'بدون موضوع'}</strong><span className="queue-item-preview" dir="auto">{message.body}</span>
                  <span className="queue-item-meta">{message.channel} <i /> {formatReceived(message.received_at)}</span>
                </button>
                <button type="button" className="queue-draft-button" data-testid="draft-button" disabled={busy === message.message_id} onClick={() => void createDraft(message)}>
                  {busy === message.message_id ? <><span className="button-spinner" /> در حال تولید…</> : <><span>✦</span> تهیه پیش‌نویس پاسخ</>}
                </button>
              </li>;
            })}</ul>
          )}
        </aside>
        <section className="assistant-chat-panel" aria-label="گفت‌وگوی دستیار هوشمند">
          <header className="assistant-chat-header"><div className="assistant-avatar">✦</div><div><strong>فضای آماده‌سازی پاسخ</strong><span>پیش‌نویس فقط با درخواست شما تولید می‌شود</span></div><span className="private-chip">خصوصی</span></header>
          {!selected ? <div className="chat-welcome"><div className="chat-welcome-icon">✦</div><h3>دستیار پاسخ‌گویی بازارچه</h3><p>با انتخاب یک پیام از صف، متن مشتری اینجا نمایش داده می‌شود. سپس می‌توانید پیش‌نویس پاسخ را با مدل محلی تولید کنید.</p></div> : (
            <div className="chat-thread">
              <div className="thread-context"><span>گفت‌وگو با مشتری</span><span>{selected.customer_id} · {selected.channel}</span></div>
              <article className="chat-message customer-chat-message"><div className="chat-message-meta"><span className="chat-person customer-person">م</span><div><strong>پیام مشتری</strong><small>{formatReceived(selected.received_at)}</small></div><code>{selected.message_id}</code></div>{selected.subject && <strong className="chat-subject" dir="auto">{selected.subject}</strong>}<p dir="auto" className="chat-message-body">{selected.body}</p>{selected.order_ref && <span className="order-reference">سفارش {selected.order_ref}</span>}</article>
              <article className="chat-message assistant-chat-message"><div className="chat-message-meta"><span className="chat-person assistant-person">{manualMode[selected.message_id] ? 'م' : '✦'}</span><div><strong>{manualMode[selected.message_id] ? 'پاسخ دستی اپراتور' : 'دستیار هوشمند'}</strong><small>{manualMode[selected.message_id] ? 'متن را خودتان بنویسید' : 'پیش‌نویس پیشنهادی · قابل ویرایش'}</small></div>{!manualMode[selected.message_id] && <span className="ai-generated-label">AI DRAFT</span>}</div>
                {busy === selected.message_id ? <div className="generating-state"><span className="generating-dots"><i /><i /><i /></span><div><strong>در حال آماده‌سازی پاسخ…</strong><small>مدل محلی در حال بررسی پیام است. این مرحله ممکن است کمی زمان ببرد.</small></div></div> : (manualMode[selected.message_id] || (selectedDraft !== undefined && selectedDraft.length > 0)) ? <><textarea data-testid="draft-text" className="assistant-draft-editor" dir="auto" aria-label="پیش‌نویس قابل ویرایش" value={selectedDraft} onChange={event => { setDrafts(previous => ({ ...previous, [selected.message_id]: event.target.value })); setCopied(null); }} /><div className="draft-editor-footer"><span>متن را قبل از تأیید بررسی و ویرایش کنید.</span><span>{selectedDraft.length.toLocaleString('fa-IR')} نویسه</span></div><div className="assistant-actions"><button type="button" className="copy-draft-button" data-testid="draft-approve" disabled={!selectedDraft.trim()} onClick={() => void approveDraft()}>{copied === selected.message_id ? '✓ متن کپی شد و در تاریخچه ثبت شد' : 'تأیید و کپی پاسخ'}</button>{!manualMode[selected.message_id] && <button type="button" className="manual-reply-button" onClick={() => startManualReply(selected)}>پاک کردن و نوشتن دستی</button>}<span>هیچ پیامی به مشتری ارسال نمی‌شود.</span></div></> : <div className="draft-placeholder"><span className="draft-placeholder-icon">✧</span><strong>هنوز پیش‌نویسی ساخته نشده است</strong><p>برای جلوگیری از مصرف بی‌مورد منابع مدل، تولید پاسخ فقط با کلیک روی «تهیه پیش‌نویس پاسخ» انجام می‌شود.</p></div>}
                {selectedWarning && <div className="assistant-warning" data-testid="draft-warning"><strong>وضعیت پیش‌نویس</strong><span>{selectedWarning}</span></div>}
              </article>
              <div className="chat-safety-note"><span>盾</span> متن مشتری ورودی غیرقابل‌اعتماد است. پاسخ فقط پس از بررسی و کپی توسط شما قابل استفاده است.</div>
            </div>
          )}
          <div className="sla-updated-note">آخرین محاسبه مهلت: {new Intl.DateTimeFormat('fa-IR', { timeStyle: 'short', timeZone: 'Asia/Tehran' }).format(slaUpdatedAt)} · به‌روزرسانی خودکار هر دقیقه</div>
        </section>
      </div>
    </section>
  );
}
