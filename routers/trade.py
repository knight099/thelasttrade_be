from fastapi import APIrouter
from models.trade_model import Trade

router = APIrouter()


@router.post("/trade/")
async def make_trade(trade: Trade):
    return {"status": "success", "trade": trade}


    