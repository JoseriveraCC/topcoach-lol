from pathlib import Path
import sys

BACKEND = Path(__file__).parents[1] / "backend"
sys.path.insert(0, str(BACKEND))

from app.role_policies.loader import load_rule_pack  # noqa: E402

path = BACKEND / "app" / "role_policies" / "top" / "pack.yml"
pack = load_rule_pack(path)
print(f"OK: {pack.pack.id} v{pack.pack.version}; reglas={len(pack.rules)}")
