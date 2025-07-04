import React, { useState, useRef, useEffect } from 'react';
import '../css/FitnessChatbot.css';
import { marked } from 'marked';

const FitnessChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'You', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/gemini/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const htmlReply = marked.parse(data.reply);
      const botMessage = { sender: 'FitBot 🤖', text: htmlReply };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'FitBot 🤖', text: '❌ Sorry, something went wrong.' }
      ]);
    }

    setIsTyping(false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("❗ Your browser doesn't support Speech Recognition.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.onerror = (event) => {
      alert(`Voice input error: ${event.error}`);
    };
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-title">💬 Fitness Chatbot</h2>

      <div className="chatbox">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === 'You' ? 'user-msg' : 'bot-msg'}>
            <strong>{msg.sender}:</strong>{' '}
            {msg.sender === 'You' ? (
              msg.text
            ) : (
              <span dangerouslySetInnerHTML={{ __html: msg.text }} />
            )}
          </div>
        ))}

        {isTyping && (
          <div className="bot-msg typing-indicator">
            <strong>FitBot 🤖:</strong> <span className="dots">Typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Ask anything about fitness..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={startListening} title="Voice Input 🎤">🎤</button>
      </div>
    </div>
  );
};

export default FitnessChatbot;
