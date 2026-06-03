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
  | "whatsapp"
  | "customers"
  | "contacts"
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
  /** Caller display name. */
  name: string;
  phone: string;
  /** Short category label shown as a badge on the card. */
  topic: string;
  tone: BadgeTone;
  /** Time-of-day the call came in (today's feed). */
  time: string;
  /** Recording length, mm:ss. */
  duration: string;
  /** One-line AI summary of the call. */
  summary: string;
  /** Full call transcription (collapsed by default). */
  transcription: string;
  status: "חדש" | "בטיפול" | "טופל";
  /** Flagged by triage as time-sensitive. */
  urgent?: boolean;
  read: boolean;
}

/**
 * Today's Yeda-Phone feed. Every call is transcribed, summarised by AI,
 * and later clustered into topics (see INQUIRY_TOPICS).
 */
export const INQUIRIES: Inquiry[] = [
  {
    id: "i1",
    name: "דוד מלר",
    phone: "052-718-2240",
    topic: "תשתיות",
    tone: "blue",
    time: "10:12",
    duration: "2:18",
    summary: "חברת הגז העלתה תעריף ב-14% באמצע חוזה דו-שנתי, ללא הודעה מוקדמת.",
    transcription:
      "שלום, אני מתקשר כי קיבלתי חשבון גז עם מחיר הרבה יותר גבוה מהרגיל. חתמתי על חוזה לשנתיים במחיר קבוע, ופתאום העלו לי את התעריף ב-14% בלי שום הודעה. כשהתקשרתי אליהם אמרו שזה 'עדכון מחירון' ושאין מה לעשות. זה נשמע לי לא חוקי, רציתי לבדוק מה הזכויות שלי.",
    status: "חדש",
    urgent: true,
    read: false,
  },
  {
    id: "i2",
    name: "שרה לוי",
    phone: "053-410-9981",
    topic: "תיירות",
    tone: "teal",
    time: "09:50",
    duration: "3:04",
    summary: "טיסה בוטלה ע״י חברת התעופה 48 שעות לפני המראה, ללא החזר או חלופה.",
    transcription:
      "קניתי שני כרטיסי טיסה לחו״ל דרך אתר של חברת תעופה, ויומיים לפני הטיסה קיבלתי מייל שהטיסה בוטלה. לא הציעו לי טיסה חלופית ולא החזר כספי, רק שובר זיכוי שתקף לחצי שנה. שילמתי כמעט 4,000 שקל. אני רוצה לדעת אם מותר להם לעשות את זה ואיך מקבלים את הכסף בחזרה.",
    status: "חדש",
    urgent: true,
    read: false,
  },
  {
    id: "i3",
    name: "מנחם רוט",
    phone: "050-662-7714",
    topic: "מנויים",
    tone: "purple",
    time: "09:31",
    duration: "1:47",
    summary: "מכון כושר ממשיך לחייב בהוראת קבע חודשיים אחרי ביטול מנוי בכתב.",
    transcription:
      "ביטלתי מנוי למכון כושר לפני חודשיים, שלחתי הודעת ביטול במייל וקיבלתי אישור. למרות זה הם ממשיכים לחייב אותי בהוראת קבע 189 שקל בחודש. התקשרתי פעמיים ואמרו שיטפלו, אבל החיוב ממשיך. אני רוצה החזר על שני החודשים ושיפסיקו לחייב.",
    status: "בטיפול",
    read: false,
  },
  {
    id: "i4",
    name: "אסתר גרין",
    phone: "054-228-3390",
    topic: "מסחר",
    tone: "amber",
    time: "08:58",
    duration: "2:35",
    summary: "ספה הגיעה פגומה (קרע בריפוד); החנות מסרבת להחליף ומציעה רק תיקון.",
    transcription:
      "הזמנתי ספה חדשה והיא הגיעה עם קרע בריפוד ורגל שבורה. צילמתי הכל ושלחתי לחנות. הם אומרים שזה 'נזק קוסמטי' ושהם רק יתקנו, אבל אני שילמתי על מוצר חדש ואני רוצה החלפה מלאה. עברו כבר שבועיים והם מתחמקים. מה אני יכולה לעשות?",
    status: "חדש",
    read: false,
  },
  {
    id: "i5",
    name: "יעקב בלום",
    phone: "052-991-4402",
    topic: "מנויים",
    tone: "purple",
    time: "08:40",
    duration: "1:12",
    summary: "חיוב חודשי על שירות סטרימינג שלא הוזמן; ככל הנראה חידוש אוטומטי מניסיון.",
    transcription:
      "גיליתי בכרטיס אשראי חיוב של 39.90 על שירות סטרימינג שאני בכלל לא משתמש בו. כנראה נרשמתי לתקופת ניסיון לפני שנה ושכחתי לבטל. רציתי לדעת אם מגיע לי החזר רטרואקטיבי על החודשים שלא השתמשתי.",
    status: "טופל",
    read: true,
  },
  {
    id: "i6",
    name: "מרים אדלר",
    phone: "058-303-1175",
    topic: "מסחר",
    tone: "amber",
    time: "08:22",
    duration: "2:51",
    summary: "מכונת כביסה התקלקלה בתוך תקופת אחריות; היבואן טוען לשימוש לא נכון.",
    transcription:
      "מכונת הכביסה שקניתי לפני 8 חודשים הפסיקה לעבוד. קראתי לטכנאי מטעם היבואן והוא אמר שזו תקלה שלא מכוסה באחריות כי השתמשנו לא נכון, מה שלא נכון בכלל. יש לי את הקבלה ותעודת האחריות. אני רוצה שיתקנו על חשבונם או יחליפו.",
    status: "בטיפול",
    read: false,
  },
  {
    id: "i7",
    name: "נפתלי הורן",
    phone: "050-447-1203",
    topic: "מנויים",
    tone: "purple",
    time: "08:05",
    duration: "1:33",
    summary: "הוראת קבע לעמותה לא בוטלה חודשיים אחרי בקשה טלפונית.",
    transcription:
      "ביקשתי לבטל תרומה חודשית בהוראת קבע, התקשרתי ואמרו שבוטל. אבל החיוב ממשיך כבר חודשיים. רציתי לדעת איך מבטלים סופית ואם מגיע החזר.",
    status: "חדש",
    read: false,
  },
  {
    id: "i8",
    name: "חיים פוקס",
    phone: "053-882-6610",
    topic: "תיירות",
    tone: "teal",
    time: "07:58",
    duration: "2:09",
    summary: "מלון חייב יותר מהמחיר שאושר בהזמנה; פער של 320 ₪ ללילה.",
    transcription:
      "הזמנתי מלון דרך אתר, המחיר שאושר היה 480 שקל ללילה. כשהגעתי לקבלה חייבו אותי 800 שקל ללילה וטענו ש'המחיר באתר היה שגוי'. שילמתי כי לא הייתה ברירה, אבל אני רוצה את ההפרש בחזרה. יש לי צילום מסך של ההזמנה.",
    status: "חדש",
    read: false,
  },
  {
    id: "i9",
    name: "רחל שיין",
    phone: "054-770-3398",
    topic: "מסחר",
    tone: "amber",
    time: "07:44",
    duration: "1:58",
    summary: "מקרר חדש התקלקל אחרי 11 חודשים; החנות מפנה ליבואן והיבואן לחנות.",
    transcription:
      "קניתי מקרר לפני 11 חודשים והוא הפסיק לקרר. החנות שולחת אותי ליבואן והיבואן שולח אותי לחנות, אף אחד לא לוקח אחריות. זה עדיין בתוך שנת אחריות. אני צריכה מקרר דחוף, יש לי ילדים בבית.",
    status: "חדש",
    urgent: true,
    read: false,
  },
  {
    id: "i10",
    name: "אברהם שטרן",
    phone: "052-991-4402",
    topic: "פיננסי",
    tone: "red",
    time: "07:30",
    duration: "3:22",
    summary: "הצעת הלוואה חוץ-בנקאית בריבית 28% שנתית; חשד לתנאים מנצלים.",
    transcription:
      "קיבלתי הצעה להלוואה חוץ בנקאית של 20,000 שקל עם ריבית שנתית של 28 אחוז. הם לוחצים שאחתום היום. זה נשמע לי גבוה מאוד, רציתי לבדוק אם זה בכלל חוקי לפני שאני נכנס לזה.",
    status: "חדש",
    urgent: true,
    read: false,
  },
  {
    id: "i11",
    name: "טובה גולדברג",
    phone: "058-114-7752",
    topic: "תשתיות",
    tone: "blue",
    time: "07:12",
    duration: "1:41",
    summary: "חיוב מים כפול מהממוצע ללא שינוי בצריכה; חשד לתקלת מד.",
    transcription:
      "קיבלתי חשבון מים כפול ממה שאני רגילה לשלם, בלי שום שינוי בשימוש. אני גרה לבד וזה לא הגיוני. ביקשתי בדיקת מד מים והם אומרים שזה יעלה לי. רציתי לדעת מי אמור לשלם על הבדיקה.",
    status: "בטיפול",
    read: true,
  },
  {
    id: "i12",
    name: "שמואל לנדאו",
    phone: "050-339-8821",
    topic: "תיירות",
    tone: "teal",
    time: "06:55",
    duration: "2:27",
    summary: "חבילת נופש בוטלה ע״י הסוכנות; מציעים זיכוי בלבד במקום החזר.",
    transcription:
      "הזמנתי חבילת נופש משפחתית והסוכנות ביטלה שבוע לפני הנסיעה. הם מציעים לי שובר זיכוי לשנה הבאה אבל אני רוצה את הכסף בחזרה, 6,200 שקל. כבר שילמתי הכל מראש. אמרו שזה 'מדיניות החברה'.",
    status: "חדש",
    read: false,
  },
];

/** AI-generated cluster of related inquiries. */
export interface InquiryTopic {
  id: string;
  title: string;
  tone: BadgeTone;
  /** AI description of the common thread + recommended handling. */
  description: string;
  /** Member inquiry ids, in feed order. */
  inquiryIds: string[];
}

/** One-paragraph AI overview shown above the topic cards. */
export const INQUIRY_AI_OVERVIEW =
  "מתוך 12 הפניות שהתקבלו היום, הבולטות עוסקות בחיובים נמשכים אחרי ביטול מנוי ובהפרת חוזים מול ספקי שירות. ארבע פניות סווגו כדחופות — בהן חיוב כפול וביטולי טיסה — ומומלץ לטפל בהן ראשונות.";

export const INQUIRY_TOPICS: InquiryTopic[] = [
  {
    id: "t1",
    title: "מנויים והרשאות לחיוב",
    tone: "purple",
    description:
      "חיובים בהוראת קבע שממשיכים אחרי בקשת ביטול, או מנויים שלא הוזמנו. הקו המשותף: ביטול שלא יושם בפועל. מומלץ לאגד למכתב דרישה אחיד מול חברות הסליקה.",
    inquiryIds: ["i3", "i5", "i7"],
  },
  {
    id: "t2",
    title: "מסחר ואחריות מוצרים",
    tone: "amber",
    description:
      "מוצרים פגומים או תקלות בתוך תקופת אחריות, כשהמוכר/היבואן מתחמק. יש לוודא תיעוד (קבלה, תעודת אחריות, תמונות) ולפנות ליבואן בדרישה בכתב.",
    inquiryIds: ["i4", "i6", "i9"],
  },
  {
    id: "t3",
    title: "תיירות וביטולי טיסה",
    tone: "teal",
    description:
      "ביטולים חד-צדדיים וחיובי-יתר מול חברות תעופה וסוכנויות, כשמוצע זיכוי במקום החזר כספי. לפי חוק שירותי תעופה זכאי הצרכן להחזר — מומלץ לרכז דרישה מול הרשות.",
    inquiryIds: ["i2", "i8", "i12"],
  },
  {
    id: "t4",
    title: "תשתיות ושירותים חיוניים",
    tone: "blue",
    description:
      "העלאות תעריף באמצע חוזה וחיובים שגויים מול ספקי גז ומים. יש לבדוק מול תנאי ההתקשרות והרגולציה הענפית.",
    inquiryIds: ["i1", "i11"],
  },
  {
    id: "t5",
    title: "פיננסי והלוואות",
    tone: "red",
    description:
      "הצעות אשראי חוץ-בנקאי בריבית גבוהה עם לחץ לחתימה מיידית. יש להזהיר מפני חתימה חפוזה ולבדוק מול תקרת הריבית החוקית.",
    inquiryIds: ["i10"],
  },
];

export interface DriveFolder {
  id: string;
  name: string;
  /** Item count shown as a hint in the picker. */
  itemCount: number;
}

/** Existing Drive folders offered in the "upload to Drive" picker. */
export const DRIVE_FOLDERS: DriveFolder[] = [
  { id: "f1", name: "פניות 2026", itemCount: 142 },
  { id: "f2", name: "מכתבי דרישה", itemCount: 38 },
  { id: "f3", name: "תיירות וביטולי טיסה", itemCount: 17 },
  { id: "f4", name: "מנויים והרשאות לחיוב", itemCount: 24 },
  { id: "f5", name: "ארכיון", itemCount: 506 },
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
  { id: "n7", donor: "משה ברגר", amount: 180, campaign: "בניין בית המדרש", payments: "1 מתוך 1", date: "30/05 20:14", status: "אושר" },
  { id: "n8", donor: "אברהם שטרן", amount: 500, campaign: "קרן חירום", payments: "1 מתוך 1", date: "30/05 13:02", status: "אושר" },
  { id: "n9", donor: "נחום גולד", amount: 720, campaign: "בניין בית המדרש", payments: "2 מתוך 6", date: "29/05 19:47", status: "אושר" },
  { id: "n10", donor: "יוסף פרידמן", amount: 360, campaign: "תרומה חד פעמית", payments: "1 מתוך 1", date: "29/05 10:25", status: "אושר" },
  { id: "n11", donor: "משה ברגר", amount: 100, campaign: "קרן חירום", payments: "1 מתוך 1", date: "28/05 22:08", status: "אושר" },
  { id: "n12", donor: "משפחת רוט", amount: 2500, campaign: "מגבית שנתית", payments: "1 מתוך 1", date: "28/05 16:30", status: "אושר" },
  { id: "n13", donor: "אברהם שטרן", amount: 250, campaign: "בניין בית המדרש", payments: "—", date: "27/05 09:15", status: "ממתין" },
  { id: "n14", donor: "מרים אדלר", amount: 120, campaign: "תרומה חד פעמית", payments: "1 מתוך 1", date: "27/05 08:50", status: "אושר" },
];

/** Donation categories (campaigns) with a stable badge tone for each. */
export interface NedarimCategory {
  name: string;
  tone: BadgeTone;
  icon: string;
}

export const NEDARIM_CATEGORIES: NedarimCategory[] = [
  { name: "מגבית שנתית", tone: "blue", icon: "bi-calendar-heart-fill" },
  { name: "קרן חירום", tone: "red", icon: "bi-life-preserver" },
  { name: "תרומה חד פעמית", tone: "teal", icon: "bi-gift-fill" },
  { name: "בניין בית המדרש", tone: "amber", icon: "bi-bank2" },
];

/** Resolve a campaign name to its category metadata (falls back to a neutral tone). */
export function nedarimCategory(campaign: string): NedarimCategory {
  return NEDARIM_CATEGORIES.find((c) => c.name === campaign) ?? { name: campaign, tone: "purple", icon: "bi-cash-coin" };
}

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

/* ---- Dashboard ("command center") ---- */

export interface KpiCard {
  key: string;
  icon: string;
  tone: BadgeTone;
  value: string;
  label: string;
  delta: string;
  deltaUp: boolean;
  /** Mini sparkline series, normalised on render. */
  spark: number[];
}

export const KPIS: KpiCard[] = [
  {
    key: "unread",
    icon: "bi-inbox-fill",
    tone: "blue",
    value: "12",
    label: "מיילים לא נקראו",
    delta: "3 חדשים היום",
    deltaUp: true,
    spark: [4, 6, 5, 8, 7, 9, 11, 12],
  },
  {
    key: "inquiries",
    icon: "bi-telephone-fill",
    tone: "teal",
    value: "47",
    label: "פניות פתוחות",
    delta: "8% מהשבוע שעבר",
    deltaUp: true,
    spark: [30, 34, 32, 38, 41, 39, 44, 47],
  },
  {
    key: "donations",
    icon: "bi-cash-coin",
    tone: "green",
    value: "₪18,420",
    label: "תרומות החודש",
    delta: "12% עלייה",
    deltaUp: true,
    spark: [8, 9, 11, 10, 13, 15, 16, 18],
  },
  {
    key: "receipts",
    icon: "bi-receipt",
    tone: "purple",
    value: "184",
    label: "קבלות שהופקו",
    delta: "2 ממתינות",
    deltaUp: false,
    spark: [120, 132, 140, 151, 160, 168, 176, 184],
  },
];

export interface TrendPoint {
  day: string;
  incoming: number;
  resolved: number;
}

/** 7-day inflow vs. resolved — drives the main area chart. */
export const TREND: TrendPoint[] = [
  { day: "א׳", incoming: 42, resolved: 35 },
  { day: "ב׳", incoming: 58, resolved: 49 },
  { day: "ג׳", incoming: 47, resolved: 44 },
  { day: "ד׳", incoming: 71, resolved: 60 },
  { day: "ה׳", incoming: 63, resolved: 58 },
  { day: "ו׳", incoming: 29, resolved: 27 },
  { day: "ש׳", incoming: 11, resolved: 10 },
];

export interface TopDonor {
  name: string;
  amount: number;
  campaign: string;
}

export const TOP_DONORS: TopDonor[] = [
  { name: "משפחת רוט", amount: 2500, campaign: "מגבית שנתית" },
  { name: "משפחת לנדאו", amount: 1800, campaign: "מגבית שנתית" },
  { name: "נחום גולד", amount: 1000, campaign: "קרן חירום" },
  { name: "אברהם שטרן", amount: 500, campaign: "העברה" },
  { name: "משה ברגר", amount: 360, campaign: "נדרים פלוס" },
];

export interface AttentionItem {
  icon: string;
  tone: BadgeTone;
  title: string;
  sub: string;
  tag: string;
}

/** "Needs attention today" — the dashboard's action queue. */
export const ATTENTION: AttentionItem[] = [
  { icon: "bi-exclamation-triangle-fill", tone: "red", title: "תלונה דחופה — חיוב כפול", sub: "משה ברגר · ממתין 3 ימים", tag: "דחוף" },
  { icon: "bi-hourglass-split", tone: "amber", title: "קבלה ממתינה להפקה", sub: "אברהם שטרן · ₪500", tag: "ממתין" },
  { icon: "bi-telephone-inbound", tone: "teal", title: "פנייה לא משויכת", sub: "שרה לוי · ביטול טיסה", tag: "חדש" },
  { icon: "bi-x-circle-fill", tone: "red", title: "עסקת נדרים נכשלה", sub: "מנחם רוט · ₪500", tag: "נכשל" },
];

/* ============================================================
 * Customer relationships
 * ------------------------------------------------------------
 * The demo data is keyed by display name / email / phone rather than
 * a foreign key, so we resolve a customer's related records by matching
 * those fields. Names are the most reliable join key here; phone numbers
 * are reused across some sample calls, so we avoid joining on phone alone.
 * ============================================================ */

/** Emails sent by this customer — matched by sender address, falling back to name. */
export function customerEmails(customer: Customer): Email[] {
  return EMAILS.filter((email) => email.fromAddr === customer.email || email.fromName === customer.name);
}

/** Yeda-Phone calls from this customer — matched by caller name. */
export function customerInquiries(customer: Customer): Inquiry[] {
  return INQUIRIES.filter((inquiry) => inquiry.name === customer.name);
}

/** Nedarim Plus transactions credited to this customer. */
export function customerDonations(customer: Customer): NedarimTxn[] {
  return NEDARIM_TXNS.filter((txn) => txn.donor === customer.name);
}

/** Receipts issued to this customer. */
export function customerReceipts(customer: Customer): Receipt[] {
  return RECEIPTS.filter((receipt) => receipt.donor === customer.name);
}

export interface CustomerStats {
  emails: number;
  inquiries: number;
  urgentInquiries: number;
  donations: number;
  /** Sum of approved Nedarim Plus transactions, in shekels. */
  donatedTotal: number;
  receipts: number;
}

/** Aggregate counts across every record linked to a customer. */
export function customerStats(customer: Customer): CustomerStats {
  const inquiries = customerInquiries(customer);
  const donations = customerDonations(customer);
  return {
    emails: customerEmails(customer).length,
    inquiries: inquiries.length,
    urgentInquiries: inquiries.filter((q) => q.urgent).length,
    donations: donations.length,
    donatedTotal: donations.filter((d) => d.status === "אושר").reduce((sum, d) => sum + d.amount, 0),
    receipts: customerReceipts(customer).length,
  };
}

/* ============================================================
 * WhatsApp conversations (UI demo data)
 * ============================================================ */

export interface WhatsappMessage {
  id: string;
  /** "in" = from the customer, "out" = from the representative. */
  direction: "in" | "out";
  text: string;
  /** Time-of-day, HH:mm. */
  time: string;
  /** Delivery state — outgoing messages only. */
  status?: "sent" | "delivered" | "read";
}

export interface WhatsappConversation {
  id: string;
  name: string;
  phone: string;
  messages: WhatsappMessage[];
  /** Unread incoming messages. */
  unread: number;
  /** Label for the last-activity time shown in the list. */
  lastTime: string;
  /** Whether the 24h free-text service window is still open. */
  windowOpen: boolean;
}

export const WHATSAPP_CONVERSATIONS: WhatsappConversation[] = [
  {
    id: "w1",
    name: "משה ברגר",
    phone: "052-718-2240",
    unread: 2,
    lastTime: "09:48",
    windowOpen: true,
    messages: [
      { id: "w1m1", direction: "in", text: "שלום, חויבתי פעמיים על אותה חבילת סלולר בחודש האחרון 😟", time: "09:40" },
      { id: "w1m2", direction: "in", text: "סך הכל 178 ₪ במקום 89 ₪. צירפתי את החשבונית", time: "09:41" },
      { id: "w1m3", direction: "out", text: "שלום משה, תודה שפנית לפורום. קיבלנו את החשבונית ונבדוק מול החברה.", time: "09:44", status: "read" },
      { id: "w1m4", direction: "out", text: "תוכל לאשר שניתן לפעול בשמך מול חברת הסלולר?", time: "09:44", status: "read" },
      { id: "w1m5", direction: "in", text: "כן בהחלט, תודה רבה על העזרה", time: "09:47" },
      { id: "w1m6", direction: "in", text: "מתי לדעתכם יהיה עדכון?", time: "09:48" },
    ],
  },
  {
    id: "w2",
    name: "רבקה כהן",
    phone: "053-410-9981",
    unread: 0,
    lastTime: "08:30",
    windowOpen: true,
    messages: [
      { id: "w2m1", direction: "in", text: "קניתי שואב אבק מאיש מכירות שהגיע לבית, אפשר לבטל?", time: "08:12" },
      { id: "w2m2", direction: "out", text: "שלום רבקה, בעסקת רוכלות יש זכות ביטול תוך 14 יום מהרכישה. מתי בוצעה העסקה?", time: "08:20", status: "read" },
      { id: "w2m3", direction: "in", text: "לפני 5 ימים", time: "08:27" },
      { id: "w2m4", direction: "out", text: "מצוין, את עדיין בתוך התקופה. נשלח לך נוסח מכתב ביטול להעביר למוכר.", time: "08:30", status: "delivered" },
    ],
  },
  {
    id: "w3",
    name: "מרים אדלר",
    phone: "058-303-1175",
    unread: 1,
    lastTime: "אתמול",
    windowOpen: true,
    messages: [
      { id: "w3m1", direction: "in", text: "מכונת הכביסה התקלקלה בתוך אחריות והיבואן מסרב לתקן", time: "אתמול" },
      { id: "w3m2", direction: "out", text: "יש לך את הקבלה ותעודת האחריות? נצטרך אותן לפנייה.", time: "אתמול", status: "read" },
      { id: "w3m3", direction: "in", text: "כן, אצרף עכשיו 📎", time: "אתמול" },
    ],
  },
  {
    id: "w4",
    name: "אברהם שטרן",
    phone: "052-991-4402",
    unread: 0,
    lastTime: "יום ב׳",
    windowOpen: false,
    messages: [
      { id: "w4m1", direction: "in", text: "קיבלתי הצעה להלוואה חוץ בנקאית בריבית 28%, זה חוקי?", time: "יום ב׳ 14:20" },
      { id: "w4m2", direction: "out", text: "שלום אברהם, ריבית כזו חשודה כמנצלת. אל תחתום לפני שנבדוק מול תקרת הריבית החוקית.", time: "יום ב׳ 14:35", status: "read" },
      { id: "w4m3", direction: "out", text: "שלחנו לך סיכום בדיקה במייל. נשמח לדעת אם התקדמת.", time: "יום ב׳ 14:36", status: "read" },
    ],
  },
  {
    id: "w5",
    name: "חנה ויס",
    phone: "054-228-3390",
    unread: 0,
    lastTime: "יום א׳",
    windowOpen: false,
    messages: [
      { id: "w5m1", direction: "in", text: "המקרר התקלקל אחרי 11 חודשים והחנות טוענת שאין אחריות", time: "יום א׳ 11:02" },
      { id: "w5m2", direction: "out", text: "בתוך שנת אחריות יצרן זו אחריות החנות/היבואן. יש לך קבלה?", time: "יום א׳ 11:20", status: "read" },
      { id: "w5m3", direction: "in", text: "כן יש לי", time: "יום א׳ 11:25" },
      { id: "w5m4", direction: "out", text: "מעולה, פתחנו עבורך פנייה מול היבואן ונעדכן בהמשך.", time: "יום א׳ 11:40", status: "read" },
    ],
  },
];
