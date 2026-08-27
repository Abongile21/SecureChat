import { useEffect, useState } from 'react';
import { chatService } from '../services/chatService';

type Message = { id: string | number; text: string; time: string; mine: boolean; read?: boolean; replyTo?: string };
type Conversation = { id: string; name: string; initials: string; preview: string; time: string; unread: number; messages: Message[] };

const initialConversations: Conversation[] = [
  {
    id: 'securechat-demo', name: 'SecureChat AI', initials: 'AI', preview: 'Your private cybersecurity learning assistant.', time: 'Now', unread: 0,
    messages: [
      { id: 1, text: 'Welcome. I can help you understand phishing, suspicious links, and common social engineering tactics.', time: '10:39 AM', mine: false },
    ],
  },
];

function Icon({ name }: { name: 'search' | 'plus' | 'arrow' | 'check' | 'more' | 'smile' | 'send' | 'back' | 'chat' | 'close' }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="m9 18 6-6-6-6" /></>,
    back: <><path d="m15 18-6-6 6-6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
    smile: <><circle cx="12" cy="12" r="8" /><path d="M8.5 14.5c1.8 2 5.2 2 7 0M9 9h.01M15 9h.01" /></>,
    send: <><path d="m21 3-7.5 18-3.5-7-7-3.5L21 3Z" /><path d="M10 14 21 3" /></>,
    chat: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-3.5-.8L4 20l1.2-3.2A7.5 7.5 0 1 1 20 11.5Z" /><path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  };
  return <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState('securechat-demo');
  const [messageQuery, setMessageQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadConversation = async () => {
      try {
        const storedChatId = localStorage.getItem('securechat.currentChatId');
        const response = storedChatId
          ? await chatService.getChatHistory(storedChatId)
          : await chatService.startNewChat();
        const chatId = storedChatId || response.data.chatId;
        const history = storedChatId ? response.data.messages : [];
        if (!active) return;
        localStorage.setItem('securechat.currentChatId', chatId);
        setConversations([{ id: chatId, name: 'SecureChat AI', initials: 'AI', preview: 'Your private learning session.', time: 'Now', unread: 0, messages: history.map((message: { id: string; role: string; content: string; timestamp: string }) => ({ id: message.id, text: message.content, time: new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), mine: message.role === 'user', read: true })) }]);
        setSelectedId(chatId);
      } catch {
        if (active) setError('The chat service is unavailable. Try again shortly.');
      }
    };
    void loadConversation();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!isChatOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsChatOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isChatOpen]);

  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0];
  const visibleMessages = selected.messages.filter((message) => message.text.toLowerCase().includes(messageQuery.toLowerCase()));

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text || isSending || !selected) return;
    if (text.length > 2000) { setError('Messages must be 2,000 characters or fewer.'); return; }
    const message: Message = { id: `${Date.now()}:user`, text, time: 'Now', mine: true, read: false, replyTo: replyTo?.text };
    setConversations((current) => current.map((conversation) => conversation.id === selected.id ? { ...conversation, preview: text, time: 'Now', messages: [...conversation.messages, message] } : conversation));
    setDraft('');
    setReplyTo(null);
    setError('');
    setIsSending(true);
    try {
      const response = await chatService.sendMessage(selected.id, text);
      const assistantMessage: Message = { id: `${response.data.messageId}:assistant`, text: response.data.botResponse, time: new Date(response.data.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), mine: false };
      setConversations((current) => current.map((conversation) => conversation.id === selected.id ? { ...conversation, preview: assistantMessage.text, messages: [...conversation.messages, assistantMessage] } : conversation));
    } catch {
      setError('Your message could not be sent. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button className="chat-launcher" type="button" aria-label="Open SecureChat assistant" title="Open SecureChat assistant" onClick={() => setIsChatOpen(true)}>
        <Icon name="chat" />
        <span className="chat-launcher-label">Chat with SecureChat</span>
      </button>
      {isChatOpen && <div className="chat-modal-backdrop" role="presentation" onMouseDown={() => setIsChatOpen(false)}>
        <section className="chat-modal" role="dialog" aria-modal="true" aria-label="Cybersecurity learning assistant" onMouseDown={(event) => event.stopPropagation()}>
          <button className="modal-close" type="button" aria-label="Close SecureChat assistant" title="Close chat" onClick={() => setIsChatOpen(false)}><Icon name="close" /></button>
            <div className="chat-shell">
          <div className="chat-panel">
        <header className="chat-header">
          <span className="avatar">{selected.initials}</span><div className="chat-person"><strong>{selected.name}</strong><span>Cybersecurity learning topic</span></div>
          <div className="chat-actions"><button className="icon-button" aria-label="Search lesson" title="Search lesson" onClick={() => document.getElementById('message-search')?.focus()}><Icon name="search" /></button><button className="icon-button" aria-label="More topic options" title="More options"><Icon name="more" /></button></div>
        </header>
        <div className="message-toolbar"><span>Learning session</span><label className="message-search"><Icon name="search" /><span className="sr-only">Search lesson</span><input id="message-search" value={messageQuery} onChange={(event) => setMessageQuery(event.target.value)} placeholder="Search this lesson" /></label></div>
        <div className="message-history" aria-live="polite">
          {error && <p role="alert" className="mb-3 text-sm text-rose-300">{error}</p>}
          {visibleMessages.length ? visibleMessages.map((message) => <div key={message.id} className={`message-row ${message.mine ? 'mine' : ''}`}><div className="message-bubble">{message.replyTo && <div className="reply-preview">Replying to: {message.replyTo}</div>}<p>{message.text}</p><div className="message-meta"><time>{message.time}</time>{message.mine && <span aria-label={message.read ? 'Read' : 'Delivered'} className={message.read ? 'read' : ''}><Icon name="check" /><Icon name="check" /></span>}<button onClick={() => setReplyTo(message)} aria-label={`Reply to ${message.text}`}>Reply</button></div></div></div>) : <div className="empty-state"><span className="empty-icon"><Icon name="search" /></span><strong>No messages found</strong><span>Try another search term.</span></div>}
        </div>
        <div className="composer-wrap">{replyTo && <div className="reply-bar"><span>Replying to <strong>{replyTo.text}</strong></span><button onClick={() => setReplyTo(null)} aria-label="Cancel reply">Cancel</button></div>}<div className="typing-indicator">SecureChat is ready to help<span>...</span></div><form className="composer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}><button type="button" className="icon-button" aria-label="Add reaction" title="Add reaction"><Icon name="smile" /></button><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask a cybersecurity question" aria-label={`Ask about ${selected.name}`} /><button type="submit" className="send-button" aria-label="Send question" title="Send question"><Icon name="send" /></button></form></div>
          </div>
          </div>
        </section>
      </div>}
    </>
  );
}
