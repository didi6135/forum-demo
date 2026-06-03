import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import "./inquiries.css";
import {
  INQUIRIES,
  INQUIRY_TOPICS,
  INQUIRY_AI_OVERVIEW,
  DRIVE_FOLDERS,
  type BadgeTone,
  type Inquiry,
} from "../data/sampleData";

/* ---------- tone helpers (shared idiom with Dashboard) ---------- */
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

/** Deterministic waveform heights so each call gets a stable, unique shape. */
function waveform(seed: string, bars = 28): number[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const out: number[] = [];
  for (let i = 0; i < bars; i += 1) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    out.push(28 + (hash % 72));
  }
  return out;
}

type GroupState = "idle" | "running" | "done";
const BATCHES = 4;
const BATCH_MS = 520;

export function Inquiries() {
  const [period, setPeriod] = useState<"today" | "yesterday" | "week">("today");
  const [read, setRead] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(INQUIRIES.map((q) => [q.id, q.read])),
  );
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [playing, setPlaying] = useState<string | null>(null);
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({ t1: true });

  const [groupState, setGroupState] = useState<GroupState>("idle");
  const [batch, setBatch] = useState(0);
  /** Time the current grouping was last saved (HH:MM), or null if unsaved. */
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  /**
   * Open bulk-action modal: which action, on which inquiries, and whether to
   * clear the feed selection afterwards (only the selection-bar flow does).
   */
  const [modal, setModal] = useState<{ kind: "drive" | "email"; items: Inquiry[]; clearSel: boolean } | null>(null);

  const byId = useMemo(() => new Map(INQUIRIES.map((q) => [q.id, q])), []);
  /** Every inquiry that belongs to an AI topic, in topic order — for the "act on all groups" buttons. */
  const allGroupedInquiries = useMemo(
    () => INQUIRY_TOPICS.flatMap((t) => t.inquiryIds).map((id) => byId.get(id)!).filter(Boolean),
    [byId],
  );

  /* ---- derived counts ---- */
  const unread = INQUIRIES.filter((q) => !read[q.id]).length;
  const urgent = INQUIRIES.filter((q) => q.urgent && !read[q.id]).length;
  const selectedIds = Object.keys(selected).filter((id) => selected[id]);
  const topicsShown = groupState === "done" ? INQUIRY_TOPICS.length : 0;

  /* ---- select-all (master checkbox) ---- */
  const allSelected = selectedIds.length === INQUIRIES.length;
  const someSelected = selectedIds.length > 0 && !allSelected;
  const selectAllRef = useRef<HTMLInputElement | null>(null);
  // `indeterminate` is a DOM-only property — set it imperatively each render.
  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  /* ---- AI grouping simulation ---- */
  function runGrouping() {
    if (groupState === "running") return;
    setSavedAt(null);
    setGroupState("running");
    setBatch(0);
  }
  /** Reset back to the pre-grouping state so the AI can cluster again. */
  function regroup() {
    setSavedAt(null);
    setGroupState("idle");
  }
  /** Persist the current grouping (demo: stamp the save time). */
  function saveGrouping() {
    setSavedAt(new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }));
  }
  useEffect(() => {
    if (groupState !== "running") return;
    if (batch >= BATCHES) {
      const t = window.setTimeout(() => setGroupState("done"), 360);
      return () => window.clearTimeout(t);
    }
    timer.current = window.setTimeout(() => setBatch((b) => b + 1), BATCH_MS);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [groupState, batch]);

  /* ---- actions ---- */
  function markRead(id: string) {
    setRead((r) => ({ ...r, [id]: true }));
  }
  function toggleSelect(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }
  function toggleSelectAll() {
    setSelected(allSelected ? {} : Object.fromEntries(INQUIRIES.map((q) => [q.id, true])));
  }
  function clearSelection() {
    setSelected({});
  }
  /** Confirm a bulk modal — the demo "completes" the action, clearing feed selection only when it originated there. */
  function confirmModal() {
    if (modal?.clearSel) clearSelection();
    setModal(null);
  }
  function markSelectedRead() {
    setRead((r) => {
      const next = { ...r };
      selectedIds.forEach((id) => (next[id] = true));
      return next;
    });
    clearSelection();
  }
  function markTopicRead(ids: string[]) {
    setRead((r) => {
      const next = { ...r };
      ids.forEach((id) => (next[id] = true));
      return next;
    });
  }
  function toggleTopic(id: string) {
    setOpenTopics((o) => ({ ...o, [id]: !o[id] }));
  }

  const periodLabel = period === "today" ? "היום" : period === "yesterday" ? "אתמול" : "השבוע";

  return (
    <div className="surface-card">
      <div className="inq">
        {/* ===== Header ===== */}
        <div className="inq-head">
          <div>
            <h1 className="inq-title">פניות ידע פון</h1>
            <p className="inq-sub">
              שיחות שהתקבלו · {periodLabel} · יום ג׳, 3 ביוני 2026
            </p>
          </div>
          <div className="inq-head-actions">
            <div className="seg">
              <button className={period === "today" ? "active" : ""} type="button" onClick={() => setPeriod("today")}>
                היום
              </button>
              <button className={period === "yesterday" ? "active" : ""} type="button" onClick={() => setPeriod("yesterday")}>
                אתמול
              </button>
              <button className={period === "week" ? "active" : ""} type="button" onClick={() => setPeriod("week")}>
                השבוע
              </button>
            </div>
            <button className="btn btn-soft btn-sm" type="button">
              <i className="bi bi-arrow-clockwise" /> רענון
            </button>
          </div>
        </div>

        {/* ===== Stat strip ===== */}
        <div className="inq-stats">
          <Stat icon="bi-telephone-inbound-fill" tone="blue" value={String(INQUIRIES.length)} label="פניות התקבלו" />
          <Stat icon="bi-envelope-dot-fill" tone="amber" value={String(unread)} label="לא נקראו" />
          <Stat icon="bi-exclamation-triangle-fill" tone="red" value={String(urgent)} label="דחופות" />
          <Stat
            icon="bi-diagram-3-fill"
            tone="purple"
            value={topicsShown ? String(topicsShown) : "—"}
            label="קבוצות AI"
          />
          <Stat icon="bi-stopwatch-fill" tone="teal" value="2:18" label="משך שיחה ממוצע" />
        </div>

        {/* ===== Two columns ===== */}
        <div className="inq-cols">
          {/* ---- Feed (primary, right in RTL) ---- */}
          <div className="panel inq-feed">
            <div className="panel-head">
              <label className="inq-selectall" title={allSelected ? "נקה בחירה" : "בחר את כולם"}>
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
                <span>בחר הכל</span>
              </label>
              <i className="bi bi-chat-left-text-fill" style={{ color: "var(--primary)" }} />
              <h3>פיד הפניות</h3>
              <span className="badge badge-gray">{INQUIRIES.length}</span>
              <div style={{ marginInlineStart: "auto" }} className="inq-feed-search">
                <i className="bi bi-search" />
                <input type="text" placeholder="חיפוש בתמלולים…" />
              </div>
            </div>

            <div className="inq-list">
              {INQUIRIES.map((q) => (
                <InquiryCard
                  key={q.id}
                  q={q}
                  read={!!read[q.id]}
                  selected={!!selected[q.id]}
                  expanded={!!expanded[q.id]}
                  playing={playing === q.id}
                  onSelect={() => toggleSelect(q.id)}
                  onRead={() => markRead(q.id)}
                  onExpand={() => setExpanded((e) => ({ ...e, [q.id]: !e[q.id] }))}
                  onPlay={() => setPlaying((p) => (p === q.id ? null : q.id))}
                />
              ))}
            </div>
          </div>

          {/* ---- AI groups (left) ---- */}
          <div className="panel inq-groups">
            <div className="panel-head">
              <i className="bi bi-stars" style={{ color: "var(--purple)" }} />
              <h3>קיבוץ נושאים · AI</h3>
              {groupState === "done" && <span className="badge badge-purple">{topicsShown}</span>}
            </div>

            {groupState === "idle" && (
              <div className="inq-group-cta">
                <div className="inq-group-cta-orb">
                  <i className="bi bi-stars" />
                </div>
                <h4>נתח וקבץ את הפניות</h4>
                <p>
                  ה-AI יקרא את כל {INQUIRIES.length} התמלולים, יזהה נושאים חוזרים ויקבץ אותם
                  לטיפול מרוכז — מכתב דרישה אחד לכל קבוצה.
                </p>
                <button className="btn btn-primary inq-group-btn" type="button" onClick={runGrouping}>
                  <i className="bi bi-stars" /> קבץ עם AI
                </button>
              </div>
            )}

            {groupState === "running" && (
              <div className="inq-group-progress">
                <div className="inq-group-cta-orb pulsing">
                  <i className="bi bi-stars" />
                </div>
                <h4>מנתח אצווה {Math.min(batch + 1, BATCHES)} מתוך {BATCHES}…</h4>
                <div className="inq-progress-track">
                  <div
                    className="inq-progress-fill"
                    style={{ width: `${(Math.min(batch, BATCHES) / BATCHES) * 100}%` }}
                  />
                </div>
                <p className="inq-progress-hint">
                  {batch === 0 && "קורא תמלולים ומחלץ ישויות…"}
                  {batch === 1 && "מזהה נושאים חוזרים בין הפניות…"}
                  {batch === 2 && "מקבץ פניות דומות לאשכולות…"}
                  {batch >= 3 && "מנסח תיאור והמלצת טיפול לכל קבוצה…"}
                </p>
              </div>
            )}

            {groupState === "done" && (
              <div className="inq-group-result">
                <div className="ai-summary inq-ai-overview">
                  <div className="ai-head">
                    <i className="bi bi-stars" /> סיכום AI
                  </div>
                  <p>{INQUIRY_AI_OVERVIEW}</p>
                </div>

                <div className="inq-group-bulk">
                  <span>
                    פעולות על כל {INQUIRY_TOPICS.length} הקבוצות
                    {savedAt && (
                      <span className="inq-saved-tag">
                        <i className="bi bi-check-circle-fill" /> נשמר {savedAt}
                      </span>
                    )}
                  </span>
                  <div>
                    <button
                      className={`btn btn-sm ${savedAt ? "btn-soft" : "btn-primary"}`}
                      type="button"
                      onClick={saveGrouping}
                    >
                      <i className="bi bi-bookmark-check-fill" /> {savedAt ? "שמור שוב" : "שמור קיבוץ"}
                    </button>
                    <button
                      className="btn btn-soft btn-sm"
                      type="button"
                      onClick={() => setModal({ kind: "email", items: allGroupedInquiries, clearSel: false })}
                    >
                      <i className="bi bi-envelope-fill" /> שלח הכל
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      onClick={() => setModal({ kind: "drive", items: allGroupedInquiries, clearSel: false })}
                    >
                      <i className="bi bi-cloud-arrow-up-fill" /> העלה הכל לדרייב
                    </button>
                    <button className="btn btn-ghost btn-sm" type="button" onClick={regroup}>
                      <i className="bi bi-arrow-counterclockwise" /> קבץ מחדש
                    </button>
                  </div>
                </div>

                <div className="inq-topic-cards">
                  {INQUIRY_TOPICS.map((topic, ti) => {
                    const items = topic.inquiryIds.map((id) => byId.get(id)).filter(Boolean) as Inquiry[];
                    const unreadInTopic = items.filter((q) => !read[q.id]).length;
                    const isOpen = !!openTopics[topic.id];
                    return (
                      <div
                        className={`inq-topic${isOpen ? " open" : ""}`}
                        key={topic.id}
                        style={{ animationDelay: `${ti * 70}ms` }}
                      >
                        <button className="inq-topic-head" type="button" onClick={() => toggleTopic(topic.id)}>
                          <span
                            className="inq-topic-count"
                            style={{ background: TONE_SOFT[topic.tone], color: TONE_FG[topic.tone] }}
                          >
                            {items.length}
                          </span>
                          <span className="inq-topic-name">{topic.title}</span>
                          {unreadInTopic > 0 && <span className="inq-topic-dot" title={`${unreadInTopic} לא נקראו`} />}
                          <i className="bi bi-chevron-down inq-topic-caret" />
                        </button>
                        <div className="inq-topic-desc">{topic.description}</div>
                        <div className="inq-topic-body">
                          <div className="inq-topic-body-inner">
                            <div className="inq-topic-members">
                              {items.map((q) => (
                                <div
                                  className={`inq-topic-member${read[q.id] ? " is-read" : ""}${selected[q.id] ? " is-selected" : ""}`}
                                  key={q.id}
                                >
                                  <div className="inq-tm-head">
                                    <label className="inq-tm-check" title="בחר פנייה">
                                      <input
                                        type="checkbox"
                                        checked={!!selected[q.id]}
                                        onChange={() => toggleSelect(q.id)}
                                      />
                                    </label>
                                    <span className="inq-tm-name">
                                      {!read[q.id] && <span className="inq-unread-dot" />}
                                      {q.name}
                                    </span>
                                    <span className="inq-tm-phone">
                                      <i className="bi bi-telephone" /> {q.phone}
                                    </span>
                                    {q.urgent && !read[q.id] && (
                                      <span className="badge badge-red inq-tm-urgent">
                                        <i className="bi bi-exclamation-triangle-fill" /> דחוף
                                      </span>
                                    )}
                                    <span className="inq-tm-time">
                                      <i className="bi bi-clock" /> {q.time} · {q.duration}
                                    </span>
                                    <button
                                      className={`inq-act inq-tm-read${read[q.id] ? " done" : ""}`}
                                      type="button"
                                      disabled={read[q.id]}
                                      onClick={() => markRead(q.id)}
                                      title={read[q.id] ? "נקרא" : "סמן כנקרא"}
                                    >
                                      <i className="bi bi-check2-circle" />
                                    </button>
                                  </div>
                                  <p className="inq-tm-summary">{q.summary}</p>
                                  <button
                                    className="inq-card-transcript"
                                    type="button"
                                    onClick={() => setExpanded((e) => ({ ...e, [q.id]: !e[q.id] }))}
                                  >
                                    <i className={`bi ${expanded[q.id] ? "bi-chevron-up" : "bi-chevron-down"}`} />
                                    {expanded[q.id] ? "הסתר תמלול" : "הצג תמלול מלא"}
                                  </button>
                                  {expanded[q.id] && <p className="inq-card-transcript-text">{q.transcription}</p>}
                                </div>
                              ))}
                            </div>
                            <div className="inq-topic-foot">
                              <button
                                className="btn btn-primary btn-sm"
                                type="button"
                                onClick={() => setModal({ kind: "email", items, clearSel: false })}
                              >
                                <i className="bi bi-envelope-fill" /> שלח מכתב לקבוצה
                              </button>
                              <button
                                className="btn btn-soft btn-sm"
                                type="button"
                                onClick={() => setModal({ kind: "drive", items, clearSel: false })}
                              >
                                <i className="bi bi-cloud-arrow-up-fill" /> העלה לדרייב
                              </button>
                              <button
                                className="btn btn-ghost btn-sm"
                                type="button"
                                disabled={unreadInTopic === 0}
                                onClick={() => markTopicRead(topic.inquiryIds)}
                              >
                                <i className="bi bi-check2-all" /> סמן הכל כנקרא
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Selection bar ===== */}
      {selectedIds.length > 0 && (
        <div className="inq-selbar">
          <span className="inq-selbar-count">
            <i className="bi bi-check-circle-fill" /> {selectedIds.length} נבחרו
          </span>
          <div className="inq-selbar-actions">
            <button className="btn btn-ghost btn-sm" type="button" onClick={markSelectedRead}>
              <i className="bi bi-check2-circle" /> סמן כנקרא
            </button>
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              onClick={() => setModal({ kind: "drive", items: selectedIds.map((id) => byId.get(id)!), clearSel: true })}
            >
              <i className="bi bi-cloud-arrow-up-fill" /> העלה לדרייב
            </button>
            <button
              className="btn btn-soft btn-sm"
              type="button"
              onClick={() => setModal({ kind: "email", items: selectedIds.map((id) => byId.get(id)!), clearSel: true })}
            >
              <i className="bi bi-envelope-fill" /> שלח במייל
            </button>
            <button className="btn btn-ghost btn-sm" type="button" onClick={clearSelection}>
              <i className="bi bi-x-lg" /> נקה
            </button>
          </div>
        </div>
      )}

      {/* ===== Bulk-action modals ===== */}
      {modal?.kind === "drive" && (
        <DriveModal count={modal.items.length} onClose={() => setModal(null)} onConfirm={confirmModal} />
      )}
      {modal?.kind === "email" && (
        <EmailModal recipients={modal.items.filter(Boolean)} onClose={() => setModal(null)} onConfirm={confirmModal} />
      )}
    </div>
  );
}

/* ---------- Stat chip ---------- */
function Stat({ icon, tone, value, label }: { icon: string; tone: BadgeTone; value: string; label: string }) {
  return (
    <div className="inq-stat">
      <div className="inq-stat-ic" style={{ background: TONE_SOFT[tone], color: TONE_FG[tone] }}>
        <i className={`bi ${icon}`} />
      </div>
      <div>
        <div className="inq-stat-val">{value}</div>
        <div className="inq-stat-lbl">{label}</div>
      </div>
    </div>
  );
}

/* ---------- Single inquiry card ---------- */
interface CardProps {
  q: Inquiry;
  read: boolean;
  selected: boolean;
  expanded: boolean;
  playing: boolean;
  onSelect: () => void;
  onRead: () => void;
  onExpand: () => void;
  onPlay: () => void;
}

function InquiryCard({ q, read, selected, expanded, playing, onSelect, onRead, onExpand, onPlay }: CardProps) {
  const bars = useMemo(() => waveform(q.id), [q.id]);

  return (
    <div className={`inq-card${read ? " is-read" : ""}${selected ? " is-selected" : ""}${q.urgent && !read ? " is-urgent" : ""}`}>
      <label className="inq-card-check">
        <input type="checkbox" checked={selected} onChange={onSelect} />
      </label>

      <div className="inq-card-main">
        <div className="inq-card-top">
          <span className="inq-card-name">
            {!read && <span className="inq-unread-dot" />}
            {q.name}
          </span>
          <span className="inq-card-phone">
            <i className="bi bi-telephone" /> {q.phone}
          </span>
          <span className={`badge badge-${q.tone} inq-card-topic`}>{q.topic}</span>
          {q.urgent && (
            <span className="badge badge-red inq-card-urgent">
              <i className="bi bi-exclamation-triangle-fill" /> דחוף
            </span>
          )}
          <span className="inq-card-time">
            <i className="bi bi-clock" /> {q.time}
          </span>
        </div>

        <div className="inq-card-summary">
          <i className="bi bi-stars" />
          {q.summary}
        </div>

        {/* audio player */}
        <div className={`inq-player${playing ? " playing" : ""}`}>
          <button className="inq-play" type="button" onClick={onPlay} title={playing ? "השהה" : "השמע הקלטה"}>
            <i className={`bi ${playing ? "bi-pause-fill" : "bi-play-fill"}`} />
          </button>
          <div className="inq-wave">
            {bars.map((h, i) => (
              <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 40}ms` }} />
            ))}
          </div>
          <span className="inq-player-time">{q.duration}</span>
        </div>

        <button className="inq-card-transcript" type="button" onClick={onExpand}>
          <i className={`bi ${expanded ? "bi-chevron-up" : "bi-chevron-down"}`} />
          {expanded ? "הסתר תמלול" : "הצג תמלול מלא"}
        </button>
        {expanded && <p className="inq-card-transcript-text">{q.transcription}</p>}
      </div>

      <div className="inq-card-actions">
        <button
          className={`inq-act${read ? " done" : ""}`}
          type="button"
          disabled={read}
          onClick={onRead}
          title={read ? "נקרא" : "סמן כנקרא"}
        >
          <i className="bi bi-check2-circle" />
        </button>
        <button className="inq-act" type="button" title="שלח ב-Gmail">
          <i className="bi bi-envelope" />
        </button>
        <button className="inq-act" type="button" title="העלה לדרייב">
          <i className="bi bi-cloud-arrow-up" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Reusable modal shell ---------- */
interface ModalProps {
  title: string;
  icon: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
}

function Modal({ title, icon, onClose, children, footer }: ModalProps) {
  // Close on Esc, mirroring the dropdown/backdrop idiom used elsewhere.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="inq-modal-backdrop" onClick={onClose}>
      <div className="inq-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="inq-modal-head">
          <i className={`bi ${icon}`} />
          <h3>{title}</h3>
          <button className="inq-modal-x" type="button" onClick={onClose} title="סגור">
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="inq-modal-body">{children}</div>
        <div className="inq-modal-foot">{footer}</div>
      </div>
    </div>
  );
}

/* ---------- Drive upload modal ---------- */
type DriveTarget = "existing" | "new";

function DriveModal({ count, onClose, onConfirm }: { count: number; onClose: () => void; onConfirm: () => void }) {
  const [target, setTarget] = useState<DriveTarget>("existing");
  const [folderId, setFolderId] = useState(DRIVE_FOLDERS[0]?.id ?? "");
  const [newName, setNewName] = useState("");

  const canUpload = target === "existing" ? !!folderId : newName.trim().length > 0;

  return (
    <Modal title="העלאה לדרייב" icon="bi-cloud-arrow-up-fill" onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost btn-sm" type="button" onClick={onClose}>ביטול</button>
          <button className="btn btn-primary btn-sm" type="button" disabled={!canUpload} onClick={onConfirm}>
            <i className="bi bi-cloud-arrow-up-fill" /> העלה
          </button>
        </>
      }
    >
      <p className="inq-modal-lead">
        העלאת <strong>{count}</strong> {count === 1 ? "פנייה" : "פניות"} לתיקייה בדרייב.
      </p>

      <div className="inq-radio-group">
        <label className={`inq-radio${target === "existing" ? " checked" : ""}`}>
          <input type="radio" name="drive-target" checked={target === "existing"} onChange={() => setTarget("existing")} />
          <span className="inq-radio-label"><i className="bi bi-folder-fill" /> תיקייה קיימת</span>
        </label>
        <label className={`inq-radio${target === "new" ? " checked" : ""}`}>
          <input type="radio" name="drive-target" checked={target === "new"} onChange={() => setTarget("new")} />
          <span className="inq-radio-label"><i className="bi bi-folder-plus" /> תיקייה חדשה</span>
        </label>
      </div>

      {target === "existing" ? (
        <label className="inq-field">
          <span className="inq-field-label">בחר תיקייה</span>
          <select className="inq-input" value={folderId} onChange={(e) => setFolderId(e.target.value)}>
            {DRIVE_FOLDERS.map((f) => (
              <option key={f.id} value={f.id}>{f.name} · {f.itemCount} קבצים</option>
            ))}
          </select>
        </label>
      ) : (
        <label className="inq-field">
          <span className="inq-field-label">שם התיקייה החדשה</span>
          <input
            className="inq-input"
            type="text"
            value={newName}
            placeholder="לדוגמה: פניות יוני 2026"
            autoFocus
            onChange={(e) => setNewName(e.target.value)}
          />
        </label>
      )}
    </Modal>
  );
}

/* ---------- Email compose modal ---------- */
function EmailModal({ recipients, onClose, onConfirm }: { recipients: Inquiry[]; onClose: () => void; onConfirm: () => void }) {
  const count = recipients.length;
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(`סיכום ${count} ${count === 1 ? "פנייה" : "פניות"} — ידע פון`);
  const [body, setBody] = useState(
    recipients.map((q) => `• ${q.name} (${q.phone}): ${q.summary}`).join("\n"),
  );

  const canSend = /\S+@\S+\.\S+/.test(to) && subject.trim().length > 0;

  return (
    <Modal title="שליחה במייל" icon="bi-envelope-fill" onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost btn-sm" type="button" onClick={onClose}>ביטול</button>
          <button className="btn btn-primary btn-sm" type="button" disabled={!canSend} onClick={onConfirm}>
            <i className="bi bi-send-fill" /> שלח
          </button>
        </>
      }
    >
      <div className="inq-chip-row">
        {recipients.map((q) => (
          <span className="inq-chip" key={q.id}><i className="bi bi-telephone" /> {q.name}</span>
        ))}
      </div>

      <label className="inq-field">
        <span className="inq-field-label">אל</span>
        <input className="inq-input" type="email" value={to} placeholder="name@example.com" autoFocus
          onChange={(e) => setTo(e.target.value)} />
      </label>
      <label className="inq-field">
        <span className="inq-field-label">נושא</span>
        <input className="inq-input" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </label>
      <label className="inq-field">
        <span className="inq-field-label">תוכן</span>
        <textarea className="inq-input inq-textarea" rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
      </label>
    </Modal>
  );
}
