"""
WSGI config for krishimitra_backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os
import sys
from pathlib import Path

# Add the project directory to the Python path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'krishimitra_backend.settings')

# Collect static files on startup for Vercel
if os.environ.get('VERCEL'):
    import subprocess
    try:
        subprocess.run(['python', 'manage.py', 'collectstatic', '--noinput'], 
                      cwd=str(BASE_DIR), check=False, capture_output=True)
    except:
        pass

application = get_wsgi_application()

# Vercel serverless function handler
app = application
