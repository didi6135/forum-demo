import { useState } from "react";
import type { ModuleKey } from "./data/sampleData";
import { Login } from "./modules/Login";
import { TopBar } from "./components/TopBar";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./modules/Dashboard";
import { Inbox } from "./modules/Inbox";
import { DesignSystem } from "./modules/DesignSystem";

/** Placeholder for screens we haven't designed together yet. */
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="surface-card">
      <div style={{ display: "grid", placeItems: "center", height: "100%", textAlign: "center", color: "var(--text-3)" }}>
        <div>
          <i className="bi bi-cone-striped" style={{ fontSize: 56, opacity: 0.5 }} />
          <h2 style={{ margin: "14px 0 4px", color: "var(--text-2)" }}>{title}</h2>
          <p style={{ margin: 0 }}>המסך הזה ייבנה בשלב הבא 🛠️</p>
        </div>
      </div>
    </div>
  );
}

const MODULE_TITLES: Record<ModuleKey, string> = {
  design: "תבנית עיצוב",
  dashboard: "לוח בקרה",
  inbox: "דואר נכנס",
  daily: "סיכום יומי",
  inquiries: "פניות ידע פון",
  customers: "ניהול לקוחות",
  receipts: "קבלות",
  nedarim: "נדרים פלוס",
  tests: "בדיקות",
};

export function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  // After login we land on the design-system tab — the new visual base.
  const [active, setActive] = useState<ModuleKey>("design");

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  function renderModule() {
    switch (active) {
      case "design":
        return <DesignSystem />;
      case "dashboard":
        return <Dashboard />;
      case "inbox":
        return <Inbox />;
      default:
        return <ComingSoon title={MODULE_TITLES[active]} />;
    }
  }

  return (
    <div className="app-shell">
      <TopBar />
      <Sidebar active={active} onSelect={setActive} />
      <div className="workspace">{renderModule()}</div>
    </div>
  );
}
