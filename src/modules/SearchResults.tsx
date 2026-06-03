import { useState } from "react";
import { EMAILS } from "../data/sampleData";
import { EmailReader } from "./EmailReader";
import { EmailRow } from "../components/EmailRow";

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [attachOnly, setAttachOnly] = useState(false);
  const [starred, setStarred] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(EMAILS.map((e) => [e.id, e.starred])),
  );
  const [read, setRead] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(EMAILS.map((e) => [e.id, !e.unread])),
  );

  const q = query.trim().toLowerCase();
  const matches = EMAILS.filter((e) => {
    const hay = [e.fromName, e.fromAddr, e.subject, e.snippet, ...e.body, ...e.labels.map((l) => l.text)]
      .join(" ")
      .toLowerCase();
    if (q !== "" && !hay.includes(q)) return false;
    if (unreadOnly && read[e.id]) return false;
    if (attachOnly && !e.attachments) return false;
    return true;
  });

  function openEmail(id: string) {
    setOpenId(id);
    setRead((r) => ({ ...r, [id]: true }));
  }
  function toggleStar(id: string, ev: React.MouseEvent) {
    ev.stopPropagation();
    setStarred((s) => ({ ...s, [id]: !s[id] }));
  }

  const open = openId ? EMAILS.find((e) => e.id === openId) ?? null : null;
  if (open) {
    return <EmailReader email={open} onBack={() => setOpenId(null)} backLabel="תוצאות חיפוש" />;
  }

  return (
    <div className="surface-card">
      <div className="search-head">
        <i className="bi bi-search" />
        <div className="search-head-text">
          <span className="search-head-label">תוצאות חיפוש עבור</span>
          <span className="search-q">"{query}"</span>
        </div>
        <span className="search-count">{matches.length} תוצאות</span>
      </div>

      <div className="gm-actions">
        <button
          className={`btn btn-sm ${unreadOnly ? "btn-ghost" : "btn-soft"}`}
          type="button"
          onClick={() => setUnreadOnly((v) => !v)}
        >
          <i className="bi bi-envelope" />
          לא נקראו
        </button>
        <button
          className={`btn btn-sm ${attachOnly ? "btn-ghost" : "btn-soft"}`}
          type="button"
          onClick={() => setAttachOnly((v) => !v)}
        >
          <i className="bi bi-paperclip" />
          עם צרופה
        </button>
        <button className="btn btn-soft btn-sm" type="button">
          <i className="bi bi-person" />
          מאת…
        </button>
        <button className="btn btn-soft btn-sm" type="button">
          <i className="bi bi-calendar3" />
          טווח תאריכים
        </button>
      </div>

      <div className="gm-list">
        {matches.length === 0 && (
          <div className="gm-empty">
            <i className="bi bi-search" style={{ fontSize: 40, opacity: 0.4, display: "block", marginBottom: 12 }} />
            לא נמצאו תוצאות עבור "{query}".
          </div>
        )}
        {matches.map((e) => (
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
