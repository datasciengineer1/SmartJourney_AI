import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'campaigns', label: 'Campaigns', icon: '📧' },
    { id: 'templates', label: 'Templates', icon: '📝' },
    { id: 'audience', label: 'Audience', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📊' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>SmartJourney</h2>
        <span className="ai-badge">AI</span>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;