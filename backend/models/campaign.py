from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Campaign(BaseModel):
    id: str
    name: str
    description: str
    type: str
    status: str
    target_audience: str
    content: str
    created_at: datetime
    updated_at: datetime

class CampaignCreateRequest(BaseModel):
    name: str
    description: str
    type: str
    target_audience: str

class CampaignUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    target_audience: Optional[str] = None
    content: Optional[str] = None