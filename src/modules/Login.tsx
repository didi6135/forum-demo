import { useState } from "react";

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onLogin();
  }

  return (
    <div className="login-wrap">
      {/* Brand / marketing panel */}
      <aside className="login-brand">
        <div className="login-brand-top">
          <div className="login-brand-logo">
            <i className="bi bi-shield-fill-check" />
          </div>
          <div className="login-brand-name">
            הפורום להגנת הצרכן החרדי
            <small>מערכת ניהול מרכזית</small>
          </div>
        </div>

        <div className="login-brand-mid">
          <h2>
            כל הפעילות שלכם
            <br />
            במקום אחד.
          </h2>
          <p>
            ניהול פניות, דואר נכנס עם סיכומי AI, מעקב לקוחות, קבלות ותרומות נדרים פלוס — הכל במערכת אחת
            מסודרת ומאובטחת.
          </p>
          <div className="login-features">
            <div className="login-feature">
              <i className="bi bi-envelope-paper" />
              דואר חכם עם סיכום אוטומטי לכל פנייה
            </div>
            <div className="login-feature">
              <i className="bi bi-people" />
              ניהול לקוחות ותיקים מקצה לקצה
            </div>
            <div className="login-feature">
              <i className="bi bi-cash-coin" />
              תרומות וקבלות בחיבור ישיר לנדרים פלוס
            </div>
          </div>
        </div>

        <div className="login-brand-foot">© 2026 הפורום להגנת הצרכן החרדי · כל הזכויות שמורות</div>
      </aside>

      {/* Form panel */}
      <main className="login-form-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <span className="demo-pill">
            <i className="bi bi-stars" />
            גרסת הדגמה
          </span>
          <h1>ברוכים הבאים 👋</h1>
          <p className="login-sub">התחברו כדי להמשיך אל מערכת הניהול.</p>

          <div className="field">
            <label htmlFor="email">כתובת אימייל</label>
            <div className="field-input">
              <i className="bi bi-envelope" />
              <input id="email" type="email" placeholder="name@forum.org.il" defaultValue="avrimi@forum.org.il" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">סיסמה</label>
            <div className="field-input">
              <i className="bi bi-lock" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                defaultValue="demo1234"
              />
              <button
                type="button"
                className="toggle-eye"
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
              </button>
            </div>
          </div>

          <div className="login-row">
            <label>
              <input type="checkbox" defaultChecked /> זכור אותי
            </label>
            <a href="#forgot">שכחתם סיסמה?</a>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            כניסה למערכת
            <i className="bi bi-box-arrow-in-left" />
          </button>

          <div className="login-divider">או</div>

          <button type="button" className="btn-google" onClick={onLogin}>
            <svg className="g-logo" viewBox="0 0 48 48" aria-hidden>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            המשך עם חשבון Google
          </button>

          <p className="login-foot">
            אין לכם חשבון? <a href="#signup">צרו קשר עם מנהל המערכת</a>
          </p>
        </form>
      </main>
    </div>
  );
}
