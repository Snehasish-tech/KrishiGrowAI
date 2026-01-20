from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
import requests


# Home Page
def home_page(request):
    return render(request, "accounts/index.html")


# Sign In Page
def signin_page(request):
    if request.method == "POST":
        # Demo mode - database not available on Vercel
        messages.info(request, "Demo mode: Authentication requires database setup")
        return redirect('home')
    return render(request, "accounts/signin.html")  # Sign In template


# Sign Up Page
def signup_page(request):
    if request.method == "POST":
        # Demo mode - database not available on Vercel
        messages.info(request, "Demo mode: Registration requires database setup")
        return redirect('signin')
    return render(request, "accounts/signin.html")  # Reuse the same template with toggle


# Logout
def logout_user(request):
    logout(request)
    return redirect('signin')


# Password Reset Page
def password_reset_page(request):
    if request.method == "POST":
        email = request.POST.get("email")
        # You can integrate Django's password reset logic here
        messages.success(request, f"Password reset link sent to {email} (simulation).")
        return redirect('signin')
    return render(request, "accounts/password_reset.html")  # Create this template


# Chatbot API endpoint
@csrf_exempt
def chatbot_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')
            
            if not user_message:
                return JsonResponse({'error': 'Message is required'}, status=400)
            
            # System context for farming assistant
            system_context = """You are KrishiGrowAI Assistant, an expert AI farming assistant specializing in Indian agriculture. 
            You help farmers with:
            - Crop recommendations based on soil, weather, and season
            - Soil health and pH management
            - Pest and disease control
            - Market price insights
            - Irrigation and water management
            - Fertilizer recommendations
            - Weather-based farming decisions
            
            Provide practical, actionable advice in a friendly, encouraging tone. Use emojis appropriately. 
            Keep responses concise (2-4 sentences) but informative. Focus on Indian farming conditions and crops."""
            
            prompt = f"{system_context}\n\nFarmer's Question: {user_message}\n\nYour Response:"
            
            # Call Gemini API
            api_key = settings.GEMINI_API_KEY
            if not api_key:
                return JsonResponse({'error': 'Gemini API key missing on server'}, status=500)
            api_url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}'
            
            response = requests.post(
                api_url,
                headers={'Content-Type': 'application/json'},
                json={
                    'contents': [{
                        'parts': [{'text': prompt}]
                    }],
                    'generationConfig': {
                        'temperature': 0.7,
                        'maxOutputTokens': 300,
                        'topP': 0.8,
                        'topK': 40
                    }
                },
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()

                candidates = result.get('candidates') or []
                if candidates:
                    content = candidates[0].get('content') or {}
                    parts = content.get('parts') or []
                    if parts and parts[0].get('text'):
                        bot_response = parts[0]['text']
                        return JsonResponse({'response': bot_response})

                # If we reach here, the structure is not what we expect
                return JsonResponse({
                    'error': 'Invalid response format from Gemini',
                    'details': result
                }, status=500)
            else:
                # Include Gemini's response body for debugging
                return JsonResponse({
                    'error': f'Gemini API error ({response.status_code})',
                    'details': response.text
                }, status=500)
                
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except requests.RequestException as e:
            return JsonResponse({'error': 'Request to Gemini failed', 'details': str(e)}, status=500)
        except Exception as e:
            return JsonResponse({'error': 'Server error', 'details': str(e)}, status=500)
    
    return JsonResponse({'error': 'Only POST method allowed'}, status=405)
