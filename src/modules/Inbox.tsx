import { useState } from "react";
import { EMAILS } from "../data/sampleData";
import { Avatar } from "../components/Avatar";

export function Inbox() {
  const [selectedId, setSelectedId] = useState<string>(EMAILS[0].id);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const visible = filter === "unread" ? EMAILS.filter((e) => e.unread) : EMAILS;
  const selected = EMAILS.find((e) => e.id === selectedId) ?? EMAILS[0];

  return (
    <div className="surface-card">
      <div className="page-head">
        <i className="bi bi-inbox-fill" style={{ fontSize: 20, color: "var(--primary)" }} />
        <h1>דואר נכנס</h1>
        <span className="page-sub">24 שעות אחרונות</span>
        <div className="page-head-spacer" />
        <button className="btn btn-soft btn-sm" type="button">
          <i className="bi bi-magic" />
          סיכום אוטומטי
        </button>
        <button className="btn btn-ghost btn-sm" type="button">
          <i className="bi bi-arrow-clockwise" />
          רענן
        </button>
      </div>

      <div className="split">
        {/* List */}
        <div className="mail-list">
          <div className="list-toolbar">
            <div className="seg">
              <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")} type="button">
                הכל
              </button>
              <button className={filter === "unread" ? "active" : ""} onClick={() => setFilter("unread")} type="button">
                לא נקראו
              </button>
            </div>
            <span style={{ marginInlineStart: "auto", fontSize: 12, color: "var(--text-3)", fontWeight: 600 }}>
              {visible.length} מיילים
            </span>
          </div>

          {visible.map((e) => (
            <div
              key={e.id}
              className={`mail-row${e.unread ? " unread" : ""}${e.id === selectedId ? " selected" : ""}`}
              onClick={() => setSelectedId(e.id)}
            >
              <Avatar name={e.fromName} gradient={e.avatarColor} size="md" />
              <div className="mail-main">
                <div className="mail-line1">
                  <span className="mail-from">{e.fromName}</span>
                  {e.starred && <i className="bi bi-star-fill" style={{ color: "var(--amber)", fontSize: 12 }} />}
                </div>
                <div className="mail-subject">{e.subject}</div>
                <div className="mail-snippet">{e.snippet}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 7 }}>
                  {e.labels.map((l) => (
                    <span key={l.text} className={`badge badge-${l.tone}`}>
                      {l.text}
                    </span>
                  ))}
                  {e.attachments && (
                    <span className="badge badge-gray">
                      <i className="bi bi-paperclip" /> {e.attachments.length}
                    </span>
                  )}
                </div>
              </div>
              <div className="mail-meta">
                <span className="mail-time">{e.time}</span>
                {e.unread && <span className="unread-dot" />}
              </div>
            </div>
          ))}
        </div>

        {/* Reader */}
        <div className="reader">
          <div className="reader-toolbar">
            <button className="icon-btn" type="button" title="חזרה">
              <i className="bi bi-arrow-right" />
            </button>
            <button className="icon-btn" type="button" title="ארכיון">
              <i className="bi bi-archive" />
            </button>
            <button className="icon-btn" type="button" title="מחיקה">
              <i className="bi bi-trash" />
            </button>
            <button className="icon-btn" type="button" title="סמן כנקרא">
              <i className="bi bi-envelope-open" />
            </button>
            <div style={{ marginInlineStart: "auto" }} />
            <button className="icon-btn" type="button" title="הקודם">
              <i className="bi bi-chevron-up" />
            </button>
            <button className="icon-btn" type="button" title="הבא">
              <i className="bi bi-chevron-down" />
            </button>
          </div>

          <div className="reader-body">
            <h2 className="reader-subject">{selected.subject}</h2>

            <div className="reader-sender">
              <Avatar name={selected.fromName} gradient={selected.avatarColor} size="lg" />
              <div className="who">
                <span className="name">{selected.fromName}</span>
                <span className="addr">&lt;{selected.fromAddr}&gt;</span>
              </div>
              <span className="date">{selected.time}</span>
            </div>

            <div className="ai-summary">
              <div className="ai-head">
                <i className="bi bi-stars" />
                סיכום קצר לנציג
              </div>
              <p>{selected.aiSummary}</p>
            </div>

            <div className="reader-text">
              {selected.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {selected.attachments && (
              <div className="attach-strip">
                {selected.attachments.map((a) => (
                  <div className="attach-card" key={a.name}>
                    <i className="bi bi-file-earmark-pdf" />
                    <div>
                      <div className="att-name">{a.name}</div>
                      <div className="att-size">{a.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="reader-actions">
              <button className="btn btn-primary" type="button">
                <i className="bi bi-reply-fill" />
                תשובה
              </button>
              <button className="btn btn-ghost" type="button">
                <i className="bi bi-arrow-90deg-left" />
                העברה
              </button>
              <button className="btn btn-soft" type="button">
                <i className="bi bi-stars" />
                יצירת טיוטה ב-AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
