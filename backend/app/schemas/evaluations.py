from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class EvaluationCreate(BaseModel):
    riot_account_id: UUID
    role: Literal["TOP"] = "TOP"
    queue_id: Literal[420] = 420


class EvaluationAccepted(BaseModel):
    job_id: UUID
    status: Literal["queued"] = "queued"
    valid_matches_found: int = Field(default=0, ge=0, le=10)
