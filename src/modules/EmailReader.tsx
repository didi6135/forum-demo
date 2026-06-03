import { useState } from "react";
import { type Email } from "../data/sampleData";
import { Avatar } from "../components/Avatar";

/** The logged-in representative — recipient shown in message details. */
const ME = "אברימי לב <avrimi@forum.org.il>";

type ComposeMode = "reply" | "forward" | null;

interface EmailReaderProps {
  email: Email;
  onBack: () => void;
  /** Label for the back button's destination (e.g. "דואר נכנס", "סיכום יומי"). */
  backLabel?: string;
}

/** Full-screen conversation view — shows the message body, details popover,
 *  and an inline reply/forward composer. Shared by Inbox and Daily Summary. */
export function EmailReader({ email, onBack, backLabel = "חזרה" }: EmailReaderProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [composeMode, setComposeMode] = useState<ComposeMode>(null);

  const mailedBy = email.fromAddr.split("@")[1];
  const dateText = email.time.includes(":") ? `3 ביוני 2026, ${email.time}` : email.time;

  return (
    <div className="surface-card">
      <div className="reader-toolbar">
        <button className="icon-btn" type="button" title={backLabel} onClick={onBack}>
          <i className="bi bi-arrow-right" />
        </button>
        <button className="icon-btn" type="button" title="ארכיון">
          <i className="bi bi-archive" />
        </button>
        <button className="icon-btn" type="button" title="דיווח כספאם">
          <i className="bi bi-exclamation-octagon" />
        </button>
        <button className="icon-btn" type="button" title="מחיקה">
          <i className="bi bi-trash" />
        </button>
        <button className="icon-btn" type="button" title="סמן כלא נקרא">
          <i className="bi bi-envelope" />
        </button>
        <div style={{ marginInlineStart: "auto", display: "flex", gap: 2 }}>
          <button className="icon-btn" type="button" title="הקודם">
            <i className="bi bi-chevron-up" />
          </button>
          <button className="icon-btn" type="button" title="הבא">
            <i className="bi bi-chevron-down" />
          </button>
        </div>
      </div>

      <div className="reader">
        <div className="reader-body">
          <h2 className="reader-subject">{email.subject}</h2>

          <div className="reader-sender">
            <Avatar name={email.fromName} gradient={email.avatarColor} size="lg" />
            <div className="who">
              <div className="who-line">
                <span className="name">{email.fromName}</span>
                <span className="addr">&lt;{email.fromAddr}&gt;</span>
                <button
                  className="sender-toggle"
                  type="button"
                  title="הצגת פרטים"
                  onClick={() => setShowDetails((v) => !v)}
                >
                  <i className={`bi ${showDetails ? "bi-caret-up-fill" : "bi-caret-down-fill"}`} />
                </button>
              </div>
              <span className="who-to">אליי</span>

              {showDetails && (
                <div className="msg-details">
                  <div className="md-row">
                    <span className="md-label">מאת:</span>
                    <span className="md-value">
                      <b>{email.fromName}</b> &lt;{email.fromAddr}&gt;
                    </span>
                  </div>
                  <div className="md-row">
                    <span className="md-label">אל:</span>
                    <span className="md-value">{ME}</span>
                  </div>
                  <div className="md-row">
                    <span className="md-label">תאריך:</span>
                    <span className="md-value">{dateText}</span>
                  </div>
                  <div className="md-row">
                    <span className="md-label">נושא:</span>
                    <span className="md-value">{email.subject}</span>
                  </div>
                  <div className="md-row">
                    <span className="md-label">נשלח על-ידי:</span>
                    <span className="md-value">{mailedBy}</span>
                  </div>
                </div>
              )}
            </div>
            <span className="date">{dateText}</span>
          </div>

          <div className="ai-summary">
            <div className="ai-head">
              <i className="bi bi-stars" />
              סיכום קצר לנציג
            </div>
            <p>{email.aiSummary}</p>
          </div>

          <div className="reader-text">
            {email.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {email.attachments && (
            <div className="attach-strip">
              {email.attachments.map((a) => (
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

          {composeMode ? (
            <Composer mode={composeMode} email={email} onClose={() => setComposeMode(null)} />
          ) : (
            <div className="reader-actions">
              <button className="btn btn-ghost" type="button" onClick={() => setComposeMode("reply")}>
                <i className="bi bi-reply-fill" />
                תשובה
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => setComposeMode("forward")}>
                <i className="bi bi-arrow-90deg-left" />
                העברה
              </button>
              <button className="btn btn-soft" type="button" onClick={() => setComposeMode("reply")}>
                <i className="bi bi-stars" />
                תשובה בעזרת AI
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Inline reply / forward composer (Gmail-style) ---------- */

interface ComposerProps {
  mode: "reply" | "forward";
  email: Email;
  onClose: () => void;
}

function Composer({ mode, email, onClose }: ComposerProps) {
  const isReply = mode === "reply";
  const quoted = `\n\n--------- הודעה מקורית ---------\nמאת: ${email.fromName} <${email.fromAddr}>\n\n${email.body.join("\n")}`;

  return (
    <div className="composer">
      <div className="composer-head">
        <i className={`bi ${isReply ? "bi-reply-fill" : "bi-arrow-90deg-left"}`} />
        <span>{isReply ? "תשובה" : "העברה"}</span>
        <button className="icon-btn icon-btn-sm composer-x" type="button" title="סגירה" onClick={onClose}>
          <i className="bi bi-x-lg" />
        </button>
      </div>

      <div className="composer-field">
        <label>אל</label>
        <input type="text" defaultValue={isReply ? email.fromAddr : ""} placeholder="נמען…" />
      </div>
      <div className="composer-field">
        <label>נושא</label>
        <input type="text" defaultValue={`${isReply ? "Re" : "Fwd"}: ${email.subject}`} />
      </div>

      <textarea className="composer-body" placeholder="כתוב הודעה…" defaultValue={isReply ? "" : quoted} />

      <div className="composer-foot">
        <button className="btn btn-primary" type="button" onClick={onClose}>
          שליחה
          <i className="bi bi-send-fill" />
        </button>
        <div className="composer-tools">
          <button className="icon-btn icon-btn-sm" type="button" title="עיצוב טקסט">
            <i className="bi bi-type" />
          </button>
          <button className="icon-btn icon-btn-sm" type="button" title="צירוף קובץ">
            <i className="bi bi-paperclip" />
          </button>
          <button className="icon-btn icon-btn-sm" type="button" title="טיוטה ב-AI">
            <i className="bi bi-stars" />
          </button>
        </div>
        <button className="icon-btn icon-btn-sm composer-trash" type="button" title="מחיקת טיוטה" onClick={onClose}>
          <i className="bi bi-trash" />
        </button>
      </div>
    </div>
  );
}
