from fastapi import APIrouter
from models.user_model import User


router = APIrouter()

@router.post("/user/")
async def create_user(user: User):
    # create user
    return {"status": "success", "user": user}