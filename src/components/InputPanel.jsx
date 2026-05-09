import React from 'react';
import { Database, FileDigit, Activity, CalendarClock, Download, Layers } from 'lucide-react';

export const InputPanel = ({ inputs, setInputs }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="glass-panel">
      <div className="header-container" style={{ marginBottom: '1.5rem' }}>
        <Database className="text-accent" size={24} />
        <h2 style={{ margin: 0 }}>Backup Metrics</h2>
      </div>

      <div className="form-group">
        <label>Initial Storage Consumed (TB)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={16} className="text-muted" />
          <input 
            type="number" 
            name="storageConsumedTB" 
            value={inputs.storageConsumedTB} 
            onChange={handleChange}
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>Average File Size (MB)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileDigit size={16} className="text-muted" />
            <input 
              type="number" 
              name="averageFileSizeMB" 
              value={inputs.averageFileSizeMB} 
              onChange={handleChange}
              min="0.1"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Multipart Chunk Size (MB)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={16} className="text-muted" />
            <input 
              type="number" 
              name="multipartSizeMB" 
              value={inputs.multipartSizeMB} 
              onChange={handleChange}
              min="5"
              max="5120"
            />
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>Daily Change Rate (%)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} className="text-muted" />
            <input 
              type="number" 
              name="dailyChangeRatePercent" 
              value={inputs.dailyChangeRatePercent} 
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>Retention Period (Days)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarClock size={16} className="text-muted" />
            <input 
              type="number" 
              name="retentionDays" 
              value={inputs.retentionDays} 
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Monthly Data Retrieved (GB)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={16} className="text-muted" />
            <input 
              type="number" 
              name="monthlyDataRetrievedGB" 
              value={inputs.monthlyDataRetrievedGB} 
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
