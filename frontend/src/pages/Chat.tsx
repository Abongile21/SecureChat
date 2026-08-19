import { useMemo, useState } from 'react';

type Message = { id: number; text: string; time: string; mine: boolean; read?: boolean; replyTo?: string };
type Conversation = { id: string; name: string; initials: string; preview: string; time: string; unread: number; messages: Message[] };

const initialConversations: Conversation[] = [
  {
    id: 'phishing', name: 'Phishing basics', initials: 'PH', preview: 'Learn how to spot suspicious links.', time: 'Today', unread: 2,
    messages: [
      { id: 1, text: 'Welcome. I can help you understand phishing, suspicious links, and common social engineering tactics.', time: '10:39 AM', mine: false },
      { id: 2, text: 'How can I identify a suspicious link?', time: '10:40 AM', mine: true, read: true },
      { id: 3, text: 'Check the real destination before opening it, watch for misspelled domains, and be cautious when a message creates urgency. You can paste a link here and I will help you assess the warning signs.', time: '10:42 AM', mine: false },
    ],
  },
  {
    id: 'passwords', name: 'Password safety', initials: 'PW', preview: 'Build stronger password habits.', time: 'Yesterday', unread: 0,
    messages: [{ id: 4, text: 'Learn why unique passwords and a password manager reduce account takeover risk.', time: 'Yesterday', mine: false }],
  },
  {
    id: 'messaging', name: 'Secure messaging', initials: 'SM', preview: 'Protect conversations and data.', time: 'Mon', unread: 0,
    messages: [{ id: 5, text: 'Explore practical ways to protect sensitive conversations, devices, and shared information.', time: 'Mon', mine: false }],
  },
];

function Icon({ name }: { name: 'search' | 'plus' | 'arrow' | 'check' | 'more' | 'smile' | 'send' | 'back' }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="m9 18 6-6-6-6" /></>,
    back: <><path d="m15 18-6-6 6-6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
    smile: <><circle cx="12" cy="12" r="8" /><path d="M8.5 14.5c1.8 2 5.2 2 7 0M9 9h.01M15 9h.01" /></>,
    send: <><path d="m21 3-7.5 18-3.5-7-7-3.5L21 3Z" /><path d="M10 14 21 3" /></>,
  };
  return <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function Chat() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState('maya');
  const [query, setQuery] = useState('');
  const [messageQuery, setMessageQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0];
  const visibleConversations = useMemo(() => conversations.filter((conversation) => conversation.name.toLowerCase().includes(query.toLowerCase())), [conversations, query]);
  const visibleMessages = selected.messages.filter((message) => message.text.toLowerCase().includes(messageQuery.toLowerCase()));

  const openConversation = (id: string) => { setSelectedId(id); setMobileChatOpen(true); };
  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    const message: Message = { id: Date.now(), text, time: 'Now', mine: true, read: false, replyTo: replyTo?.text };
    setConversations((current) => current.map((conversation) => conversation.id === selected.id ? { ...conversation, preview: text, time: 'Now', messages: [...conversation.messages, message] } : conversation));
    setDraft('');
    setReplyTo(null);
  };

  return (
    <section className="chat-shell" aria-label="Cybersecurity learning assistant">
      <aside className={`conversation-panel ${mobileChatOpen ? 'mobile-hidden' : ''}`}>
        <div className="conversation-heading">
          <div><p className="eyebrow">SecureChat</p><h2>Learn security</h2></div>
          <button className="icon-button" aria-label="Start a new learning topic" title="New learning topic"><Icon name="plus" /></button>
        </div>
        <label className="search-field"><Icon name="search" /><span className="sr-only">Search learning topics</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics" /></label>
        <div className="conversation-list">
          {visibleConversations.length ? visibleConversations.map((conversation) => (
            <button key={conversation.id} className={`conversation-item ${selected.id === conversation.id ? 'selected' : ''}`} onClick={() => openConversation(conversation.id)}>
              <span className="avatar">{conversation.initials}</span><span className="conversation-copy"><strong>{conversation.name}</strong><span>{conversation.preview}</span></span><span className="conversation-meta"><time>{conversation.time}</time>{conversation.unread > 0 && <b>{conversation.unread}</b>}</span><Icon name="arrow" />
            </button>
          )) : <div className="empty-state compact"><span className="empty-icon"><Icon name="search" /></span><strong>No topics found</strong><span>Try a different search.</span></div>}
        </div>
      </aside>

      <div className={`chat-panel ${mobileChatOpen ? 'mobile-visible' : ''}`}>
        <header className="chat-header">
          <button className="back-button" aria-label="Back to conversations" onClick={() => setMobileChatOpen(false)}><Icon name="back" /></button>
          <span className="avatar">{selected.initials}</span><div className="chat-person"><strong>{selected.name}</strong><span>Cybersecurity learning topic</span></div>
          <div className="chat-actions"><button className="icon-button" aria-label="Search lesson" title="Search lesson" onClick={() => document.getElementById('message-search')?.focus()}><Icon name="search" /></button><button className="icon-button" aria-label="More topic options" title="More options"><Icon name="more" /></button></div>
        </header>
        <div className="message-toolbar"><span>Learning session</span><label className="message-search"><Icon name="search" /><span className="sr-only">Search lesson</span><input id="message-search" value={messageQuery} onChange={(event) => setMessageQuery(event.target.value)} placeholder="Search this lesson" /></label></div>
        <div className="message-history" aria-live="polite">
          {visibleMessages.length ? visibleMessages.map((message) => <div key={message.id} className={`message-row ${message.mine ? 'mine' : ''}`}><div className="message-bubble">{message.replyTo && <div className="reply-preview">Replying to: {message.replyTo}</div>}<p>{message.text}</p><div className="message-meta"><time>{message.time}</time>{message.mine && <span aria-label={message.read ? 'Read' : 'Delivered'} className={message.read ? 'read' : ''}><Icon name="check" /><Icon name="check" /></span>}<button onClick={() => setReplyTo(message)} aria-label={`Reply to ${message.text}`}>Reply</button></div></div></div>) : <div className="empty-state"><span className="empty-icon"><Icon name="search" /></span><strong>No messages found</strong><span>Try another search term.</span></div>}
        </div>
        <div className="composer-wrap">{replyTo && <div className="reply-bar"><span>Replying to <strong>{replyTo.text}</strong></span><button onClick={() => setReplyTo(null)} aria-label="Cancel reply">Cancel</button></div>}<div className="typing-indicator">SecureChat is ready to help<span>...</span></div><form className="composer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}><button type="button" className="icon-button" aria-label="Add reaction" title="Add reaction"><Icon name="smile" /></button><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask a cybersecurity question" aria-label={`Ask about ${selected.name}`} /><button type="submit" className="send-button" aria-label="Send question" title="Send question"><Icon name="send" /></button></form></div>
      </div>
    </section>
  );
}
