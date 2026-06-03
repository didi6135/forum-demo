import { useMemo, useState } from "react";
import "./whatsapp.css";
import { Avatar } from "../components/Avatar";
import { WHATSAPP_CONVERSATIONS, type WhatsappConversation, type WhatsappMessage } from "../data/sampleData";

export function Whatsapp() {
  const [activeId, setActiveId] = useState<string>(WHATSAPP_CONVERSATIONS[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [unread, setUnread] = useState<Record<string, number>>(() =>
    Object.fromEntries(WHATSAPP_CONVERSATIONS.map((c) => [c.id, c.unread])),
  );

  const conversations = useMemo(() => {
    const q = query.trim();
    if (!q) return WHATSAPP_CONVERSATIONS;
    return WHATSAPP_CONVERSATIONS.filter(
      (c) => c.name.includes(q) || c.phone.includes(q) || c.messages.some((m) => m.text.includes(q)),
    );
  }, [query]);

  const active = WHATSAPP_CONVERSATIONS.find((c) => c.id === activeId) ?? null;

  function openConversation(id: string) {
    setActiveId(id);
    setDraft("");
    setUnread((u) => ({ ...u, [id]: 0 }));
  }

  return (
    <div className="surface-card">
      <div className="wa">
        {/* ===== Conversation list (start side / right in RTL) ===== */}
        <aside className="wa-list">
          <div className="wa-list-head">
            <h2 className="wa-list-title">
              <i className="bi bi-whatsapp" /> וואטסאפ
            </h2>
            <span className="wa-list-sub">שיחות עם פונים</span>
          </div>
          <div className="wa-search">
            <i className="bi bi-search" />
            <input
              type="text"
              placeholder="חיפוש שיחה או הודעה…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="wa-threads">
            {conversations.length === 0 && <div className="wa-threads-empty">לא נמצאו שיחות</div>}
            {conversations.map((c) => (
              <ThreadItem
                key={c.id}
                conv={c}
                active={c.id === activeId}
                unread={unread[c.id] ?? 0}
                onClick={() => openConversation(c.id)}
              />
            ))}
          </div>
        </aside>

        {/* ===== Active chat (end side / left in RTL) ===== */}
        <section className="wa-chat">
          {active ? (
            <ChatView conv={active} draft={draft} setDraft={setDraft} />
          ) : (
            <div className="wa-chat-empty">
              <i className="bi bi-whatsapp" />
              <p>בחר שיחה כדי להתחיל לדבר עם הפונה</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ---------- Conversation list item ---------- */
function ThreadItem({
  conv,
  active,
  unread,
  onClick,
}: {
  conv: WhatsappConversation;
  active: boolean;
  unread: number;
  onClick: () => void;
}) {
  const last = conv.messages[conv.messages.length - 1];
  return (
    <button
      className={`wa-thread${active ? " is-active" : ""}${unread > 0 ? " has-unread" : ""}`}
      type="button"
      onClick={onClick}
    >
      <Avatar name={conv.name} size="md" />
      <div className="wa-thread-main">
        <div className="wa-thread-top">
          <span className="wa-thread-name">{conv.name}</span>
          <span className="wa-thread-time">{conv.lastTime}</span>
        </div>
        <div className="wa-thread-bottom">
          <span className="wa-thread-preview">
            {last?.direction === "out" && <i className="bi bi-reply" />}
            {last?.text}
          </span>
          {unread > 0 && <span className="wa-thread-badge">{unread}</span>}
        </div>
      </div>
    </button>
  );
}

/* ---------- Active chat view ---------- */
function ChatView({
  conv,
  draft,
  setDraft,
}: {
  conv: WhatsappConversation;
  draft: string;
  setDraft: (v: string) => void;
}) {
  return (
    <>
      <header className="wa-chat-head">
        <Avatar name={conv.name} size="md" />
        <div className="wa-chat-who">
          <span className="wa-chat-name">{conv.name}</span>
          <span className="wa-chat-phone">{conv.phone}</span>
        </div>
        <span className={`wa-window${conv.windowOpen ? " open" : " closed"}`}>
          <i className={`bi ${conv.windowOpen ? "bi-unlock-fill" : "bi-lock-fill"}`} />
          {conv.windowOpen ? "חלון 24ש׳ פתוח" : "חלון נסגר"}
        </span>
        <div className="wa-chat-actions">
          <button className="icon-btn" type="button" title="חיפוש בשיחה">
            <i className="bi bi-search" />
          </button>
          <button className="icon-btn" type="button" title="פתח תיק לקוח">
            <i className="bi bi-person-lines-fill" />
          </button>
          <button className="icon-btn" type="button" title="עוד">
            <i className="bi bi-three-dots-vertical" />
          </button>
        </div>
      </header>

      <div className="wa-messages">
        <div className="wa-day">היום</div>
        {conv.messages.map((m) => (
          <Bubble key={m.id} msg={m} />
        ))}
      </div>

      {conv.windowOpen ? (
        <div className="wa-composer">
          <button className="icon-btn" type="button" title="צירוף קובץ">
            <i className="bi bi-paperclip" />
          </button>
          <textarea
            className="wa-input"
            placeholder="הקלד הודעה…"
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button className="icon-btn" type="button" title="תבנית מהירה">
            <i className="bi bi-stars" />
          </button>
          <button className="wa-send" type="button" title="שליחה" disabled={!draft.trim()}>
            <i className="bi bi-send-fill" />
          </button>
        </div>
      ) : (
        <div className="wa-template-bar">
          <i className="bi bi-info-circle-fill" />
          <span>חלון 24 השעות נסגר — ניתן לשלוח רק הודעת תבנית מאושרת.</span>
          <button className="btn btn-primary btn-sm" type="button">
            <i className="bi bi-file-earmark-text-fill" /> שלח תבנית
          </button>
        </div>
      )}
    </>
  );
}

/* ---------- Single message bubble ---------- */
function Bubble({ msg }: { msg: WhatsappMessage }) {
  const isOut = msg.direction === "out";
  return (
    <div className={`wa-bubble-row ${isOut ? "out" : "in"}`}>
      <div className="wa-bubble">
        <span className="wa-bubble-text">{msg.text}</span>
        <span className="wa-bubble-meta">
          {msg.time}
          {isOut && <Ticks status={msg.status} />}
        </span>
      </div>
    </div>
  );
}

function Ticks({ status }: { status?: WhatsappMessage["status"] }) {
  if (!status) return null;
  if (status === "sent") return <i className="bi bi-check wa-tick" title="נשלח" />;
  const read = status === "read";
  return <i className={`bi bi-check-all wa-tick${read ? " read" : ""}`} title={read ? "נקרא" : "נמסר"} />;
}
