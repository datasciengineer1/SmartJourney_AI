import React, { useState, useEffect } from 'react';
import CampaignEditor from './CampaignEditor';
import InfoTooltip from './InfoTooltip';
import './CampaignWorkspace.css';

const CampaignWorkspace = ({ activeView }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  // Storage key for localStorage
  const STORAGE_KEY = 'smartjourney_campaigns';

  // Fallback sample campaigns data
  const fallbackCampaigns = [
    {
      id: 1,
      name: "Welcome Series - New Users",
      subject: "Welcome to SmartJourney! 🚀",
      content: {
        subject: "Welcome to SmartJourney! 🚀",
        body: "Hi there! Welcome to SmartJourney AI Platform. We're excited to help you create amazing campaigns that convert! Our AI-powered tools will help you optimize every aspect of your email marketing."
      },
      status: "active",
      audience: "new",
      metrics: { sent: 1250, opened: 875, clicked: 234, converted: 45 },
      created_at: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      name: "Product Launch - AI Features",
      subject: "🤖 New AI Features Are Here!",
      content: {
        subject: "🤖 New AI Features Are Here!",
        body: "Discover our latest AI-powered features that will revolutionize your campaign management experience. From smart subject line optimization to predictive analytics, we've got you covered."
      },
      status: "sent",
      audience: "active",
      metrics: { sent: 3200, opened: 2240, clicked: 672, converted: 128 },
      created_at: "2024-01-10T14:30:00Z"
    },
    {
      id: 3,
      name: "Monthly Newsletter - January",
      subject: "Your January Success Report 📊",
      content: {
        subject: "Your January Success Report 📊",
        body: "Here's what happened in January and what's coming next month. Your campaigns performed exceptionally well with above-average engagement rates across all segments."
      },
      status: "draft",
      audience: "all",
      metrics: { sent: 0, opened: 0, clicked: 0, converted: 0 },
      created_at: "2024-01-20T16:45:00Z"
    },
    {
      id: 4,
      name: "Re-engagement Campaign",
      subject: "We miss you! Come back for exclusive offers 💝",
      content: {
        subject: "We miss you! Come back for exclusive offers 💝",
        body: "It's been a while since we've heard from you. We have some exciting updates and exclusive offers just for you. Don't miss out on what's new!"
      },
      status: "scheduled",
      audience: "inactive",
      metrics: { sent: 0, opened: 0, clicked: 0, converted: 0 },
      created_at: "2024-01-22T09:15:00Z"
    },
    {
      id: 5,
      name: "Holiday Sale Announcement",
      subject: "🎉 Holiday Sale: Up to 50% Off Everything!",
      content: {
        subject: "🎉 Holiday Sale: Up to 50% Off Everything!",
        body: "Our biggest sale of the year is here! Get up to 50% off on all premium features. Limited time offer - don't wait, upgrade today and save big!"
      },
      status: "sent",
      audience: "all",
      metrics: { sent: 5200, opened: 4160, clicked: 1248, converted: 312 },
      created_at: "2024-01-05T11:30:00Z"
    }
  ];

  // Fallback templates data
  const fallbackTemplates = [
    {
      id: 1,
      name: "Welcome Email Template",
      category: "Onboarding",
      subject: "Welcome to [Company Name]! 🎉",
      preview: "A warm welcome email for new subscribers with clear next steps and value proposition.",
      content: {
        subject: "Welcome to [Company Name]! 🎉",
        body: "Hi [First Name],\n\nWelcome to [Company Name]! We're thrilled to have you join our community of successful marketers.\n\nHere's what you can expect:\n• Personalized campaign recommendations\n• AI-powered optimization tips\n• 24/7 customer support\n\nReady to get started? Click the button below to create your first campaign!\n\n[Get Started Button]\n\nBest regards,\nThe [Company Name] Team"
      },
      tags: ["welcome", "onboarding", "new-user"],
      usage_count: 45
    },
    {
      id: 2,
      name: "Product Launch Template",
      category: "Announcement",
      subject: "🚀 Introducing [Product Name]",
      preview: "Professional product launch template with features, benefits, and clear call-to-action.",
      content: {
        subject: "🚀 Introducing [Product Name]",
        body: "We're excited to announce the launch of [Product Name]!\n\nAfter months of development and testing, we're proud to bring you a solution that will transform how you [solve problem].\n\nKey Features:\n• [Feature 1] - [Benefit]\n• [Feature 2] - [Benefit]\n• [Feature 3] - [Benefit]\n\nSpecial Launch Offer: Get 30% off for the first 100 customers!\n\n[Learn More Button] [Get Started Button]\n\nQuestions? Reply to this email - we'd love to hear from you!"
      },
      tags: ["launch", "product", "announcement"],
      usage_count: 23
    },
    {
      id: 3,
      name: "Newsletter Template",
      category: "Newsletter",
      subject: "[Month] Newsletter - [Company Name]",
      preview: "Monthly newsletter template with sections for updates, tips, and community highlights.",
      content: {
        subject: "[Month] Newsletter - [Company Name]",
        body: "Hi [First Name],\n\nHere's what's new this month at [Company Name]!\n\n📈 Company Updates\n• [Update 1]\n• [Update 2]\n• [Update 3]\n\n💡 Tips & Tricks\n• [Tip 1]: [Description]\n• [Tip 2]: [Description]\n• [Tip 3]: [Description]\n\n🌟 Community Spotlight\nThis month we're featuring [Customer Name] who achieved [Achievement] using our platform!\n\n📅 Upcoming Events\n• [Event 1] - [Date]\n• [Event 2] - [Date]\n\nThat's all for now. See you next month!\n\nBest,\nThe [Company Name] Team"
      },
      tags: ["newsletter", "monthly", "updates"],
      usage_count: 67
    },
    {
      id: 4,
      name: "Re-engagement Campaign",
      category: "Retention",
      subject: "We miss you! Come back for exclusive offers 💝",
      preview: "Win back inactive subscribers with special incentives and personalized content.",
      content: {
        subject: "We miss you! Come back for exclusive offers 💝",
        body: "Hi [First Name],\n\nWe noticed you haven't opened our emails lately. We miss you!\n\nAs a valued subscriber, we want to make sure you're getting the most out of [Company Name]. Here's what you might have missed:\n\n• New AI features that save 5+ hours per week\n• Advanced analytics dashboard\n• Priority customer support\n\nAs a welcome back gift, here's an exclusive 20% discount on any premium plan:\n\nUse code: COMEBACK20\n\n[Claim Discount Button]\n\nThis offer expires in 48 hours, so don't wait!\n\nWe'd love to have you back,\nThe [Company Name] Team\n\nP.S. If you no longer wish to receive emails, you can [unsubscribe here]."
      },
      tags: ["re-engagement", "discount", "retention"],
      usage_count: 31
    },
    {
      id: 5,
      name: "Event Invitation",
      category: "Events",
      subject: "🎉 You're Invited: [Event Name]",
      preview: "Professional event invitation template with RSVP functionality and event details.",
      content: {
        subject: "🎉 You're Invited: [Event Name]",
        body: "Dear [First Name],\n\nYou're cordially invited to [Event Name]!\n\nJoin us for an exclusive event where we'll be sharing:\n• Latest industry insights\n• Networking opportunities\n• Live product demonstrations\n• Q&A with our expert team\n\n📅 Date: [Date]\n🕐 Time: [Time]\n📍 Location: [Location]\n🎟️ Admission: [Free/Paid]\n\nSpaces are limited, so please RSVP by [RSVP Date].\n\n[RSVP Yes Button] [RSVP No Button]\n\nCan't make it in person? We'll also be live streaming the event!\n\n[Join Live Stream Button]\n\nLooking forward to seeing you there!\n\nBest regards,\n[Your Name]\n[Company Name]"
      },
      tags: ["event", "invitation", "rsvp"],
      usage_count: 18
    },
    {
      id: 6,
      name: "Abandoned Cart Recovery",
      category: "E-commerce",
      subject: "Don't forget your items! Complete your purchase 🛒",
      preview: "Recover abandoned carts with personalized reminders and incentives.",
      content: {
        subject: "Don't forget your items! Complete your purchase 🛒",
        body: "Hi [First Name],\n\nYou left some great items in your cart! Don't let them get away.\n\nYour Cart:\n• [Product 1] - [Price]\n• [Product 2] - [Price]\n• [Product 3] - [Price]\n\nTotal: [Total Price]\n\nComplete your purchase now and get FREE shipping on orders over $50!\n\n[Complete Purchase Button]\n\nHurry! These items are popular and may sell out soon.\n\nNeed help? Reply to this email or call us at [Phone Number].\n\nHappy shopping!\nThe [Company Name] Team"
      },
      tags: ["ecommerce", "cart-recovery", "sales"],
      usage_count: 89
    }
  ];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load from localStorage first
      const storedCampaigns = localStorage.getItem(STORAGE_KEY);
      if (storedCampaigns) {
        const parsedCampaigns = JSON.parse(storedCampaigns);
        setCampaigns(parsedCampaigns);
      } else {
        setCampaigns(fallbackCampaigns);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackCampaigns));
      }

      // Try to fetch from backend
      const [campaignsRes, templatesRes] = await Promise.all([
        fetch('http://localhost:8000/campaigns').catch(() => null),
        fetch('http://localhost:8000/templates').catch(() => null)
      ]);

      if (campaignsRes && campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        const backendCampaigns = campaignsData.campaigns || fallbackCampaigns;
        setCampaigns(backendCampaigns);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(backendCampaigns));
      }

      if (templatesRes && templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData.templates || fallbackTemplates);
      } else {
        setTemplates(fallbackTemplates);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      const storedCampaigns = localStorage.getItem(STORAGE_KEY);
      if (storedCampaigns) {
        setCampaigns(JSON.parse(storedCampaigns));
      } else {
        setCampaigns(fallbackCampaigns);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackCampaigns));
      }
      setTemplates(fallbackTemplates);
    }
    setLoading(false);
  };

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setShowEditor(true);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setShowEditor(true);
  };

  const handleUseTemplate = (template) => {
    const newCampaign = {
      name: `Campaign from ${template.name}`,
      subject: template.subject,
      content: template.content,
      status: 'draft',
      audience: 'all'
    };
    setEditingCampaign(newCampaign);
    setShowEditor(true);
  };

  const handleSaveCampaign = async (campaignData) => {
    try {
      let updatedCampaigns;
      if (editingCampaign?.id) {
        // Update existing campaign
        updatedCampaigns = campaigns.map(c => 
          c.id === editingCampaign.id ? { ...campaignData, id: editingCampaign.id } : c
        );
      } else {
        // Create new campaign
        const newCampaign = { 
          ...campaignData, 
          id: Date.now(),
          created_at: new Date().toISOString(),
          metrics: { sent: 0, opened: 0, clicked: 0, converted: 0 }
        };
        updatedCampaigns = [...campaigns, newCampaign];
      }
      
      setCampaigns(updatedCampaigns);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCampaigns));

      // Try to sync with backend
      try {
        const method = editingCampaign?.id ? 'PUT' : 'POST';
        const url = editingCampaign?.id 
          ? `http://localhost:8000/campaigns/${editingCampaign.id}`
          : 'http://localhost:8000/campaigns';
        
        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaignData)
        });
      } catch (backendError) {
        console.log('Backend sync failed, but campaign saved locally');
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
    
    setShowEditor(false);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = async (campaignId) => {
    try {
      const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
      setCampaigns(updatedCampaigns);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCampaigns));

      // Try to sync with backend
      try {
        await fetch(`http://localhost:8000/campaigns/${campaignId}`, {
          method: 'DELETE'
        });
      } catch (backendError) {
        console.log('Backend sync failed, but campaign deleted locally');
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
    
    setShowEditor(false);
    setEditingCampaign(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'sent': return '#3b82f6';
      case 'draft': return '#f59e0b';
      case 'scheduled': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (showEditor) {
    return (
      <CampaignEditor
        campaign={editingCampaign}
        onSave={handleSaveCampaign}
        onCancel={() => setShowEditor(false)}
        onDelete={handleDeleteCampaign}
      />
    );
  }

  if (loading) {
    return (
      <div className="workspace-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading {activeView}...</p>
        </div>
      </div>
    );
  }

  // Show only campaigns
  if (activeView === 'campaigns') {
    return (
      <div className="workspace-content">
        <div className="workspace-header">
          <div className="header-title">
            <h1>Email Campaigns</h1>
            <InfoTooltip content="Create, manage, and optimize your email campaigns with AI-powered insights. Track performance metrics and improve engagement rates." />
          </div>
          <button className="create-btn" onClick={handleCreateCampaign}>
            + New Campaign
          </button>
        </div>

        <div className="campaigns-section">
          <div className="section-header">
            <h2>Your Campaigns ({campaigns.length})</h2>
            <InfoTooltip content="Manage your active, draft, and completed email campaigns. Click on any campaign to edit or view detailed analytics." />
          </div>
          
          {campaigns.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📧</div>
              <h3>No campaigns yet</h3>
              <p>Create your first campaign to get started with AI-powered email marketing!</p>
              <button className="create-btn" onClick={handleCreateCampaign}>
                Create Your First Campaign
              </button>
            </div>
          ) : (
            <div className="campaigns-grid">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="campaign-card sample-card">
                  <div className="card-header">
                    <h3>{campaign.name}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(campaign.status) }}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  <div className="card-content">
                    <div className="campaign-subject">{campaign.subject}</div>
                    <div className="campaign-preview">
                      {campaign.content?.body?.substring(0, 120)}...
                    </div>
                    <div className="campaign-meta">
                      <span className="audience-tag">👥 {campaign.audience}</span>
                      <span className="date-tag">📅 {formatDate(campaign.created_at)}</span>
                    </div>
                    <div className="campaign-metrics">
                      <div className="metric-item">
                        <span className="metric-icon">📧</span>
                        <span className="metric-value">{campaign.metrics?.sent || 0}</span>
                        <span className="metric-label">Sent</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-icon">📖</span>
                        <span className="metric-value">{campaign.metrics?.opened || 0}</span>
                        <span className="metric-label">Opened</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-icon">👆</span>
                        <span className="metric-value">{campaign.metrics?.clicked || 0}</span>
                        <span className="metric-label">Clicked</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-icon">✅</span>
                        <span className="metric-value">{campaign.metrics?.converted || 0}</span>
                        <span className="metric-label">Converted</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditCampaign(campaign)}
                    >
                      Edit Campaign
                    </button>
                    <button 
                      className="view-btn"
                      onClick={() => alert(`Viewing analytics for: ${campaign.name}`)}
                    >
                      View Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show only templates
  if (activeView === 'templates') {
    return (
      <div className="workspace-content">
        <div className="workspace-header">
          <div className="header-title">
            <h1>Campaign Templates</h1>
            <InfoTooltip content="Pre-built templates to jumpstart your campaigns. Click 'Use Template' to create a new campaign based on any template." />
          </div>
          <button className="create-btn" onClick={handleCreateCampaign}>
            + New Campaign
          </button>
        </div>

        <div className="campaigns-section">
          <div className="section-header">
            <h2>Available Templates ({templates.length})</h2>
            <InfoTooltip content="Choose from professionally designed templates optimized for different campaign types and industries." />
          </div>
          
          {templates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No templates available</h3>
              <p>Templates will appear here once loaded from the server.</p>
            </div>
          ) : (
            <div className="campaigns-grid">
              {templates.map(template => (
                <div key={template.id} className="campaign-card template-card">
                  <div className="card-header">
                    <h3>{template.name}</h3>
                    <span className="template-category">{template.category}</span>
                  </div>
                  <div className="card-content">
                    <div className="template-subject">{template.subject}</div>
                    <div className="template-preview">{template.preview}</div>
                    <div className="template-tags">
                      {template.tags?.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                    <div className="usage-stats">
                      <span className="usage-icon">📊</span>
                      Used {template.usage_count} times
                    </div>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="use-template-btn"
                      onClick={() => handleUseTemplate(template)}
                    >
                      Use Template
                    </button>
                    <button 
                      className="preview-btn"
                      onClick={() => alert(`Template Preview:\n\nSubject: ${template.subject}\n\nContent:\n${template.content.body}`)}
                    >
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default CampaignWorkspace;