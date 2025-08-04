from pydantic import BaseModel
from typing import List, Optional
import datetime

from .trade_model import Trade


class User(BaseModel):
    uid: str
    name: str
    balance: float
    portfolio: dict
    trades = List[Trade] = []