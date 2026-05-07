import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';

export const PricingSettings = ({ pricing, setPricing }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPricing(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="glass-panel" style={{ marginTop: '1.5rem' }}>
      <div 
        className="accordion-header" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings className="text-accent" size={20} />
          <span style={{ fontSize: '1.1rem' }}>AWS Pricing Rates (us-east-1)</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isOpen && (
        <div className="accordion-content">
          <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            These are current estimates. Adjust them if you have custom enterprise pricing.
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.75rem', color: '#60a5fa' }}>Storage Costs ($/GB/mo)</h4>
            <div className="grid-2">
              <div className="form-group">
                <label>S3 Standard</label>
                <input type="number" name="s3StandardStorage" value={pricing.s3StandardStorage} onChange={handleChange} step="0.001" />
              </div>
              <div className="form-group">
                <label>S3 Standard-IA</label>
                <input type="number" name="s3StandardIAStorage" value={pricing.s3StandardIAStorage} onChange={handleChange} step="0.001" />
              </div>
              <div className="form-group">
                <label>Glacier Instant Retrieval</label>
                <input type="number" name="glacierInstantStorage" value={pricing.glacierInstantStorage} onChange={handleChange} step="0.0001" />
              </div>
              <div className="form-group">
                <label>Glacier Flexible Retrieval</label>
                <input type="number" name="glacierFlexibleStorage" value={pricing.glacierFlexibleStorage} onChange={handleChange} step="0.0001" />
              </div>
              <div className="form-group">
                <label>Glacier Deep Archive</label>
                <input type="number" name="glacierDeepStorage" value={pricing.glacierDeepStorage} onChange={handleChange} step="0.0001" />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.75rem', color: '#60a5fa' }}>API Request Costs ($/1000 requests)</h4>
            <div className="grid-2">
              <div className="form-group">
                <label>S3 Standard PUT/COPY/POST</label>
                <input type="number" name="s3StandardPut" value={pricing.s3StandardPut} onChange={handleChange} step="0.001" />
              </div>
              <div className="form-group">
                <label>S3 Standard GET/SELECT</label>
                <input type="number" name="s3StandardGet" value={pricing.s3StandardGet} onChange={handleChange} step="0.0001" />
              </div>
              <div className="form-group">
                <label>S3 Standard-IA PUT/COPY</label>
                <input type="number" name="s3StandardIAPut" value={pricing.s3StandardIAPut} onChange={handleChange} step="0.001" />
              </div>
              <div className="form-group">
                <label>S3 Standard-IA GET</label>
                <input type="number" name="s3StandardIAGet" value={pricing.s3StandardIAGet} onChange={handleChange} step="0.001" />
              </div>
              <div className="form-group">
                <label>Glacier Instant PUT</label>
                <input type="number" name="glacierInstantPut" value={pricing.glacierInstantPut} onChange={handleChange} step="0.01" />
              </div>
              <div className="form-group">
                <label>Glacier Flexible Transition</label>
                <input type="number" name="glacierFlexiblePut" value={pricing.glacierFlexiblePut} onChange={handleChange} step="0.01" />
              </div>
              <div className="form-group">
                <label>Deep Archive Transition</label>
                <input type="number" name="glacierDeepPut" value={pricing.glacierDeepPut} onChange={handleChange} step="0.01" />
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '0.75rem', color: '#60a5fa' }}>Data Retrieval & Egress ($/GB)</h4>
            <div className="grid-2">
              <div className="form-group">
                <label>S3 Standard-IA Retrieval</label>
                <input type="number" name="s3StandardIARetrieval" value={pricing.s3StandardIARetrieval} onChange={handleChange} step="0.001" />
              </div>
              <div className="form-group">
                <label>Glacier Instant Retrieval</label>
                <input type="number" name="glacierInstantRetrieval" value={pricing.glacierInstantRetrieval} onChange={handleChange} step="0.001" />
              </div>
              <div className="form-group">
                <label>Glacier Flexible Retrieval</label>
                <input type="number" name="glacierFlexibleRetrieval" value={pricing.glacierFlexibleRetrieval} onChange={handleChange} step="0.001" />
              </div>
              <div className="form-group">
                <label>Deep Archive Standard Retrieval</label>
                <input type="number" name="glacierDeepRetrieval" value={pricing.glacierDeepRetrieval} onChange={handleChange} step="0.001" />
              </div>
              <div className="form-group">
                <label>Internet Egress (First 10TB)</label>
                <input type="number" name="dataEgress" value={pricing.dataEgress} onChange={handleChange} step="0.01" />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
