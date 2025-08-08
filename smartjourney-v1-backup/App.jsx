import React, { useState, useEffect } from 'react';
import './App.css';
import './EnhancedAnalytics.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [campaigns, setCampaigns] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'email',
    target_audience: '',
    content: { subject: '', body: '' },
    channels: ['email'],
    budget: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchCampaigns();
    fetchAnalytics();
    generateAIInsights();
  }, []);

  const fetchCampaigns = async () => {
  try {
    const response = await fetch('http://localhost:8000/campaigns');
    const data = await response.json();
    setCampaigns(data.campaigns || []); // ✅ This is correct
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    setCampaigns([]); // ✅ Set empty array on error
  }
};

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:8000/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const generateAIInsights = async () => {
    const insights = [
      {
        type: 'performance',
        icon: '📈',
        title: 'Campaign Performance',
        insight: 'Your email campaigns are performing 23% above industry average',
        action: 'Consider increasing budget for email campaigns by 15-20%',
        priority: 'high',
        impact: 'High ROI potential'
      },
      {
        type: 'audience',
        icon: '🎯',
        title: 'Audience Optimization',
        insight: 'Tech-savvy professionals show highest engagement rates (18.5%)',
        action: 'Create more content targeting this segment with technical language',
        priority: 'medium',
        impact: 'Medium engagement boost'
      },
      {
        type: 'timing',
        icon: '⏰',
        title: 'Optimal Timing',
        insight: 'Tuesday 10 AM shows 40% higher open rates than other times',
        action: 'Schedule future campaigns for Tuesday mornings',
        priority: 'high',
        impact: 'Immediate improvement'
      },
      {
        type: 'content',
        icon: '✍️',
        title: 'Content Strategy',
        insight: 'Campaigns with personalized subject lines perform 2x better',
        action: 'Use AI suggestions for personalized content creation',
        priority: 'medium',
        impact: 'Long-term growth'
      },
      {
        type: 'budget',
        icon: '💰',
        title: 'Budget Allocation',
        insight: 'Social media campaigns have 35% lower cost per conversion',
        action: 'Reallocate 20% budget from email to social media channels',
        priority: 'low',
        impact: 'Cost optimization'
      }
    ];

    setAiInsights(insights);
  };

  /* Add AI Recommendations */

  const applyAIRecommendations = async () => {
    setLoading(true);
    try {
      const campaignData = JSON.stringify({
        total_campaigns: analytics?.total_campaigns || 0,
        active_campaigns: analytics?.active_campaigns || 0,
        total_budget: analytics?.total_budget || 0,
        campaign_types: analytics?.campaign_types || {}
      });
  
      const response = await fetch('http://localhost:8000/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaign_data: campaignData })
      });
  
      const data = await response.json();
      
      if (data.suggestions) {
        // Update AI insights with new recommendations
        const newInsights = data.suggestions.map((suggestion, index) => ({
          type: 'ai_recommendation',
          icon: '🤖',
          title: `AI Recommendation ${index + 1}`,
          insight: suggestion,
          action: 'Consider implementing this recommendation',
          priority: 'medium',
          impact: 'AI-generated improvement'
        }));
        
        setAiInsights(prev => [...newInsights, ...prev.slice(0, 3)]); // Add new ones, keep top 3 old ones
        alert('✅ New AI recommendations generated!');
      }
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      alert('❌ Failed to get AI recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  /*end of AI Recommendations */

  const getAISuggestions = async (field, context = '') => {
    setAiLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          context: context || formData.name || 'marketing campaign',
          campaign_type: formData.type,
          target_audience: formData.target_audience || 'general audience'
        })
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.status}`);
      }

      const data = await response.json();
      return data.suggestions;
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      setError('AI suggestions temporarily unavailable. Check if backend is running.');
      return ['AI suggestions temporarily unavailable'];
    } finally {
      setAiLoading(false);
    }
  };

  const handleAISuggestion = async (field) => {
    const suggestions = await getAISuggestions(field);
    if (suggestions && suggestions.length > 0) {
      const suggestion = suggestions[0];
      if (field === 'name') {
        setFormData(prev => ({ ...prev, name: suggestion }));
      } else if (field === 'subject') {
        setFormData(prev => ({ 
          ...prev, 
          content: { ...prev.content, subject: suggestion }
        }));
      } else if (field === 'body') {
        setFormData(prev => ({ 
          ...prev, 
          content: { ...prev.content, body: suggestion }
        }));
      } else if (field === 'target_audience') {
        setFormData(prev => ({ ...prev, target_audience: suggestion }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = editingCampaign 
        ? `http://localhost:8000/campaigns/${editingCampaign.id}`
        : 'http://localhost:8000/campaigns';

      const method = editingCampaign ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingCampaign ? 'update' : 'create'} campaign`);
      }

      await fetchCampaigns();
      await fetchAnalytics();
      resetForm();
    } catch (error) {
      console.error('Error saving campaign:', error);
      setError(`Failed to ${editingCampaign ? 'update' : 'create'} campaign. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'email',
      target_audience: '',
      content: { subject: '', body: '' },
      channels: ['email'],
      budget: '',
      start_date: '',
      end_date: ''
    });
    setEditingCampaign(null);
  };

  const editCampaign = (campaign) => {
    setFormData(campaign);
    setEditingCampaign(campaign);
    setActiveTab('campaigns');
  };

  const deleteCampaign = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const response = await fetch(`http://localhost:8000/campaigns/${id}`, { 
        method: 'DELETE' 
      });

      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }

      await fetchCampaigns();
      await fetchAnalytics();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setError('Failed to delete campaign. Please try again.');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const renderAnalytics = () => (
    <div className="enhanced-analytics">
      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>{analytics?.total_campaigns || 0}</h3>
            <p>Total Campaigns</p>
            <span className="metric-change positive">+12% this month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <h3>{analytics?.active_campaigns || 0}</h3>
            <p>Active Campaigns</p>
            <span className="metric-change positive">+5% this week</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>${analytics?.total_budget || 0}</h3>
            <p>Total Budget</p>
            <span className="metric-change neutral">Same as last month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>{analytics?.avg_engagement || '0%'}</h3>
            <p>Avg Engagement</p>
            <span className="metric-change positive">+3.2% this month</span>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="ai-insights-section">
        <div className="section-header">
          <h2>🤖 AI-Powered Insights & Recommendations</h2>
          <p>Smart recommendations based on your campaign performance data</p>
        </div>

        <div className="insights-grid">
          {aiInsights.map((insight, index) => (
            <div key={index} className="insight-card">
              <div className="insight-header">
                <span className="insight-icon">{insight.icon}</span>
                <div className="insight-title-section">
                  <h3>{insight.title}</h3>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(insight.priority) }}
                  >
                    {insight.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>

              <div className="insight-content">
                <p className="insight-text">
                  <strong>📊 Analysis:</strong> {insight.insight}
                </p>
                <div className="insight-action">
                  <strong>💡 Recommendation:</strong>
                  <p>{insight.action}</p>
                </div>
                <div className="insight-impact">
                  <strong>🎯 Expected Impact:</strong>
                  <p>{insight.impact}</p>
                </div>
              </div>

              <div className="insight-footer">
                <button className="apply-insight-btn"
                onClick={applyAIRecommendations}
                disabled={loading}>
                  ✅ Apply Recommendation
                </button>
                <button className="dismiss-btn">❌ Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="performance-section">
        <h2>📊 Campaign Performance Trends</h2>
        <div className="chart-container">
          <div className="simple-chart">
            {analytics?.monthly_trends?.map((trend, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar" 
                  style={{ 
                    height: `${(trend.engagement / 20) * 100}%`,
                    backgroundColor: '#3498db'
                  }}
                ></div>
                <span className="bar-label">{trend.month}</span>
                <span className="bar-value">{trend.engagement}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Types Distribution */}
      <div className="distribution-section">
        <h2>📈 Campaign Types Performance</h2>
        <div className="campaign-types">
          {Object.entries(analytics?.campaign_types || {}).map(([type, count]) => (
            <div key={type} className="campaign-type-card">
              <div className="type-header">
                <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                <span className="count-badge">{count} campaigns</span>
              </div>
              <div className="type-metrics">
                <div className="metric">
                  <span>Avg. Engagement:</span>
                  <strong>{Math.floor(Math.random() * 20 + 10)}%</strong>
                </div>
                <div className="metric">
                  <span>Conversion Rate:</span>
                  <strong>{Math.floor(Math.random() * 10 + 5)}%</strong>
                </div>
                <div className="metric">
                  <span>ROI:</span>
                  <strong>{Math.floor(Math.random() * 300 + 150)}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="campaigns-section">
      <div className="campaigns-header">
        <h2>🚀 Campaign Management</h2>
        <p>Create and manage your marketing campaigns with AI assistance</p>
      </div>

      {error && (
        <div className="error-message">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="campaign-form">
        <div className="form-row">
          <div className="form-group">
            <label>Campaign Name</label>
            <div className="input-with-ai">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter campaign name"
                required
              />
              <button 
                type="button" 
                className="ai-suggest-btn"
                onClick={() => handleAISuggestion('name')}
                disabled={aiLoading}
              >
                {aiLoading ? '⏳' : '✨'} AI Suggest
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Campaign Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="email">Email Marketing</option>
              <option value="social">Social Media</option>
              <option value="ppc">Pay-Per-Click</option>
              <option value="content">Content Marketing</option>
              <option value="influencer">Influencer Marketing</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Target Audience</label>
            <div className="input-with-ai">
              <input
                type="text"
                value={formData.target_audience}
                onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                placeholder="Describe your target audience"
                required
              />
              <button 
                type="button" 
                className="ai-suggest-btn"
                onClick={() => handleAISuggestion('target_audience')}
                disabled={aiLoading}
              >
                {aiLoading ? '⏳' : '✨'} AI Suggest
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Budget</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="Campaign budget"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Subject Line</label>
          <div className="input-with-ai">
            <input
              type="text"
              value={formData.content?.subject || ''} // ✅ Safe access
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                content: { ...prev.content, subject: e.target.value }
              }))}
              placeholder="Email subject line"
            />
            <button 
              type="button" 
              className="ai-suggest-btn"
              onClick={() => handleAISuggestion('subject')}
              disabled={aiLoading}
            >
              {aiLoading ? '⏳' : '✨'} AI Suggest
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Campaign Content</label>
          <div className="textarea-with-ai">
            <textarea
              value={formData.content?.body || ''} // ✅ Safe access
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                content: { ...prev.content, body: e.target.value }
              }))}
              placeholder="Campaign content and message"
              rows="4"
            />
            <button 
              type="button" 
              className="ai-suggest-btn"
              onClick={() => handleAISuggestion('body')}
              disabled={aiLoading}
            >
              {aiLoading ? '⏳' : '✨'} AI Suggest
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '⏳ Processing...' : (editingCampaign ? '📝 Update Campaign' : '🚀 Create Campaign')}
          </button>
          {editingCampaign && (
            <button type="button" onClick={resetForm} className="cancel-btn">
              ❌ Cancel
            </button>
          )}
        </div>
      </form>

      <div className="campaigns-list">
        <h3>📋 Your Campaigns</h3>
        {campaigns.length === 0 ? (
          <p className="no-campaigns">No campaigns yet. Create your first campaign above!</p>
        ) : (
          <div className="campaigns-grid">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="campaign-card">
                <div className="campaign-header">
                  <h4>{campaign.name}</h4>
                  <span className="campaign-type">{campaign.type}</span>
                </div>
                <div className="campaign-details">
                  <p><strong>Audience:</strong> {campaign.target_audience}</p>
                  <p><strong>Budget:</strong> ${campaign.budget || 'Not set'}</p>
                  <p><strong>Status:</strong> {campaign.status}</p>
                </div>
                <div className="campaign-actions">
                  <button onClick={() => editCampaign(campaign)} className="edit-btn">
                    ✏️ Edit
                  </button>
                  <button onClick={() => deleteCampaign(campaign.id)} className="delete-btn">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 SmartJourney AI</h1>
        <p>AI-Powered Campaign Management Platform</p>
      </header>

      <nav className="app-nav">
        <button 
          className={activeTab === 'analytics' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('analytics')}
        >
          📊 AI Analytics
        </button>
        <button 
          className={activeTab === 'campaigns' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('campaigns')}
        >
          🚀 Campaigns
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'campaigns' && renderCampaigns()}
      </main>
    </div>
  );
};

export default App;
