import json
from pathlib import Path
import sys

BACKEND = Path(__file__).parents[1] / "backend"
sys.path.insert(0, str(BACKEND))

from app.role_policies.loader import RulePack  # noqa: E402

output = BACKEND / "app" / "role_policies" / "schema.json"
output.write_text(
    json.dumps(RulePack.model_json_schema(), ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
print(output)
