import React from 'react';
import './ExportButton.css';

const ExportButton = ({ onExport }) => {
  return (
    <button onClick={onExport} className="export-button">
      📥 Export JSON
    </button>
  );
};

export default ExportButton; 