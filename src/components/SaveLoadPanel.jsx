import React, { useRef } from 'react';
import { Download, Upload, Save } from 'lucide-react';

export const SaveLoadPanel = ({ inputs, pricing, setInputs, setPricing }) => {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const data = { inputs, pricing };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `aws-cost-scenario-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Basic validation
        if (data && data.inputs && data.pricing) {
          setInputs(data.inputs);
          setPricing(data.pricing);
          alert('Configuration imported successfully!');
        } else {
          alert('Invalid file format. Ensure you are uploading a valid AWS Cost Estimator scenario file.');
        }
      } catch (err) {
        alert('Error reading the file. It might be corrupted or not valid JSON.');
      }
      
      // Reset the file input so the same file can be loaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="glass-panel" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <Save className="text-accent" size={20} />
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Configuration Scenarios</h3>
      </div>
      
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Save your current inputs and pricing overrides to share with colleagues or load later.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={handleExport}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'var(--accent-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'opacity 0.2s'
          }}
        >
          <Download size={16} /> Export
        </button>

        <button 
          onClick={handleImportClick}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background 0.2s'
          }}
        >
          <Upload size={16} /> Import
        </button>
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          onChange={handleImport} 
          style={{ display: 'none' }} 
        />
      </div>
    </div>
  );
};
