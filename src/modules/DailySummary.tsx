import { useState } from "react";
import { EMAILS, ATTENTION, TOP_DONORS, type BadgeTone } from "../data/sampleData";
import { Avatar } from "../components/Avatar";
import { EmailReader } from "./EmailReader";
import { EmailRow } from "../components/EmailRow";

const TONE_SOFT: Record<BadgeTone, string> = {
  blue: "var(--primary-soft)",
  green: "var(--green-soft)",
  red: "var(--red-soft)",
  amber: "var(--amber-soft)",
  purple: "var(--purple-soft)",
  teal: "var(--teal-soft)",
  gray: "var(--surface-2)",
};
const TONE_FG: Record<BadgeTone, string> = {
  blue: "var(--primary)",
  green: "var(--green)",
  red: "var(--red)",
  amber: "#b06000",
  purple: "var(--purple)",
  teal: "var(--teal)",
  gray: "var(--text-2)",
};

const METRICS = [
  { icon: "bi-inbox", value: "24", label: "מיילים נכנסו" },
  { icon: "bi-send", value: "18", label: "מיילים נשלחו" },
  { icon: "bi-telephone", value: "6", label: "פניות ידע פון" },
  { icon: "bi-cash-coin", value: "₪3,420", label: "תרומות היום" },
];

const SENT_TODAY = [
  { to: "משה ברגר", subject: "מענה לתלונה — חיוב כפול מול חברת הסלולר", time: "11:20" },
  { to: "רבקה כהן", subject: "הנחיות לביטול עסקת רוכלות תוך 14 יום", time: "10:05" },
  { to: "חברת הביטוח הישיר", subject: "דרישה רשמית בשם יוסף פרידמן", time: "09:30" },
];

const CALLS = [
  { name: "דוד מלר", topic: "תשתיות", tone: "blue" as BadgeTone, summary: "חברת הגז העלתה תעריף ב-14% באמצע חוזה, ללא הודעה.", urgent: true },
  { name: "שרה לוי", topic: "תיירות", tone: "teal" as BadgeTone, summary: "טיסה בוטלה 48 שעות לפני המראה, ללא החזר או חלופה.", urgent: true },
  { name: "מנחם רוט", topic: "מנויים", tone: "purple" as BadgeTone, summary: "מכון כושר ממשיך לחייב לאחר ביטול מנוי בכתב.", urgent: false },
];

function SecHead({ icon, title, count }: { icon: string; title: string; count: string }) {
  return (
    <div className="digest-sec-head">
      <i className={`bi ${icon}`} />
      <h3>{title}</h3>
      <span className="digest-count">{count}</span>
    </div>
  );
}

export function DailySummary() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [starred, setStarred] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(EMAILS.map((e) => [e.id, e.starred])),
  );

  const open = openId ? EMAILS.find((e) => e.id === openId) ?? null : null;

  function toggleStar(id: string, ev: React.MouseEvent) {
    ev.stopPropagation();
    setStarred((s) => ({ ...s, [id]: !s[id] }));
  }

  /* Clicking an email opens its body — same reader as the inbox. */
  if (open) {
    return <EmailReader email={open} onBack={() => setOpenId(null)} backLabel="סיכום יומי" />;
  }

  return (
    <div className="surface-card">
      <div className="reader-toolbar">
        <span className="digest-toolbar-title">סיכום יומי · יום ג׳, 3 ביוני 2026</span>
        <div style={{ marginInlineStart: "auto", display: "flex", gap: 8 }}>
          <button className="btn btn-soft btn-sm" type="button">
            <i className="bi bi-send" />
            שליחה לצוות
          </button>
          <button className="btn btn-soft btn-sm" type="button">
            <i className="bi bi-download" />
            הורדת PDF
          </button>
        </div>
      </div>

      <div className="reader">
        <div className="digest-top">
          <div className="ai-summary digest-overview">
            <div className="ai-head">
              <i className="bi bi-stars" />
              תקציר היום
            </div>
            <p>
              בוקר טוב אברימי. ב-24 השעות האחרונות נכנסו 24 פניות ונשלחו 18 מענים. בלטו שתי תלונות
              דחופות (חיוב כפול בסלולר וביטול טיסה ללא החזר), והתקבלו תרומות בסך ₪3,420. ארבעה פריטים
              ממתינים לטיפול מחר — מומלץ להתחיל מהתלונה של משה ברגר שממתינה כבר 3 ימים.
            </p>
          </div>

          <div className="digest-metrics">
            {METRICS.map((m) => (
              <div className="digest-metric" key={m.label}>
                <i className={`bi ${m.icon}`} />
                <div className="digest-metric-val">{m.value}</div>
                <div className="digest-metric-lbl">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Incoming emails — inbox style, click to read the body ---- */}
        <SecHead icon="bi-inbox-fill" title="דואר נכנס בולט" count="24 נכנסו" />
        {EMAILS.map((e) => (
          <EmailRow
            key={e.id}
            email={e}
            unread={e.unread}
            starred={starred[e.id]}
            onOpen={() => setOpenId(e.id)}
            onToggleStar={(ev) => toggleStar(e.id, ev)}
          />
        ))}

        {/* ---- Sent today ---- */}
        <SecHead icon="bi-send-fill" title="נשלחו היום" count="18 נשלחו" />
        {SENT_TODAY.map((s) => (
          <div className="digest-item" key={s.subject}>
            <div className="digest-ic">
              <i className="bi bi-reply-fill" />
            </div>
            <div className="digest-item-main">
              <div className="digest-item-top">
                <span className="digest-item-title">אל: {s.to}</span>
                <span className="digest-item-time">{s.time}</span>
              </div>
              <div className="digest-item-sub">{s.subject}</div>
            </div>
          </div>
        ))}

        {/* ---- Yeda-Phone calls ---- */}
        <SecHead icon="bi-telephone-fill" title="פניות ידע פון" count="6 חדשות" />
        {CALLS.map((c) => (
          <div className="digest-item" key={c.name}>
            <div className="digest-ic" style={{ background: TONE_SOFT[c.tone], color: TONE_FG[c.tone] }}>
              <i className="bi bi-telephone-inbound" />
            </div>
            <div className="digest-item-main">
              <div className="digest-item-top">
                <span className="digest-item-title">{c.name}</span>
                <span className={`badge badge-${c.tone}`}>{c.topic}</span>
                {c.urgent && <span className="badge badge-red">דחוף</span>}
              </div>
              <div className="digest-item-sub">{c.summary}</div>
            </div>
          </div>
        ))}

        {/* ---- Donations ---- */}
        <SecHead icon="bi-cash-coin" title="תרומות שהתקבלו" count="₪3,420" />
        {TOP_DONORS.slice(0, 3).map((d) => (
          <div className="digest-item" key={d.name}>
            <Avatar name={d.name} size="sm" />
            <div className="digest-item-main">
              <div className="digest-item-top">
                <span className="digest-item-title">{d.name}</span>
                <span className="digest-item-time">{d.campaign}</span>
              </div>
            </div>
            <span className="digest-amount">₪{d.amount.toLocaleString("he-IL")}</span>
          </div>
        ))}

        {/* ---- Follow-ups ---- */}
        <SecHead icon="bi-flag-fill" title="דורש מעקב מחר" count={`${ATTENTION.length} פריטים`} />
        {ATTENTION.map((a, i) => (
          <div className="digest-item" key={i}>
            <div className="digest-ic" style={{ background: TONE_SOFT[a.tone], color: TONE_FG[a.tone] }}>
              <i className={`bi ${a.icon}`} />
            </div>
            <div className="digest-item-main">
              <div className="digest-item-top">
                <span className="digest-item-title">{a.title}</span>
                <span className={`badge badge-${a.tone}`}>{a.tag}</span>
              </div>
              <div className="digest-item-sub">{a.sub}</div>
            </div>
          </div>
        ))}

        <footer className="digest-foot">
          סיכום זה הופק אוטומטית על-ידי מערכת הפורום · נשלח מדי בוקר ב-07:00 לכל חברי הצוות.
        </footer>
      </div>
    </div>
  );
}
