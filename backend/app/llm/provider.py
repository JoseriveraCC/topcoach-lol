from typing import Protocol

from pydantic import BaseModel, ConfigDict


class AnalysisOutput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    role: str
    summary: str
    priorities: list[dict[str, object]]


class ExplanationProvider(Protocol):
    def generate_report(self, payload: dict[str, object]) -> AnalysisOutput: ...
