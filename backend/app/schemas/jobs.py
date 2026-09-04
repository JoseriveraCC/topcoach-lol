from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel


class JobStatus(StrEnum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class JobRead(BaseModel):
    id: UUID
    status: JobStatus
    created_at: datetime
    updated_at: datetime
    error_code: str | None = None
