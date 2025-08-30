'use client'
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

type Message = {
  id: number;
  sender: "user" | "agent";
  text: string;
}

export default function AgentAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : ""
  const api = process.env.NEXT_PUBLIC_API_URL

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const newUserMessage: Message = { id: messages.length + 1, sender: "user", text: inputMessage }
    setMessages(prevMessages => [...prevMessages, newUserMessage])
    setInputMessage("")

    try {
      const res = await fetch(api + "/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "X-Tenant-ID": "1" },
        body: JSON.stringify({ message: inputMessage })
      })
      const data = await res.json()
      const newAgentMessage: Message = { id: messages.length + 2, sender: "agent", text: data.reply }
      setMessages(prevMessages => [...prevMessages, newAgentMessage])
    } catch (error) {
      console.error("Error sending message to agent:", error)
      const errorMessage: Message = { id: messages.length + 2, sender: "agent", text: "Sorry, I couldn't process that. Please try again." }
      setMessages(prevMessages => [...prevMessages, errorMessage])
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <main className="flex flex-col h-[calc(100vh-80px)]"> {/* Adjust height as needed */}
      <h2 className="text-xl font-semibold mb-3">AI Assistant</h2>
      
      <div className="flex-1 overflow-y-auto p-4 border rounded bg-white mb-4">
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-md p-3 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          className="border p-2 flex-1 rounded" 
          placeholder="Type your message..." 
          value={inputMessage} 
          onChange={e => setInputMessage(e.target.value)} 
          onKeyPress={e => { if (e.key === "Enter") sendMessage() }}
        />
        <button className="bg-black text-white px-4 py-2 rounded" onClick={sendMessage}>Send</button>
      </div>
    </main>
  )
}