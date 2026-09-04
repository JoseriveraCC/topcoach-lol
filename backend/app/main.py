from fastapi import FastAPI

from app.api.routes.health import router as health_router

app = FastAPI(
    title="TopCoach LoL API",
    version="0.1.0",
    description="API del MVP de entrenamiento post-partida para Top Lane.",
)
app.include_router(health_router)
