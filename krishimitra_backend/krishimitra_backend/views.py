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
            
            # Call Gemini API with model fallbacks
            api_key = settings.GEMINI_API_KEY
            if not api_key:
                return JsonResponse({'error': 'Gemini API key missing on server'}, status=500)

            # Try multiple models in order of preference
            model_candidates = ['gemini-1.5-flash-latest', 'gemini-1.5-pro-latest', 'gemini-pro']
            last_details = None
            last_error = None

            for model in model_candidates:
                api_url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}'
                
                try:
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
                except requests.RequestException as e:
                    last_error = str(e)
                    continue

                # Parse response
                try:
                    result = response.json()
                except:
                    last_details = response.text
                    continue

                if response.status_code == 200:
                    # Extract bot response
                    candidates = result.get('candidates') or []
                    if candidates:
                        content = candidates[0].get('content') or {}
                        parts = content.get('parts') or []
                        if parts and parts[0].get('text'):
                            bot_response = parts[0]['text']
                            return JsonResponse({'response': bot_response})

                    # Fallback: try alternate response structure
                    return JsonResponse({
                        'error': 'Invalid response format from Gemini',
                        'details': result
                    }, status=500)

                # If 404, try next model
                if response.status_code == 404:
                    last_details = result
                    continue

                # Other errors - return immediately
                return JsonResponse({
                    'error': f'Gemini API error ({response.status_code})',
                    'details': result
                }, status=500)

            # All models failed
            return JsonResponse({
                'error': 'All Gemini model attempts failed',
                'details': last_details or last_error
            }, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': 'Server error', 'details': str(e)}, status=500)
    
    return JsonResponse({'error': 'Only POST method allowed'}, status=405)