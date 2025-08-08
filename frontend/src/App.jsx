import React, { useState } from 'react';
import './App.css';
import CampaignWorkspace from './components/CampaignWorkspace';
import InfoTooltip from './components/InfoTooltip';

const App = () => {
  const [activeView, setActiveView] = useState('campaigns');

  // ReportsView component
  const ReportsView = () => {
    const reportData = [
      { metric: "Total Campaigns", value: "45", period: "Last 30 days", trend: "+12%", icon: "📊" },
      { metric: "Emails Sent", value: "125,430", period: "Last 30 days", trend: "+8%", icon: "📧" },
      { metric: "Average Open Rate", value: "24.8%", period: "Last 30 days", trend: "+3.2%", icon: "📖" },
      { metric: "Average Click Rate", value: "3.2%", period: "Last 30 days", trend: "+0.8%", icon: "👆" },
      { metric: "Conversion Rate", value: "1.8%", period: "Last 30 days", trend: "+0.3%", icon: "✅" },
      { metric: "Revenue Generated", value: "$12,450", period: "Last 30 days", trend: "+15%", icon: "💰" }
    ];

    const topCampaigns = [
      { name: "Welcome Series", openRate: "45.2%", clickRate: "8.1%", conversions: 89, revenue: "$2,340", status: "active" },
      { name: "Product Launch", openRate: "38.7%", clickRate: "6.4%", conversions: 156, revenue: "$4,680", status: "sent" },
      { name: "Newsletter Jan", openRate: "28.9%", clickRate: "4.2%", conversions: 67, revenue: "$1,340", status: "sent" },
      { name: "Holiday Sale", openRate: "52.1%", clickRate: "12.3%", conversions: 203, revenue: "$6,090", status: "sent" },
      { name: "Re-engagement", openRate: "22.4%", clickRate: "3.8%", conversions: 34, revenue: "$850", status: "active" }
    ];

    const monthlyData = [
      { month: "Jan 2024", campaigns: 12, emails: 45000, opens: 11250, clicks: 1350, openRate: "25.0%", clickRate: "3.0%" },
      { month: "Feb 2024", campaigns: 15, emails: 52000, opens: 13520, clicks: 1664, openRate: "26.0%", clickRate: "3.2%" },
      { month: "Mar 2024", campaigns: 18, emails: 61000, opens: 15860, clicks: 1952, openRate: "26.0%", clickRate: "3.2%" },
      { month: "Apr 2024", campaigns: 22, emails: 68000, opens: 17680, clicks: 2176, openRate: "26.0%", clickRate: "3.2%" }
    ];

    const getStatusColor = (status) => {
      switch (status) {
        case 'active': return '#10b981';
        case 'sent': return '#3b82f6';
        case 'draft': return '#f59e0b';
        case 'scheduled': return '#8b5cf6';
        default: return '#6b7280';
      }
    };

    return (
      <div className="workspace-content">
        <div className="workspace-header">
          <div className="header-title">
            <h1>Reports & Analytics</h1>
            <InfoTooltip content="Comprehensive analytics and performance metrics for all your email campaigns. Track engagement, conversions, and revenue." />
          </div>
          <div className="header-actions">
            <button className="export-btn">📊 Export Report</button>
            <button className="refresh-btn">🔄 Refresh Data</button>
          </div>
        </div>

        <div className="reports-section">
          <div className="section-header">
            <h2>📈 Performance Overview</h2>
            <InfoTooltip content="Key performance indicators for your email marketing campaigns over the selected time period." />
          </div>
          <div className="reports-grid">
            {reportData.map((report, index) => (
              <div key={index} className="report-card">
                <div className="report-icon">{report.icon}</div>
                <div className="report-content">
                  <h3>{report.metric}</h3>
                  <div className="report-value">{report.value}</div>
                  <div className="report-meta">
                    <span className="report-trend positive">{report.trend}</span>
                    <span className="report-period">{report.period}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reports-section">
          <div className="section-header">
            <h2>🏆 Top Performing Campaigns</h2>
            <InfoTooltip content="Your best performing campaigns ranked by engagement and conversion metrics." />
          </div>
          <div className="campaigns-table-container">
            <table className="campaigns-table">
              <thead>
                <tr>
                  <th>Campaign Name</th>
                  <th>Status</th>
                  <th>Open Rate</th>
                  <th>Click Rate</th>
                  <th>Conversions</th>
                  <th>Revenue</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {topCampaigns.map((campaign, index) => (
                  <tr key={index}>
                    <td className="campaign-name-cell">
                      <div className="campaign-name">{campaign.name}</div>
                    </td>
                    <td>
                      <span 
                        className="status-badge-small"
                        style={{ backgroundColor: getStatusColor(campaign.status) }}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="metric-cell">{campaign.openRate}</td>
                    <td className="metric-cell">{campaign.clickRate}</td>
                    <td className="metric-cell">{campaign.conversions}</td>
                    <td className="metric-cell revenue">{campaign.revenue}</td>
                    <td>
                      <button className="table-action-btn">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="reports-section">
          <div className="section-header">
            <h2>📅 Monthly Trends</h2>
            <InfoTooltip content="Month-over-month performance trends showing campaign volume and engagement metrics." />
          </div>
          <div className="trends-table-container">
            <table className="trends-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Campaigns</th>
                  <th>Emails Sent</th>
                  <th>Opens</th>
                  <th>Clicks</th>
                  <th>Open Rate</th>
                  <th>Click Rate</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, index) => (
                  <tr key={index}>
                    <td className="month-cell">{data.month}</td>
                    <td className="metric-cell">{data.campaigns}</td>
                    <td className="metric-cell">{data.emails.toLocaleString()}</td>
                    <td className="metric-cell">{data.opens.toLocaleString()}</td>
                    <td className="metric-cell">{data.clicks.toLocaleString()}</td>
                    <td className="metric-cell rate-cell">{data.openRate}</td>
                    <td className="metric-cell rate-cell">{data.clickRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // AudienceView component
  const AudienceView = () => {
    const [selectedSegment, setSelectedSegment] = useState(null);

    const audienceStats = [
      { label: "Total Subscribers", value: "12,450", change: "+5.2%", icon: "👥" },
      { label: "Active Users", value: "8,920", change: "+12.1%", icon: "🟢" },
      { label: "New This Month", value: "1,234", change: "+8.7%", icon: "🆕" },
      { label: "Engagement Rate", value: "68.5%", change: "+3.2%", icon: "📈" }
    ];

    const segments = [
      {
        id: 1,
        name: "High Engagement",
        count: 3420,
        percentage: 27.5,
        description: "Users who open and click regularly",
        lastActive: "2 days ago",
        avgOpenRate: "45.2%",
        avgClickRate: "8.1%",
        tags: ["engaged", "loyal", "active"]
      },
      {
        id: 2,
        name: "New Subscribers",
        count: 1890,
        percentage: 15.2,
        description: "Joined in the last 30 days",
        lastActive: "1 day ago",
        avgOpenRate: "38.7%",
        avgClickRate: "6.4%",
        tags: ["new", "onboarding", "potential"]
      },
      {
        id: 3,
        name: "VIP Customers",
        count: 890,
        percentage: 7.1,
        description: "High-value customers and repeat buyers",
        lastActive: "1 day ago",
        avgOpenRate: "52.1%",
        avgClickRate: "12.3%",
        tags: ["vip", "high-value", "premium"]
      },
      {
        id: 4,
        name: "Re-engagement Needed",
        count: 2150,
        percentage: 17.3,
        description: "Haven't engaged in 30+ days",
        lastActive: "45 days ago",
        avgOpenRate: "12.4%",
        avgClickRate: "1.8%",
        tags: ["inactive", "re-engage", "at-risk"]
      }
    ];

    const handleViewDetails = (segment) => {
      setSelectedSegment(segment);
    };

    const handleCreateCampaign = (segment) => {
      alert(`Creating targeted campaign for ${segment.name} segment with ${segment.count.toLocaleString()} subscribers.\n\nThis would open the campaign editor with the audience pre-selected.`);
    };

    const handleCloseDetails = () => {
      setSelectedSegment(null);
    };

    return (
      <div className="workspace-content">
        <div className="workspace-header">
          <div className="header-title">
            <h1>Audience Management</h1>
            <InfoTooltip content="Manage and analyze your subscriber segments. Create targeted campaigns based on user behavior and engagement patterns." />
          </div>
          <div className="header-actions">
            <button className="create-btn">+ Create Segment</button>
            <button className="import-btn">📥 Import Contacts</button>
          </div>
        </div>

        <div className="audience-stats">
          {audienceStats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <h3>{stat.label}</h3>
                <div className="stat-number">{stat.value}</div>
                <div className="stat-change positive">{stat.change}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="audience-segments">
          <div className="section-header">
            <h2>👥 Audience Segments</h2>
            <InfoTooltip content="Organized groups of subscribers based on behavior, engagement, and demographics. Click on any segment to view details or create targeted campaigns." />
          </div>
          <div className="segments-grid">
            {segments.map((segment) => (
              <div key={segment.id} className="segment-card">
                <div className="segment-header">
                  <h3>{segment.name}</h3>
                  <div className="segment-percentage">{segment.percentage}%</div>
                </div>
                <div className="segment-content">
                  <div className="segment-count">{segment.count.toLocaleString()} subscribers</div>
                  <div className="segment-description">{segment.description}</div>
                  <div className="segment-metrics">
                    <div className="metric-item">
                      <span className="metric-label">Open Rate:</span>
                      <span className="metric-value">{segment.avgOpenRate}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Click Rate:</span>
                      <span className="metric-value">{segment.avgClickRate}</span>
                    </div>
                  </div>
                  <div className="segment-tags">
                    {segment.tags.map(tag => (
                      <span key={tag} className="segment-tag">#{tag}</span>
                    ))}
                  </div>
                  <div className="segment-meta">Last Active: {segment.lastActive}</div>
                </div>
                <div className="segment-actions">
                  <button
                    className="segment-btn secondary"
                    onClick={() => handleViewDetails(segment)}
                  >
                    View Details
                  </button>
                  <button
                    className="segment-btn primary"
                    onClick={() => handleCreateCampaign(segment)}
                  >
                    Create Campaign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedSegment && (
          <div className="segment-details-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>📊 {selectedSegment.name} Details</h3>
                <button className="close-btn" onClick={handleCloseDetails}>×</button>
              </div>
              <div className="modal-body">
                <div className="detail-stats">
                  <div className="detail-stat">
                    <span className="stat-label">Total Subscribers</span>
                    <span className="stat-value">{selectedSegment.count.toLocaleString()}</span>
                  </div>
                  <div className="detail-stat">
                    <span className="stat-label">Percentage of Total</span>
                    <span className="stat-value">{selectedSegment.percentage}%</span>
                  </div>
                  <div className="detail-stat">
                    <span className="stat-label">Average Open Rate</span>
                    <span className="stat-value">{selectedSegment.avgOpenRate}</span>
                  </div>
                  <div className="detail-stat">
                    <span className="stat-label">Average Click Rate</span>
                    <span className="stat-value">{selectedSegment.avgClickRate}</span>
                  </div>
                </div>
                <div className="detail-description">
                  <h4>Description</h4>
                  <p>{selectedSegment.description}</p>
                </div>
                <div className="detail-tags">
                  <h4>Tags</h4>
                  <div className="tags-list">
                    {selectedSegment.tags.map(tag => (
                      <span key={tag} className="detail-tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={handleCloseDetails}>Close</button>
                <button 
                  className="primary-btn"
                  onClick={() => handleCreateCampaign(selectedSegment)}
                >
                  Create Campaign for This Segment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main render function
  const renderContent = () => {
    switch (activeView) {
      case 'campaigns':
        return <CampaignWorkspace activeView="campaigns" />;
      case 'templates':
        return <CampaignWorkspace activeView="templates" />;
      case 'reports':
        return <ReportsView />;
      case 'audience':
        return <AudienceView />;
      default:
        return <CampaignWorkspace activeView="campaigns" />;
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>🚀 SmartJourney</h2>
          <p>AI Campaign Platform</p>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeView === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveView('campaigns')}
          >
            📧 Campaigns
          </button>
          <button 
            className={`nav-item ${activeView === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveView('templates')}
          >
            📝 Templates
          </button>
          <button 
            className={`nav-item ${activeView === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveView('reports')}
          >
            📊 Reports
          </button>
          <button 
            className={`nav-item ${activeView === 'audience' ? 'active' : ''}`}
            onClick={() => setActiveView('audience')}
          >
            👥 Audience
          </button>
        </nav>
      </div>
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;