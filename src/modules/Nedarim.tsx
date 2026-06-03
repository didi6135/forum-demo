import { useMemo, useState } from "react";
import "./nedarim.css";
import { Avatar } from "../components/Avatar";
import {
  NEDARIM_TXNS,
  NEDARIM_CATEGORIES,
  nedarimCategory,
  type BadgeTone,
  type NedarimTxn,
} from "../data/sampleData";

const STATUS_TONE: Record<NedarimTxn["status"], BadgeTone> = {
  אושר: "green",
  ממתין: "amber",
  נכשל: "red",
};

type StatusFilter = "all" | NedarimTxn["status"];

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "הכל" },
  { key: "אושר", label: "אושרו" },
  { key: "ממתין", label: "ממתינות" },
  { key: "נכשל", label: "נכשלו" },
];

const shekel = (n: number) => `₪${n.toLocaleString()}`;

export function Nedarim() {
  const [donor, setDonor] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [donorOpen, setDonorOpen] = useState(false);

  /** Distinct donors, for the customer filter dropdown. */
  const donors = useMemo(
    () => Array.from(new Set(NEDARIM_TXNS.map((t) => t.donor))).sort((a, b) => a.localeCompare(b, "he")),
    [],
  );

  /** Per-category approved totals, drives the summary cards. */
  const categoryTotals = useMemo(() => {
    return NEDARIM_CATEGORIES.map((cat) => {
      const rows = NEDARIM_TXNS.filter((t) => t.campaign === cat.name);
      return {
        ...cat,
        count: rows.length,
        total: rows.filter((t) => t.status === "אושר").reduce((sum, t) => sum + t.amount, 0),
      };
    });
  }, []);

  const filtered = useMemo(() => {
    return NEDARIM_TXNS.filter((t) => {
      if (donor !== "all" && t.donor !== donor) return false;
      if (category !== "all" && t.campaign !== category) return false;
      if (status !== "all" && t.status !== status) return false;
      return true;
    });
  }, [donor, category, status]);

  /* ---- stats reflect the active filter ---- */
  const approvedSum = filtered.filter((t) => t.status === "אושר").reduce((sum, t) => sum + t.amount, 0);
  const approvedCount = filtered.filter((t) => t.status === "אושר").length;
  const pendingCount = filtered.filter((t) => t.status === "ממתין").length;
  const failedCount = filtered.filter((t) => t.status === "נכשל").length;

  const hasFilter = donor !== "all" || category !== "all" || status !== "all";
  function clearFilters() {
    setDonor("all");
    setCategory("all");
    setStatus("all");
  }

  return (
    <div className="surface-card">
      <div className="ned">
        {/* ===== Header ===== */}
        <div className="ned-head">
          <div>
            <h1 className="ned-title">נדרים פלוס</h1>
            <p className="ned-sub">תרומות שהתקבלו דרך נדרים פלוס · סינון לפי תורם וקטגוריה</p>
          </div>
          <button className="btn btn-primary btn-sm" type="button">
            <i className="bi bi-plus-circle-fill" /> תרומה חדשה
          </button>
        </div>

        {/* ===== Stat strip ===== */}
        <div className="ned-stats">
          <Stat icon="bi-cash-stack" tone="green" value={shekel(approvedSum)} label="סך גויס" />
          <Stat icon="bi-receipt-cutoff" tone="blue" value={String(filtered.length)} label="עסקאות" />
          <Stat icon="bi-check-circle-fill" tone="teal" value={String(approvedCount)} label="אושרו" />
          <Stat
            icon="bi-hourglass-split"
            tone="amber"
            value={`${pendingCount}/${failedCount}`}
            label="ממתינות / נכשלו"
          />
        </div>

        {/* ===== Category summary cards (= category filter) ===== */}
        <div className="ned-cats">
          {categoryTotals.map((cat) => (
            <button
              key={cat.name}
              type="button"
              className={`ned-cat${category === cat.name ? " is-active" : ""}`}
              onClick={() => setCategory((c) => (c === cat.name ? "all" : cat.name))}
            >
              <div className={`ned-cat-ic tone-${cat.tone}`}>
                <i className={`bi ${cat.icon}`} />
              </div>
              <div className="ned-cat-body">
                <div className="ned-cat-name">{cat.name}</div>
                <div className="ned-cat-total">{shekel(cat.total)}</div>
              </div>
              <span className="ned-cat-count">{cat.count}</span>
            </button>
          ))}
        </div>

        {/* ===== Filter bar ===== */}
        <div className="ned-filters">
          {/* customer / donor dropdown */}
          <div className="dd">
            <button className="btn btn-soft btn-sm" type="button" onClick={() => setDonorOpen((v) => !v)}>
              <i className="bi bi-person" />
              {donor === "all" ? "כל התורמים" : donor}
              <i className="bi bi-chevron-down" style={{ fontSize: 11 }} />
            </button>
            {donorOpen && (
              <>
                <button className="dd-backdrop" type="button" aria-label="סגירה" onClick={() => setDonorOpen(false)} />
                <div className="dd-menu">
                  <button
                    className={`dd-item${donor === "all" ? " active" : ""}`}
                    type="button"
                    onClick={() => {
                      setDonor("all");
                      setDonorOpen(false);
                    }}
                  >
                    <i className="bi bi-check2" style={{ visibility: donor === "all" ? "visible" : "hidden" }} />
                    כל התורמים
                  </button>
                  <div className="dd-divider" />
                  {donors.map((d) => (
                    <button
                      key={d}
                      className={`dd-item${donor === d ? " active" : ""}`}
                      type="button"
                      onClick={() => {
                        setDonor(d);
                        setDonorOpen(false);
                      }}
                    >
                      <i className="bi bi-check2" style={{ visibility: donor === d ? "visible" : "hidden" }} />
                      {d}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* status segmented */}
          <div className="seg">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s.key}
                type="button"
                className={status === s.key ? "active" : ""}
                onClick={() => setStatus(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {hasFilter && (
            <button className="btn btn-ghost btn-sm ned-clear" type="button" onClick={clearFilters}>
              <i className="bi bi-x-lg" /> נקה סינון
            </button>
          )}
        </div>

        {/* ===== Transactions table ===== */}
        <div className="ned-table">
          <div className="ned-row ned-row-head">
            <span>תורם</span>
            <span>קטגוריה</span>
            <span className="ned-col-pay">תשלומים</span>
            <span className="ned-col-date">תאריך</span>
            <span className="ned-col-amount">סכום</span>
            <span className="ned-col-status">סטטוס</span>
          </div>

          {filtered.length === 0 ? (
            <div className="ned-empty">
              <i className="bi bi-search" />
              <p>לא נמצאו תרומות התואמות את הסינון</p>
              {hasFilter && (
                <button className="btn btn-soft btn-sm" type="button" onClick={clearFilters}>
                  נקה סינון
                </button>
              )}
            </div>
          ) : (
            filtered.map((t) => {
              const cat = nedarimCategory(t.campaign);
              return (
                <div className="ned-row" key={t.id}>
                  <span className="ned-donor">
                    <Avatar name={t.donor} size="sm" />
                    <span className="ned-donor-name">{t.donor}</span>
                  </span>
                  <span>
                    <span className={`badge badge-${cat.tone} ned-cat-badge`}>
                      <i className={`bi ${cat.icon}`} /> {t.campaign}
                    </span>
                  </span>
                  <span className="ned-col-pay ned-muted">{t.payments}</span>
                  <span className="ned-col-date ned-muted">{t.date}</span>
                  <span className="ned-col-amount ned-amount">{shekel(t.amount)}</span>
                  <span className="ned-col-status">
                    <span className={`badge badge-${STATUS_TONE[t.status]}`}>{t.status}</span>
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Stat chip ---------- */
function Stat({ icon, tone, value, label }: { icon: string; tone: BadgeTone; value: string; label: string }) {
  return (
    <div className="ned-stat">
      <div className={`ned-stat-ic tone-${tone}`}>
        <i className={`bi ${icon}`} />
      </div>
      <div>
        <div className="ned-stat-val">{value}</div>
        <div className="ned-stat-lbl">{label}</div>
      </div>
    </div>
  );
}
