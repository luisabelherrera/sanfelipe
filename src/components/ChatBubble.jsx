// Archivo: src/components/ChatBubble.jsx
import React, { useState, useRef, useEffect } from "react";
import { apiService } from "../api/apiService";
import "./ChatBubble.css";

const ChatBubble = ({ contextMessage = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "¡Hola! ¿En qué puedo ayudarte?",
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Si se abre el chat y hay un mensaje de contexto, enviarlo
    if (!isOpen && contextMessage && messages.length === 1) {
      handleQuickMessage(contextMessage);
    }
  };

  const handleQuickMessage = async (message) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setIsLoading(true);

    try {
      const response = await apiService.sendChatMessage(message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.response },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, hubo un error. Por favor, intenta de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await apiService.sendChatMessage(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.response },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, hubo un error. Por favor, intenta de nuevo.",
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

  // Preguntas rápidas contextuales
  const quickQuestions = [
    "¿Cómo registro un lavado?",
    "¿Qué servicios están disponibles?",
    "¿Cómo calculo el total?",
  ];

  return (
    <>
      {/* Burbuja de chat */}
      {isOpen && (
        <div className="chat-bubble-container">
          <div className="chat-bubble-header">
            <div className="chat-bubble-title">
              <span className="chat-bubble-icon">💬</span>
              <span>Asistente</span>
            </div>
            <button onClick={toggleChat} className="chat-bubble-close">
              ✕
            </button>
          </div>

          <div className="chat-bubble-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-bubble-message ${message.role === "user" ? "user" : "assistant"}`}
              >
                <div className="chat-bubble-message-avatar">
                  {message.role === "user" ? "👤" : "🤖"}
                </div>
                <div className="chat-bubble-message-content">
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-bubble-message assistant">
                <div className="chat-bubble-message-avatar">🤖</div>
                <div className="chat-bubble-message-content loading">
                  <div className="chat-bubble-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preguntas rápidas - solo mostrar al inicio */}
          {messages.length <= 2 && (
            <div className="chat-bubble-quick-questions">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickMessage(question)}
                  className="chat-bubble-quick-btn"
                  disabled={isLoading}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <form className="chat-bubble-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
              className="chat-bubble-input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="chat-bubble-send-btn"
            >
              📤
            </button>
          </form>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={toggleChat}
        className={`chat-bubble-float-btn ${isOpen ? "active" : ""}`}
        title="Abrir asistente"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </>
  );
};

export default ChatBubble;