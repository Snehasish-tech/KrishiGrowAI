import os
import sys
from pathlib import Path

# Add both the project root and inner project directory to the Python path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
sys.path.insert(0, str(BASE_DIR / "krishimitra_backend"))

# Helpful for debugging import issues during deployment
if 'VERCEL_DEBUG' in os.environ:
    print('sys.path:', sys.path)

os.environ['VERCEL'] = '1'

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'krishimitra_backend.settings')

application = get_wsgi_application()
app = application
