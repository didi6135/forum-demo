import { type Email } from "../data/sampleData";

interface EmailRowProps {
  email: Email;
  unread: boolean;
  starred: boolean;
  onOpen: () => void;
  onToggleStar: (ev: React.MouseEvent) => void;
}

/** A single Gmail-style inbox row. Shared by the inbox, search and digest
 *  so they all render emails identically. */
export function EmailRow({ email: e, unread, starred, onOpen, onToggleStar }: EmailRowProps) {
  return (
    <div className={`gm-row${unread ? " unread" : ""}`} onClick={onOpen}>
      <span className="gm-check" onClick={(ev) => ev.stopPropagation()} title="בחירה">
        <i className="bi bi-square" />
      </span>
      <button className="gm-star" type="button" title="הוסף כוכב" onClick={onToggleStar}>
        <i className={`bi ${starred ? "bi-star-fill star-on" : "bi-star"}`} />
      </button>
      <span className="gm-sender">{e.fromName}</span>
      <span className="gm-msg">
        {e.labels.map((l) => (
          <span key={l.text} className={`badge badge-${l.tone} gm-label`}>
            {l.text}
          </span>
        ))}
        <span className="gm-subject">{e.subject}</span>
        <span className="gm-snippet"> — {e.snippet}</span>
      </span>
      <span className="gm-end">
        {e.attachments && <i className="bi bi-paperclip gm-clip" />}
        <span className="gm-date">{e.time}</span>
        <span className="gm-actions">
          <button className="icon-btn icon-btn-sm" type="button" title="ארכיון" onClick={(ev) => ev.stopPropagation()}>
            <i className="bi bi-archive" />
          </button>
          <button className="icon-btn icon-btn-sm" type="button" title="מחיקה" onClick={(ev) => ev.stopPropagation()}>
            <i className="bi bi-trash" />
          </button>
          <button className="icon-btn icon-btn-sm" type="button" title="סמן כנקרא" onClick={(ev) => ev.stopPropagation()}>
            <i className="bi bi-envelope-open" />
          </button>
          <button className="icon-btn icon-btn-sm" type="button" title="נדחה" onClick={(ev) => ev.stopPropagation()}>
            <i className="bi bi-clock" />
          </button>
        </span>
      </span>
    </div>
  );
}
