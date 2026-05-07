import React, { useState, useMemo } from 'react';
import { CloudRain } from 'lucide-react';
import { InputPanel } from './components/InputPanel';
import { PricingSettings } from './components/PricingSettings';
import { ResultsDashboard } from './components/ResultsDashboard';
import { calculateCosts, defaultInputs, defaultPricing } from './utils/calculator';
import './index.css';

function App() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [pricing, setPricing] = useState(defaultPricing);

  const costs = useMemo(() => calculateCosts(inputs, pricing), [inputs, pricing]);

  return (
    <div className="app-container">
      <header className="header-container">
        <div style={{ background: 'var(--accent-color)', padding: '0.75rem', borderRadius: '12px' }}>
          <CloudRain size={32} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>AWS Storage Cost Estimator</h1>
          <p className="text-muted">Optimize your backup repository costs across S3 and Glacier tiers.</p>
        </div>
      </header>

      <main className="dashboard-layout">
        <section className="left-column">
          <InputPanel inputs={inputs} setInputs={setInputs} />
          <PricingSettings pricing={pricing} setPricing={setPricing} />
        </section>
        
        <section className="right-column">
          <ResultsDashboard costs={costs} inputs={inputs} pricing={pricing} />
        </section>
      </main>
    </div>
  );
}

export default App;
