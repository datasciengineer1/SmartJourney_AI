import React, { useState, useEffect } from 'react';
import './CampaignEditor.css';

const CampaignEditor = ({ campaign, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: { subject: '', body: '' },
    audience: 'all',
    budget: '',
    budgetType: 'total',
    status: 'draft',
    scheduled_date: '',
    scheduled_time: ''
  });
  
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeField, setActiveField] = useState('');
  const [showGenAI, setShowGenAI] = useState(false);
  const [genAIPrompt, setGenAIPrompt] = useState('');
  const [genAILoading, setGenAILoading] = useState(false);

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name || '',
        subject: campaign.subject || campaign.content?.subject || '',
        content: {
          subject: campaign.content?.subject || campaign.subject || '',
          body: campaign.content?.body || ''
        },
        audience: campaign.audience || 'all',
        budget: campaign.budget || '',
        budgetType: campaign.budgetType || 'total',
        status: campaign.status || 'draft',
        scheduled_date: campaign.scheduled_date || '',
        scheduled_time: campaign.scheduled_time || ''
      });
    }
  }, [campaign]);

  const handleInputChange = (field, value) => {
    if (field === 'subject') {
      setFormData(prev => ({
        ...prev,
        subject: value,
        content: { ...prev.content, subject: value }
      }));
    } else if (field === 'body') {
      setFormData(prev => ({
        ...prev,
        content: { ...prev.content, body: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Trigger AI suggestions when content changes
    if (field === 'subject' || field === 'body') {
      setActiveField(field);
      generateAISuggestions(field, value);
    }
  };

  const getAudienceSize = () => {
    const audienceSizes = {
      'all': 12450,
      'new': 1890,
      'active': 8920,
      'vip': 890,
      'inactive': 2150
    };
    return audienceSizes[formData.audience] || 12450;
  };

  const generateAISuggestions = async (field, value) => {
    if (!value || value.length < 5) {
      setAiSuggestions([]);
      return;
    }

    setLoadingAI(true);
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (field === 'subject') {
        setAiSuggestions([
          {
            type: 'subject',
            text: `${value} - Limited Time Offer!`,
            reason: 'Adding urgency can increase open rates by 15%',
            confidence: 89
          },
          {
            type: 'subject',
            text: `🎉 ${value}`,
            reason: 'Emojis can improve visibility in inbox by 25%',
            confidence: 76
          },
          {
            type: 'subject',
            text: `[First Name], ${value.toLowerCase()}`,
            reason: 'Personalization increases engagement by 18%',
            confidence: 92
          },
          {
            type: 'subject',
            text: `${value} (Expires Tonight!)`,
            reason: 'Time-sensitive language creates urgency',
            confidence: 84
          }
        ]);
      } else if (field === 'body') {
        setAiSuggestions([
          {
            type: 'body',
            text: `Hi [First Name],\n\n${value}\n\nBest regards,\nThe SmartJourney Team`,
            reason: 'Adding personalization and proper greeting increases engagement',
            confidence: 88
          },
          {
            type: 'body',
            text: `${value}\n\n🎯 Ready to get started?\n\n[Get Started Button]\n\nQuestions? Reply to this email - we're here to help!`,
            reason: 'Clear call-to-action and support offer improves click rates',
            confidence: 91
          },
          {
            type: 'body',
            text: `${value}\n\n⏰ This exclusive offer expires in 48 hours!\n\nDon't miss out - claim your spot now:\n[Claim Now Button]`,
            reason: 'Adding urgency and scarcity can boost conversions by 23%',
            confidence: 85
          },
          {
            type: 'body',
            text: `Dear [First Name],\n\n${value}\n\nP.S. As a valued subscriber, you get early access to all our new features!\n\nCheers,\nThe Team`,
            reason: 'Personal touch with VIP treatment increases loyalty',
            confidence: 79
          }
        ]);
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    }
    setLoadingAI(false);
  };

  const applySuggestion = (suggestion) => {
    if (suggestion.type === 'subject') {
      handleInputChange('subject', suggestion.text);
    } else if (suggestion.type === 'body') {
      handleInputChange('body', suggestion.text);
    }
    setAiSuggestions([]);
  };

  const handleGenAI = async () => {
    if (!genAIPrompt.trim()) return;
    
    setGenAILoading(true);
    try {
      // Simulate Gen AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedContent = generateContentFromPrompt(genAIPrompt);
      
      // Apply generated content
      setFormData(prev => ({
        ...prev,
        subject: generatedContent.subject,
        content: {
          subject: generatedContent.subject,
          body: generatedContent.body
        }
      }));
      
      setShowGenAI(false);
      setGenAIPrompt('');
    } catch (error) {
      console.error('Error with Gen AI:', error);
    }
    setGenAILoading(false);
  };

  const generateContentFromPrompt = (prompt) => {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('welcome') || promptLower.includes('onboard')) {
      return {
        subject: "Welcome to SmartJourney! Let's get you started 🚀",
        body: `Hi [First Name],\n\nWelcome to SmartJourney! We're thrilled to have you join thousands of marketers who are already seeing amazing results.\n\nHere's what you can do right now:\n• Create your first AI-powered campaign\n• Explore our template library\n• Set up audience segments\n\nReady to transform your email marketing?\n\n[Get Started Button]\n\nNeed help? Our support team is here 24/7.\n\nBest regards,\nThe SmartJourney Team`
      };
    } else if (promptLower.includes('product') || promptLower.includes('launch')) {
      return {
        subject: "🚀 Introducing Our Game-Changing New Feature!",
        body: `Hi [First Name],\n\nAfter months of development, we're excited to announce our latest breakthrough!\n\nIntroducing: AI-Powered Campaign Optimization\n\n✨ What's new:\n• Real-time performance predictions\n• Automatic A/B testing\n• Smart send-time optimization\n• Personalized content suggestions\n\nEarly access starts today for our valued customers like you.\n\n[Try It Now Button]\n\nQuestions? Hit reply - we'd love to hear from you!\n\nCheers,\nThe Product Team`
      };
    } else if (promptLower.includes('sale') || promptLower.includes('discount') || promptLower.includes('offer')) {
      return {
        subject: "🎉 Exclusive 48-Hour Flash Sale - Up to 50% Off!",
        body: `Hi [First Name],\n\nWe're celebrating and you're invited to the party!\n\n🎊 FLASH SALE ALERT 🎊\nUp to 50% off all premium plans\n\n⏰ This exclusive offer expires in 48 hours!\n\nWhat you get:\n• All premium features unlocked\n• Priority customer support\n• Advanced analytics dashboard\n• Unlimited campaigns\n\nUse code: FLASH50\n\n[Claim Your Discount Button]\n\nDon't wait - this deal won't last long!\n\nHappy saving,\nThe SmartJourney Team`
      };
    } else if (promptLower.includes('newsletter') || promptLower.includes('update')) {
      return {
        subject: "📊 Your Monthly Success Report + What's Coming Next",
        body: `Hi [First Name],\n\nHere's your monthly roundup of wins and what's on the horizon!\n\n📈 This Month's Highlights:\n• 25% increase in average open rates\n• New AI features launched\n• 500+ new templates added\n• Customer success stories\n\n🔮 Coming Next Month:\n• Advanced segmentation tools\n• Integration with popular CRMs\n• Mobile app improvements\n\n💡 Pro Tip: Try our new subject line optimizer - it's boosting open rates by 30%!\n\n[Explore New Features Button]\n\nAs always, we're here if you need anything.\n\nBest,\nThe SmartJourney Team`
      };
    } else {
      return {
        subject: "Important Update from SmartJourney",
        body: `Hi [First Name],\n\n${prompt}\n\nWe hope this message finds you well and that you're seeing great results with your campaigns.\n\nIf you have any questions or need assistance, don't hesitate to reach out to our support team.\n\n[Contact Support Button]\n\nBest regards,\nThe SmartJourney Team`
      };
    }
  };

  const handleSave = () => {
    const campaignData = {
      ...formData,
      id: campaign?.id || Date.now(),
      created_at: campaign?.created_at || new Date().toISOString(),
      metrics: campaign?.metrics || { sent: 0, opened: 0, clicked: 0, converted: 0 }
    };
    onSave(campaignData);
  };

  const handleDelete = () => {
    if (campaign?.id && window.confirm('Are you sure you want to delete this campaign?')) {
      onDelete(campaign.id);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMinTime = () => {
    if (formData.scheduled_date === getMinDateTime()) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return '00:00';
  };

  return (
    <div className="campaign-editor">
      <div className="editor-header">
        <h1>{campaign ? 'Edit Campaign' : 'Create New Campaign'}</h1>
        <div className="editor-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          {campaign?.id && (
            <button className="delete-btn" onClick={handleDelete}>Delete</button>
          )}
          <button className="save-btn" onClick={handleSave}>Save Campaign</button>
        </div>
      </div>

      <div className="editor-content">
        <div className="editor-main">
          <div className="form-group">
            <label>Campaign Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter campaign name..."
            />
          </div>

          <div className="form-group">
            <label>Subject Line</label>
            <div className="input-with-ai">
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Enter email subject..."
                onFocus={() => setActiveField('subject')}
              />
              {loadingAI && activeField === 'subject' && (
                <div className="ai-loading-indicator">🤖</div>
              )}
            </div>
          </div>

          {/* NEW BUDGET SECTION */}
          <div className="form-row">
            <div className="form-group">
              <label>Campaign Budget</label>
              <div className="budget-input-group">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <small className="field-hint">Set your campaign spending limit (optional)</small>
            </div>
            <div className="form-group">
              <label>Budget Type</label>
              <select
                value={formData.budgetType}
                onChange={(e) => handleInputChange('budgetType', e.target.value)}
              >
                <option value="total">Total Budget</option>
                <option value="daily">Daily Budget</option>
                <option value="monthly">Monthly Budget</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Email Content</label>
            <div className="content-controls">
              <button 
                className="gen-ai-btn"
                onClick={() => setShowGenAI(true)}
                type="button"
              >
                ✨ Generate with AI
              </button>
            </div>
            <div className="input-with-ai">
              <textarea
                value={formData.content.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                placeholder="Write your email content here..."
                rows={12}
                onFocus={() => setActiveField('body')}
              />
              {loadingAI && activeField === 'body' && (
                <div className="ai-loading-indicator">🤖</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Audience</label>
              <select
                value={formData.audience}
                onChange={(e) => handleInputChange('audience', e.target.value)}
              >
                <option value="all">All Subscribers ({getAudienceSize().toLocaleString()})</option>
                <option value="new">New Subscribers (1,890)</option>
                <option value="active">Active Users (8,920)</option>
                <option value="vip">VIP Customers (890)</option>
                <option value="inactive">Inactive Users (2,150)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Send Now</option>
              </select>
            </div>
          </div>

          {formData.status === 'scheduled' && (
            <div className="scheduling-section">
              <h3>📅 Schedule Campaign</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
                    min={getMinDateTime()}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => handleInputChange('scheduled_time', e.target.value)}
                    min={getMinTime()}
                  />
                </div>
              </div>
              <div className="scheduling-tips">
                <p>💡 <strong>Best times to send:</strong> Tuesday-Thursday, 10 AM - 2 PM</p>
                <p>⏰ <strong>Avoid:</strong> Monday mornings and Friday afternoons</p>
              </div>
            </div>
          )}
        </div>

        <div className="ai-assistant">
          <div className="ai-header">
            <h3>🤖 AI Assistant</h3>
            {loadingAI && <div className="ai-loading-dot">●</div>}
          </div>

          {aiSuggestions.length > 0 && (
            <div className="ai-suggestions">
              <h4>💡 Smart Suggestions</h4>
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="suggestion-card">
                  <div className="suggestion-header">
                    <div className="suggestion-confidence">{suggestion.confidence}% match</div>
                  </div>
                  <div className="suggestion-text">{suggestion.text}</div>
                  <div className="suggestion-reason">{suggestion.reason}</div>
                  <button 
                    className="apply-btn"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    Apply Suggestion
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="ai-tips">
            <h4>📝 Writing Tips</h4>
            <div className="tip">
              <strong>Subject Lines:</strong> Keep under 50 characters for mobile
            </div>
            <div className="tip">
              <strong>Personalization:</strong> Use [First Name] for dynamic content
            </div>
            <div className="tip">
              <strong>Call-to-Action:</strong> Make it clear and compelling
            </div>
            <div className="tip">
              <strong>Budget:</strong> Recommended ${Math.ceil(getAudienceSize() * 0.05)} for {getAudienceSize().toLocaleString()} subscribers
            </div>
          </div>

          <div className="ai-metrics">
            <h4>📊 Predicted Performance</h4>
            <div className="metric-prediction">
              <span>Open Rate:</span>
              <span className="prediction-value">24.5%</span>
            </div>
            <div className="metric-prediction">
              <span>Click Rate:</span>
              <span className="prediction-value">3.2%</span>
            </div>
            <div className="metric-prediction">
              <span>Deliverability:</span>
              <span className="prediction-value">96.8%</span>
            </div>
            {formData.budget && (
              <div className="metric-prediction">
                <span>Est. Cost per Click:</span>
                <span className="prediction-value">${(parseFloat(formData.budget) / (getAudienceSize() * 0.032)).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gen AI Modal */}
      {showGenAI && (
        <div className="gen-ai-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>✨ Generate Email with AI</h3>
              <button 
                className="close-btn"
                onClick={() => setShowGenAI(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <label>Describe what you want to create:</label>
              <textarea
                value={genAIPrompt}
                onChange={(e) => setGenAIPrompt(e.target.value)}
                placeholder="e.g., 'Create a welcome email for new subscribers' or 'Write a product launch announcement for our new AI features'"
                rows={4}
              />
              <div className="prompt-examples">
                <h4>💡 Try these prompts:</h4>
                <div className="example-prompts">
                  <button 
                    className="example-btn"
                    onClick={() => setGenAIPrompt('Create a welcome email for new subscribers with onboarding steps')}
                  >
                    Welcome Email
                  </button>
                  <button 
                    className="example-btn"
                    onClick={() => setGenAIPrompt('Write a product launch announcement for our new AI features')}
                  >
                    Product Launch
                  </button>
                  <button 
                    className="example-btn"
                    onClick={() => setGenAIPrompt('Create a flash sale email with 50% discount offer')}
                  >
                    Flash Sale
                  </button>
                  <button 
                    className="example-btn"
                    onClick={() => setGenAIPrompt('Write a monthly newsletter with company updates')}
                  >
                    Newsletter
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowGenAI(false)}
              >
                Cancel
              </button>
              <button 
                className="generate-btn"
                onClick={handleGenAI}
                disabled={!genAIPrompt.trim() || genAILoading}
              >
                {genAILoading ? '🤖 Generating...' : '✨ Generate Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignEditor;