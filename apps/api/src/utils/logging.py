from loguru import logger

def setup_logging():
    logger.add("logs/api.log", rotation="10 MB")
    return logger

logger = setup_logging()
