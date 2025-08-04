from pydantic import BaseModel
from typing import List, Optional
import datetime

class Trade(BaseModel):
    user_id: str
    symbol: str
    quantity: int
    price: float
    action: str #buy / sell
    timestamp: datetime.datetime
    type: str
    status: str
    error: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

