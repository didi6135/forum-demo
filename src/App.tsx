import { useRef, useState } from "react";
import type { ModuleKey } from "./data/sampleData";
import { Login } from "./modules/Login";
import { TopBar } from "./components/TopBar";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./modules/Dashboard";
import { Inbox } from "./modules/Inbox";
import { Inquiries } from "./modules/Inquiries";
import { Whatsapp } from "./modules/Whatsapp";
import { Customers } from "./modules/Customers";
import { Contacts } from "./modules/Contacts";
import { Nedarim } from "./modules/Nedarim";
import { DailySummary } from "./modules/DailySummary";
import { DesignSystem } from "./modules/DesignSystem";
import { SearchResults } from "./modules/SearchResults";

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
  whatsapp: "וואטסאפ",
  customers: "ניהול לקוחות",
  contacts: "אנשי קשר ויועצים",
  nedarim: "נדרים פלוס",
  tests: "בדיקות",
};

const MODULE_ICONS: Record<ModuleKey, string> = {
  design: "bi-bezier2",
  dashboard: "bi-grid-1x2-fill",
  inbox: "bi-inbox-fill",
  daily: "bi-calendar2-week",
  inquiries: "bi-telephone-fill",
  whatsapp: "bi-whatsapp",
  customers: "bi-people-fill",
  contacts: "bi-person-vcard",
  nedarim: "bi-cash-coin",
  tests: "bi-clipboard2-check",
};

interface SearchTab {
  id: string;
  query: string;
}

/** Browser-style tab strip — the current module plus each open search. */
function TabStrip({
  moduleTitle,
  moduleIcon,
  tabs,
  activeSearchId,
  onModule,
  onSelect,
  onClose,
}: {
  moduleTitle: string;
  moduleIcon: string;
  tabs: SearchTab[];
  activeSearchId: string | null;
  onModule: () => void;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}) {
  return (
    <div className="tabstrip">
      <button className={`tab${activeSearchId === null ? " active" : ""}`} type="button" onClick={onModule}>
        <i className={`bi ${moduleIcon}`} />
        <span className="tab-label">{moduleTitle}</span>
      </button>
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`tab${activeSearchId === t.id ? " active" : ""}`}
          type="button"
          onClick={() => onSelect(t.id)}
        >
          <i className="bi bi-search" />
          <span className="tab-label">{t.query}</span>
          <span
            className="tab-x"
            title="סגירת טאב"
            onClick={(e) => {
              e.stopPropagation();
              onClose(t.id);
            }}
          >
            <i className="bi bi-x" />
          </span>
        </button>
      ))}
    </div>
  );
}

export function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  // After login we land on the design-system tab — the new visual base.
  const [active, setActive] = useState<ModuleKey>("design");
  const [searchTabs, setSearchTabs] = useState<SearchTab[]>([]);
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null);
  const searchSeq = useRef(0);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  /** Each search opens a new tab and stays open until closed. */
  function openSearch(query: string) {
    const id = `s${searchSeq.current++}`;
    setSearchTabs((tabs) => [...tabs, { id, query }]);
    setActiveSearchId(id);
  }
  function closeSearch(id: string) {
    setSearchTabs((tabs) => tabs.filter((t) => t.id !== id));
    setActiveSearchId((cur) => (cur === id ? null : cur));
  }
  function goToModule(key: ModuleKey) {
    setActive(key);
    setActiveSearchId(null);
  }

  const activeSearch = searchTabs.find((t) => t.id === activeSearchId) ?? null;

  function renderModule() {
    switch (active) {
      case "design":
        return <DesignSystem />;
      case "dashboard":
        return <Dashboard />;
      case "inbox":
        return <Inbox />;
      case "daily":
        return <DailySummary />;
      case "inquiries":
        return <Inquiries />;
      case "whatsapp":
        return <Whatsapp />;
      case "customers":
        return <Customers />;
      case "contacts":
        return <Contacts />;
      case "nedarim":
        return <Nedarim />;
      default:
        return <ComingSoon title={MODULE_TITLES[active]} />;
    }
  }

  return (
    <div className="app-shell">
      <TopBar onSearch={openSearch} />
      <Sidebar active={active} onSelect={goToModule} />
      <div className="workspace">
        {searchTabs.length > 0 && (
          <TabStrip
            moduleTitle={MODULE_TITLES[active]}
            moduleIcon={MODULE_ICONS[active]}
            tabs={searchTabs}
            activeSearchId={activeSearchId}
            onModule={() => setActiveSearchId(null)}
            onSelect={setActiveSearchId}
            onClose={closeSearch}
          />
        )}
        {activeSearch ? <SearchResults key={activeSearch.id} query={activeSearch.query} /> : renderModule()}
      </div>
    </div>
  );
}
