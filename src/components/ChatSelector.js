import React from 'react';
import './ChatSelector.css';

const ChatSelector = ({ chats, currentChatId, onChatChange }) => {
  const chatIds = Object.keys(chats);

  return (
    <div className="chat-selector">
      <label htmlFor="chat-select" className="chat-label">
        Active Chat:
      </label>
      <select
        id="chat-select"
        value={currentChatId}
        onChange={(e) => onChatChange(e.target.value)}
        className="chat-select"
      >
        {chatIds.map(chatId => (
          <option key={chatId} value={chatId}>
            {chats[chatId]?.name || chatId}
            {chats[chatId]?.messages?.length > 0 && 
              ` (${chats[chatId].messages.length} messages)`
            }
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChatSelector; 