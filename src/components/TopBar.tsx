import { useState } from "react";
import logoMark from "../../assets/logo_mark.png";

interface TopBarProps {
  /** Submit a search — opens it as a new persistent tab. */
  onSearch: (query: string) => void;
}

export function TopBar({ onSearch }: TopBarProps) {
  const [query, setQuery] = useState("");

  function submit() {
    const q = query.trim();
    if (q) onSearch(q);
  }

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-logo">
          <img src={logoMark} alt="הפורום להגנת הצרכן החרדי" />
        </div>
        <div className="brand-text">
          <span className="brand-title">הפורום להגנת הצרכן החרדי</span>
          <span className="brand-sub">מערכת ניהול מרכזית</span>
        </div>
      </div>

      <div className="topbar-search">
        <i className="bi bi-search" />
        <input
          type="text"
          placeholder="חיפוש במיילים, לקוחות, פניות וקבלות…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        <i className="bi bi-sliders" style={{ fontSize: 16, cursor: "pointer" }} onClick={submit} />
      </div>

      <div className="topbar-actions">
        <button className="icon-btn" type="button" title="רענון">
          <i className="bi bi-arrow-clockwise" />
        </button>
        <button className="icon-btn" type="button" title="התראות">
          <i className="bi bi-bell" />
          <span className="dot" />
        </button>
        <button className="icon-btn" type="button" title="הגדרות">
          <i className="bi bi-gear" />
        </button>
        <div className="topbar-user" title="אברימי לב">
          אל
        </div>
      </div>
    </header>
  );
}
