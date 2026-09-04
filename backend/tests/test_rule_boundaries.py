from pathlib import Path

from app.role_policies.loader import load_rule_pack


PACK_PATH = Path(__file__).parents[1] / "app" / "role_policies" / "top" / "pack.yml"


def test_average_deaths_warning_has_non_overlapping_boundaries() -> None:
    pack = load_rule_pack(PACK_PATH)
    rule = next(rule for rule in pack.rules if rule.id == "top.average_deaths.block_mean")
    warning = next(condition for condition in rule.conditions if condition.severity == "warning")

    assert warning.min_exclusive == 4
    assert warning.max_inclusive == 6
