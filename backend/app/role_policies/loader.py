from pathlib import Path
from typing import Literal

import yaml
from pydantic import BaseModel, ConfigDict, Field, model_validator


class PatchRange(BaseModel):
    model_config = ConfigDict(extra="forbid")

    from_patch: str = Field(alias="from")
    to: str | None = None


class PackMetadata(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    role: Literal["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"]
    queue_ids: list[int]
    version: str
    schema_version: str
    patch_range: PatchRange
    status: Literal["experimental", "validated", "deprecated"]
    author: str
    provenance: list[str]


class RuleCondition(BaseModel):
    model_config = ConfigDict(extra="forbid")

    operator: Literal["lt", "lte", "gt", "gte", "eq", "range"]
    severity: Literal["good", "warning", "critical"]
    value: float | None = None
    min_inclusive: float | None = None
    min_exclusive: float | None = None
    max_inclusive: float | None = None
    max_exclusive: float | None = None

    @model_validator(mode="after")
    def validate_operands(self) -> "RuleCondition":
        if self.operator == "range":
            lower_bounds = [self.min_inclusive, self.min_exclusive]
            upper_bounds = [self.max_inclusive, self.max_exclusive]
            if sum(bound is not None for bound in lower_bounds) != 1:
                raise ValueError("range requires exactly one lower bound")
            if sum(bound is not None for bound in upper_bounds) != 1:
                raise ValueError("range requires exactly one upper bound")
        elif self.value is None:
            raise ValueError(f"{self.operator} requires value")
        return self


class Evidence(BaseModel):
    model_config = ConfigDict(extra="forbid")

    source: Literal["match_detail", "timeline", "derived", "history"]
    required_fields: list[str]
    limitations: list[str] = Field(default_factory=list)


class Rule(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    metric: str
    strategy: Literal["threshold", "relative", "descriptive"]
    aggregation: str
    sample_size: int = Field(ge=1)
    conditions: list[RuleCondition] = Field(default_factory=list)
    comparison_reference: str | None = None
    evidence: Evidence
    recommendation_id: str
    rationale: str

    @model_validator(mode="after")
    def validate_strategy(self) -> "Rule":
        if self.strategy == "threshold" and not self.conditions:
            raise ValueError("threshold rules require conditions")
        if self.strategy == "relative" and not self.comparison_reference:
            raise ValueError("relative rules require comparison_reference")
        return self


class RulePack(BaseModel):
    model_config = ConfigDict(extra="forbid")

    pack: PackMetadata
    rules: list[Rule]



def load_rule_pack(path: Path) -> RulePack:
    with path.open("r", encoding="utf-8") as source:
        raw = yaml.safe_load(source)
    return RulePack.model_validate(raw)
