# Gemini API Setup Guide for KrishiGrowAI Chatbot

## 🚀 Quick Setup Instructions

### Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click on **"Get API Key"** or **"Create API Key"**
4. Copy your API key (it will look like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

### Step 2: Add Your API Key

Open the file: `krishimitra_backend/accounts/static/accounts/js/config.js`

Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:

```javascript
const CONFIG = {
    GEMINI_API_KEY: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Your actual key here
    // ...rest of config
};
```

### Step 3: Test the Chatbot

1. Open your website in a browser
2. Click on the chatbot button (💬) in the bottom right corner
3. Ask a farming question like: "What crop should I grow in black soil?"
4. The AI will respond with personalized advice!

## 🔒 Security Best Practices

### ⚠️ IMPORTANT: Protect Your API Key!

1. **Never commit API keys to Git:**
   - Add `config.js` to your `.gitignore` file
   - Create a `.gitignore` in your project root if you don't have one

2. **Create a `.gitignore` file:**
```
# Add this to .gitignore
krishimitra_backend/accounts/static/accounts/js/config.js
*.env
.env.local
```

3. **For production deployment:**
   - Use environment variables instead of hardcoded keys
   - Consider using a backend proxy to hide the API key
   - Implement rate limiting to prevent abuse

## 📋 Features

### What the Gemini-Powered Chatbot Can Do:

✅ Answer farming questions intelligently  
✅ Provide crop recommendations  
✅ Suggest pest control methods  
✅ Explain soil management techniques  
✅ Give weather-based farming advice  
✅ Help with irrigation planning  
✅ Recommend fertilizers  
✅ Provide market insights  

### Fallback Support:
- If the API fails or quota is exceeded, the chatbot automatically falls back to local keyword-based responses
- Ensures the chatbot always works, even without internet or API access

## 🐛 Troubleshooting

### Problem: Chatbot not responding with AI answers

**Solution 1:** Check if API key is correct
- Make sure you copied the full API key
- Check for extra spaces or quotes
- Verify the key is active in Google AI Studio

**Solution 2:** Check browser console for errors
- Press F12 to open Developer Tools
- Look at the Console tab for error messages
- Common errors:
  - `API_KEY_INVALID` - Wrong API key
  - `CORS error` - May need to enable API in Google Cloud Console
  - `403 Forbidden` - API quota exceeded or restrictions applied

**Solution 3:** Check API quota
- Visit [Google AI Studio](https://makersuite.google.com/)
- Check your usage limits
- Free tier has limits on requests per minute

### Problem: "API request failed" message

This usually means:
1. No internet connection
2. API quota exceeded
3. API key restrictions (check if you've set IP/domain restrictions)

The chatbot will automatically use local responses in this case.

## 💰 Pricing & Limits

### Free Tier (Gemini API):
- 60 requests per minute
- 1,500 requests per day
- 1 million tokens per month

**Perfect for development and small-scale use!**

### Paid Tier:
- For production apps with high traffic
- Pay-as-you-go pricing
- Higher rate limits

## 🔧 Advanced Configuration

### Customize AI Behavior

Edit the `generateBotResponse` function in `scripts.js`:

```javascript
const systemContext = `You are KrishiGrowAI Assistant...`;
```

### Adjust Response Length

Change `maxOutputTokens` in the API call:

```javascript
generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 300,  // Change this (100-2048)
    topP: 0.8,
    topK: 40
}
```

- Lower = shorter responses
- Higher = longer, detailed responses

### Adjust Creativity Level

Change `temperature`:

```javascript
temperature: 0.7,  // Range: 0.0 to 1.0
```

- 0.0 = More factual, consistent
- 1.0 = More creative, varied

## 📚 Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [API Pricing](https://ai.google.dev/pricing)
- [Rate Limits](https://ai.google.dev/docs/quota)

## 🎉 You're All Set!

Your KrishiGrowAI chatbot is now powered by Google's Gemini AI! 🚀🌾

Enjoy intelligent farming assistance with cutting-edge AI technology!
