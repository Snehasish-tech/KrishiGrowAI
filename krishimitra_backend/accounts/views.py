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
    """Accepts POST with {'message': '<text>'} and returns {'response': '<bot text>'}.
    Tries several Gemini models and returns clear diagnostics on failure."""
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

    try:
        data = json.loads(request.body)
        user_message = data.get('message', '')

        if not user_message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        # System context for farming assistant
        system_context = (
            "You are KrishiGrowAI Assistant, an expert AI farming assistant specializing in Indian agriculture. "
            "You help farmers with: Crop recommendations, soil health, pest control, market insights, irrigation, fertilizers, and weather-based advice. "
            "Provide practical, actionable advice in a friendly, encouraging tone. Keep responses concise (2-4 sentences)."
        )

        prompt = f"{system_context}\n\nFarmer's Question: {user_message}\n\nYour Response:"

        api_key = settings.GEMINI_API_KEY
        if not api_key:
            return JsonResponse({'error': 'Gemini API key missing on server'}, status=500)

        model_candidates = ['gemini-1.5-flash', 'gemini-flash-latest', 'gemini-1.5-pro', 'gemini-pro']
        last_details = None
        last_error = None

        for model in model_candidates:
            api_url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}'
            print(f"Trying Gemini model: {model}")
            # per-model one-time retry flag for MAX_TOKENS
            retried_for_max_tokens = False

            def call_model(max_tokens=300):
                try:
                    resp = requests.post(
                        api_url,
                        headers={'Content-Type': 'application/json'},
                        json={
                            'contents': [{ 'parts': [{'text': prompt}] }],
                            'generationConfig': {'temperature': 0.7, 'maxOutputTokens': max_tokens, 'topP': 0.8, 'topK': 40}
                        },
                        timeout=15
                    )
                    return resp
                except requests.RequestException:
                    raise

            try:
                response = call_model()
            except requests.RequestException as e:
                last_error = str(e)
                print(f"RequestException for model {model}: {e}")
                continue

            try:
                details = response.json()
            except Exception:
                details = response.text

            if response.status_code == 200:
                result = details
                # Try older and newer response shapes
                bot_response = None
                candidates = result.get('candidates') or []
                if candidates:
                    first_candidate = candidates[0]
                    content = first_candidate.get('content') or {}
                    parts = content.get('parts') or []
                    if parts and parts[0].get('text'):
                        bot_response = parts[0]['text']
                    else:
                        # If the model returned a candidate but no text, capture diagnostic info
                        finish_reason = first_candidate.get('finishReason')
                        if finish_reason:
                            result['_diagnostic_note'] = f'candidate finishReason: {finish_reason}'

                            # If MAX_TOKENS, try one retry with larger token budget
                            if finish_reason == 'MAX_TOKENS' and not retried_for_max_tokens:
                                try:
                                    print(f"Retrying model {model} with larger maxOutputTokens due to MAX_TOKENS")
                                    response2 = call_model(max_tokens=800)
                                    try:
                                        details2 = response2.json()
                                    except Exception:
                                        details2 = response2.text

                                    if response2.status_code == 200:
                                        result = details2
                                        candidates2 = result.get('candidates') or []
                                        if candidates2:
                                            content2 = candidates2[0].get('content') or {}
                                            parts2 = content2.get('parts') or []
                                            if parts2 and parts2[0].get('text'):
                                                return JsonResponse({'response': parts2[0]['text']})
                                        outputs2 = result.get('outputs') or []
                                        if outputs2 and outputs2[0].get('content'):
                                            content2 = outputs2[0].get('content')
                                            if isinstance(content2, list) and content2 and content2[0].get('text'):
                                                return JsonResponse({'response': content2[0]['text']})
                                            elif isinstance(content2, str):
                                                return JsonResponse({'response': content2})

                                    # keep diagnostic info from retry
                                    result['_retry_details'] = details2
                                except requests.RequestException as e:
                                    print(f"Retry RequestException for model {model}: {e}")
                                retried_for_max_tokens = True

                if not bot_response:
                    outputs = result.get('outputs') or []
                    if outputs:
                        content = outputs[0].get('content') or outputs[0]
                        if isinstance(content, list) and content and content[0].get('text'):
                            bot_response = content[0]['text']
                        elif isinstance(content, str):
                            bot_response = content

                if bot_response:
                    return JsonResponse({'response': bot_response})

                # Ensure details_text is always provided for easier frontend display
                try:
                    details_text = json.dumps(result, indent=2)
                except Exception:
                    details_text = str(result)

                return JsonResponse({'error': 'No text returned by Gemini (see details)', 'details': result, 'details_text': details_text}, status=500)

            if response.status_code == 404:
                print(f"Model {model} not found or unsupported for generateContent. Details: {details}")
                last_details = details
                continue

            print(f"Gemini API error for model {model}: {response.status_code} - {details}")
            # provide textual details for easier client display
            try:
                details_text = json.dumps(details, indent=2)
            except Exception:
                details_text = str(details)
            return JsonResponse({'error': f'Gemini API error ({response.status_code})', 'details': details, 'details_text': details_text}, status=500)

        try:
            details_text = json.dumps(last_details, indent=2) if isinstance(last_details, dict) else str(last_details)
        except Exception:
            details_text = str(last_details or last_error)
        return JsonResponse({'error': 'All Gemini model attempts failed', 'details': last_details or last_error, 'details_text': details_text}, status=500)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except requests.RequestException as e:
        return JsonResponse({'error': 'Request to Gemini failed', 'details': str(e)}, status=500)
    except Exception as e:
        return JsonResponse({'error': 'Server error', 'details': str(e)}, status=500)
