import { Avatar } from "../components/Avatar";

/**
 * Living style guide for the "Elevated Gmail" design system.
 * This page documents the tokens defined in index.css and is the
 * single visual reference for every screen in the app.
 */

interface Swatch {
  name: string;
  hex: string;
  /** Light chips get a hairline so they stay visible on white. */
  light?: boolean;
}

const SURFACES: Swatch[] = [
  { name: "surface", hex: "#FFFFFF", light: true },
  { name: "container-low", hex: "#F7F9FC", light: true },
  { name: "container", hex: "#F1F4F9", light: true },
  { name: "container-high", hex: "#E9EDF3", light: true },
  { name: "bg", hex: "#F6F8FC", light: true },
];

const TEXT_LINES: Swatch[] = [
  { name: "text", hex: "#202124" },
  { name: "text-2", hex: "#5F6368" },
  { name: "text-3", hex: "#80868B" },
  { name: "border-2", hex: "#DADCE0", light: true },
  { name: "border", hex: "#E8EAED", light: true },
];

const SEMANTIC: Swatch[] = [
  { name: "green", hex: "#1E8E3E" },
  { name: "red", hex: "#D93025" },
  { name: "amber", hex: "#F9AB00" },
  { name: "purple", hex: "#8430CE" },
  { name: "teal", hex: "#129EAF" },
];

const PRIMARY_RAMP = [
  { step: "50", hex: "#EAF1FE", ink: "#1557B0" },
  { step: "100", hex: "#D2E3FC", ink: "#1557B0" },
  { step: "200", hex: "#A8C7FA", ink: "#1557B0" },
  { step: "300", hex: "#7BAAF7", ink: "#0C3370" },
  { step: "400", hex: "#4D8BF0", ink: "#FFFFFF" },
  { step: "500", hex: "#1A73E8", ink: "#FFFFFF" },
  { step: "600", hex: "#1765CC", ink: "#FFFFFF" },
  { step: "700", hex: "#1557B0", ink: "#FFFFFF" },
  { step: "800", hex: "#114390", ink: "#FFFFFF" },
  { step: "900", hex: "#0C3370", ink: "#FFFFFF" },
];

const TYPE_SCALE: { tag: string; meta: string; el: JSX.Element }[] = [
  {
    tag: "Display",
    meta: "28px · 600",
    el: <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.4px" }}>הפורום להגנת הצרכן החרדי</div>,
  },
  {
    tag: "Headline",
    meta: "22px · 600",
    el: <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.2px" }}>סקירת פעילות יומית</div>,
  },
  {
    tag: "Title",
    meta: "19px · 600",
    el: <div style={{ fontSize: 19, fontWeight: 600 }}>פניות שטרם טופלו</div>,
  },
  {
    tag: "Body Large",
    meta: "15px · 400",
    el: <div style={{ fontSize: 15 }}>טקסט מוביל לפסקאות פתיחה ותיאורים קצרים במסכים.</div>,
  },
  {
    tag: "Body",
    meta: "14px · 400",
    el: <div style={{ fontSize: 14 }}>טקסט גוף סטנדרטי — קריא, נקי, ללא עומס. ברירת המחדל של המערכת.</div>,
  },
  {
    tag: "Label",
    meta: "12.5px · 600",
    el: <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>עודכן לפני 4 דקות</div>,
  },
  {
    tag: "Numeric / mono",
    meta: "tabular-nums",
    el: (
      <div style={{ fontSize: 20, fontWeight: 600, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.2px" }}>
        ₪ 128,450 · 1,847 · 09:42
      </div>
    ),
  },
];

const SPACING = [
  { name: "--space-1", px: 4 },
  { name: "--space-2", px: 8 },
  { name: "--space-3", px: 12 },
  { name: "--space-4", px: 16 },
  { name: "--space-5", px: 20 },
  { name: "--space-6", px: 24 },
  { name: "--space-8", px: 32 },
  { name: "--space-10", px: 40 },
];

const RADII = [
  { name: "--radius-xs", px: 6 },
  { name: "--radius-sm", px: 8 },
  { name: "--radius", px: 12 },
  { name: "--radius-lg", px: 18 },
];

const ELEVATION = ["--shadow-xs", "--shadow-sm", "--shadow-md", "--shadow-lg"];

const MOTION = [
  { name: "--dur-fast", val: "120ms", role: "hover · ripple" },
  { name: "--dur", val: "180ms", role: "default transition" },
  { name: "--dur-slow", val: "280ms", role: "panel · overlay" },
  { name: "--ease-standard", val: "0.2,0,0,1", role: "in/out כללי" },
  { name: "--ease-emphasized", val: "0.3,0,0,1", role: "כניסות בולטות" },
];

const ICONS = [
  "bi-inbox-fill",
  "bi-grid-1x2-fill",
  "bi-telephone-fill",
  "bi-people-fill",
  "bi-cash-coin",
  "bi-receipt",
  "bi-shield-fill-check",
  "bi-bell",
  "bi-gear",
  "bi-search",
  "bi-envelope-paper",
  "bi-clipboard2-check",
];

function Swatches({ items }: { items: Swatch[] }) {
  return (
    <div className="ds-swatches">
      {items.map((s) => (
        <div className="ds-swatch" key={s.name}>
          <div
            className="ds-swatch-chip"
            style={{ background: s.hex, ...(s.light ? { boxShadow: "inset 0 0 0 1px var(--border)" } : {}) }}
          />
          <div className="ds-swatch-meta">
            <div className="ds-swatch-name">{s.name}</div>
            <div className="ds-swatch-hex">{s.hex}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DesignSystem() {
  return (
    <div className="ds">
      <div className="ds-inner">
        {/* ---- Hero ---- */}
        <header className="ds-hero">
          <div className="ds-hero-logo">
            <i className="bi bi-bezier2" />
          </div>
          <div>
            <span className="ds-overline">תבנית עיצוב · גרסה 1.0</span>
            <h1>שפת העיצוב של המערכת</h1>
            <p>
              מערכת אחת של צבע, טיפוגרפיה, מרווחים ותנועה שמניעה את כל המסכים. הסגנון נשען על שפת
              Google Workspace — נקי, אמין ומוכר — אבל עם זהות משלו: אקצנט יחיד, מבנה חד וטקסט שמדבר
              בשפה של הפורום. כל מסך חדש נבנה מהאסימונים שכאן, בלי צבעים קשיחים.
            </p>
            <div className="ds-hero-meta">
              <span className="badge badge-blue">RTL · עברית</span>
              <span className="badge badge-green">Light</span>
              <span className="badge badge-gray">Heebo</span>
              <span className="badge badge-purple">Material 3</span>
            </div>
          </div>
        </header>

        {/* ---- Principles ---- */}
        <section className="ds-section">
          <span className="ds-overline">עקרונות</span>
          <h2>מה מוביל את ההחלטות</h2>
          <div className="ds-principles">
            <div className="ds-principle">
              <i className="bi bi-bullseye" />
              <div>
                <h4>אקצנט אחד, בכוונה</h4>
                <p>כחול הפורום מופיע רק כשהוא צריך להוביל את העין — פעולה ראשית, פריט פעיל, מספר חשוב.</p>
              </div>
            </div>
            <div className="ds-principle">
              <i className="bi bi-rulers" />
              <div>
                <h4>מבנה לפני קישוט</h4>
                <p>גבולות חדים של 1px ורשת עקבית נושאים את הממשק. צללים עדינים בלבד, בלי גרדיאנטים מיותרים.</p>
              </div>
            </div>
            <div className="ds-principle">
              <i className="bi bi-fonts" />
              <div>
                <h4>היררכיה ברורה</h4>
                <p>סקאלת טיפוגרפיה מוגדרת, ומספרים תמיד ב־tabular-nums כדי שטבלאות וסכומים יתיישרו.</p>
              </div>
            </div>
            <div className="ds-principle">
              <i className="bi bi-shield-check" />
              <div>
                <h4>אמון קודם</h4>
                <p>ארגון שמטפל בתלונות ובתרומות — הממשק צריך להרגיש מסודר, רגוע ומכובד, לא "טרנדי".</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Color ---- */}
        <section className="ds-section">
          <span className="ds-overline">צבע</span>
          <h2>פלטת הצבעים</h2>
          <p className="ds-lead">
            כחול הפורום הוא הצבע המוביל היחיד. הניטרלים והמשטחים נושאים את רוב הממשק; הצבעים הסמנטיים
            שמורים למצבים בלבד.
          </p>

          <div style={{ marginBottom: "var(--space-5)" }}>
            <div className="ds-swatch-name" style={{ marginBottom: 8 }}>כחול הפורום · סולם טונים</div>
            <div className="ds-ramp">
              {PRIMARY_RAMP.map((s) => (
                <div className="ds-ramp-step" key={s.step} style={{ background: s.hex, color: s.ink }}>
                  {s.step}
                </div>
              ))}
            </div>
          </div>

          <div className="ds-swatch-name" style={{ marginBottom: 8 }}>משטחים</div>
          <Swatches items={SURFACES} />
          <div className="ds-swatch-name" style={{ margin: "var(--space-5) 0 8px" }}>טקסט וקווים</div>
          <Swatches items={TEXT_LINES} />
          <div className="ds-swatch-name" style={{ margin: "var(--space-5) 0 8px" }}>סמנטי · מצבים</div>
          <Swatches items={SEMANTIC} />
        </section>

        {/* ---- Typography ---- */}
        <section className="ds-section">
          <span className="ds-overline">טיפוגרפיה</span>
          <h2>סקאלת הטקסט</h2>
          <p className="ds-lead">משפחה אחת — Heebo — בשבע דרגות. כל דרגה היא תפקיד, לא גודל שרירותי.</p>
          <div className="ds-type-list">
            {TYPE_SCALE.map((t) => (
              <div className="ds-type-row" key={t.tag}>
                <div className="ds-type-tag">
                  <b>{t.tag}</b>
                  {t.meta}
                </div>
                <div className="ds-type-sample">{t.el}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Buttons ---- */}
        <section className="ds-section">
          <span className="ds-overline">רכיבים</span>
          <h2>כפתורים</h2>
          <p className="ds-lead">ראשי לפעולה אחת במסך. השאר רפאים או רכים. גובה אחיד, פינות גלולה.</p>
          <div className="ds-panel">
            <div className="ds-row">
              <button className="btn btn-primary">
                שמירה <i className="bi bi-check-lg" />
              </button>
              <button className="btn btn-ghost">
                <i className="bi bi-pencil" /> עריכה
              </button>
              <button className="btn btn-soft">
                <i className="bi bi-funnel" /> סינון
              </button>
              <button className="btn btn-primary btn-sm">קטן</button>
              <button className="btn btn-ghost btn-sm">קטן</button>
            </div>
          </div>
        </section>

        {/* ---- Chips & badges ---- */}
        <section className="ds-section">
          <h2>צ׳יפים ותגיות</h2>
          <p className="ds-lead">צ׳יפים לסינון אינטראקטיבי; תגיות לסטטוס בלבד.</p>
          <div className="ds-panel">
            <div className="ds-row">
              <span className="chip is-active">
                <i className="bi bi-inbox" /> הכל
              </span>
              <span className="chip">לא נקראו</span>
              <span className="chip">מסומנים</span>
              <span className="chip">מצורף</span>
            </div>
            <div className="ds-row">
              <span className="badge badge-green">טופל</span>
              <span className="badge badge-amber">בטיפול</span>
              <span className="badge badge-red">דחוף</span>
              <span className="badge badge-blue">חדש</span>
              <span className="badge badge-purple">מנויים</span>
              <span className="badge badge-teal">ייעוץ</span>
              <span className="badge badge-gray">טיוטה</span>
            </div>
          </div>
        </section>

        {/* ---- Inputs & avatars ---- */}
        <section className="ds-section">
          <h2>שדות וזהויות</h2>
          <div className="ds-col-2">
            <div className="ds-panel">
              <div className="field" style={{ marginBottom: 14 }}>
                <label htmlFor="ds-name">שם מלא</label>
                <div className="field-input">
                  <i className="bi bi-person" />
                  <input id="ds-name" type="text" defaultValue="משה ברגר" />
                </div>
              </div>
              <div className="search-mini">
                <i className="bi bi-search" />
                <input type="text" placeholder="חיפוש מהיר…" />
              </div>
            </div>
            <div className="ds-panel">
              <div className="ds-row" style={{ gap: 14 }}>
                <Avatar name="משה ברגר" size="lg" />
                <Avatar name="רבקה כהן" size="md" />
                <Avatar name="יוסף פרידמן" size="sm" />
                <div>
                  <div className="ds-swatch-name">אווטאר גרדיאנט</div>
                  <div className="ds-swatch-hex">נגזר דטרמיניסטית מהשם</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Elevation ---- */}
        <section className="ds-section">
          <span className="ds-overline">עומק</span>
          <h2>Elevation</h2>
          <p className="ds-lead">ארבע דרגות, עדינות. הגבהה מסמנת אינטראקציה — לא דקורציה.</p>
          <div className="ds-elev">
            {ELEVATION.map((e) => (
              <div className="ds-elev-card" key={e} style={{ boxShadow: `var(${e})` }}>
                {e.replace("--shadow-", "")}
              </div>
            ))}
          </div>
        </section>

        {/* ---- Spacing & radius ---- */}
        <section className="ds-section">
          <span className="ds-overline">מידות</span>
          <h2>מרווחים ופינות</h2>
          <div className="ds-col-2">
            <div className="ds-tokens">
              {SPACING.map((s) => (
                <div className="ds-token" key={s.name}>
                  <span className="ds-token-name">{s.name}</span>
                  <span className="ds-token-val">{s.px}px</span>
                  <span className="ds-token-vis">
                    <span className="ds-space-bar" style={{ width: s.px }} />
                  </span>
                </div>
              ))}
            </div>
            <div className="ds-tokens">
              {RADII.map((r) => (
                <div className="ds-token" key={r.name}>
                  <span className="ds-token-name">{r.name}</span>
                  <span className="ds-token-val">{r.px}px</span>
                  <span className="ds-token-vis">
                    <span className="ds-radius-box" style={{ borderRadius: r.px }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Motion ---- */}
        <section className="ds-section">
          <h2>תנועה</h2>
          <p className="ds-lead">מעברים קצרים ועקביים. הכל נשען על שני עקומי האטה ושלוש דרגות זמן.</p>
          <div className="ds-tokens">
            {MOTION.map((m) => (
              <div className="ds-token" key={m.name}>
                <span className="ds-token-name">{m.name}</span>
                <span className="ds-token-val">{m.val}</span>
                <span className="ds-token-vis" style={{ color: "var(--text-2)", fontSize: 12.5 }}>{m.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Iconography ---- */}
        <section className="ds-section">
          <h2>אייקונוגרפיה</h2>
          <p className="ds-lead">Bootstrap Icons, משקל אחיד. ניווט במלא (fill), פעולות בקו.</p>
          <div className="ds-icons">
            {ICONS.map((ic) => (
              <div className="ds-icon" key={ic}>
                <i className={`bi ${ic}`} />
                <span>{ic.replace("bi-", "")}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
