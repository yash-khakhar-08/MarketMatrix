import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { addToCart } from "../../cart/services/cart.service"
import { setAuthData } from "../../../auth/authSlice"

export default function ChatbotPage(props) {

    const {customer, cart, token} = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const chatBodyRef = useRef(null)

    const [conversations, setConversations] = useState(() => {
        const stored = localStorage.getItem("conversations")
        return stored ? JSON.parse(stored) : []
    })

    const [activeConversationId, setActiveConversationId] = useState(null)
    const [editingChatId, setEditingChatId] = useState(null)
    const [editTitle, setEditTitle] = useState("")

    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        localStorage.setItem("conversations", JSON.stringify(conversations))
    }, [conversations])

    const activeConversation = conversations.find(
        (c) => c.id === activeConversationId
    )

    const messages = activeConversation?.messages || []

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const createNewConversation = () => {
        const newChat = {
            id: crypto.randomUUID(),
            title: "New Chat",
            messages: [
                { sender: "agent", text: "Hello 👋 How can I help you today?" },
            ],
        }

        setConversations((prev) => [newChat, ...prev])
        setActiveConversationId(newChat.id)
        setInput("")
    }

    const deleteConversation = (id) => {
        const updated = conversations.filter((c) => c.id !== id)
        setConversations(updated)

        if (id === activeConversationId) {
            setActiveConversationId(updated[0]?.id || null)
        }
    }

    const startRename = (chat) => {
        setEditingChatId(chat.id)
        setEditTitle(chat.title)
    }

    const saveRename = (id) => {
        if (!editTitle.trim()) return setEditingChatId(null)

        setConversations((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, title: editTitle } : c
            )
        )
        setEditingChatId(null)
    }

    const sendMessage = async () => {
        const message = input.trim()
        if (!message || !activeConversationId) return

        setInput("")
        setIsTyping(true)

        setConversations((prev) =>
            prev.map((conv) =>
                conv.id === activeConversationId
                ? {
                    ...conv,
                    messages: [...conv.messages, { sender: "user", text: message }],
                    }
                : conv
            )
        )

        try {
            
            const res = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_id: activeConversationId,
                    user_id: customer?.id??0,
                    jwt_token: token ?? "",
                    message,
                }),
            })

            const data = await res.json()

            setConversations((prev) =>
                prev.map((conv) =>
                conv.id === activeConversationId
                    ? {
                        ...conv,
                        title:
                        conv.title === "New Chat"
                            ? message.slice(0, 30)
                            : conv.title,
                        messages: [
                        ...conv.messages,
                        {
                            sender: "agent",
                            text: data.response,
                            products: data.state?.recommended_products,
                            show_product_list: data.state?.show_product_list,
                        },
                        ],
                    }
                    : conv
                )
            )
        } catch {
            setConversations((prev) =>
                prev.map((conv) =>
                conv.id === activeConversationId
                    ? {
                        ...conv,
                        messages: [
                        ...conv.messages,
                        { sender: "agent", text: "⚠️ Something went wrong." },
                        ],
                    }
                    : conv
                )
            )
        } finally {
            setIsTyping(false)
        }
    }

    const handleAddToCart = async (product) => {

        if (!customer || !token) return alert("Login to add to cart")

        try {

            const payload = {
                productId: product.id,
                purchaseQty: 1,
                userId: customer?.id
            }

            const newCartItem = await addToCart(token, payload)
            
            dispatch(setAuthData({ token, customer, cart: [...cart, newCartItem] }))

            localStorage.setItem("customer", JSON.stringify({
                userDto: customer,
                cartList: [...cart, newCartItem],
                token
            }))

        } catch (err) {
            console.error(err)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div style={{ display: "flex", height: "80vh" }}>

            {/* SIDEBAR */}
            <div
                style={{
                width: "280px",
                background: "#202123",
                color: "#fff",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                }}
            >
                <button
                className="btn btn-light btn-sm mb-3"
                onClick={createNewConversation}
                >
                + New Chat
                </button>

                <div style={{ flex: 1, overflowY: "auto" }}>
                    {conversations.map((chat) => (
                        <div
                        key={chat.id}
                        style={{
                            padding: "8px",
                            borderRadius: "6px",
                            marginBottom: "6px",
                            background:
                            chat.id === activeConversationId ? "#343541" : "transparent",
                        }}
                        >
                        {editingChatId === chat.id ? (
                            <input
                            autoFocus
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => saveRename(chat.id)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && saveRename(chat.id)
                            }
                            className="form-control form-control-sm"
                            />
                        ) : (
                            <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                            >
                            <span
                                onClick={() => setActiveConversationId(chat.id)}
                                style={{ flex: 1 }}
                            >
                                {chat.title}
                            </span>

                            <div>
                                <button
                                className="btn btn-sm btn-link text-light"
                                onClick={() => startRename(chat)}
                                >
                                ✏️
                                </button>
                                <button
                                className="btn btn-sm btn-link text-danger"
                                onClick={() => deleteConversation(chat.id)}
                                >
                                🗑
                                </button>
                            </div>
                            </div>
                        )}
                        </div>
                    ))}
                </div>
            </div>

            {/* CHAT WINDOW */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div
                ref={chatBodyRef}
                style={{
                    flex: 1,
                    padding: "20px",
                    overflowY: "auto",
                    background: "#f8f9fa",
                }}
                >
                {messages.map((msg, i) => (
                    <div
                    key={i}
                    style={{
                        maxWidth: "80%",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "12px",
                        background: msg.sender === "user" ? "#007bff" : "#e9ecef",
                        color: msg.sender === "user" ? "#fff" : "#000",
                        marginLeft: msg.sender === "user" ? "auto" : "0",
                    }}
                    >
                    {msg.text}

                    {msg.products && msg.show_product_list && (
                        <div className="row mt-2">
                        {msg.products.map((p) => (
                            

                            <div className="col-md-4" key={p.id}>
                            <div className="card p-2 mt-2">
                                <Link to="/productInfo" state={{ product: p, categoryId: p.category.id }}>
                                
                                <img
                                src={`http://localhost:8080/products/${p.productImage}`}
                                alt={p.productName}
                                style={{ width: "100%", objectFit: "cover", height: "200px", padding: "5px" }}
                                />
                                </Link>
                                <strong>{p.productName}</strong>
                                <div>₹{p.productPrice}</div>
                                {cart.some((c) => c.product?.id === p.id) ? (
                                <button
                                    className="btn btn-sm btn-outline-primary mt-2"
                                    onClick={() => navigate("/cart")}
                                >
                                    Go to Cart
                                </button>
                                ) : (
                                <button
                                    className="btn btn-sm btn-outline-primary mt-2"
                                    onClick={() => handleAddToCart(p)}
                                >
                                    Add to Cart
                                </button>
                                )}
                            </div>
                            </div>
                        ))}
                        </div>
                    )}
                    </div>
                ))}

                {isTyping && <em>Agent is typing...</em>}
                </div>

                <div style={{ padding: "15px", borderTop: "1px solid #ddd" }}>
                    <textarea
                        className="form-control"
                        rows="1"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isTyping}
                    />
                </div>
            </div>
        </div>
    )
}
