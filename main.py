from fastapi import FastAPI
from routers import trades, user

app = FastAPI()

app.include_router(trades.router)
app.include_router(user.router)

