from uuid import UUID
from datetime import datetime
from typing import Any

def serialize_response(obj: Any) -> Any:
    """Serialize objects to JSON-compatible format."""
    if isinstance(obj, UUID):
        return str(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, dict):
        return {k: serialize_response(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [serialize_response(item) for item in obj]
    return obj