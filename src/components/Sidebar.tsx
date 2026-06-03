import type { ModuleKey } from "../data/sampleData";

interface NavItem {
  key: ModuleKey;
  label: string;
  icon: string;
  count?: number;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    items: [
      { key: "dashboard", label: "לוח בקרה", icon: "bi-grid-1x2-fill" },
      { key: "inbox", label: "דואר נכנס", icon: "bi-inbox-fill", count: 2 },
      { key: "daily", label: "סיכום יומי", icon: "bi-calendar2-week" },
    ],
  },
  {
    label: "פניות וטיפול",
    items: [
      { key: "inquiries", label: "פניות ידע פון", icon: "bi-telephone-fill", count: 6 },
      { key: "customers", label: "ניהול לקוחות", icon: "bi-people-fill" },
    ],
  },
  {
    label: "כספים",
    items: [
      { key: "nedarim", label: "נדרים פלוס", icon: "bi-cash-coin" },
      { key: "receipts", label: "קבלות", icon: "bi-receipt" },
    ],
  },
  {
    label: "מערכת",
    items: [
      { key: "design", label: "תבנית עיצוב", icon: "bi-bezier2" },
      { key: "tests", label: "בדיקות", icon: "bi-clipboard2-check" },
    ],
  },
];

interface SidebarProps {
  active: ModuleKey;
  onSelect: (key: ModuleKey) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <nav className="rail">
      <button className="compose-btn" type="button">
        <i className="bi bi-pencil-fill" />
        כתיבה
      </button>

      {NAV.map((group, gi) => (
        <div key={group.label ?? `g-${gi}`}>
          {group.label && <div className="rail-section-label">{group.label}</div>}
          {group.items.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`rail-item${active === item.key ? " active" : ""}`}
              onClick={() => onSelect(item.key)}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
              {item.count !== undefined && <span className="rail-count">{item.count}</span>}
            </button>
          ))}
        </div>
      ))}

      <div className="rail-foot">
        הפורום להגנת הצרכן החרדי
        <br />
        מערכת ניהול · גרסת הדגמה
      </div>
    </nav>
  );
}
