import React, { useState, useRef, useEffect } from "react";
import { apiService } from "../api/apiService";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "¡Hola! Soy tu asistente virtual de San Felipe. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Agregar mensaje del usuario
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await apiService.sendChatMessage(userMessage);
      
      // Agregar respuesta del asistente
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.response },
      ]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>💬 Asistente Virtual</h2>
        <p>San Felipe - Lavado de Autos</p>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === "user" ? "user-message" : "assistant-message"}`}
          >
            <div className="message-avatar">
              {message.role === "user" ? "👤" : "🤖"}
            </div>
            <div className="message-content">
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant-message">
            <div className="message-avatar">🤖</div>
            <div className="message-content loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje aquí..."
          disabled={isLoading}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="chat-send-button"
        >
          {isLoading ? "⏳" : "📤"}
        </button>
      </form>
    </div>
  );
};

export default Chat;