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
            
            # Call Gemini API with model fallbacks and better error handling
            api_key = settings.GEMINI_API_KEY
            if not api_key:
                return JsonResponse({'error': 'Gemini API key missing on server'}, status=500)

            model_candidates = ['gemini-1.5-flash', 'gemini-flash-latest', 'gemini-1.5-pro', 'gemini-pro']
            last_details = None
            last_error = None

            for model in model_candidates:
                api_url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}'
                print(f"Trying Gemini model: {model}")
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
                    print(f"RequestException for model {model}: {e}")
                    continue

                try:
                    details = response.json()
                except Exception:
                    details = response.text

                if response.status_code == 200:
                    result = details

                    bot_response = None
                    candidates = result.get('candidates') or []
                    if candidates:
                        content = candidates[0].get('content') or {}
                        parts = content.get('parts') or []
                        if parts and parts[0].get('text'):
                            bot_response = parts[0]['text']

                    if not bot_response:
                        outputs = result.get('outputs') or []
                        if outputs and outputs[0].get('content'):
                            content = outputs[0]['content']
                            if isinstance(content, list) and content and content[0].get('text'):
                                bot_response = content[0]['text']
                            elif isinstance(content, str):
                                bot_response = content

                    if bot_response:
                        return JsonResponse({'response': bot_response})

                    return JsonResponse({'error': 'Invalid response format from Gemini', 'details': result}, status=500)

                if response.status_code == 404:
                    print(f"Model {model} not found or unsupported for generateContent. Details: {details}")
                    last_details = details
                    continue

                print(f"Gemini API error for model {model}: {response.status_code} - {details}")
                return JsonResponse({'error': f'Gemini API error ({response.status_code})', 'details': details}, status=500)

            return JsonResponse({'error': 'All Gemini model attempts failed', 'details': last_details or last_error}, status=500)

                # If we reach here, the structure is not what we expect
                
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except requests.RequestException as e:
            return JsonResponse({'error': 'Request to Gemini failed', 'details': str(e)}, status=500)
        except Exception as e:
            return JsonResponse({'error': 'Server error', 'details': str(e)}, status=500)
    
    return JsonResponse({'error': 'Only POST method allowed'}, status=405)