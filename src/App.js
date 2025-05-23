import React, { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import ResultPanel from './components/ResultPanel';
import Chatbot from './components/Chatbot';
import ExportButton from './components/ExportButton';
import ChatSelector from './components/ChatSelector';
import './App.css';

function App() {
  const [code, setCode] = useState('<!DOCTYPE html>\n<html>\n<head>\n<title>Hello World</title>\n</head>\n<body>\n<h1>Hello, World!</h1>\n<p>Welcome to the live code editor!</p>\n</body>\n</html>');
  const [language, setLanguage] = useState('html');
  const [result, setResult] = useState('');
  const [currentChatId, setCurrentChatId] = useState('chat1');
  const [chats, setChats] = useState({});

  // Initialize chats from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem('editorChats');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats);
      } catch (error) {
        console.error('Error parsing saved chats:', error);
      }
    } else {
      // Initialize with empty chats
      const initialChats = {
        chat1: { name: 'Chat 1', messages: [] },
        chat2: { name: 'Chat 2', messages: [] },
        chat3: { name: 'Chat 3', messages: [] }
      };
      setChats(initialChats);
      localStorage.setItem('editorChats', JSON.stringify(initialChats));
    }
  }, []);

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    if (Object.keys(chats).length > 0) {
      localStorage.setItem('editorChats', JSON.stringify(chats));
    }
  }, [chats]);

  const updateChat = (chatId, messages) => {
    setChats(prev => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        messages: messages
      }
    }));
  };

  const handleExport = () => {
    const exportData = {
      code: code,
      language: language,
      result: result,
      currentChat: chats[currentChatId] || { name: 'Empty Chat', messages: [] },
      timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `code-and-chat-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Code Editor & AI Chatbot</h1>
        <div className="header-controls">
          <ChatSelector 
            chats={chats}
            currentChatId={currentChatId}
            onChatChange={setCurrentChatId}
          />
          <ExportButton onExport={handleExport} />
        </div>
      </header>
      
      <div className="app-content">
        <div className="editor-result-container">
          <CodeEditor 
            code={code}
            language={language}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
            onRunCode={setResult}
          />
          <ResultPanel result={result} language={language} />
        </div>
        
        <div className="chatbot-container">
          <Chatbot 
            chatId={currentChatId}
            chat={chats[currentChatId]}
            onUpdateChat={updateChat}
          />
        </div>
      </div>
    </div>
  );
}

export default App; 