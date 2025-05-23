import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Chatbot.css';

const Chatbot = ({ chatId, chat, onUpdateChat }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const messages = chat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMessage];
    
    // Update messages immediately with user message
    onUpdateChat(chatId, newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        message: input,
        conversation_history: messages
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString()
      };

      onUpdateChat(chatId, [...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check that the backend server is running.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      onUpdateChat(chatId, [...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    onUpdateChat(chatId, []);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="section chatbot-section">
      <div className="section-header">
        <div className="header-content">
          <span>AI Chatbot</span>
          <button onClick={clearChat} className="clear-button">
            Clear Chat
          </button>
        </div>
      </div>
      <div className="section-content chatbot-content">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h3>👋 Hello! I'm your AI assistant</h3>
              <p>Ask me anything about coding, technology, or general questions.</p>
              <div className="example-questions">
                <p><strong>Try asking:</strong></p>
                <ul>
                  <li>"Explain how React hooks work"</li>
                  <li>"What's the difference between let and const?"</li>
                  <li>"How do I center a div in CSS?"</li>
                </ul>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role} ${message.isError ? 'error' : ''}`}
              >
                <div className="message-header">
                  <span className="role">
                    {message.role === 'user' ? '👤 You' : '🤖 AI Assistant'}
                  </span>
                  <span className="timestamp">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <div className="message-content">
                  {message.role === 'user' ? message.content : (
                    <ReactMarkdown
                      components={{
                        code: ({ node, inline, className, children, ...props }) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={tomorrow}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message assistant loading">
              <div className="message-header">
                <span className="role">🤖 AI Assistant</span>
              </div>
              <div className="message-content">
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
        
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              disabled={isLoading}
              className="message-input"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="send-button"
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot; 