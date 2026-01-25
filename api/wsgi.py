import os
import sys
from pathlib import Path

# Add the inner project directory to the Python path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "krishimitra_backend"))

os.environ['VERCEL'] = '1'

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'krishimitra_backend.settings')

application = get_wsgi_application()
app = application
