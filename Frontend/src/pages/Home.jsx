import { useState, useRef, useEffect } from 'react'
import './Home.css'
import axios from 'axios'
import { io } from "socket.io-client";

// Simple ID generator
let msgCounter = 0

export default function Home() {
    const [ chats, setChats ] = useState([])
    const [ socket, setSocket ] = useState(null)
    const [ lastMessage, setLastMessage ] = useState({ _id: null, text: '' })

    const [ messages, setMessages ] = useState([])

    const [ activeChatId, setActiveChatId ] = useState(null)
    const [ input, setInput ] = useState('')
    const [ isThinking, setIsThinking ] = useState(false)
    const textareaRef = useRef(null)
    const scrollRef = useRef(null)

    const activeChat = chats.find(c => c.id === activeChatId)

    function createChat() {

        const chatTitle = prompt('Enter chat title:')


        axios.post("http://localhost:3000/api/chats", {
            title: chatTitle
        }, { withCredentials: true }).then((res) => {
            setChats(prev => [ res.data.chat, ...prev ])
        })

    }

    function updateActiveTitle(firstUserMessage) {
        if (!firstUserMessage) return
        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, title: truncate(firstUserMessage, 26) } : c))
    }

    function truncate(str, max) { return str.length > max ? str.slice(0, max - 1) + '…' : str }

    const addMessage = (role, content, _id) => {

        setMessages(prev => {
            return [ ...prev, { role, content, _id } ]
        })
        
    }

    async function handleSend() {
        const trimmed = input.trim()
        if (!trimmed || isThinking) return

        addMessage('user', trimmed)

        socket.emit("ai-message", { chat: activeChatId, text: trimmed })

    }

    function generateDummyReply(prompt) {
        const responses = [
            'Interesting! Tell me a bit more about that.',
            'Here is a quick summary based on what you said.',
            'Let’s break that down into smaller steps.',
            'Sounds good — what would you like to focus on next?',
            'I can help you outline that. Ready when you are.'
        ]
        return responses[ Math.floor(Math.random() * responses.length) ] + '\n\n> You said: "' + truncate(prompt, 120) + '"'
    }

    // Auto-resize textarea
    useEffect(() => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = '0px'
        el.style.height = Math.min(el.scrollHeight, 220) + 'px'
    }, [ input ])

    // Scroll to bottom on new messages
    useEffect(() => {
        const container = scrollRef.current
        if (container) container.scrollTop = container.scrollHeight
    }, [ messages.length, isThinking ])

    useEffect(() => {

        axios.get("http://localhost:3000/api/chats", { withCredentials: true }).then((res) => {
            setChats(res.data.chats)
        })

    }, [])

    useEffect(() => {

        const newSocket = io("http://localhost:3000", { withCredentials: true });


        newSocket.on("ai-response", (data) => {
            console.log(data, lastMessage);
            setLastMessage(prevMessage => {
                if (prevMessage._id === data._id) {
                    setMessages(prev => prev.map(m => m._id === data._id ? {
                        _id: data._id,
                        content: m.content + data.text,
                    } : m))
                    return { _id: data._id, text: prevMessage.text + data.text };
                } else {
                    setMessages(prev => {
                        if(prev[prev.length - 1]?._id === data._id){
                            return prev.map(m => m._id === data._id ? {
                                _id: data._id,
                                content: m.content + data.text,
                            } : m)
                        }
                        return [...prev, { _id: data._id, role: 'model', content: data.text } ]
                    })
                    return { _id: data._id, text: data.text };
                }
            });
        });

        setSocket(newSocket)
    }, [])


    function handleKey(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="home-root">
            <aside className="chat-sidebar">
                <div className="sidebar-header">Chats</div>
                <button className="new-chat-btn" onClick={createChat}>+ New Chat</button>
                <div className="chat-list">
                    {chats.map(chat => (
                        <button
                            key={chat._id}
                            className={`chat-item ${chat._id === activeChatId ? 'active' : ''}`}
                            onClick={() => setActiveChatId(chat._id)}
                        >
                            <span style={{ flex: 1 }}>{chat.title}</span>
                        </button>
                    ))}
                </div>
                <div className="sidebar-footer">Demo chat UI • Local state only</div>
            </aside>
            <main className="chat-main">
                <div className="chat-scroll" ref={scrollRef}>


                    {messages.map(msg => (
                        <div key={msg.id} className={`chat-message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
                            <div className="message-content">
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    ))}

                   

                </div>

                {
                    activeChatId &&

                    <div className="chat-input-bar">
                        <div className="input-shell-wide">
                            <textarea
                                ref={textareaRef}
                                className="chat-textarea"
                                placeholder="Message..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                rows={1}
                            />
                            <button className="send-btn" disabled={!input.trim() || isThinking} onClick={handleSend}>Send</button>
                        </div>
                        <div className="token-hint">Enter to send • Shift+Enter = newline</div>
                    </div>

                }
            </main>
        </div>
    )
}
