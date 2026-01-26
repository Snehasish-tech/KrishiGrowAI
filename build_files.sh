#!/bin/bash

# Build the project
echo "Building the project..."

# Install dependencies
pip install -r requirements.txt

# Collect static files for production
echo "Collecting static files..."
cd krishimitra_backend
python manage.py collectstatic --noinput

echo "Build completed!"
