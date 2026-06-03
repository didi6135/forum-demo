import { ACTIVITY, ATTENTION, KPIS, TOP_DONORS, TREND, type BadgeTone } from "../data/sampleData";
import { Avatar } from "../components/Avatar";

const TONE_SOFT: Record<BadgeTone, string> = {
  blue: "var(--primary-soft)",
  green: "var(--green-soft)",
  red: "var(--red-soft)",
  amber: "var(--amber-soft)",
  purple: "var(--purple-soft)",
  teal: "var(--teal-soft)",
  gray: "var(--surface-2)",
};
const TONE_FG: Record<BadgeTone, string> = {
  blue: "var(--primary)",
  green: "var(--green)",
  red: "var(--red)",
  amber: "#b06000",
  purple: "var(--purple)",
  teal: "var(--teal)",
  gray: "var(--text-2)",
};

/** Build an SVG path string from a numeric series within a viewBox. */
function linePath(values: number[], width: number, height: number, pad: number, max: number): string {
  const step = width / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = height - pad - (v / max) * (height - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function TrendChart() {
  const w = 100;
  const h = 42;
  const pad = 4;
  const max = Math.max(...TREND.map((t) => t.incoming)) * 1.1;
  const incoming = linePath(TREND.map((t) => t.incoming), w, h, pad, max);
  const resolved = linePath(TREND.map((t) => t.resolved), w, h, pad, max);
  const incomingArea = `${incoming} L${w},${h - pad} L0,${h - pad} Z`;
  const gridY = [0.25, 0.5, 0.75].map((f) => pad + f * (h - pad * 2));

  return (
    <div className="chart-wrap">
      <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="incFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridY.map((y) => (
          <line key={y} x1="0" y1={y} x2={w} y2={y} stroke="var(--border)" strokeWidth="0.35" />
        ))}
        <path d={incomingArea} fill="url(#incFill)" />
        <path d={resolved} fill="none" stroke="var(--teal)" strokeWidth="1" strokeDasharray="2.5 2" strokeLinecap="round" />
        <path d={incoming} fill="none" stroke="var(--primary)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="chart-x">
        {TREND.map((t) => (
          <span key={t.day}>{t.day}</span>
        ))}
      </div>
    </div>
  );
}

export function Dashboard() {
  const totalIncoming = TREND.reduce((s, t) => s + t.incoming, 0);
  const totalResolved = TREND.reduce((s, t) => s + t.resolved, 0);
  const resolveRate = Math.round((totalResolved / totalIncoming) * 100);

  return (
    <div className="surface-card">
      <div className="dash">
        {/* ---- Header ---- */}
        <div className="dash-head">
          <div>
            <h1 className="dash-greet">בוקר טוב, אברימי</h1>
            <p className="dash-greet-sub">סקירת הפעילות במערכת · יום ג׳, 3 ביוני 2026</p>
          </div>
          <div className="dash-head-actions">
            <div className="seg">
              <button className="active" type="button">היום</button>
              <button type="button">השבוע</button>
              <button type="button">החודש</button>
            </div>
            <button className="btn btn-soft btn-sm" type="button">
              <i className="bi bi-arrow-clockwise" /> רענון
            </button>
          </div>
        </div>

        {/* ---- KPI cards ---- */}
        <div className="stat-grid">
          {KPIS.map((s) => (
            <div className="stat-card" key={s.key}>
              <div className="stat-top">
                <span className="stat-label">{s.label}</span>
                <div className="stat-ic">
                  <i className={`bi ${s.icon}`} />
                </div>
              </div>
              <div className="stat-val">{s.value}</div>
              <div className={`stat-delta ${s.deltaUp ? "up" : "flat"}`}>
                <i className={`bi ${s.deltaUp ? "bi-arrow-up-right" : "bi-dash"}`} />
                {s.delta}
              </div>
            </div>
          ))}
        </div>

        {/* ---- Main: chart + activity ---- */}
        <div className="dash-cols">
          <div className="panel">
            <div className="panel-head">
              <i className="bi bi-graph-up-arrow" style={{ color: "var(--primary)" }} />
              <h3>מגמת פניות — נכנס מול טופל</h3>
              <div className="chart-legend">
                <span><i className="dot dot-primary" /> נכנס</span>
                <span><i className="dot dot-teal" /> טופל</span>
              </div>
            </div>
            <TrendChart />
            <div className="chart-foot">
              <div className="chart-kpi">
                <span className="ck-val">{totalIncoming}</span>
                <span className="ck-lbl">פניות השבוע</span>
              </div>
              <div className="chart-kpi">
                <span className="ck-val">{resolveRate}%</span>
                <span className="ck-lbl">שיעור טיפול</span>
              </div>
              <div className="chart-kpi">
                <span className="ck-val">2.4 ימים</span>
                <span className="ck-lbl">זמן טיפול ממוצע</span>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <i className="bi bi-activity" style={{ color: "var(--primary)" }} />
              <h3>פעילות אחרונה</h3>
              <button className="link" type="button">הצג הכל</button>
            </div>
            <div className="panel-body">
              {ACTIVITY.map((a, i) => (
                <div className="activity-row" key={i}>
                  <div className="activity-ic">
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
        </div>

        {/* ---- Secondary: attention + donors ---- */}
        <div className="dash-cols dash-cols-even">
          <div className="panel">
            <div className="panel-head">
              <i className="bi bi-flag-fill" style={{ color: "var(--red)" }} />
              <h3>דורש טיפול היום</h3>
              <span className="badge badge-red">{ATTENTION.length}</span>
            </div>
            <div className="panel-body">
              {ATTENTION.map((a, i) => (
                <button className="attn-row" type="button" key={i}>
                  <div className="attn-ic" style={{ background: TONE_SOFT[a.tone], color: TONE_FG[a.tone] }}>
                    <i className={`bi ${a.icon}`} />
                  </div>
                  <div className="activity-main">
                    <div className="activity-title">{a.title}</div>
                    <div className="activity-sub">{a.sub}</div>
                  </div>
                  <span className={`badge badge-${a.tone}`}>{a.tag}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <i className="bi bi-trophy-fill" style={{ color: "var(--amber)" }} />
              <h3>תורמים מובילים החודש</h3>
              <button className="link" type="button">לכל התורמים</button>
            </div>
            <div className="panel-body">
              {TOP_DONORS.map((d, i) => (
                <div className="donor-row" key={d.name}>
                  <span className={`donor-rank${i === 0 ? " top" : ""}`}>{i + 1}</span>
                  <Avatar name={d.name} size="sm" />
                  <div className="activity-main">
                    <div className="activity-title">{d.name}</div>
                    <div className="activity-sub">{d.campaign}</div>
                  </div>
                  <span className="donor-amount">₪{d.amount.toLocaleString("he-IL")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
