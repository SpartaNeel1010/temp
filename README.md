# Code Editor & AI Chatbot

A comprehensive web application featuring a live code editor, result display, and AI chatbot interface. Built with React frontend and Python FastAPI backend.

## Features

### Core Features
1. **Code Editor** - Monaco Editor with syntax highlighting for multiple languages
2. **Result Panel** - Live preview of HTML/CSS/JavaScript and execution results for other languages
3. **AI Chatbot** - Interactive dialogue interface with mock AI responses

### Additional Features
4. **Multiple Chat Storage** - Store up to 3 different chat conversations using localStorage
5. **Export Functionality** - Export code and current chat data in JSON format

## Tech Stack

- **Frontend**: React 18, Monaco Editor, Axios
- **Backend**: Python FastAPI, Uvicorn
- **Styling**: Custom CSS with responsive design

## Project Structure

```
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CodeEditor.js/css
│   │   ├── ResultPanel.js/css
│   │   ├── Chatbot.js/css
│   │   ├── ChatSelector.js/css
│   │   └── ExportButton.js/css
│   ├── App.js/css
│   ├── index.js/css
├── backend/
│   └── main.py
├── package.json
├── requirements.txt
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- npm or yarn

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the React development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:
```bash
cd backend
python main.py
```

Or using uvicorn directly:
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

## Usage Guide

### Code Editor

1. **Language Selection**: Choose from HTML, CSS, JavaScript, Python, Java, or C++
2. **Live Preview**: HTML/CSS/JavaScript code automatically previews in the Result panel
3. **Server Execution**: Python, Java, and C++ code can be executed on the server by clicking "Run Code"
4. **Auto-execution**: Web languages (HTML/CSS/JS) auto-execute with a 1-second delay after typing

### Result Panel

- **Web Languages**: Displays live preview in an iframe
- **Other Languages**: Shows console output from server execution
- **Error Handling**: Displays compilation and runtime errors clearly

### AI Chatbot

1. **Chat Interface**: Type messages and click "Send" to interact
2. **Mock Responses**: Currently uses mock responses based on keywords
3. **Chat History**: Conversation history is maintained during the session
4. **Clear Chat**: Use the "Clear Chat" button to reset the conversation

### Multiple Chat Management

1. **Chat Selector**: Use the dropdown in the header to switch between 3 different chats
2. **Persistent Storage**: Chats are automatically saved to localStorage
3. **Message Count**: The selector shows the number of messages in each chat

### Export Functionality

1. **Export Button**: Click the "📥 Export JSON" button in the header
2. **Data Included**: 
   - Current code and language
   - Result output
   - Current chat conversation
   - Export timestamp
3. **File Format**: Downloads as a JSON file with timestamp in filename

## API Endpoints

### Chat Endpoint
```
POST /api/chat
Content-Type: application/json

{
  "message": "Hello, how can you help me?",
  "conversation_history": [...]
}
```

### Code Execution Endpoint
```
POST /api/execute
Content-Type: application/json

{
  "code": "print('Hello, World!')",
  "language": "python"
}
```

### Health Check
```
GET /health
GET /
```

## Supported Languages

### Client-side Execution (Live Preview)
- HTML
- CSS  
- JavaScript

### Server-side Execution
- Python
- JavaScript (via Node.js)
- Java (requires JDK)
- C++ (requires g++)

## Development Notes

### Security Considerations
- The code execution feature uses basic sandboxing with timeouts
- In production, implement proper containerization and security measures
- Consider using services like Judge0 API for safer code execution

### AI Integration
- Currently uses mock responses
- Replace `get_llm_response()` function with actual AI API calls (OpenAI, Claude, etc.)
- Add proper error handling and rate limiting for AI services

### Customization
- Modify `src/components/` files to customize UI components
- Update `backend/main.py` to add new languages or AI integrations
- Adjust styling in CSS files for different themes

## Troubleshooting

### Common Issues

1. **Backend not connecting**: Ensure the backend is running on port 8000
2. **Code execution failing**: Check if required compilers/interpreters are installed
3. **Monaco Editor not loading**: Ensure all npm dependencies are installed
4. **CORS errors**: Backend includes CORS middleware for localhost:3000

### Dependencies Not Found

- **Node.js**: Required for JavaScript server-side execution
- **Java JDK**: Required for Java code compilation and execution  
- **g++**: Required for C++ code compilation and execution

## Future Enhancements

- Real AI integration (OpenAI GPT, Claude, etc.)
- Database storage for chats and code snippets
- User authentication and project management
- More programming languages support
- Code sharing and collaboration features
- Syntax error detection and suggestions
- Code formatting and beautification
- Plugin system for extensions

## License

This project is for educational and demonstration purposes. Please ensure proper licensing for production use.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Note**: This application includes a mock AI chatbot. For production use, integrate with a real AI service and implement proper security measures for code execution. 