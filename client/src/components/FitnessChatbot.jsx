import React, { useState } from 'react';
import '../css/FitnessChatbot.css';

const FitnessChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'You', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const res = await fetch('http://localhost:5000/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    const botMessage = { sender: 'FitBot 🤖', text: data.reply };

    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <div className="chatbot-container">
      <h2>💬 Fitness Chatbot</h2>
      <div className="chatbox">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === 'You' ? 'user-msg' : 'bot-msg'}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
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
      </div>
    </div>
  );
};

export default FitnessChatbot;
