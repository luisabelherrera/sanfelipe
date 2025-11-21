import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy el asistente virtual de San Felipe. ¿En qué puedo ayudarte hoy?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://sanfelipe-gchccshmg4b9f7b9.canadacentral-01.azurewebsites.net/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.' 
        }]);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'No pude conectarme con el servidor. Verifica tu conexión.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button 
        className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Ventana de chat */}
      <div className={`chat-container ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <h3>Asistente San Felipe</h3>
          <button onClick={() => setIsOpen(false)} className="close-chat">✕</button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'assistant' ? '🤖' : '👤'}
              </div>
              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content loading">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={sendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="chat-input"
          />
          <button 
            type="submit" 
            disabled={!inputMessage.trim() || isLoading}
            className="send-btn"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatBot;
