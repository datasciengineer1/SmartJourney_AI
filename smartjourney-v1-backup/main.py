from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import chromadb
import requests
import json
import os
import statistics

# Initialize FastAPI app
app = FastAPI(title="SmartJourney AI Campaign Platform")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ChromaDB
try:
    client = chromadb.Client()
    collection = client.get_or_create_collection("campaigns")
    print("✅ ChromaDB initialized successfully")
except Exception as e:
    print(f"❌ ChromaDB error: {e}")
    print("Using fallback storage...")
    client = None
    collection = None

# MODELS
class Campaign(BaseModel):
    name: str
    type: str
    target_audience: str
    content: Optional[Dict] = {}
    channels: Optional[List[str]] = ["email"]
    budget: Optional[str] = ""
    start_date: Optional[str] = ""
    end_date: Optional[str] = ""
    status: Optional[str] = "draft"

class AISuggestionRequest(BaseModel):
    field: str
    context: str
    campaign_type: str
    target_audience: str

class AISuggestionResponse(BaseModel):
    suggestions: List[str]

class AnalyticsResponse(BaseModel):
    total_campaigns: int
    active_campaigns: int
    total_budget: float
    avg_engagement: str
    popular_channel: str
    success_rate: str
    campaign_types: Dict[str, int]
    monthly_trends: List[Dict[str, Any]]

# Fallback storage (if ChromaDB fails)
campaigns_storage = []

# CAMPAIGN ENDPOINTS
@app.get("/campaigns")
async def get_campaigns():
    """Get all campaigns"""
    try:
        if collection:
            campaigns_data = collection.get()
            campaigns = []

            if campaigns_data['documents']:
                for i, doc in enumerate(campaigns_data['documents']):
                    try:
                        campaign_data = eval(doc)
                        campaign_data['id'] = campaigns_data['ids'][i]
                        campaigns.append(campaign_data)
                    except:
                        continue

            return {"campaigns": campaigns}
        else:
            # Fallback to in-memory storage
            return {"campaigns": campaigns_storage}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/campaigns")
async def create_campaign(campaign: dict):
    """Enhanced campaign creation with support for content, channels, budget, dates"""
    try:
        campaign_id = str(len(campaigns_storage) + 1)

        # Add timestamp and default status
        campaign['created_at'] = datetime.now().isoformat()
        campaign['status'] = 'draft'
        campaign['id'] = campaign_id

        # Ensure all fields have defaults
        campaign.setdefault('content', {})
        campaign.setdefault('channels', ['email'])
        campaign.setdefault('budget', '')
        campaign.setdefault('start_date', '')
        campaign.setdefault('end_date', '')

        if collection:
            collection.add(
                documents=[str(campaign)],
                ids=[campaign_id]
            )
        else:
            # Fallback to in-memory storage
            campaigns_storage.append(campaign)

        return campaign

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/campaigns/{campaign_id}")
async def update_campaign(campaign_id: str, campaign: dict):
    """Update an existing campaign"""
    try:
        campaign['updated_at'] = datetime.now().isoformat()
        campaign['id'] = campaign_id

        if collection:
            collection.update(
                ids=[campaign_id],
                documents=[str(campaign)]
            )
        else:
            # Fallback to in-memory storage
            for i, c in enumerate(campaigns_storage):
                if c.get('id') == campaign_id:
                    campaigns_storage[i] = campaign
                    break

        return campaign
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str):
    """Delete a campaign"""
    try:
        if collection:
            collection.delete(ids=[campaign_id])
        else:
            # Fallback to in-memory storage
            global campaigns_storage
            campaigns_storage = [c for c in campaigns_storage if c.get('id') != campaign_id]

        return {"message": "Campaign deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# AI SUGGESTIONS ENDPOINT
@app.post("/ai/suggestions", response_model=AISuggestionResponse)
async def generate_ai_suggestions(request: AISuggestionRequest):
    """Generate AI-powered suggestions using Ollama (free local LLM)"""
    try:
        # Try to use Ollama first (if running locally)
        suggestions = await get_ollama_suggestions(request)
        if suggestions:
            return AISuggestionResponse(suggestions=suggestions)

        # Fallback to Mistral API (if you have API key)
        suggestions = await get_mistral_suggestions(request)
        if suggestions:
            return AISuggestionResponse(suggestions=suggestions)

    except Exception as e:
        print(f"AI suggestion error: {e}")

    # Fallback suggestions for demo
    fallback_suggestions = {
        "name": [
            f"Boost Your {request.campaign_type.title()} Campaign",
            f"Ultimate {request.target_audience} Experience", 
            f"Transform Your Journey with {request.campaign_type.title()}"
        ],
        "subject": [
            "🚀 Don't Miss Out - Limited Time Offer!",
            "✨ Exclusive Deal Just for You",
            "🎯 Your Perfect Match is Here"
        ],
        "body": [
            f"Discover amazing opportunities tailored specifically for {request.target_audience}. Our latest {request.campaign_type} campaign brings you closer to your goals.",
            f"We've crafted something special just for {request.target_audience}. Experience the difference with our innovative {request.campaign_type} approach.",
            f"Transform your experience with our cutting-edge {request.campaign_type} solutions designed for {request.target_audience}."
        ],
        "target_audience": [
            "Tech-savvy professionals aged 25-40",
            "Budget-conscious millennials", 
            "Early adopters and innovators",
            "Small business owners",
            "Digital marketing enthusiasts"
        ]
    }

    suggestions = fallback_suggestions.get(request.field, ["AI suggestions coming soon..."])
    return AISuggestionResponse(suggestions=suggestions[:3])

# AI ANALYTICS SUGGESTIONS ENDPOINT (for Apply Recommendations button)
@app.post("/ai-suggestions")
async def get_ai_analytics_suggestions(request: dict):
    """Generate AI recommendations for analytics dashboard"""
    try:
        campaign_data = request.get("campaign_data", "")

        # Try Ollama first
        suggestions = await get_ollama_analytics_suggestions(campaign_data)
        if suggestions:
            return {"suggestions": suggestions}

        # Fallback suggestions for analytics
        fallback_suggestions = [
            "Increase budget allocation for high-performing keywords",
            "Optimize ad copy based on current engagement metrics",
            "Adjust targeting parameters for better audience reach",
            "Review and update campaign scheduling for peak hours",
            "Implement A/B testing for different ad variations"
        ]

        return {"suggestions": fallback_suggestions}

    except Exception as e:
        print(f"AI analytics error: {e}")
        fallback_suggestions = [
            "Review campaign performance metrics",
            "Optimize keyword targeting strategy",
            "Adjust budget allocation based on ROI",
            "Update ad creative for better engagement",
            "Analyze competitor strategies"
        ]
        return {"suggestions": fallback_suggestions}

# ANALYTICS ENDPOINT
@app.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics():
    """Generate analytics based on campaign data"""
    try:
        campaigns = []

        if collection:
            # Get all campaigns from ChromaDB
            campaigns_data = collection.get()

            if campaigns_data['documents']:
                for i, doc in enumerate(campaigns_data['documents']):
                    try:
                        campaign_data = eval(doc)  # Convert string back to dict
                        campaigns.append(campaign_data)
                    except:
                        continue
        else:
            # Use in-memory storage
            campaigns = campaigns_storage

        # Calculate analytics
        total_campaigns = len(campaigns)
        active_campaigns = len([c for c in campaigns if c.get('status') == 'active'])

        # Calculate total budget
        total_budget = sum(float(c.get('budget', 0)) for c in campaigns if c.get('budget') and str(c.get('budget')).replace('.', '').isdigit())

        # Campaign types distribution
        campaign_types = {}
        for campaign in campaigns:
            campaign_type = campaign.get('type', 'unknown')
            campaign_types[campaign_type] = campaign_types.get(campaign_type, 0) + 1

        # Most popular channel
        popular_channel = max(campaign_types.keys(), default='email') if campaign_types else 'email'

        # Mock some additional metrics (in production, these would come from real data)
        avg_engagement = "12.5%"
        success_rate = "78%"

        # Monthly trends (mock data)
        monthly_trends = [
            {"month": "Jan", "campaigns": 5, "engagement": 12.3},
            {"month": "Feb", "campaigns": 8, "engagement": 14.1}, 
            {"month": "Mar", "campaigns": 12, "engagement": 16.8},
        ]

        return AnalyticsResponse(
            total_campaigns=total_campaigns,
            active_campaigns=active_campaigns,
            total_budget=total_budget,
            avg_engagement=avg_engagement,
            popular_channel=popular_channel,
            success_rate=success_rate,
            campaign_types=campaign_types,
            monthly_trends=monthly_trends
        )

    except Exception as e:
        print(f"Analytics error: {e}")
        # Return default analytics on error
        return AnalyticsResponse(
            total_campaigns=0,
            active_campaigns=0,
            total_budget=0.0,
            avg_engagement="0%",
            popular_channel="email",
            success_rate="0%",
            campaign_types={},
            monthly_trends=[]
        )

# AI HELPER FUNCTIONS
async def get_ollama_suggestions(request: AISuggestionRequest):
    """Get suggestions from Ollama running locally"""
    try:
        prompt = f"""Generate 3 creative suggestions for a {request.field} in a {request.campaign_type} campaign.
Context: {request.context}
Target Audience: {request.target_audience}

Requirements:
- Be creative and engaging
- Match the campaign type and audience  
- Keep suggestions concise and actionable
- Return only the 3 suggestions, one per line"""

        # Ollama API call (assumes Ollama is running on localhost:11434)
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama2",  # or "mistral", "codellama", etc.
                "prompt": prompt,
                "stream": False
            },
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            suggestions_text = result.get('response', '')
            suggestions = [s.strip() for s in suggestions_text.split('\n') if s.strip()]
            return suggestions[:3]

    except Exception as e:
        print(f"Ollama error: {e}")
        return None

async def get_ollama_analytics_suggestions(campaign_data: str):
    """Get analytics suggestions from Ollama"""
    try:
        prompt = f"""
        Analyze this campaign data and provide 3-5 specific marketing recommendations:

        Campaign Data: {campaign_data}

        Provide actionable suggestions for improving campaign performance:
        """

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama2",
                "prompt": prompt,
                "stream": False
            },
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            suggestions_text = result.get("response", "")

            suggestions = []
            lines = suggestions_text.split("\n")
            for line in lines:
                line = line.strip()
                if line and (line.startswith("-") or line.startswith("•") or line.startswith("*")):
                    suggestion = line.lstrip("-•* ").strip()
                    if suggestion:
                        suggestions.append(suggestion)

            return suggestions[:5] if suggestions else None

    except Exception as e:
        print(f"Ollama analytics error: {e}")
        return None

async def get_mistral_suggestions(request: AISuggestionRequest):
    """Get suggestions from Mistral API (has free tier)"""
    try:
        # You can get a free API key from https://console.mistral.ai/
        mistral_api_key = os.getenv("MISTRAL_API_KEY")
        if not mistral_api_key:
            return None

        prompt = f"""Generate 3 creative suggestions for a {request.field} in a {request.campaign_type} campaign.
Context: {request.context}
Target Audience: {request.target_audience}

Requirements:
- Be creative and engaging
- Match the campaign type and audience
- Keep suggestions concise and actionable"""

        response = requests.post(
            "https://api.mistral.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {mistral_api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "mistral-tiny",  # Free tier model
                "messages": [
                    {"role": "system", "content": "You are a marketing expert. Generate exactly 3 suggestions, one per line."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 200,
                "temperature": 0.7
            },
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            suggestions_text = result['choices'][0]['message']['content']
            suggestions = [s.strip() for s in suggestions_text.split('\n') if s.strip()]
            return suggestions[:3]

    except Exception as e:
        print(f"Mistral error: {e}")
        return None

# HEALTH CHECK
@app.get("/")
async def root():
    return {"message": "SmartJourney AI Campaign Platform API", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
