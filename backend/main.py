from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
from datetime import datetime, timedelta
import random

app = FastAPI(title="SmartJourney AI Platform", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample data
SAMPLE_CAMPAIGNS = [
    {
        "id": 1,
        "name": "Welcome Series - New Users",
        "subject": "Welcome to SmartJourney! 🚀",
        "content": {
            "subject": "Welcome to SmartJourney! 🚀",
            "body": "Hi there! Welcome to SmartJourney AI Platform. We're excited to help you create amazing campaigns..."
        },
        "status": "active",
        "audience": "new",
        "metrics": {"sent": 1250, "opened": 875, "clicked": 234, "converted": 45},
        "created_at": "2024-01-15T10:00:00Z",
        "send_time": "2024-01-16T09:00:00Z"
    },
    {
        "id": 2,
        "name": "Product Launch - AI Features",
        "subject": "🤖 New AI Features Are Here!",
        "content": {
            "subject": "🤖 New AI Features Are Here!",
            "body": "Discover our latest AI-powered features that will revolutionize your campaign management..."
        },
        "status": "sent",
        "audience": "active",
        "metrics": {"sent": 3200, "opened": 2240, "clicked": 672, "converted": 128},
        "created_at": "2024-01-10T14:30:00Z",
        "send_time": "2024-01-12T10:00:00Z"
    },
    {
        "id": 3,
        "name": "Monthly Newsletter - January",
        "subject": "Your January Success Report 📊",
        "content": {
            "subject": "Your January Success Report 📊",
            "body": "Here's what happened in January and what's coming next month..."
        },
        "status": "draft",
        "audience": "all",
        "metrics": {"sent": 0, "opened": 0, "clicked": 0, "converted": 0},
        "created_at": "2024-01-20T16:45:00Z",
        "send_time": ""
    }
]

SAMPLE_TEMPLATES = [
    {
        "id": 1,
        "name": "Welcome Email Template",
        "category": "Onboarding",
        "subject": "Welcome to [Company Name]! 🎉",
        "preview": "A warm welcome email for new subscribers with clear next steps and value proposition.",
        "content": {
            "subject": "Welcome to [Company Name]! 🎉",
            "body": "Hi [First Name],\n\nWelcome to [Company Name]! We're thrilled to have you join our community...\n\nBest regards,\nThe [Company Name] Team"
        },
        "tags": ["welcome", "onboarding", "new-user"],
        "usage_count": 45
    },
    {
        "id": 2,
        "name": "Product Launch Template",
        "category": "Announcement",
        "subject": "🚀 Introducing [Product Name]",
        "preview": "Professional product launch template with features, benefits, and clear call-to-action.",
        "content": {
            "subject": "🚀 Introducing [Product Name]",
            "body": "We're excited to announce the launch of [Product Name]!\n\nKey Features:\n• [Feature 1]\n• [Feature 2]\n• [Feature 3]\n\n[Call to Action Button]"
        },
        "tags": ["launch", "product", "announcement"],
        "usage_count": 23
    },
    {
        "id": 3,
        "name": "Newsletter Template",
        "category": "Newsletter",
        "subject": "[Month] Newsletter - [Company Name]",
        "preview": "Monthly newsletter template with sections for updates, tips, and community highlights.",
        "content": {
            "subject": "[Month] Newsletter - [Company Name]",
            "body": "This Month's Highlights:\n\n📈 Company Updates\n[Update content]\n\n💡 Tips & Tricks\n[Tips content]\n\n🌟 Community Spotlight\n[Community content]"
        },
        "tags": ["newsletter", "monthly", "updates"],
        "usage_count": 67
    }
]

# Pydantic models
class Campaign(BaseModel):
    id: Optional[int] = None
    name: str
    subject: str
    content: Dict[str, str]
    status: str = "draft"
    audience: str = "all"
    send_time: Optional[str] = None
    metrics: Optional[Dict[str, int]] = None

class AIFieldSuggestion(BaseModel):
    field: str
    currentValue: str
    campaignData: Dict[str, Any]
    context: str

# API Endpoints
@app.get("/")
async def root():
    return {"message": "SmartJourney AI Platform API", "version": "1.0.0"}

@app.get("/campaigns")
async def get_campaigns():
    return {"campaigns": SAMPLE_CAMPAIGNS}

@app.get("/campaigns/{campaign_id}")
async def get_campaign(campaign_id: int):
    campaign = next((c for c in SAMPLE_CAMPAIGNS if c["id"] == campaign_id), None)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@app.post("/campaigns")
async def create_campaign(campaign: Campaign):
    new_id = max([c["id"] for c in SAMPLE_CAMPAIGNS]) + 1
    campaign_data = campaign.dict()
    campaign_data["id"] = new_id
    campaign_data["created_at"] = datetime.now().isoformat()
    campaign_data["metrics"] = {"sent": 0, "opened": 0, "clicked": 0, "converted": 0}
    
    SAMPLE_CAMPAIGNS.append(campaign_data)
    return {"message": "Campaign created successfully", "campaign": campaign_data}

@app.put("/campaigns/{campaign_id}")
async def update_campaign(campaign_id: int, campaign: Campaign):
    existing_campaign = next((c for c in SAMPLE_CAMPAIGNS if c["id"] == campaign_id), None)
    if not existing_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    campaign_data = campaign.dict()
    campaign_data["id"] = campaign_id
    
    # Update the campaign in the list
    for i, c in enumerate(SAMPLE_CAMPAIGNS):
        if c["id"] == campaign_id:
            SAMPLE_CAMPAIGNS[i].update(campaign_data)
            break
    
    return {"message": "Campaign updated successfully", "campaign": campaign_data}

@app.delete("/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: int):
    global SAMPLE_CAMPAIGNS
    SAMPLE_CAMPAIGNS = [c for c in SAMPLE_CAMPAIGNS if c["id"] != campaign_id]
    return {"message": "Campaign deleted successfully"}

@app.get("/templates")
async def get_templates():
    return {"templates": SAMPLE_TEMPLATES}

@app.get("/metrics/overview")
async def get_metrics_overview():
    total_campaigns = len(SAMPLE_CAMPAIGNS)
    active_campaigns = len([c for c in SAMPLE_CAMPAIGNS if c["status"] == "active"])
    total_sent = sum([c["metrics"]["sent"] for c in SAMPLE_CAMPAIGNS])
    total_opened = sum([c["metrics"]["opened"] for c in SAMPLE_CAMPAIGNS])
    
    return {
        "total_campaigns": total_campaigns,
        "active_campaigns": active_campaigns,
        "total_sent": total_sent,
        "total_opened": total_opened,
        "open_rate": round((total_opened / total_sent * 100) if total_sent > 0 else 0, 1),
        "click_rate": round((sum([c["metrics"]["clicked"] for c in SAMPLE_CAMPAIGNS]) / total_sent * 100) if total_sent > 0 else 0, 1)
    }

@app.post("/ai-field-suggestions")
async def get_ai_field_suggestions(request: AIFieldSuggestion):
    # AI-powered suggestions based on field type
    suggestions_map = {
        "subject": [
            "🎯 Boost Your Results with Our Latest Update",
            "⚡ Limited Time: Exclusive Offer Inside",
            "🚀 Transform Your Workflow in 5 Minutes",
            "💡 The Secret to Success Revealed",
            "🔥 Don't Miss Out: Amazing Benefits Await"
        ],
        "preheader": [
            "Get the inside scoop on our latest features...",
            "This exclusive offer expires in 48 hours...",
            "See how companies increased efficiency by 40%...",
            "Your personalized recommendations are ready...",
            "Join thousands who've already transformed their workflow..."
        ],
        "content": [
            "Start with a compelling hook that addresses your audience's pain point",
            "Include social proof or testimonials to build trust",
            "Use bullet points to highlight key benefits clearly",
            "Add a clear, action-oriented call-to-action",
            "Keep paragraphs short for better readability"
        ],
        "sendTime": [
            "Tuesday 10:00 AM (highest open rates)",
            "Thursday 2:00 PM (best for B2B)",
            "Wednesday 11:00 AM (optimal engagement)",
            "Tuesday 2:00 PM (good click-through rates)",
            "Thursday 10:00 AM (strong conversion rates)"
        ],
        "audience": [
            "Active subscribers (last 30 days)",
            "High-engagement users",
            "New subscribers (welcome series)",
            "Re-engagement segment",
            "VIP customers"
        ]
    }
    
    field_suggestions = suggestions_map.get(request.field, [])
    
    return {
        "suggestions": field_suggestions,
        "confidence": random.uniform(0.8, 0.95),
        "field": request.field
    }

@app.get("/ai-recommendations/{campaign_id}")
async def get_ai_recommendations(campaign_id: int):
    recommendations = [
        {
            "type": "Subject Line Optimization",
            "impact": "+15% open rate potential",
            "confidence": 0.89,
            "preview": "Consider adding urgency or personalization to your subject line",
            "actionable_steps": [
                "Add recipient's first name for personalization",
                "Include time-sensitive words like 'limited' or 'expires'",
                "Test A/B variations with different emotional triggers"
            ]
        },
        {
            "type": "Send Time Optimization",
            "impact": "+8% engagement boost",
            "confidence": 0.76,
            "preview": "Your audience is most active on Tuesday mornings",
            "actionable_steps": [
                "Schedule for Tuesday 10:00 AM",
                "Avoid Monday mornings and Friday afternoons",
                "Consider timezone differences for global audience"
            ]
        },
        {
            "type": "Content Enhancement",
            "impact": "+12% click-through rate",
            "confidence": 0.82,
            "preview": "Add more visual elements and clear CTAs",
            "actionable_steps": [
                "Include relevant images or GIFs",
                "Make your call-to-action button more prominent",
                "Break up text with bullet points or numbered lists"
            ]
        }
    ]
    
    return {"recommendations": recommendations}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)