#!/bin/bash

# Build the project
echo "Building the project..."

# Install dependencies
pip install -r requirements.txt

# Set environment variable to skip database checks during collectstatic
export DJANGO_SETTINGS_MODULE=krishimitra_backend.settings
export VERCEL=1

# Collect static files (skip database migrations)
python krishimitra_backend/manage.py collectstatic --noinput --clear --no-default-ignore

echo "Build completed!"
