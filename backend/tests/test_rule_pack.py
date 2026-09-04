from pathlib import Path

from app.role_policies.loader import load_rule_pack


PACK_PATH = Path(__file__).parents[1] / "app" / "role_policies" / "top" / "pack.yml"


def test_load_top_rule_pack_with_versioned_rules() -> None:
    pack = load_rule_pack(PACK_PATH)

    assert pack.pack.id == "top-ranked-v1"
    assert pack.pack.role == "TOP"
    assert pack.pack.queue_ids == [420]
    assert pack.pack.status == "experimental"
    assert len(pack.rules) >= 3
    assert {rule.metric for rule in pack.rules} >= {
        "cs_per_minute",
        "deaths_pre_15",
        "average_deaths",
    }
