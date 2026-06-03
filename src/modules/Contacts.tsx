import { useRef, useState } from "react";
import { Avatar } from "../components/Avatar";
import { type BadgeTone } from "../data/sampleData";

type Category = "משפטי" | "מקצועי" | "רשות";

interface Advisor {
  name: string;
  role: string;
  category: Category;
  specialty: string;
  org: string;
  phone: string;
  email: string;
  status: "זמין" | "עסוק" | "לא זמין";
  cases: number;
}

const ADVISORS: Advisor[] = [
  { name: "עו״ד יעקב רוזנברג", role: "עו״ד", category: "משפטי", specialty: "דיני צרכנות והגנת הצרכן", org: "רוזנברג ושות׳", phone: "03-618-2240", email: "yaakov@rozen-law.co.il", status: "זמין", cases: 42 },
  { name: "עו״ד מרים שטיין", role: "עו״ד", category: "משפטי", specialty: "חוזים וביטול עסקאות", org: "שטיין־לוין משרד עו״ד", phone: "02-501-9981", email: "miriam@stein-law.co.il", status: "זמין", cases: 28 },
  { name: "עו״ד נחום אדלר", role: "עו״ד", category: "משפטי", specialty: "תביעות קטנות וגישור", org: "עצמאי", phone: "08-622-7714", email: "n.adler@gmail.com", status: "עסוק", cases: 17 },
  { name: "רו״ח דוד לוי", role: "רו״ח", category: "מקצועי", specialty: "ביקורת חשבונות ומיסוי", org: "לוי ראייה חשבון", phone: "03-744-1180", email: "david@levi-cpa.co.il", status: "זמין", cases: 15 },
  { name: "אבי כהן", role: "יועץ", category: "מקצועי", specialty: "ייעוץ פיננסי — הלוואות וריבית", org: "כהן ייעוץ כלכלי", phone: "052-991-4402", email: "avi@cohen-finance.co.il", status: "זמין", cases: 19 },
  { name: "מהנדס שמואל ברנשטיין", role: "מהנדס", category: "מקצועי", specialty: "חוות דעת — מוצרי חשמל ואחריות", org: "עצמאי", phone: "054-228-3390", email: "shmuel.b@gmail.com", status: "לא זמין", cases: 9 },
  { name: "הרשות להגנת הצרכן", role: "רשות", category: "רשות", specialty: "אכיפה ותלונות רשמיות", org: "משרד הכלכלה", phone: "1-700-50-60-60", email: "consumer@economy.gov.il", status: "זמין", cases: 0 },
  { name: "המועצה לצרכנות", role: "ארגון", category: "רשות", specialty: "ייעוץ וליווי צרכנים", org: "המועצה הישראלית לצרכנות", phone: "1-599-50-10-10", email: "info@consumers.org.il", status: "זמין", cases: 0 },
];

const CATEGORIES: { key: Category | "הכל"; icon: string }[] = [
  { key: "הכל", icon: "bi-grid" },
  { key: "משפטי", icon: "bi-bank" },
  { key: "מקצועי", icon: "bi-briefcase" },
  { key: "רשות", icon: "bi-building" },
];

const CAT_TONE: Record<Category, BadgeTone> = { משפטי: "blue", מקצועי: "purple", רשות: "teal" };
const STATUS_TONE: Record<Advisor["status"], BadgeTone> = { זמין: "green", עסוק: "amber", "לא זמין": "gray" };

/* ---------- Referrals to advisors ---------- */

const REF_STATUSES = ["נשלח", "בטיפול", "התקבל מענה", "נסגר"] as const;
type RefStatus = (typeof REF_STATUSES)[number];
const REF_TONE: Record<RefStatus, BadgeTone> = {
  נשלח: "blue",
  בטיפול: "amber",
  "התקבל מענה": "teal",
  נסגר: "green",
};

interface Referral {
  id: string;
  subject: string;
  client: string;
  advisor: string;
  status: RefStatus;
  priority: "רגיל" | "דחוף";
  date: string;
}

const INITIAL_REFERRALS: Referral[] = [
  { id: "rf1", subject: "תלונה על חיוב כפול — חברת סלולר", client: "משה ברגר", advisor: "עו״ד יעקב רוזנברג", status: "בטיפול", priority: "דחוף", date: "03/06" },
  { id: "rf2", subject: "ביטול עסקת רוכלות — שואב אבק", client: "רבקה כהן", advisor: "עו״ד מרים שטיין", status: "נשלח", priority: "רגיל", date: "03/06" },
  { id: "rf3", subject: "אחריות יצרן — מקרר שהתקלקל", client: "חנה ויס", advisor: "מהנדס שמואל ברנשטיין", status: "התקבל מענה", priority: "רגיל", date: "02/06" },
  { id: "rf4", subject: "הלוואה חוץ בנקאית — ריבית 28%", client: "אברהם שטרן", advisor: "אבי כהן", status: "נסגר", priority: "רגיל", date: "01/06" },
];

export function Contacts() {
  const [view, setView] = useState<"directory" | "referrals">("directory");

  return (
    <div className="surface-card">
      <div className="page-head">
        <i className="bi bi-person-vcard" style={{ fontSize: 20, color: "var(--primary)" }} />
        <h1>אנשי קשר ויועצים</h1>
        <div className="seg" style={{ marginInlineStart: 16 }}>
          <button className={view === "directory" ? "active" : ""} type="button" onClick={() => setView("directory")}>
            יועצים
          </button>
          <button className={view === "referrals" ? "active" : ""} type="button" onClick={() => setView("referrals")}>
            פניות ליועצים
          </button>
        </div>
        <div className="page-head-spacer" />
      </div>

      {view === "directory" ? <Directory /> : <Referrals />}
    </div>
  );
}

/* ===================== Directory view ===================== */
function Directory() {
  const [cat, setCat] = useState<Category | "הכל">("הכל");
  const [q, setQ] = useState("");

  const visible = ADVISORS.filter((a) => {
    if (cat !== "הכל" && a.category !== cat) return false;
    if (q.trim() && !`${a.name} ${a.role} ${a.specialty} ${a.org}`.toLowerCase().includes(q.trim().toLowerCase()))
      return false;
    return true;
  });

  return (
    <>
      <div className="gm-actions">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`btn btn-sm ${cat === c.key ? "btn-ghost" : "btn-soft"}`}
            type="button"
            onClick={() => setCat(c.key)}
          >
            <i className={`bi ${c.icon}`} />
            {c.key}
          </button>
        ))}
        <div className="search-mini" style={{ marginInlineStart: "auto" }}>
          <i className="bi bi-search" />
          <input type="text" placeholder="חיפוש יועץ…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-sm" type="button">
          <i className="bi bi-plus-lg" />
          איש קשר חדש
        </button>
      </div>

      <div className="scroll-area">
        <div className="advisor-grid">
          {visible.map((a) => (
            <div className="advisor-card" key={a.email}>
              <div className="advisor-top">
                <Avatar name={a.name} size="md" />
                <div className="advisor-id">
                  <div className="advisor-name">{a.name}</div>
                  <div className="advisor-role">
                    <span className={`badge badge-${CAT_TONE[a.category]}`}>{a.role}</span>
                    <span className={`status-dot status-${STATUS_TONE[a.status]}`} />
                    <span className="advisor-status">{a.status}</span>
                  </div>
                </div>
              </div>
              <div className="advisor-specialty">{a.specialty}</div>
              <div className="advisor-org">
                <i className="bi bi-building" />
                {a.org}
              </div>
              <div className="advisor-contact">
                <a href={`tel:${a.phone}`} className="advisor-line">
                  <i className="bi bi-telephone" />
                  {a.phone}
                </a>
                <a href={`mailto:${a.email}`} className="advisor-line">
                  <i className="bi bi-envelope" />
                  {a.email}
                </a>
              </div>
              <div className="advisor-foot">
                {a.cases > 0 && <span className="advisor-cases">{a.cases} תיקים משותפים</span>}
                <div className="advisor-actions">
                  <button className="icon-btn icon-btn-sm" type="button" title="התקשרות">
                    <i className="bi bi-telephone-fill" />
                  </button>
                  <button className="icon-btn icon-btn-sm" type="button" title="מייל">
                    <i className="bi bi-envelope-fill" />
                  </button>
                  <button className="icon-btn icon-btn-sm" type="button" title="וואטסאפ">
                    <i className="bi bi-whatsapp" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ===================== Referrals view ===================== */
function Referrals() {
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);
  const [filter, setFilter] = useState<RefStatus | "הכל">("הכל");
  const [showForm, setShowForm] = useState(false);
  const seq = useRef(0);

  const [subject, setSubject] = useState("");
  const [client, setClient] = useState("");
  const [advisor, setAdvisor] = useState(ADVISORS[0].name);
  const [priority, setPriority] = useState<"רגיל" | "דחוף">("רגיל");

  const visible = filter === "הכל" ? referrals : referrals.filter((r) => r.status === filter);

  function setStatus(id: string, status: RefStatus) {
    setReferrals((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  }
  function resetForm() {
    setSubject("");
    setClient("");
    setAdvisor(ADVISORS[0].name);
    setPriority("רגיל");
    setShowForm(false);
  }
  function submit() {
    if (!subject.trim()) return;
    const ref: Referral = {
      id: `rf-new-${seq.current++}`,
      subject: subject.trim(),
      client: client.trim() || "—",
      advisor,
      status: "נשלח",
      priority,
      date: "היום",
    };
    setReferrals((rs) => [ref, ...rs]);
    resetForm();
  }

  return (
    <>
      <div className="gm-actions">
        <button className="btn btn-primary btn-sm" type="button" onClick={() => setShowForm((v) => !v)}>
          <i className="bi bi-plus-lg" />
          פנייה חדשה
        </button>
        <span className="ref-filter-sep" />
        {(["הכל", ...REF_STATUSES] as const).map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? "btn-ghost" : "btn-soft"}`}
            type="button"
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
        <span className="search-count" style={{ marginInlineStart: "auto" }}>
          {visible.length} פניות
        </span>
      </div>

      {showForm && (
        <div className="ref-form">
          <div className="ref-form-grid">
            <div className="ref-field" style={{ gridColumn: "1 / -1" }}>
              <label>נושא הפנייה</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="תיאור התיק / הסוגיה…" />
            </div>
            <div className="ref-field">
              <label>שם הפונה</label>
              <input type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder="שם הלקוח" />
            </div>
            <div className="ref-field">
              <label>שיוך ליועץ</label>
              <select value={advisor} onChange={(e) => setAdvisor(e.target.value)}>
                {ADVISORS.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name} · {a.specialty}
                  </option>
                ))}
              </select>
            </div>
            <div className="ref-field">
              <label>דחיפות</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as "רגיל" | "דחוף")}>
                <option value="רגיל">רגיל</option>
                <option value="דחוף">דחוף</option>
              </select>
            </div>
          </div>
          <div className="ref-form-actions">
            <button className="btn btn-primary btn-sm" type="button" onClick={submit}>
              <i className="bi bi-send" />
              שליחה ליועץ
            </button>
            <button className="btn btn-soft btn-sm" type="button" onClick={resetForm}>
              ביטול
            </button>
          </div>
        </div>
      )}

      <div className="scroll-area">
        {visible.length === 0 && <div className="gm-empty">אין פניות בסטטוס זה.</div>}
        {visible.map((r) => (
          <div className="ref-row" key={r.id}>
            <div className="ref-main">
              <div className="ref-subject">{r.subject}</div>
              <div className="ref-client">
                <i className="bi bi-person" />
                {r.client}
              </div>
            </div>
            {r.priority === "דחוף" && <span className="badge badge-red">דחוף</span>}
            <div className="ref-advisor">
              <Avatar name={r.advisor} size="sm" />
              <span>{r.advisor}</span>
            </div>
            <select
              className={`status-select tone-${REF_TONE[r.status]}`}
              value={r.status}
              onChange={(e) => setStatus(r.id, e.target.value as RefStatus)}
              title="עדכון סטטוס"
            >
              {REF_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="ref-date">{r.date}</span>
          </div>
        ))}
      </div>
    </>
  );
}
