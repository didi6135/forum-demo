import { useEffect, useMemo, useRef, useState } from "react";
import "./customers.css";
import { Avatar } from "../components/Avatar";
import {
  CUSTOMERS,
  customerEmails,
  customerInquiries,
  customerDonations,
  customerReceipts,
  customerStats,
  type BadgeTone,
  type Customer,
  type CustomerStats,
} from "../data/sampleData";

/* ---------- status → badge tone ---------- */
const STATUS_TONE: Record<Customer["status"], BadgeTone> = {
  פעיל: "green",
  ממתין: "amber",
  סגור: "gray",
};

type Filter = "all" | "active" | "donors";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "הכל" },
  { key: "active", label: "פעילים" },
  { key: "donors", label: "תורמים" },
];

export function Customers() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const open = openId ? CUSTOMERS.find((c) => c.id === openId) ?? null : null;

  const visible = useMemo(() => {
    const q = query.trim();
    return CUSTOMERS.filter((c) => {
      if (filter === "active" && c.status !== "פעיל") return false;
      if (filter === "donors" && !c.donor) return false;
      if (!q) return true;
      return [c.name, c.phone, c.email, c.city].some((field) => field.includes(q));
    });
  }, [query, filter]);

  if (open) {
    return <CustomerDetail customer={open} onBack={() => setOpenId(null)} />;
  }

  const donorCount = CUSTOMERS.filter((c) => c.donor).length;
  const activeCount = CUSTOMERS.filter((c) => c.status === "פעיל").length;
  const openCases = CUSTOMERS.reduce((sum, c) => sum + c.cases, 0);

  return (
    <div className="surface-card">
      <div className="cust">
        {/* ===== Header ===== */}
        <div className="cust-head">
          <div>
            <h1 className="cust-title">ניהול לקוחות</h1>
            <p className="cust-sub">תיק מאוחד לכל פונה — מיילים, פניות, תרומות וקבלות במקום אחד</p>
          </div>
          <button className="btn btn-primary btn-sm" type="button">
            <i className="bi bi-person-plus-fill" /> לקוח חדש
          </button>
        </div>

        {/* ===== Stat strip ===== */}
        <div className="cust-stats">
          <Stat icon="bi-people-fill" tone="blue" value={String(CUSTOMERS.length)} label="לקוחות" />
          <Stat icon="bi-person-check-fill" tone="green" value={String(activeCount)} label="פעילים" />
          <Stat icon="bi-heart-fill" tone="purple" value={String(donorCount)} label="תורמים" />
          <Stat icon="bi-folder-fill" tone="amber" value={String(openCases)} label="תיקים פתוחים" />
        </div>

        {/* ===== Controls ===== */}
        <div className="cust-controls">
          <div className="cust-search">
            <i className="bi bi-search" />
            <input
              type="text"
              placeholder="חיפוש לפי שם, טלפון, אימייל או עיר…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="cust-filters">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`chip${filter === f.key ? " is-active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== List ===== */}
        <div className="cust-list">
          {visible.length === 0 && <div className="cust-empty">לא נמצאו לקוחות התואמים את החיפוש</div>}
          {visible.map((c) => (
            <CustomerRow key={c.id} customer={c} onOpen={() => setOpenId(c.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Stat chip ---------- */
function Stat({ icon, tone, value, label }: { icon: string; tone: BadgeTone; value: string; label: string }) {
  return (
    <div className="cust-stat">
      <div className={`cust-stat-ic tone-${tone}`}>
        <i className={`bi ${icon}`} />
      </div>
      <div>
        <div className="cust-stat-val">{value}</div>
        <div className="cust-stat-lbl">{label}</div>
      </div>
    </div>
  );
}

/* ---------- Single customer row ---------- */
function CustomerRow({ customer, onOpen }: { customer: Customer; onOpen: () => void }) {
  const stats = useMemo(() => customerStats(customer), [customer]);
  return (
    <button className="cust-row" type="button" onClick={onOpen}>
      <Avatar name={customer.name} size="md" />
      <div className="cust-row-main">
        <div className="cust-row-top">
          <span className="cust-row-name">{customer.name}</span>
          {customer.donor && (
            <span className="badge badge-purple cust-row-donor">
              <i className="bi bi-heart-fill" /> תורם
            </span>
          )}
          <span className={`badge badge-${STATUS_TONE[customer.status]}`}>{customer.status}</span>
        </div>
        <div className="cust-row-meta">
          <span><i className="bi bi-telephone" /> {customer.phone}</span>
          <span><i className="bi bi-envelope" /> {customer.email}</span>
          <span><i className="bi bi-geo-alt" /> {customer.city}</span>
        </div>
      </div>
      <div className="cust-row-side">
        <span className="cust-row-cases">
          <strong>{customer.cases}</strong> תיקים
        </span>
        <span className="cust-row-mini">
          {stats.emails > 0 && <span title="מיילים"><i className="bi bi-envelope-fill" /> {stats.emails}</span>}
          {stats.inquiries > 0 && <span title="פניות"><i className="bi bi-telephone-fill" /> {stats.inquiries}</span>}
          {stats.receipts > 0 && <span title="קבלות"><i className="bi bi-receipt" /> {stats.receipts}</span>}
        </span>
        <span className="cust-row-last">{customer.lastContact}</span>
      </div>
      <i className="bi bi-chevron-left cust-row-caret" />
    </button>
  );
}

/* ============================================================
 * Detail view — the unified customer file
 * ============================================================ */

type SummaryState = "idle" | "running" | "done";
const SUMMARY_STEPS = ["אוסף מיילים, פניות ותרומות…", "מנתח דפוסים והיסטוריית טיפול…", "מנסח סיכום לנציג…"];
const STEP_MS = 620;

function CustomerDetail({ customer, onBack }: { customer: Customer; onBack: () => void }) {
  const emails = useMemo(() => customerEmails(customer), [customer]);
  const inquiries = useMemo(() => customerInquiries(customer), [customer]);
  const donations = useMemo(() => customerDonations(customer), [customer]);
  const receipts = useMemo(() => customerReceipts(customer), [customer]);
  const stats = useMemo(() => customerStats(customer), [customer]);

  const [summary, setSummary] = useState<SummaryState>("idle");
  const [step, setStep] = useState(0);
  const timer = useRef<number | null>(null);

  function runSummary() {
    if (summary === "running") return;
    setSummary("running");
    setStep(0);
  }
  useEffect(() => {
    if (summary !== "running") return;
    if (step >= SUMMARY_STEPS.length) {
      const t = window.setTimeout(() => setSummary("done"), 320);
      return () => window.clearTimeout(t);
    }
    timer.current = window.setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [summary, step]);

  return (
    <div className="surface-card">
      <div className="reader-toolbar">
        <button className="icon-btn" type="button" title="חזרה לרשימת הלקוחות" onClick={onBack}>
          <i className="bi bi-arrow-right" />
        </button>
        <button className="icon-btn" type="button" title="עריכת פרטים">
          <i className="bi bi-pencil" />
        </button>
        <button className="icon-btn" type="button" title="מחיקה">
          <i className="bi bi-trash" />
        </button>
      </div>

      <div className="cust-detail">
        {/* ===== Profile header ===== */}
        <div className="cust-profile">
          <Avatar name={customer.name} size="lg" />
          <div className="cust-profile-info">
            <div className="cust-profile-name">
              {customer.name}
              {customer.donor && (
                <span className="badge badge-purple">
                  <i className="bi bi-heart-fill" /> תורם
                </span>
              )}
              <span className={`badge badge-${STATUS_TONE[customer.status]}`}>{customer.status}</span>
            </div>
            <div className="cust-profile-meta">
              <span><i className="bi bi-telephone" /> {customer.phone}</span>
              <span><i className="bi bi-envelope" /> {customer.email}</span>
              <span><i className="bi bi-geo-alt" /> {customer.city}</span>
              <span><i className="bi bi-clock-history" /> קשר אחרון: {customer.lastContact}</span>
            </div>
          </div>
          <div className="cust-profile-actions">
            <button className="btn btn-soft btn-sm" type="button">
              <i className="bi bi-envelope-fill" /> שלח מייל
            </button>
            <button className="btn btn-soft btn-sm" type="button">
              <i className="bi bi-receipt" /> הפק קבלה
            </button>
          </div>
        </div>

        {/* ===== Aggregate stat chips ===== */}
        <div className="cust-detail-stats">
          <DetailStat icon="bi-envelope-fill" tone="blue" value={stats.emails} label="מיילים" />
          <DetailStat icon="bi-telephone-fill" tone="teal" value={stats.inquiries} label="פניות ידע פון" />
          <DetailStat icon="bi-cash-coin" tone="green" value={stats.donations} label="תרומות" />
          <DetailStat icon="bi-receipt" tone="purple" value={stats.receipts} label="קבלות" />
        </div>

        {/* ===== AI summary ===== */}
        <AiSummary
          customer={customer}
          stats={stats}
          state={summary}
          step={step}
          onRun={runSummary}
          onReset={() => setSummary("idle")}
        />

        {/* ===== Linked records ===== */}
        <Panel icon="bi-envelope-fill" iconColor="var(--primary)" title="מיילים" count={emails.length}>
          {emails.length === 0 ? (
            <Empty text="אין מיילים מקושרים" />
          ) : (
            emails.map((e) => (
              <div className="cust-item" key={e.id}>
                <div className="cust-item-top">
                  <span className="cust-item-title">{e.subject}</span>
                  <span className="cust-item-time">{e.time}</span>
                </div>
                <div className="cust-item-sub">{e.snippet}</div>
                <div className="cust-item-tags">
                  {e.labels.map((l) => (
                    <span key={l.text} className={`badge badge-${l.tone}`}>{l.text}</span>
                  ))}
                  {e.attachments && (
                    <span className="cust-item-clip"><i className="bi bi-paperclip" /> {e.attachments.length}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </Panel>

        <Panel icon="bi-telephone-fill" iconColor="var(--teal)" title="פניות ידע פון" count={inquiries.length}>
          {inquiries.length === 0 ? (
            <Empty text="אין פניות מקושרות" />
          ) : (
            inquiries.map((q) => (
              <div className="cust-item" key={q.id}>
                <div className="cust-item-top">
                  <span className="cust-item-title">
                    <span className={`badge badge-${q.tone}`}>{q.topic}</span>
                    {q.urgent && <span className="badge badge-red"><i className="bi bi-exclamation-triangle-fill" /> דחוף</span>}
                  </span>
                  <span className="cust-item-time"><i className="bi bi-clock" /> {q.time} · {q.duration}</span>
                </div>
                <div className="cust-item-sub"><i className="bi bi-stars" /> {q.summary}</div>
                <div className="cust-item-tags">
                  <span className="badge badge-gray">{q.status}</span>
                </div>
              </div>
            ))
          )}
        </Panel>

        <Panel icon="bi-cash-coin" iconColor="var(--green)" title="נדרים פלוס" count={donations.length}>
          {donations.length === 0 ? (
            <Empty text="אין תרומות מקושרות" />
          ) : (
            donations.map((d) => (
              <div className="cust-item cust-item-row" key={d.id}>
                <span className="cust-amount">₪{d.amount.toLocaleString()}</span>
                <span className="cust-item-title">{d.campaign}</span>
                <span className="cust-item-time">{d.date} · {d.payments}</span>
                <span className={`badge badge-${d.status === "אושר" ? "green" : d.status === "ממתין" ? "amber" : "red"}`}>
                  {d.status}
                </span>
              </div>
            ))
          )}
        </Panel>

        <Panel icon="bi-receipt" iconColor="var(--purple)" title="קבלות" count={receipts.length}>
          {receipts.length === 0 ? (
            <Empty text="אין קבלות מקושרות" />
          ) : (
            receipts.map((r) => (
              <div className="cust-item cust-item-row" key={r.id}>
                <span className="cust-receipt-no"><i className="bi bi-hash" />{r.number}</span>
                <span className="cust-amount">₪{r.amount.toLocaleString()}</span>
                <span className="cust-item-title">{r.method}</span>
                <span className="cust-item-time">{r.date}</span>
                <span className={`badge badge-${r.status === "הופקה" ? "green" : r.status === "ממתינה" ? "amber" : "red"}`}>
                  {r.status}
                </span>
              </div>
            ))
          )}
        </Panel>
      </div>
    </div>
  );
}

/* ---------- Detail stat chip ---------- */
function DetailStat({ icon, tone, value, label }: { icon: string; tone: BadgeTone; value: number; label: string }) {
  return (
    <div className="cust-dstat">
      <div className={`cust-stat-ic tone-${tone}`}>
        <i className={`bi ${icon}`} />
      </div>
      <div>
        <div className="cust-stat-val">{value}</div>
        <div className="cust-stat-lbl">{label}</div>
      </div>
    </div>
  );
}

/* ---------- AI summary block ---------- */
interface AiSummaryProps {
  customer: Customer;
  stats: CustomerStats;
  state: SummaryState;
  step: number;
  onRun: () => void;
  onReset: () => void;
}

function AiSummary({ customer, stats, state, step, onRun, onReset }: AiSummaryProps) {
  if (state === "idle") {
    return (
      <div className="cust-ai cust-ai-cta">
        <div className="cust-ai-orb"><i className="bi bi-stars" /></div>
        <div className="cust-ai-cta-text">
          <h4>סיכום AI על הלקוח</h4>
          <p>ה-AI יקרא את כל המיילים, הפניות והתרומות של {customer.name} וייצר סיכום תיק קצר לנציג.</p>
        </div>
        <button className="btn btn-primary btn-sm" type="button" onClick={onRun}>
          <i className="bi bi-stars" /> צור סיכום
        </button>
      </div>
    );
  }

  if (state === "running") {
    return (
      <div className="cust-ai cust-ai-running">
        <div className="cust-ai-orb pulsing"><i className="bi bi-stars" /></div>
        <div>
          <h4>מנתח את תיק הלקוח…</h4>
          <p className="cust-ai-step">{SUMMARY_STEPS[Math.min(step, SUMMARY_STEPS.length - 1)]}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-summary cust-ai-done">
      <div className="ai-head">
        <i className="bi bi-stars" /> סיכום AI · {customer.name}
        <button className="btn btn-ghost btn-sm cust-ai-redo" type="button" onClick={onReset}>
          <i className="bi bi-arrow-counterclockwise" /> צור מחדש
        </button>
      </div>
      <p>{buildSummary(customer, stats)}</p>
    </div>
  );
}

/** Compose a deterministic recap from the customer's linked records. */
function buildSummary(customer: Customer, stats: CustomerStats): string {
  const parts: string[] = [];
  parts.push(`${customer.name} מ${customer.city}, ${customer.donor ? "תורם פעיל ו" : ""}לקוח בסטטוס "${customer.status}".`);

  const activity: string[] = [];
  if (stats.emails) activity.push(`${stats.emails} מיילים`);
  if (stats.inquiries) {
    activity.push(`${stats.inquiries} פניות בידע פון${stats.urgentInquiries ? ` (${stats.urgentInquiries} דחופות)` : ""}`);
  }
  if (activity.length) {
    parts.push(`לאורך הקשר נרשמו ${activity.join(" ו-")}, סך הכל ${customer.cases} תיקי טיפול.`);
  } else {
    parts.push(`טרם נרשמה תכתובת או פנייה — ${customer.cases} תיקי טיפול במערכת.`);
  }

  if (stats.donatedTotal > 0) {
    parts.push(`תרם ₪${stats.donatedTotal.toLocaleString()} דרך נדרים פלוס (${stats.donations} עסקאות), והופקו עבורו ${stats.receipts} קבלות.`);
  } else if (stats.receipts > 0) {
    parts.push(`הופקו עבורו ${stats.receipts} קבלות.`);
  }

  if (stats.urgentInquiries > 0) {
    parts.push("יש לתעדף את הפניות הדחופות הפתוחות.");
  }
  return parts.join(" ");
}

/* ---------- Section panel ---------- */
function Panel({
  icon,
  iconColor,
  title,
  count,
  children,
}: {
  icon: string;
  iconColor: string;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="panel cust-panel">
      <div className="panel-head">
        <i className={`bi ${icon}`} style={{ color: iconColor }} />
        <h3>{title}</h3>
        <span className="badge badge-gray">{count}</span>
      </div>
      <div className="cust-panel-body">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="cust-panel-empty">{text}</div>;
}
