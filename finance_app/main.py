from fastapi import FastAPI
from database import Base, engine
from routers import transactions, analytics
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Finance Tracker API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

app.include_router(transactions.router)
app.include_router(analytics.router)