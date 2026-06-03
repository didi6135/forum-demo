/**
 * Static sample data for the UI mockup.
 * No real backend — these are realistic placeholders so the screens feel alive.
 */

export type ModuleKey =
  | "design"
  | "dashboard"
  | "inbox"
  | "daily"
  | "inquiries"
  | "customers"
  | "receipts"
  | "nedarim"
  | "tests";

export interface Email {
  id: string;
  fromName: string;
  fromAddr: string;
  subject: string;
  snippet: string;
  body: string[];
  aiSummary: string;
  time: string;
  unread: boolean;
  starred: boolean;
  labels: { text: string; tone: BadgeTone }[];
  attachments?: { name: string; size: string }[];
  avatarColor: string;
}

export type BadgeTone = "green" | "red" | "amber" | "blue" | "purple" | "teal" | "gray";

/** Deterministic gradient for an avatar based on a seed string. */
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#1a73e8,#5b8def)",
  "linear-gradient(135deg,#8430ce,#b15ee8)",
  "linear-gradient(135deg,#1e8e3e,#52c46f)",
  "linear-gradient(135deg,#d93025,#f0635a)",
  "linear-gradient(135deg,#f9ab00,#fcc934)",
  "linear-gradient(135deg,#129eaf,#3fc9d8)",
  "linear-gradient(135deg,#e8710a,#fa903e)",
  "linear-gradient(135deg,#9334e6,#c77dff)",
];

export function avatarGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[0][0] ?? "") + (parts[1][0] ?? "");
}

export const EMAILS: Email[] = [
  {
    id: "e1",
    fromName: "משה ברגר",
    fromAddr: "m.berger@gmail.com",
    subject: "תלונה על חברת סלולר — חיוב כפול",
    snippet: "שלום, חויבתי פעמיים על אותה חבילה ואני לא מצליח להגיע לנציג...",
    body: [
      "לכבוד הפורום להגנת הצרכן החרדי,",
      "ברצוני להגיש תלונה כנגד חברת הסלולר שלי. בחודש האחרון חויבתי פעמיים על אותה חבילת גלישה, סך הכל 178 ₪ במקום 89 ₪.",
      "פניתי לשירות הלקוחות שלוש פעמים ולא קיבלתי מענה. אשמח לעזרתכם בנושא.",
      "בברכה, משה ברגר",
    ],
    aiSummary:
      "תלונה על חיוב כפול (178₪ במקום 89₪) מחברת סלולר. הלקוח פנה 3 פעמים ללא מענה. דורש החזר וטיפול מול החברה.",
    time: "09:42",
    unread: true,
    starred: true,
    labels: [
      { text: "תלונה", tone: "red" },
      { text: "סלולר", tone: "blue" },
    ],
    attachments: [{ name: "חשבונית-מרץ.pdf", size: "248 KB" }],
    avatarColor: avatarGradient("משה ברגר"),
  },
  {
    id: "e2",
    fromName: "רבקה כהן",
    fromAddr: "rivka.cohen@walla.co.il",
    subject: "בקשת ייעוץ — ביטול עסקה ברוכלות",
    snippet: "קניתי שואב אבק מאיש מכירות שהגיע לבית, ואני רוצה לבטל בתוך 14 יום...",
    body: [
      "שלום רב,",
      "לפני 5 ימים רכשתי שואב אבק במכירה מדלת לדלת בסכום של 1,490 ₪. גיליתי שהמחיר בחנות נמוך בהרבה.",
      "האם אני זכאית לבטל את העסקה? מה התהליך?",
      "תודה, רבקה",
    ],
    aiSummary:
      "שאלת ייעוץ על זכות ביטול עסקת רוכלות (שואב אבק 1,490₪, לפני 5 ימים). זכאית לביטול תוך 14 יום לפי חוק. יש להנחות על התהליך.",
    time: "08:15",
    unread: true,
    starred: false,
    labels: [{ text: "ייעוץ", tone: "teal" }],
    avatarColor: avatarGradient("רבקה כהן"),
  },
  {
    id: "e3",
    fromName: "יוסף פרידמן",
    fromAddr: "yosef.f@gmail.com",
    subject: "תודה על הטיפול המסור!",
    snippet: "רציתי להודות לכם על הטיפול בתלונה שלי מול חברת הביטוח...",
    body: [
      "שלום לצוות הפורום,",
      "רציתי להודות מקרב לב על הטיפול המקצועי בתלונה שהגשתי מול חברת הביטוח. תוך שבועיים קיבלתי החזר מלא.",
      "ישר כוח על העבודה החשובה!",
    ],
    aiSummary: "מכתב תודה. הלקוח קיבל החזר מלא מחברת ביטוח תוך שבועיים בזכות טיפול הפורום. אין דרישה לפעולה.",
    time: "אתמול",
    unread: false,
    starred: false,
    labels: [{ text: "תודה", tone: "green" }],
    avatarColor: avatarGradient("יוסף פרידמן"),
  },
  {
    id: "e4",
    fromName: "חנה ויס",
    fromAddr: "h.weiss@gmail.com",
    subject: "שאלה לגבי אחריות על מוצר חשמלי",
    snippet: "המקרר שקניתי לפני 11 חודשים התקלקל, והחנות טוענת שאין אחריות...",
    body: [
      "שלום,",
      "רכשתי מקרר לפני 11 חודשים. השבוע הוא הפסיק לעבוד והחנות טוענת שהאחריות לא מכסה.",
      "מה זכויותיי? יש לי את הקבלה.",
    ],
    aiSummary:
      "סכסוך אחריות — מקרר התקלקל אחרי 11 חודשים, החנות מסרבת. בתוך תקופת אחריות יצרן. יש קבלה. דורש בירור מול היבואן.",
    time: "אתמול",
    unread: false,
    starred: true,
    labels: [
      { text: "אחריות", tone: "amber" },
      { text: "חשמל", tone: "purple" },
    ],
    attachments: [
      { name: "קבלה.pdf", size: "112 KB" },
      { name: "תעודת-אחריות.jpg", size: "1.2 MB" },
    ],
    avatarColor: avatarGradient("חנה ויס"),
  },
  {
    id: "e5",
    fromName: "אברהם שטרן",
    fromAddr: "a.stern@neto.net.il",
    subject: "פנייה בנושא הלוואה חוץ בנקאית",
    snippet: "קיבלתי הצעה להלוואה עם ריבית שנראית לי גבוהה מאוד, רציתי לבדוק...",
    body: [
      "שלום,",
      "קיבלתי הצעה להלוואה חוץ בנקאית בסך 20,000 ₪ עם ריבית שנתית של 28%. זה חוקי?",
      "אשמח להכוונה לפני שאני חותם.",
    ],
    aiSummary:
      "בקשת בדיקה על הלוואה חוץ בנקאית (20,000₪, ריבית 28%). יש לבדוק מול תקרת הריבית החוקית ולהזהיר מפני חתימה חפוזה.",
    time: "ב׳, 14:20",
    unread: false,
    starred: false,
    labels: [{ text: "פיננסי", tone: "blue" }],
    avatarColor: avatarGradient("אברהם שטרן"),
  },
];

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  text: string;
  topic: string;
  time: string;
  status: "חדש" | "טופל" | "בטיפול";
}

export const INQUIRIES: Inquiry[] = [
  { id: "i1", name: "דוד מלר", phone: "052-718-2240", text: "חברת הגז העלתה מחיר באמצע חוזה בלי הודעה", topic: "תשתיות", time: "10:12", status: "חדש" },
  { id: "i2", name: "שרה לוי", phone: "053-410-9981", text: "רכשתי כרטיסי טיסה והחברה ביטלה בלי החזר", topic: "תיירות", time: "09:50", status: "חדש" },
  { id: "i3", name: "מנחם רוט", phone: "050-662-7714", text: "מכון כושר ממשיך לחייב אחרי שביטלתי מנוי", topic: "מנויים", time: "09:31", status: "בטיפול" },
  { id: "i4", name: "אסתר גרין", phone: "054-228-3390", text: "קנתה רהיט שהגיע פגום, החנות לא מחליפה", topic: "מסחר", time: "08:58", status: "חדש" },
  { id: "i5", name: "יעקב בלום", phone: "052-991-4402", text: "חיוב על שירות סטרימינג שלא הזמין", topic: "מנויים", time: "08:40", status: "טופל" },
  { id: "i6", name: "מרים אדלר", phone: "058-303-1175", text: "אחריות על מכונת כביסה לא כובדה", topic: "מסחר", time: "08:22", status: "בטיפול" },
];

export interface TopicGroup {
  topic: string;
  tone: BadgeTone;
  count: number;
  items: string[];
}

export const TOPIC_GROUPS: TopicGroup[] = [
  {
    topic: "מנויים והרשאות לחיוב",
    tone: "purple",
    count: 8,
    items: [
      "מכון כושר ממשיך לחייב אחרי ביטול מנוי",
      "חיוב על שירות סטרימינג שלא הוזמן",
      "הוראת קבע שלא בוטלה לאחר בקשה",
    ],
  },
  {
    topic: "מסחר ואחריות מוצרים",
    tone: "amber",
    count: 6,
    items: ["רהיט שהגיע פגום ללא החלפה", "אחריות מכונת כביסה לא כובדה", "מוצר חשמלי שהתקלקל בתוך אחריות"],
  },
  {
    topic: "שירותי תשתית",
    tone: "teal",
    count: 4,
    items: ["העלאת מחיר גז באמצע חוזה", "חיוב מים שגוי"],
  },
];

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  cases: number;
  status: "פעיל" | "סגור" | "ממתין";
  lastContact: string;
  donor: boolean;
}

export const CUSTOMERS: Customer[] = [
  { id: "c1", name: "משה ברגר", phone: "052-718-2240", email: "m.berger@gmail.com", city: "בני ברק", cases: 3, status: "פעיל", lastContact: "היום", donor: true },
  { id: "c2", name: "רבקה כהן", phone: "053-410-9981", email: "rivka.cohen@walla.co.il", city: "ירושלים", cases: 1, status: "פעיל", lastContact: "היום", donor: false },
  { id: "c3", name: "יוסף פרידמן", phone: "050-662-7714", email: "yosef.f@gmail.com", city: "אשדוד", cases: 2, status: "סגור", lastContact: "אתמול", donor: true },
  { id: "c4", name: "חנה ויס", phone: "054-228-3390", email: "h.weiss@gmail.com", city: "מודיעין עילית", cases: 1, status: "ממתין", lastContact: "אתמול", donor: false },
  { id: "c5", name: "אברהם שטרן", phone: "052-991-4402", email: "a.stern@neto.net.il", city: "בית שמש", cases: 4, status: "פעיל", lastContact: "לפני יומיים", donor: true },
  { id: "c6", name: "מרים אדלר", phone: "058-303-1175", email: "m.adler@gmail.com", city: "ביתר עילית", cases: 1, status: "סגור", lastContact: "השבוע", donor: false },
  { id: "c7", name: "נחום גולד", phone: "050-114-8820", email: "n.gold@gmail.com", city: "בני ברק", cases: 2, status: "פעיל", lastContact: "השבוע", donor: true },
];

export interface Receipt {
  id: string;
  number: string;
  donor: string;
  amount: number;
  method: "אשראי" | "מזומן" | "העברה" | "נדרים פלוס";
  date: string;
  status: "הופקה" | "ממתינה" | "בוטלה";
}

export const RECEIPTS: Receipt[] = [
  { id: "r1", number: "2026-1847", donor: "משה ברגר", amount: 360, method: "נדרים פלוס", date: "03/06/2026", status: "הופקה" },
  { id: "r2", number: "2026-1846", donor: "נחום גולד", amount: 1000, method: "אשראי", date: "03/06/2026", status: "הופקה" },
  { id: "r3", number: "2026-1845", donor: "יוסף פרידמן", amount: 180, method: "נדרים פלוס", date: "02/06/2026", status: "הופקה" },
  { id: "r4", number: "2026-1844", donor: "אברהם שטרן", amount: 500, method: "העברה", date: "02/06/2026", status: "ממתינה" },
  { id: "r5", number: "2026-1843", donor: "תורם אנונימי", amount: 72, method: "נדרים פלוס", date: "01/06/2026", status: "הופקה" },
  { id: "r6", number: "2026-1842", donor: "משפחת רוט", amount: 2500, method: "אשראי", date: "01/06/2026", status: "הופקה" },
  { id: "r7", number: "2026-1841", donor: "דוד מלר", amount: 120, method: "מזומן", date: "31/05/2026", status: "בוטלה" },
];

export interface NedarimTxn {
  id: string;
  donor: string;
  amount: number;
  campaign: string;
  payments: string;
  date: string;
  status: "אושר" | "ממתין" | "נכשל";
}

export const NEDARIM_TXNS: NedarimTxn[] = [
  { id: "n1", donor: "משה ברגר", amount: 360, campaign: "מגבית שנתית", payments: "1 מתוך 1", date: "03/06 09:12", status: "אושר" },
  { id: "n2", donor: "נחום גולד", amount: 1000, campaign: "קרן חירום", payments: "1 מתוך 1", date: "03/06 08:40", status: "אושר" },
  { id: "n3", donor: "משפחת לנדאו", amount: 1800, campaign: "מגבית שנתית", payments: "3 מתוך 12", date: "02/06 21:05", status: "אושר" },
  { id: "n4", donor: "תורם אנונימי", amount: 72, campaign: "תרומה חד פעמית", payments: "1 מתוך 1", date: "01/06 18:33", status: "אושר" },
  { id: "n5", donor: "יחיאל שוורץ", amount: 250, campaign: "קרן חירום", payments: "—", date: "01/06 14:20", status: "ממתין" },
  { id: "n6", donor: "מנחם רוט", amount: 500, campaign: "מגבית שנתית", payments: "—", date: "31/05 11:10", status: "נכשל" },
];

export interface TestCase {
  id: string;
  name: string;
  desc: string;
  status: "pass" | "fail" | "running";
  duration: string;
}

export const TESTS: TestCase[] = [
  { id: "t1", name: "Gmail Gateway — messages.get", desc: "אחזור הודעה בודדת בפורמט metadata", status: "pass", duration: "412ms" },
  { id: "t2", name: "Inbox range query", desc: "טווח 24 שעות אחרונות, לא נקראו", status: "pass", duration: "1.2s" },
  { id: "t3", name: "Daily summary — incoming/outgoing", desc: "ספירת נכנס ויוצא ל-24 שעות", status: "pass", duration: "880ms" },
  { id: "t4", name: "Search batch (Apps Script primary)", desc: "חיפוש batched עם boundary", status: "running", duration: "—" },
  { id: "t5", name: "Nedarim Plus webhook", desc: "קליטת עסקה ועדכון קבלה", status: "pass", duration: "305ms" },
  { id: "t6", name: "WorkDrive file fetch", desc: "משיכת קובץ מצורף מ-WorkDrive", status: "fail", duration: "3.0s" },
  { id: "t7", name: "Bandwidth lock guard", desc: "בדיקת מנגנון נעילת רוחב פס", status: "pass", duration: "44ms" },
];

export const ACTIVITY = [
  { icon: "bi-envelope-paper", tone: "blue", title: "מייל חדש ממשה ברגר", sub: "תלונה על חיוב כפול", time: "09:42" },
  { icon: "bi-cash-coin", tone: "green", title: "תרומה התקבלה — 1,000 ₪", sub: "נחום גולד · קרן חירום", time: "08:40" },
  { icon: "bi-receipt", tone: "purple", title: "קבלה 2026-1847 הופקה", sub: "משה ברגר · 360 ₪", time: "08:38" },
  { icon: "bi-telephone-inbound", tone: "teal", title: "פנייה חדשה בידע פון", sub: "שרה לוי · ביטול טיסה", time: "09:50" },
  { icon: "bi-check2-circle", tone: "green", title: "תיק נסגר בהצלחה", sub: "יוסף פרידמן · החזר מלא", time: "אתמול" },
];

export const WEEK_BARS = [
  { label: "א׳", value: 62 },
  { label: "ב׳", value: 80 },
  { label: "ג׳", value: 54 },
  { label: "ד׳", value: 95 },
  { label: "ה׳", value: 70 },
  { label: "ו׳", value: 38 },
];
