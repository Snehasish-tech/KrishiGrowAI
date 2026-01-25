import os
import sys
from pathlib import Path

# Add the project directory to the Python path
BASE_DIR = Path(__file__).resolve().parent.parent / 'krishimitra_backend'
sys.path.insert(0, str(BASE_DIR))
sys.path.insert(0, str(BASE_DIR.parent))

# Set Vercel environment variable
os.environ['VERCEL'] = '1'

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'krishimitra_backend.settings')

# Initialize Django
application = get_wsgi_application()

def __init__(self):
    """Initialize the Django application"""
    pass