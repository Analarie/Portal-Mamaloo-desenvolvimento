import logging
import json
import sys
from datetime import datetime

class JSONFormatter(logging.Formatter):
    """Formata logs em JSON para fácil parsing"""
    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "service": "mamaloo-api"
        }
        
        # Adiciona informações de erro se houver
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        
        return json.dumps(log_data)

def setup_logging():
    """Configura logging estruturado"""
    logger = logging.getLogger("mamaloo")
    logger.setLevel(logging.INFO)
    
    # Handler para stdout (útil para Docker)
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())
    
    logger.addHandler(handler)
    return logger

LOGGER = setup_logging()