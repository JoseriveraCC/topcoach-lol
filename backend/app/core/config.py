from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: Literal["development", "test", "production"] = "development"
    app_name: str = "TopCoach LoL"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/postgres"
    redis_url: str = "redis://localhost:6379/0"

    supabase_url: str = ""
    supabase_jwt_issuer: str = ""
    supabase_jwt_audience: str = "authenticated"

    riot_api_key: str = ""
    riot_default_region: str = "americas"

    aws_region: str = ""
    bedrock_model_id: str = ""
    bedrock_structured_output_enabled: bool = True
    bedrock_prompt_cache_enabled: bool = False


@lru_cache
def get_settings() -> Settings:
    return Settings()
