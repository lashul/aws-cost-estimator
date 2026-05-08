import React, { useState } from 'react';
import { PieChart, HardDrive, Cpu, ArrowDownToLine, DollarSign, Info, X } from 'lucide-react';

export const ResultsDashboard = ({ costs, inputs, pricing }) => {
  const [showCalc, setShowCalc] = useState(false);
  const [showStorageCalc, setShowStorageCalc] = useState(false);
  const [showGetCalc, setShowGetCalc] = useState(false);

  if (!costs || !pricing) return null;

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  const formatRate = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 5 }).format(val);
  const formatNumber = (val) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val);
  const formatTB = (val) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

  const CalcPopup = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
      <div style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '0.5rem',
        background: 'var(--panel-bg)',
        backdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--accent-color)',
        borderRadius: '8px',
        padding: '1rem',
        width: '280px',
        zIndex: 50,
        boxShadow: 'var(--glass-shadow)',
        textAlign: 'left',
        fontSize: '0.85rem',
        color: 'var(--text-main)',
        cursor: 'default'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          <span>{title}</span>
          <X size={14} onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          {children}
        </div>
      </div>
    );
  };

  const TierCard = ({ title, data, tierPricing, isRecommended }) => {
    const [openPopup, setOpenPopup] = useState(null);

    const handlePopup = (type) => setOpenPopup(openPopup === type ? null : type);

    return (
      <div className={`glass-panel ${isRecommended ? 'recommended' : ''}`} style={{ position: 'relative', height: '100%' }}>
        {isRecommended && (
          <div style={{ position: 'absolute', top: '-10px', right: '10px', background: 'var(--accent-color)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
            Best for Backups
          </div>
        )}
        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{title}</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', cursor: 'pointer' }} onClick={() => handlePopup('storage')}>
            <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HardDrive size={14} /> Storage Fee <Info size={12} />
            </span>
            <span>{formatCurrency(data.storageFee)}</span>
            <CalcPopup show={openPopup === 'storage'} onClose={() => setOpenPopup(null)} title="Storage Calculation">
              <p>Steady State Storage: {formatTB(costs.storage.steadyStateGB / 1024)} TB</p>
              <p>Storage Rate: {formatRate(tierPricing.storage)} / GB</p>
              <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>= {formatCurrency(data.storageFee)}</p>
            </CalcPopup>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', cursor: 'pointer' }} onClick={() => handlePopup('api')}>
            <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={14} /> API / Transitions <Info size={12} />
            </span>
            <span>{formatCurrency(data.apiFee)}</span>
            <CalcPopup show={openPopup === 'api'} onClose={() => setOpenPopup(null)} title="API Calculation">
              <p>Monthly Puts: {formatNumber(costs.apiCalls.monthlyPuts)}</p>
              <p>Put Rate: {formatRate(tierPricing.put)} / 1000</p>
              <p style={{ marginTop: '0.5rem' }}>Monthly Gets: {formatNumber(costs.apiCalls.monthlyGets)}</p>
              <p>Get Rate: {formatRate(tierPricing.get)} / 1000</p>
              <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>= {formatCurrency(data.apiFee)}</p>
            </CalcPopup>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', cursor: 'pointer' }} onClick={() => handlePopup('retrieval')}>
            <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowDownToLine size={14} /> Retrieval Fee <Info size={12} />
            </span>
            <span>{formatCurrency(data.retrievalFee)}</span>
            <CalcPopup show={openPopup === 'retrieval'} onClose={() => setOpenPopup(null)} title="Retrieval Calculation">
              <p>Data Retrieved: {formatNumber(inputs.monthlyDataRetrievedGB)} GB</p>
              <p>Retrieval Rate: {formatRate(tierPricing.retrieval)} / GB</p>
              <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>= {formatCurrency(data.retrievalFee)}</p>
            </CalcPopup>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', cursor: 'pointer' }} onClick={() => handlePopup('egress')}>
            <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={14} /> Egress Fee <Info size={12} />
            </span>
            <span>{formatCurrency(data.egressFee)}</span>
            <CalcPopup show={openPopup === 'egress'} onClose={() => setOpenPopup(null)} title="Egress Calculation">
              <p>Data Egressed: {formatNumber(inputs.monthlyDataRetrievedGB)} GB</p>
              <p>Egress Rate: {formatRate(pricing.dataEgress)} / GB</p>
              <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>= {formatCurrency(data.egressFee)}</p>
            </CalcPopup>
          </div>
          
          <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>Total Monthly</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{formatCurrency(data.total)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
            <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Total Annual</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-main)' }}>{formatCurrency(data.total * 12)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="header-container" style={{ marginBottom: '1.5rem' }}>
        <PieChart className="text-accent" size={24} />
        <h2 style={{ margin: 0 }}>Estimated Monthly Costs</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div 
          className="metric-card" 
          style={{ cursor: 'pointer', position: 'relative' }}
          onClick={() => setShowStorageCalc(!showStorageCalc)}
        >
          <div className="metric-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
            Steady State Storage <Info size={12} />
          </div>
          <div className="metric-value text-accent">{formatTB(costs.storage.steadyStateGB / 1024)} TB</div>
          
          <CalcPopup show={showStorageCalc} onClose={() => setShowStorageCalc(false)} title="Storage Calculation">
            <p style={{ marginBottom: '0.25rem' }}>Base Storage = {formatNumber(inputs.storageConsumedTB * 1024)} GB</p>
            <p style={{ marginBottom: '0.25rem' }}>Daily Change = {formatNumber(inputs.storageConsumedTB * 1024 * (inputs.dailyChangeRatePercent/100))} GB/day</p>
            <p style={{ marginBottom: '0.25rem' }}>Retention = {inputs.retentionDays} days</p>
            <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>Base + (Daily * Retention)</p>
          </CalcPopup>
        </div>

        <div 
          className="metric-card" 
          style={{ cursor: 'pointer', position: 'relative' }}
          onClick={() => setShowCalc(!showCalc)}
        >
          <div className="metric-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
            Est. Monthly PUTs <Info size={12} />
          </div>
          <div className="metric-value">{formatNumber(costs.apiCalls.monthlyPuts)} puts</div>
          
          <CalcPopup show={showCalc} onClose={() => setShowCalc(false)} title="PUT Requests Calculation">
            <p style={{ marginBottom: '0.25rem' }}>Daily Change = {formatNumber(inputs.storageConsumedTB * 1024 * (inputs.dailyChangeRatePercent/100))} GB</p>
            <p style={{ marginBottom: '0.25rem' }}>Daily Files = {formatNumber(costs.apiCalls.monthlyPuts / 30)} (Daily Change GB * 1024 / {inputs.averageFileSizeMB} MB)</p>
            <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>Monthly PUTs = Daily Files * 30 days</p>
          </CalcPopup>
        </div>

        <div 
          className="metric-card" 
          style={{ cursor: 'pointer', position: 'relative' }}
          onClick={() => setShowGetCalc(!showGetCalc)}
        >
          <div className="metric-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
            Est. Monthly GETs <Info size={12} />
          </div>
          <div className="metric-value">{formatNumber(costs.apiCalls.monthlyGets)} gets</div>
          
          <CalcPopup show={showGetCalc} onClose={() => setShowGetCalc(false)} title="GET Requests Calculation">
            <p style={{ marginBottom: '0.25rem' }}>Monthly Retrieved = {formatNumber(inputs.monthlyDataRetrievedGB)} GB</p>
            <p style={{ marginBottom: '0.25rem' }}>Retrieved Files = {formatNumber(costs.apiCalls.monthlyGets)} (Monthly Retrieved GB * 1024 / {inputs.averageFileSizeMB} MB)</p>
            <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>Monthly GETs = Retrieved Files</p>
          </CalcPopup>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <TierCard 
          title="S3 Standard" 
          data={costs.tiers.s3Standard} 
          tierPricing={{ storage: pricing.s3StandardStorage, put: pricing.s3StandardPut, get: pricing.s3StandardGet, retrieval: 0 }} 
        />
        <TierCard 
          title="S3 Standard-IA" 
          data={costs.tiers.s3StandardIA} 
          tierPricing={{ storage: pricing.s3StandardIAStorage, put: pricing.s3StandardIAPut, get: pricing.s3StandardIAGet, retrieval: pricing.s3StandardIARetrieval }} 
        />
        <TierCard 
          title="Glacier Instant Retrieval" 
          data={costs.tiers.glacierInstant} 
          tierPricing={{ storage: pricing.glacierInstantStorage, put: pricing.glacierInstantPut, get: pricing.s3StandardGet, retrieval: pricing.glacierInstantRetrieval }} 
        />
        <TierCard 
          title="Glacier Flexible Retrieval" 
          data={costs.tiers.glacierFlexible} 
          isRecommended={true} 
          tierPricing={{ storage: pricing.glacierFlexibleStorage, put: pricing.glacierFlexiblePut, get: pricing.s3StandardGet, retrieval: pricing.glacierFlexibleRetrieval }} 
        />
        <TierCard 
          title="Glacier Deep Archive" 
          data={costs.tiers.glacierDeepArchive} 
          tierPricing={{ storage: pricing.glacierDeepStorage, put: pricing.glacierDeepPut, get: pricing.s3StandardGet, retrieval: pricing.glacierDeepRetrieval }} 
        />
      </div>
      
      <div className="glass-panel" style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <strong>Note:</strong> Storage projection assumes the initial consumed storage acts as the "Full Backup" baseline, and daily changes represent incremental backups kept for the retention period. Egress and API costs are approximations based on average file size.
      </div>
    </div>
  );
};
