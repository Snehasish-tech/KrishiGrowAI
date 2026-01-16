#!/bin/bash

# Build the project
echo "Building the project..."

# Install dependencies
pip install -r requirements.txt

# Collect static files
python krishimitra_backend/manage.py collectstatic --noinput --clear

echo "Build completed!"
