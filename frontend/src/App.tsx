import { useEffect, useMemo, useState } from 'react';
import { analyze, logActivity } from './api';
import { type AnalyzeResult, type Category } from './types';
import UploadForm from './components/UploadForm';
import SummaryTiles from './components/SummaryTiles';
import CategoryBreakdown from './components/CategoryBreakdown';
import AttentionList from './components/AttentionList';
import MessagesTable from './components/MessagesTable';
import ActivityLog from './components/ActivityLog';
import { formatCategory } from './format';

type View = 'overview' | 'attention' | 'assistant' | 'messages' | 'logs';

const navItems: { id: View; label: string; icon: string }[] = [
  { id: 'overview', label: 'نمای کلی', icon: '▦' },
  { id: 'attention', label: 'نیازمند پیگیری', icon: '◉' },
  { id: 'assistant', label: 'دستیار هوشمند', icon: '✦' },
  { id: 'messages', label: 'همه پیام‌ها', icon: '☷' },
  { id: 'logs', label: 'تاریخچه فعالیت‌ها', icon: '◷' },
];

export default function App() {
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [liveUrgent, setLiveUrgent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('overview');
  const [fileName, setFileName] = useState('');
  const [clockNow, setClockNow] = useState(() => new Date());
  const [overviewCategory, setOverviewCategory] = useState<Category | 'all'>('all');

  useEffect(() => {
    const timer = window.setInterval(() => setClockNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  async function handleSubmit(file: File, now?: string) {
    setLoading(true); setError(null); setFileName(file.name);
    try { setResult(await analyze(file, now || new Date().toISOString())); setOverviewCategory('all'); setView('overview'); }
    catch (e) { setResult(null); setError(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); }
  }

  const pageTitle = useMemo(() => navItems.find(item => item.id === view)?.label ?? 'نمای کلی', [view]);

  return (
    <div className="app-shell" dir="rtl">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">ب</div>
          <div><strong>بازارچه</strong><span>مرکز عملیات پشتیبانی</span></div>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="منوی اصلی">
          {navItems.map(item => (
            <button key={item.id} className={`nav-item ${view === item.id ? 'active' : ''}`} onClick={() => { setView(item.id); void logActivity('view_opened', undefined, { view: item.id }); }}>
              <span className="nav-icon">{item.icon}</span><span>{item.label}</span>
              {item.id === 'attention' && <span className="nav-count">{liveUrgent.toLocaleString('fa-IR')}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="online-indicator"><i /> سرویس تحلیل فعال است</div>
          <div className="profile-card"><div className="avatar">س</div><div><strong>سارا</strong><span>مدیر پشتیبانی</span></div><span className="profile-more">•••</span></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div><div className="breadcrumb">بازارچه <span>/</span> پشتیبانی <span>/</span> {pageTitle}</div><h1>{pageTitle}</h1></div>
          <div className="topbar-actions">{result && <div className="topbar-urgent" data-testid="urgent-count"><span>{liveUrgent.toLocaleString('fa-IR')}</span> پیام فوری</div>}<div className="live-status"><i /> به‌روزرسانی زنده</div><div className="topbar-date"><span>{new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full', timeZone: 'Asia/Tehran' }).format(clockNow)}</span><strong data-testid="live-clock">{new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Tehran' }).format(clockNow)}</strong></div></div>
        </header>

        <div className="content-area">
          <section className="welcome-row">
            <div><h2>{view === 'overview' ? 'سلام سارا، روز بخیر 👋' : pageTitle}</h2><p>وضعیت درخواست‌های مشتریان را بررسی و موارد مهم را سریع‌تر پیگیری کنید.</p></div>
            {result && <div className="data-chip"><span className="data-dot" />{fileName || 'فایل تحلیل‌شده'}<span className="chip-divider" />{result.messages.length.toLocaleString('fa-IR')} پیام</div>}
          </section>

          <section className="upload-panel">
            <div className="upload-copy"><div className="upload-icon">↥</div><div><strong>تحلیل خروجی پشتیبانی</strong><span>فایل CSV را بارگذاری کنید تا شاخص‌ها و پیام‌های نیازمند رسیدگی به‌روزرسانی شوند.</span></div></div>
            <UploadForm onSubmit={handleSubmit} loading={loading} />
          </section>
          {error && <div className="error-banner" role="alert">{error}</div>}

          {!result && view !== 'logs' ? (
            <section className="empty-state"><div className="empty-illustration">▤</div><h3>هنوز گزارشی بارگذاری نشده است</h3><p>برای مشاهده عملکرد پشتیبانی، فایل خروجی پیام‌ها را از بخش بالا انتخاب و تحلیل کنید.</p></section>
          ) : view === 'logs' ? <ActivityLog /> : result && <>
            {view === 'overview' && <>
              <div className="section-title-row"><div><h3>شاخص‌های کلیدی</h3><p>نمایی سریع از وضعیت پیام‌های ثبت‌شده</p></div><span className="updated-label">● محاسبه بر اساس زمان فعلی مرورگر</span></div>
              <SummaryTiles total={result.total_unique_messages} urgent={liveUrgent} />
              <div className="overview-grid"><CategoryBreakdown counts={result.category_counts} total={result.total_unique_messages} selectedCategory={overviewCategory} onSelectCategory={(cat) => setOverviewCategory(cat)} />
                <section className="insight-card"><div className="insight-head"><span className="insight-icon">✦</span><div><strong>وضعیت رسیدگی</strong><small>نمای لحظه‌ای SLA</small></div></div><div className="insight-number">{(result.messages.filter(m => !m.duplicate_of && m.severity_hint === 'high' && !m.answered_at).length).toLocaleString('fa-IR')}</div><p>پیام با اولویت بالا در صف پاسخ‌گویی قرار دارد.</p><button className="text-action" onClick={() => setView('attention')}>مشاهده فهرست پیگیری <span>←</span></button></section>
              </div>
              {overviewCategory !== 'all' && <section className="overview-filter-results"><div className="section-title-row"><div><h3>پیام‌های دسته «{formatCategory(overviewCategory)}» ({result.category_counts[overviewCategory].toLocaleString('fa-IR')})</h3><p>فیلتر دسته‌بندی از نمای کلی</p></div><button className="clear-filter" onClick={() => setOverviewCategory('all')}>حذف فیلتر</button></div><MessagesTable messages={result.messages.filter(message => message.category === overviewCategory)} initialCategory={overviewCategory} showCategoryFilter={false} /></section>}
              <AttentionList ids={result.attention_message_ids || []} messages={result.messages} onUrgentCount={setLiveUrgent} />
            </>}
            {(view === 'attention' || view === 'assistant') && <AttentionList ids={result.attention_message_ids || []} messages={result.messages} onUrgentCount={setLiveUrgent} />}
            {view === 'messages' && <><MessagesTable messages={result.messages} /><div className="live-maintenance" aria-hidden="true"><AttentionList ids={result.attention_message_ids || []} messages={result.messages} onUrgentCount={setLiveUrgent} /></div></>}
          </>}
          <footer className="footer"><span>BAZARCHEH SUPPORT INTELLIGENCE</span><span>منطق SLA بر اساس تقویم کاری تهران</span></footer>
        </div>
      </main>
    </div>
  );
}
