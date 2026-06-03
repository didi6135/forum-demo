import { useState } from "react";
import { EMAILS } from "../data/sampleData";
import { EmailReader } from "./EmailReader";
import { EmailRow } from "../components/EmailRow";

const DATE_RANGES = ["היום", "7 הימים האחרונים", "30 הימים האחרונים", "החודש", "כל התאריכים"];

export function Inbox() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [starred, setStarred] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(EMAILS.map((e) => [e.id, e.starred])),
  );
  const [read, setRead] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(EMAILS.map((e) => [e.id, !e.unread])),
  );
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [dateRange, setDateRange] = useState("30 הימים האחרונים");
  const [aiBanner, setAiBanner] = useState(false);

  const open = openId ? EMAILS.find((e) => e.id === openId) ?? null : null;
  const visible = unreadOnly ? EMAILS.filter((e) => !read[e.id]) : EMAILS;

  function openEmail(id: string) {
    setOpenId(id);
    setRead((r) => ({ ...r, [id]: true }));
  }
  function markAllRead() {
    setRead(Object.fromEntries(EMAILS.map((e) => [e.id, true])));
  }
  function toggleStar(id: string, ev: React.MouseEvent) {
    ev.stopPropagation();
    setStarred((s) => ({ ...s, [id]: !s[id] }));
  }

  /* ---------- Conversation view (shows the message body) ---------- */
  if (open) {
    return <EmailReader email={open} onBack={() => setOpenId(null)} backLabel="דואר נכנס" />;
  }

  /* ---------- Inbox list (single column, like Gmail) ---------- */
  return (
    <div className="surface-card">
      <div className="gm-toolbar">
        <span className="gm-check" title="בחר הכל">
          <i className="bi bi-square" />
        </span>
        <button className="icon-btn" type="button" title="רענון">
          <i className="bi bi-arrow-clockwise" />
        </button>
        <button className="icon-btn" type="button" title="עוד">
          <i className="bi bi-three-dots-vertical" />
        </button>
        <span className="gm-pager">
          1–{visible.length} מתוך {visible.length}
          <button className="icon-btn" type="button" title="הקודם" disabled>
            <i className="bi bi-chevron-right" />
          </button>
          <button className="icon-btn" type="button" title="הבא">
            <i className="bi bi-chevron-left" />
          </button>
        </span>
      </div>

      <div className="gm-actions">
        <button className="btn btn-soft btn-sm" type="button" onClick={() => setAiBanner(true)}>
          <i className="bi bi-stars" />
          טיוטות AI לכולם
        </button>

        <div className="dd">
          <button className="btn btn-soft btn-sm" type="button" onClick={() => setDateOpen((v) => !v)}>
            <i className="bi bi-calendar3" />
            {dateRange}
            <i className="bi bi-chevron-down" style={{ fontSize: 11 }} />
          </button>
          {dateOpen && (
            <>
              <button className="dd-backdrop" type="button" aria-label="סגירה" onClick={() => setDateOpen(false)} />
              <div className="dd-menu">
                {DATE_RANGES.map((r) => (
                  <button
                    key={r}
                    className={`dd-item${r === dateRange ? " active" : ""}`}
                    type="button"
                    onClick={() => {
                      setDateRange(r);
                      setDateOpen(false);
                    }}
                  >
                    <i className="bi bi-check2" style={{ visibility: r === dateRange ? "visible" : "hidden" }} />
                    {r}
                  </button>
                ))}
                <div className="dd-divider" />
                <button className="dd-item" type="button" onClick={() => setDateOpen(false)}>
                  <i className="bi bi-calendar-range" />
                  טווח מותאם…
                </button>
              </div>
            </>
          )}
        </div>

        <button
          className={`btn btn-sm ${unreadOnly ? "btn-ghost" : "btn-soft"}`}
          type="button"
          onClick={() => setUnreadOnly((v) => !v)}
        >
          <i className="bi bi-envelope" />
          לא נקראו בלבד
        </button>

        <button className="btn btn-soft btn-sm" type="button" onClick={markAllRead}>
          <i className="bi bi-envelope-open" />
          סמן הכל כנקרא
        </button>
      </div>

      {aiBanner && (
        <div className="gm-banner">
          <i className="bi bi-check-circle-fill" />
          נוצרו טיוטות AI ל-{visible.length} מיילים — עברו עליהן, ערכו ושלחו.
          <button className="icon-btn icon-btn-sm gm-banner-x" type="button" title="סגירה" onClick={() => setAiBanner(false)}>
            <i className="bi bi-x-lg" />
          </button>
        </div>
      )}

      <div className="gm-list">
        {visible.length === 0 && <div className="gm-empty">אין מיילים שלא נקראו 🎉</div>}
        {visible.map((e) => (
          <EmailRow
            key={e.id}
            email={e}
            unread={!read[e.id]}
            starred={starred[e.id]}
            onOpen={() => openEmail(e.id)}
            onToggleStar={(ev) => toggleStar(e.id, ev)}
          />
        ))}
      </div>
    </div>
  );
}
