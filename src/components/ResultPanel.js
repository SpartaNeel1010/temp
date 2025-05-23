import React from 'react';
import './ResultPanel.css';

const ResultPanel = ({ result, language }) => {
  const renderResult = () => {
    if (!result) {
      return (
        <div className="no-result">
          <p>Run your code to see the output here</p>
        </div>
      );
    }

    // For HTML/CSS/JavaScript, render as iframe
    if (['html', 'css', 'javascript'].includes(language)) {
      return (
        <iframe
          className="result-iframe"
          srcDoc={result}
          title="Code Result"
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }

    // For other languages, display as text
    return (
      <pre className="result-text">
        {result}
      </pre>
    );
  };

  return (
    <div className="section result-panel-section">
      <div className="section-header">
        <span>Result</span>
        <div className="result-info">
          {language && (
            <span className="language-badge">{language.toUpperCase()}</span>
          )}
        </div>
      </div>
      <div className="section-content result-content">
        {renderResult()}
      </div>
    </div>
  );
};

export default ResultPanel; 