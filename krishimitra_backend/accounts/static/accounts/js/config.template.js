// Configuration Template for API keys
// INSTRUCTIONS:
// 1. Copy this file and rename it to "config.js"
// 2. Replace the placeholder values with your actual API keys
// 3. Never commit the actual config.js file to Git (it's in .gitignore)

const CONFIG = {
    // Get your Gemini API key from: https://makersuite.google.com/app/apikey
    GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
    
    // API Endpoint (don't change this unless using a different model)
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    
    // Optional: Weather API key if you want to integrate real weather data
    // Get from: https://openweathermap.org/api
    WEATHER_API_KEY: 'YOUR_WEATHER_API_KEY_HERE',
    
    // Optional: Other API configurations
    MAX_RETRIES: 3,
    REQUEST_TIMEOUT: 10000, // 10 seconds
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
