import logoMark from "../../assets/logo_mark.png";

export function TopBar() {
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
        <input type="text" placeholder="חיפוש במיילים, לקוחות, פניות וקבלות…" />
        <i className="bi bi-sliders" style={{ fontSize: 16 }} />
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
