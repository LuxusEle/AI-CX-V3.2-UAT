import os

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@db:5432/nexus")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "devsecret")
    JWT_REFRESH_SECRET: str = os.getenv("JWT_REFRESH_SECRET", "devrefsecret")
    JWT_EXPIRE_MIN: int = int(os.getenv("JWT_EXPIRE_MIN", "30"))
    JWT_REFRESH_EXPIRE_MIN: int = int(os.getenv("JWT_REFRESH_EXPIRE_MIN", "43200"))
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://redis:6379/0")
    ENV: str = os.getenv("ENV", "dev")

settings = Settings()
