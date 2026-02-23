from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./gabarit.db"
    GOOGLE_CLOUD_PROJECT: str = "gabarit-ai"
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
