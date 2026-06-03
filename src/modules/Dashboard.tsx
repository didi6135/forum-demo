import { ACTIVITY, WEEK_BARS } from "../data/sampleData";

interface Stat {
  icon: string;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  trend: string;
  trendUp: boolean;
}

const STATS: Stat[] = [
  { icon: "bi-inbox-fill", iconBg: "var(--primary-soft)", iconColor: "var(--primary)", value: "12", label: "מיילים לא נקראו", trend: "3 חדשים היום", trendUp: true },
  { icon: "bi-telephone-fill", iconBg: "var(--teal-soft)", iconColor: "var(--teal)", value: "47", label: "פניות פתוחות", trend: "8% מהשבוע שעבר", trendUp: true },
  { icon: "bi-cash-coin", iconBg: "var(--green-soft)", iconColor: "var(--green)", value: "₪18,420", label: "תרומות החודש", trend: "12% עלייה", trendUp: true },
  { icon: "bi-receipt", iconBg: "var(--purple-soft)", iconColor: "var(--purple)", value: "184", label: "קבלות שהופקו", trend: "2 ממתינות", trendUp: false },
];

const TONE_BG: Record<string, string> = {
  blue: "var(--primary-soft)",
  green: "var(--green-soft)",
  purple: "var(--purple-soft)",
  teal: "var(--teal-soft)",
  amber: "var(--amber-soft)",
};
const TONE_FG: Record<string, string> = {
  blue: "var(--primary)",
  green: "var(--green)",
  purple: "var(--purple)",
  teal: "var(--teal)",
  amber: "#b06000",
};

export function Dashboard() {
  const maxBar = Math.max(...WEEK_BARS.map((b) => b.value));

  return (
    <div className="surface-card">
      <div className="dash">
        <h1 className="dash-greet">בוקר טוב, אברימי 👋</h1>
        <p className="dash-greet-sub">הנה סקירה כללית של הפעילות במערכת — יום ג׳, 3 ביוני 2026.</p>

        <div className="stat-grid">
          {STATS.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-ic" style={{ background: s.iconBg, color: s.iconColor }}>
                <i className={`bi ${s.icon}`} />
              </div>
              <div className="stat-val">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-trend ${s.trendUp ? "trend-up" : "trend-down"}`}>
                <i className={`bi ${s.trendUp ? "bi-arrow-up-right" : "bi-dash"}`} />
                {s.trend}
              </div>
            </div>
          ))}
        </div>

        <div className="dash-cols">
          <div className="panel">
            <div className="panel-head">
              <i className="bi bi-activity" style={{ color: "var(--primary)" }} />
              <h3>פעילות אחרונה</h3>
              <button className="link" type="button">
                הצג הכל
              </button>
            </div>
            <div className="panel-body">
              {ACTIVITY.map((a, i) => (
                <div className="activity-row" key={i}>
                  <div className="activity-ic" style={{ background: TONE_BG[a.tone], color: TONE_FG[a.tone] }}>
                    <i className={`bi ${a.icon}`} />
                  </div>
                  <div className="activity-main">
                    <div className="activity-title">{a.title}</div>
                    <div className="activity-sub">{a.sub}</div>
                  </div>
                  <div className="activity-time">{a.time}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <i className="bi bi-bar-chart-fill" style={{ color: "var(--primary)" }} />
              <h3>פניות לפי יום</h3>
              <button className="link" type="button">
                השבוע
              </button>
            </div>
            <div className="bars">
              {WEEK_BARS.map((b) => (
                <div className="bar-col" key={b.label}>
                  <div className="bar" style={{ height: `${(b.value / maxBar) * 100}%` }} title={`${b.value} פניות`} />
                  <span className="bar-label">{b.label}</span>
                </div>
              ))}
            </div>
            <div className="panel-head" style={{ borderTop: "1px solid var(--border)", borderBottom: "none" }}>
              <i className="bi bi-lightning-charge-fill" style={{ color: "var(--amber)" }} />
              <h3 style={{ fontSize: 14 }}>זמן טיפול ממוצע</h3>
              <span style={{ marginInlineStart: "auto", fontWeight: 800, fontSize: 18 }}>2.4 ימים</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
