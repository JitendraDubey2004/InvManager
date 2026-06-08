from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Inventory & Order Management API"
    DATABASE_URL: str = "postgresql://user:password@db:5432/inventory_db"
    LOG_LEVEL: str = "INFO"

    # This replaces the old 'class Config:' syntax
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()