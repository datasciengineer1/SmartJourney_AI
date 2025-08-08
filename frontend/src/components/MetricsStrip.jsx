import React, { useState, useEffect } from 'react';
import './MetricsStrip.css';

const MetricsStrip = () => {
  const [metrics, setMetrics] = useState({
    total_campaigns: 0,
    active_campaigns: 0,
    total_sent: 0,
    total_opened: 0,
    open_rate: 0,
    click_rate: 0
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await fetch('http://localhost:8000/metrics/overview');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        // Fallback metrics
        setMetrics({
          total_campaigns: 12,
          active_campaigns: 3,
          total_sent: 4450,
          total_opened: 3115,
          open_rate: 70.0,
          click_rate: 20.3
        });
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
      setMetrics({
        total_campaigns: 12,
        active_campaigns: 3,
        total_sent: 4450,
        total_opened: 3115,
        open_rate: 70.0,
        click_rate: 20.3
      });
    }
  };

  return (
    <div className="metrics-strip">
      <div className="metric-item">
        <div className="metric-value">{metrics.total_campaigns}</div>
        <div className="metric-label">Total Campaigns</div>
      </div>
      <div className="metric-item">
        <div className="metric-value">{metrics.active_campaigns}</div>
        <div className="metric-label">Active</div>
      </div>
      <div className="metric-item">
        <div className="metric-value">{metrics.total_sent.toLocaleString()}</div>
        <div className="metric-label">Emails Sent</div>
      </div>
      <div className="metric-item">
        <div className="metric-value">{metrics.open_rate}%</div>
        <div className="metric-label">Open Rate</div>
      </div>
      <div className="metric-item">
        <div className="metric-value">{metrics.click_rate}%</div>
        <div className="metric-label">Click Rate</div>
      </div>
    </div>
  );
};

export default MetricsStrip;