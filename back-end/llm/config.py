import os
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

# Get the absolute path to the .env file
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')

# Load environment variables from .env file
load_dotenv(env_path)

# LLM Configuration
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
CLAUDE_MODEL = os.getenv('CLAUDE_MODEL', 'claude-3-sonnet-20240229')

# Log configuration status
logger.info(f"Environment loaded from: {env_path}")
logger.info(f"API Key loaded: {'Yes' if ANTHROPIC_API_KEY else 'No'}")
logger.info(f"Model version: {CLAUDE_MODEL}")

# Validate required environment variables
if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY environment variable is not set. Please check your .env file.")
