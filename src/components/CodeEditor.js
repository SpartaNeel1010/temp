import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

const CodeEditor = ({ code, language, onCodeChange, onLanguageChange, onRunCode }) => {
  const [isRunning, setIsRunning] = useState(false);

  const languages = [
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  const handleRunCode = async () => {
    setIsRunning(true);
    
    try {
      if (language === 'html') {
        // For HTML, directly render the content
        onRunCode(code);
      } else if (language === 'css') {
        // For CSS, wrap in HTML template
        const htmlWithCSS = `
<!DOCTYPE html>
<html>
<head>
  <style>
    ${code}
  </style>
</head>
<body>
  <h1>CSS Preview</h1>
  <p>This is a paragraph to demonstrate your CSS.</p>
  <div class="demo-content">
    <button>Button</button>
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
    </ul>
  </div>
</body>
</html>`;
        onRunCode(htmlWithCSS);
      } else if (language === 'javascript') {
        // For JavaScript, wrap in HTML template with console capture
        const htmlWithJS = `
<!DOCTYPE html>
<html>
<head>
  <title>JavaScript Output</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    #console { background: #f4f4f4; padding: 10px; border-radius: 4px; margin-top: 10px; }
    .log { margin: 2px 0; }
    .error { color: red; }
  </style>
</head>
<body>
  <h2>JavaScript Console Output:</h2>
  <div id="console"></div>
  
  <script>
    const consoleDiv = document.getElementById('console');
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = function(...args) {
      const div = document.createElement('div');
      div.className = 'log';
      div.textContent = args.join(' ');
      consoleDiv.appendChild(div);
      originalLog.apply(console, args);
    };
    
    console.error = function(...args) {
      const div = document.createElement('div');
      div.className = 'log error';
      div.textContent = 'Error: ' + args.join(' ');
      consoleDiv.appendChild(div);
      originalError.apply(console, args);
    };
    
    try {
      ${code}
    } catch (error) {
      console.error(error.message);
    }
  </script>
</body>
</html>`;
        onRunCode(htmlWithJS);
      } else {
        // For other languages, send to backend for execution
        const response = await fetch('/api/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            language: language
          }),
        });
        
        const result = await response.text();
        onRunCode(result);
      }
    } catch (error) {
      onRunCode(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Auto-run for HTML/CSS/JS
  useEffect(() => {
    if (['html', 'css', 'javascript'].includes(language)) {
      const timer = setTimeout(() => {
        handleRunCode();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [code, language]);

  return (
    <div className="section code-editor-section">
      <div className="section-header">
        <div className="header-content">
          <span>Code Editor</span>
          <div className="editor-controls">
            <select 
              value={language} 
              onChange={(e) => onLanguageChange(e.target.value)}
              className="language-selector"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <button 
              onClick={handleRunCode} 
              disabled={isRunning}
              className="run-button"
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>
      </div>
      <div className="section-content">
        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor; 