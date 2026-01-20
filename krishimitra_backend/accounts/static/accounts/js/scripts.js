// Global Variables
let chatbotOpen = false;
let isTyping = false;

// Gemini API Configuration
// Get your API key from: https://makersuite.google.com/app/apikey
const GEMINI_API_KEY = typeof CONFIG !== 'undefined' ? CONFIG.GEMINI_API_KEY : 'YOUR_GEMINI_API_KEY_HERE';
const GEMINI_API_URL = typeof CONFIG !== 'undefined' && CONFIG.GEMINI_API_URL
    ? CONFIG.GEMINI_API_URL
    : 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

// Comprehensive Crop Database
const cropDatabase = {
    'rice': {
        soilTypes: ['clay', 'loamy', 'alluvial'],
        phRange: [5.5, 7.0],
        rainfall: [1000, 2500],
        temperature: [20, 35],
        season: ['kharif'],
        profitability: 'Medium',
        description: 'Staple food crop requiring flooded fields and high water availability',
        tips: 'Ensure proper water management and use high-yielding varieties',
        diseases: 'Watch for blast disease and brown planthopper'
    },
    'wheat': {
        soilTypes: ['loamy', 'clay', 'black'],
        phRange: [6.0, 7.5],
        rainfall: [300, 1000],
        temperature: [15, 25],
        season: ['rabi'],
        profitability: 'High',
        description: 'Major cereal crop with good drought tolerance and storage life',
        tips: 'Plant early for better yield, use balanced fertilization',
        diseases: 'Monitor for rust diseases and aphid infestations'
    },
    'cotton': {
        soilTypes: ['black', 'alluvial', 'red'],
        phRange: [6.0, 8.0],
        rainfall: [600, 1200],
        temperature: [20, 35],
        season: ['kharif'],
        profitability: 'High',
        description: 'Cash crop requiring warm weather and well-drained soil',
        tips: 'Use Bt varieties for pest control, ensure proper spacing',
        diseases: 'Beware of bollworm attacks and bacterial blight'
    },
    'sugarcane': {
        soilTypes: ['loamy', 'clay', 'alluvial'],
        phRange: [6.0, 7.5],
        rainfall: [1000, 1800],
        temperature: [20, 30],
        season: ['kharif', 'rabi'],
        profitability: 'Very High',
        description: 'Perennial cash crop with high water and nutrient requirements',
        tips: 'Maintain soil moisture, use drip irrigation if possible',
        diseases: 'Control red rot and smut diseases early'
    },
    'maize': {
        soilTypes: ['loamy', 'sandy', 'alluvial'],
        phRange: [5.8, 7.8],
        rainfall: [400, 800],
        temperature: [18, 27],
        season: ['kharif', 'rabi'],
        profitability: 'Medium',
        description: 'Versatile crop good for food, feed, and industrial use',
        tips: 'Use hybrid varieties, ensure proper plant population',
        diseases: 'Watch for stem borer and leaf blight'
    },
    'soybean': {
        soilTypes: ['black', 'red', 'alluvial'],
        phRange: [6.0, 7.2],
        rainfall: [450, 700],
        temperature: [20, 30],
        season: ['kharif'],
        profitability: 'High',
        description: 'Legume crop that fixes nitrogen and improves soil fertility',
        tips: 'Inoculate seeds with rhizobium, avoid waterlogging',
        diseases: 'Control rust and bacterial pustule'
    },
    'tomato': {
        soilTypes: ['loamy', 'sandy', 'red'],
        phRange: [6.0, 7.0],
        rainfall: [400, 750],
        temperature: [18, 29],
        season: ['rabi', 'zaid'],
        profitability: 'Very High',
        description: 'High-value vegetable crop with excellent market demand',
        tips: 'Use staking for support, maintain consistent irrigation',
        diseases: 'Prevent early blight and bacterial wilt'
    },
    'onion': {
        soilTypes: ['loamy', 'sandy', 'alluvial'],
        phRange: [6.0, 7.5],
        rainfall: [350, 650],
        temperature: [15, 25],
        season: ['rabi'],
        profitability: 'High',
        description: 'Bulb crop with good storage life and processing potential',
        tips: 'Use quality seedlings, ensure proper curing',
        diseases: 'Control purple blotch and thrips infestation'
    },
    'potato': {
        soilTypes: ['sandy', 'loamy', 'alluvial'],
        phRange: [5.0, 6.0],
        rainfall: [300, 600],
        temperature: [15, 20],
        season: ['rabi'],
        profitability: 'High',
        description: 'Tuber crop requiring cool weather and well-drained soil',
        tips: 'Use certified seed potatoes, hill up soil around plants',
        diseases: 'Prevent late blight and bacterial wilt'
    },
    'mustard': {
        soilTypes: ['loamy', 'clay', 'alluvial'],
        phRange: [6.0, 7.5],
        rainfall: [300, 400],
        temperature: [10, 25],
        season: ['rabi'],
        profitability: 'Medium',
        description: 'Oilseed crop that tolerates cool weather and light frost',
        tips: 'Sow at proper time, use balanced fertilization',
        diseases: 'Control alternaria blight and aphids'
    },
    'groundnut': {
        soilTypes: ['sandy', 'red', 'black'],
        phRange: [6.0, 7.0],
        rainfall: [500, 750],
        temperature: [20, 30],
        season: ['kharif', 'rabi'],
        profitability: 'High',
        description: 'Legume oilseed crop that fixes nitrogen in soil',
        tips: 'Ensure calcium availability, avoid overwatering',
        diseases: 'Control leaf spot and rust diseases'
    },
    'chickpea': {
        soilTypes: ['black', 'loamy', 'clay'],
        phRange: [6.0, 7.5],
        rainfall: [200, 400],
        temperature: [10, 25],
        season: ['rabi'],
        profitability: 'High',
        description: 'Protein-rich pulse crop with good drought tolerance',
        tips: 'Avoid excess irrigation, use rhizobium inoculation',
        diseases: 'Control wilt and blight diseases'
    }
};

// Chatbot Responses Database
const chatbotResponses = {
    greetings: [
        "Hello! How can I assist you with your farming needs today? 🌾",
        "Hi there! I'm here to help with all your agricultural questions! 🚜",
        "Welcome! What farming challenges can I help you solve? 🌱"
    ],
    weather: [
        "Weather is crucial for farming! Our system provides real-time weather data including temperature, humidity, rainfall probability, and wind speed. Would you like me to explain how weather affects specific crops? 🌤",
        "Great question! Weather monitoring helps you make informed decisions about planting, irrigation, and harvesting. Check our weather section for up-to-date forecasts! ⛈"
    ],
    crops: [
        "I can recommend the best crops based on your soil type, climate, season, and budget. Try our AI recommendation tool above! 🌾",
        "Crop selection depends on many factors like soil pH, rainfall, temperature, and market demand. What specific information do you need? 🌱"
    ],
    soil: [
        "Soil health is fundamental! I can help you understand soil types, pH levels, and nutrient management. What's your soil type? 🌱",
        "Different crops thrive in different soil conditions. Clay, sandy, loamy - each has its advantages. Need specific soil advice? 🏔"
    ],
    market: [
        "Market prices fluctuate daily! Check our real-time market price section for current rates across different states. 📈",
        "Smart farmers track market trends! Our price analysis helps you choose profitable crops. Want to know about specific crop prices? 💰"
    ],
    pests: [
        "Pest management is crucial for good yields! Common issues include aphids, bollworms, and fungal diseases. What pest problems are you facing? 🐛",
        "Integrated Pest Management (IPM) is the best approach. Use biological controls, crop rotation, and targeted pesticides when necessary. 🛡"
    ],
    fertilizer: [
        "Balanced fertilization is key! Use soil testing to determine NPK requirements. Organic fertilizers improve soil health long-term. 🧪",
        "Different crops have different nutrient needs. Rice needs more nitrogen, while legumes need less. What crop are you growing? 🌾"
    ],
    irrigation: [
        "Water management is critical! Drip irrigation saves water and improves yields. Monitor soil moisture and avoid both drought stress and waterlogging. 💧",
        "Irrigation timing depends on crop growth stage and weather. Most crops need consistent moisture during flowering and grain filling. 🚿"
    ],
    default: [
        "I'm here to help with farming questions! Ask me about crops, weather, soil, pests, fertilizers, or market prices. 🤔",
        "That's an interesting question! Could you be more specific? I can help with crop recommendations, farming techniques, or market insights. 💭",
        "I'd love to help! Try asking about specific crops, soil problems, weather concerns, or farming techniques. 🎯"
    ]
};

// Initialize the website
document.addEventListener('DOMContentLoaded', function () {
    initializeAnimations();
    animateCounters();
    updateWeather();

    if (document.getElementById('marketGrid')) {
        initializeMarket();
        console.log('✅ Modern market section initialized!');
    }
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Header scroll effect
window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Animation on scroll
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                const counter = entry.target;
                let current = 0;
                const increment = target / 100;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => observer.observe(counter));
}

// Main crop recommendation function
async function getRecommendation() {
    // Get form values
    const location = document.getElementById('location').value;
    const season = document.getElementById('season').value;
    const soilType = document.getElementById('soilType').value;
    const soilPH = parseFloat(document.getElementById('soilPH').value);
    const rainfall = parseInt(document.getElementById('rainfall').value);
    const temperature = parseInt(document.getElementById('temperature').value);
    const farmSize = parseFloat(document.getElementById('farmSize').value);
    const budget = parseInt(document.getElementById('budget').value);

    // Validation
    if (!location || !season || !soilType || !soilPH || !rainfall || !temperature || !farmSize || !budget) {
        alert('⚠ Please fill in all fields to get accurate recommendations!');
        return;
    }

    if (soilPH < 0 || soilPH > 14) {
        alert('⚠ Soil pH should be between 0 and 14!');
        return;
    }

    // Show loading
    showLoading();

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // AI recommendation logic
    const recommendations = [];

    for (const [cropName, cropData] of Object.entries(cropDatabase)) {
        let score = 0;
        let reasons = [];

        // Soil type compatibility (25 points)
        if (cropData.soilTypes.includes(soilType)) {
            score += 25;
            reasons.push('✅ Perfect soil match');
        } else {
            const soilCompatibility = calculateSoilCompatibility(soilType, cropData.soilTypes);
            if (soilCompatibility > 0.5) {
                score += 15;
                reasons.push('⚠ Acceptable soil type');
            } else {
                reasons.push('❌ Soil type not suitable');
            }
        }

        // pH range (20 points)
        if (soilPH >= cropData.phRange[0] && soilPH <= cropData.phRange[1]) {
            score += 20;
            reasons.push('✅ Optimal pH range');
        } else if (Math.abs(soilPH - ((cropData.phRange[0] + cropData.phRange[1]) / 2)) <= 1) {
            score += 10;
            reasons.push('⚠ pH needs minor adjustment');
        } else {
            reasons.push('❌ pH requires significant correction');
        }

        // Rainfall compatibility (20 points)
        if (rainfall >= cropData.rainfall[0] && rainfall <= cropData.rainfall[1]) {
            score += 20;
            reasons.push('✅ Perfect rainfall conditions');
        } else if (rainfall < cropData.rainfall[0]) {
            const deficit = (cropData.rainfall[0] - rainfall) / cropData.rainfall[0];
            if (deficit < 0.3) {
                score += 10;
                reasons.push('💧 Needs supplemental irrigation');
            } else {
                reasons.push('💧 High irrigation requirement');
            }
        } else {
            const excess = (rainfall - cropData.rainfall[1]) / cropData.rainfall[1];
            if (excess < 0.3) {
                score += 10;
                reasons.push('🌧 Good drainage needed');
            } else {
                reasons.push('🌧 Risk of waterlogging');
            }
        }

        // Temperature compatibility (20 points)
        if (temperature >= cropData.temperature[0] && temperature <= cropData.temperature[1]) {
            score += 20;
            reasons.push('✅ Ideal temperature range');
        } else if (Math.abs(temperature - ((cropData.temperature[0] + cropData.temperature[1]) / 2)) <= 5) {
            score += 10;
            reasons.push('🌡 Acceptable temperature');
        } else {
            reasons.push('🌡 Temperature stress likely');
        }

        // Season compatibility (15 points)
        if (cropData.season.includes(season)) {
            score += 15;
            reasons.push('✅ Perfect season');
        } else {
            reasons.push('❌ Wrong season for planting');
        }

        // Budget consideration (bonus points)
        const estimatedCost = calculateCropCost(cropName, farmSize);
        if (budget >= estimatedCost * 1.2) {
            score += 5;
            reasons.push('💰 Excellent budget fit');
        } else if (budget >= estimatedCost) {
            score += 2;
            reasons.push('💰 Adequate budget');
        } else {
            reasons.push('💰 Budget may be tight');
        }

        // Only recommend crops with decent scores
        if (score >= 50) {
            recommendations.push({
                name: cropName,
                score: score,
                profitability: cropData.profitability,
                description: cropData.description,
                tips: cropData.tips,
                diseases: cropData.diseases,
                reasons: reasons,
                estimatedCost: estimatedCost,
                estimatedYield: calculateYield(cropName, farmSize),
                roi: calculateROI(cropName, farmSize, budget)
            });
        }
    }

    // Sort by score
    recommendations.sort((a, b) => b.score - a.score);

    hideLoading();
    displayResults(recommendations, farmSize, budget, location);
}

// Helper function to calculate soil compatibility
function calculateSoilCompatibility(actualSoil, preferredSoils) {
    const soilMatrix = {
        'clay': ['loamy', 'alluvial'],
        'sandy': ['loamy', 'red'],
        'loamy': ['clay', 'sandy', 'alluvial'],
        'black': ['clay', 'red'],
        'red': ['sandy', 'black', 'laterite'],
        'alluvial': ['loamy', 'clay'],
        'laterite': ['red', 'sandy']
    };

    const compatible = soilMatrix[actualSoil] || [];
    return preferredSoils.some(soil => compatible.includes(soil)) ? 0.6 : 0;
}

// Helper function to calculate crop cost
function calculateCropCost(cropName, farmSize) {
    const baseCosts = {
        'rice': 25000,
        'wheat': 20000,
        'cotton': 35000,
        'sugarcane': 80000,
        'maize': 22000,
        'soybean': 28000,
        'tomato': 50000,
        'onion': 30000,
        'potato': 45000,
        'mustard': 18000,
        'groundnut': 25000,
        'chickpea': 20000
    };

    return (baseCosts[cropName] || 25000) * farmSize;
}

// Helper function to calculate yield
function calculateYield(cropName, farmSize) {
    const yieldPerHectare = {
        'rice': 35,
        'wheat': 30,
        'cotton': 15,
        'sugarcane': 700,
        'maize': 45,
        'soybean': 25,
        'tomato': 400,
        'onion': 250,
        'potato': 200,
        'mustard': 12,
        'groundnut': 20,
        'chickpea': 15
    };

    return Math.round((yieldPerHectare[cropName] || 25) * farmSize);
}

// Helper function to calculate ROI
function calculateROI(cropName, farmSize, budget) {
    const estimatedYield = calculateYield(cropName, farmSize);
    const marketPrice = getMarketPrice(cropName);
    const estimatedRevenue = estimatedYield * marketPrice;
    return Math.round(((estimatedRevenue - budget) / budget) * 100);
}

// Helper function to get market price
function getMarketPrice(cropName) {
    const prices = {
        'rice': 1890,
        'wheat': 2150,
        'cotton': 5200,
        'sugarcane': 340,
        'maize': 1750,
        'soybean': 4200,
        'tomato': 2800,
        'onion': 3500,
        'potato': 2200,
        'mustard': 4500,
        'groundnut': 5000,
        'chickpea': 4800
    };

    return prices[cropName] || 2500;
}

// Show loading animation
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';
}

// Hide loading animation
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Display results function
function displayResults(recommendations, farmSize, budget, location) {
    const resultsDiv = document.getElementById('results');
    const cropResultsDiv = document.getElementById('cropResults');
    const additionalInfoDiv = document.getElementById('additionalInfo');

    if (recommendations.length === 0) {
        cropResultsDiv.innerHTML = `
                    <div class="crop-recommendation" style="background: linear-gradient(135deg, #f44336, #d32f2f);">
                        <h4>❌ No Suitable Crops Found</h4>
                        <p>Based on your current conditions, we couldn't find ideal crop matches. Consider:</p>
                        <div class="crop-reasons">
                            <div>🌱 Adjusting soil pH through lime or sulfur application</div>
                            <div>💧 Installing irrigation systems for water management</div>
                            <div>🗓 Waiting for the appropriate season</div>
                            <div>🧪 Conducting detailed soil testing</div>
                        </div>
                    </div>
                `;
    } else {
        let html = '';
        const topRecommendations = recommendations.slice(0, 3);

        topRecommendations.forEach((crop, index) => {
            const profitabilityColor = {
                'Very High': '#4CAF50',
                'High': '#8BC34A',
                'Medium': '#FF9800',
                'Low': '#F44336'
            };

            html += `
                        <div class="crop-recommendation">
                            <h4>${index + 1}. ${crop.name.toUpperCase()} 
                                <span style="font-size: 0.8em; opacity: 0.9;">(AI Score: ${crop.score}/100)</span>
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
                                <div>
                                    <strong>🎯 Profitability:</strong> 
                                    <span style="color: ${profitabilityColor[crop.profitability]}; font-weight: bold;">
                                        ${crop.profitability}
                                    </span>
                                </div>
                                <div><strong>💰 Est. Cost:</strong> ₹${crop.estimatedCost.toLocaleString()}</div>
                                <div><strong>📊 Est. Yield:</strong> ${crop.estimatedYield} quintals</div>
                                <div><strong>📈 Expected ROI:</strong> ${crop.roi}%</div>
                            </div>
                            <p><strong>Description:</strong> ${crop.description}</p>
                            <p><strong>💡 Pro Tip:</strong> ${crop.tips}</p>
                            <p><strong>⚠ Disease Alert:</strong> ${crop.diseases}</p>
                            <div class="crop-reasons">
                                <strong>AI Analysis:</strong><br>
                                ${crop.reasons.join('<br>')}
                            </div>
                        </div>
                    `;
        });
        cropResultsDiv.innerHTML = html;
    }

    // Additional comprehensive information
    const bestCrop = recommendations[0];
    const totalInvestment = budget;
    const expectedRevenue = bestCrop ? (bestCrop.estimatedYield * getMarketPrice(bestCrop.name)) : 0;
    const profitMargin = expectedRevenue - totalInvestment;

    additionalInfoDiv.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">
                    <div style="background: white; padding: 1.5rem; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <h4>📊 Financial Analysis</h4>
                        <div style="margin-top: 1rem;">
                            <p><strong>🏡 Farm Size:</strong> ${farmSize} hectares</p>
                            <p><strong>💰 Total Investment:</strong> ₹${totalInvestment.toLocaleString()}</p>
                            <p><strong>📈 Expected Revenue:</strong> ₹${expectedRevenue.toLocaleString()}</p>
                            <p><strong>💵 Estimated Profit:</strong> 
                                <span style="color: ${profitMargin > 0 ? '#4CAF50' : '#f44336'}; font-weight: bold;">
                                    ₹${profitMargin.toLocaleString()}
                                </span>
                            </p>
                            <p><strong>📊 Break-even:</strong> ${Math.ceil(totalInvestment / (expectedRevenue / (bestCrop?.estimatedYield || 1)))} quintals</p>
                        </div>
                    </div>

                    <div style="background: white; padding: 1.5rem; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <h4>🌱 Smart Farming Tips</h4>
                        <ul style="margin-top: 1rem; padding-left: 1.2rem;">
                            <li>🔄 <strong>Crop Rotation:</strong> Rotate crops to maintain soil health</li>
                            <li>🧪 <strong>Soil Testing:</strong> Test soil every 2-3 years</li>
                            <li>💧 <strong>Water Management:</strong> Use drip irrigation to save water</li>
                            <li>🌿 <strong>Organic Matter:</strong> Add compost to improve soil structure</li>
                            <li>🐛 <strong>IPM:</strong> Use Integrated Pest Management techniques</li>
                            <li>📱 <strong>Tech Adoption:</strong> Use farming apps for monitoring</li>
                        </ul>
                    </div>

                    <div style="background: white; padding: 1.5rem; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <h4>📅 Seasonal Calendar</h4>
                        <div style="margin-top: 1rem;">
                            <p><strong>🌱 Kharif Season:</strong> June-October<br>
                            <small>Rice, Cotton, Sugarcane, Maize, Soybean</small></p>
                            
                            <p><strong>🌾 Rabi Season:</strong> November-April<br>
                            <small>Wheat, Mustard, Chickpea, Potato, Onion</small></p>
                            
                            <p><strong>☀ Zaid Season:</strong> April-June<br>
                            <small>Tomato, Cucumber, Fodder crops</small></p>
                        </div>
                    </div>

                    <div style="background: white; padding: 1.5rem; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <h4>🎯 Success Factors</h4>
                        <div style="margin-top: 1rem;">
                            <div style="margin: 0.5rem 0;"><strong>Soil:</strong> ${getSuccessRating(recommendations[0]?.score >= 70 ? 'Good' : 'Needs Improvement')}</div>
                            <div style="margin: 0.5rem 0;"><strong>Climate:</strong> ${getSuccessRating('Suitable')}</div>
                            <div style="margin: 0.5rem 0;"><strong>Budget:</strong> ${getSuccessRating(budget > 30000 ? 'Adequate' : 'Limited')}</div>
                            <div style="margin: 0.5rem 0;"><strong>Season:</strong> ${getSuccessRating('Optimal')}</div>
                            <div style="margin: 0.5rem 0;"><strong>Market:</strong> ${getSuccessRating('Favorable')}</div>
                        </div>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 2rem; border-radius: 15px; margin-top: 2rem; text-align: center;">
                    <h4>🤝 Need More Help?</h4>
                    <p>Our AI assistant is here 24/7! Click the chat button to get personalized advice, ask questions, or get real-time farming tips.</p>
                    <button onclick="toggleChatbot()" class="cta-button" style="margin-top: 1rem;">💬 Chat with AI Assistant</button>
                </div>
            `;

    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Helper function for success rating
function getSuccessRating(status) {
    const colors = {
        'Good': '🟢',
        'Suitable': '🟢',
        'Adequate': '🟡',
        'Optimal': '🟢',
        'Favorable': '🟢',
        'Needs Improvement': '🟡',
        'Limited': '🟠'
    };
    return `${colors[status] || '🟡'} ${status}`;
}

// ============================================
// IMPROVED WEATHER FUNCTIONS WITH LOCATION CHANGE
// script.js e add koro ba replace koro
// ============================================

// Indian Cities with coordinates
const indianCities = [
    { name: 'Meenambakkam, Tamil Nadu', state: 'Tamil Nadu', lat: 12.99, lon: 80.18 },
    { name: 'Mumbai, Maharashtra', state: 'Maharashtra', lat: 19.08, lon: 72.88 },
    { name: 'Delhi, NCR', state: 'Delhi', lat: 28.61, lon: 77.23 },
    { name: 'Bangalore, Karnataka', state: 'Karnataka', lat: 12.97, lon: 77.59 },
    { name: 'Kolkata, West Bengal', state: 'West Bengal', lat: 22.57, lon: 88.36 },
    { name: 'Hyderabad, Telangana', state: 'Telangana', lat: 17.39, lon: 78.49 },
    { name: 'Chennai, Tamil Nadu', state: 'Tamil Nadu', lat: 13.09, lon: 80.28 },
    { name: 'Pune, Maharashtra', state: 'Maharashtra', lat: 18.52, lon: 73.86 },
    { name: 'Ahmedabad, Gujarat', state: 'Gujarat', lat: 23.03, lon: 72.59 },
    { name: 'Jaipur, Rajasthan', state: 'Rajasthan', lat: 26.91, lon: 75.79 },
    { name: 'Lucknow, Uttar Pradesh', state: 'Uttar Pradesh', lat: 26.85, lon: 80.95 },
    { name: 'Bhopal, Madhya Pradesh', state: 'Madhya Pradesh', lat: 23.26, lon: 77.41 },
    { name: 'Patna, Bihar', state: 'Bihar', lat: 25.59, lon: 85.14 },
    { name: 'Chandigarh, Punjab', state: 'Punjab', lat: 30.73, lon: 76.78 }
];

// Current location
let currentLocation = indianCities[0];

// Weather data with more realistic values
const weatherConditions = [
    { 
        condition: 'Sunny', 
        icon: 'wb_sunny', 
        tempRange: [28, 35], 
        humidityRange: [40, 60],
        rainChance: [0, 10],
        description: 'Clear skies, perfect for farming activities'
    },
    { 
        condition: 'Partly Cloudy', 
        icon: 'partly_cloudy_day', 
        tempRange: [25, 32], 
        humidityRange: [50, 70],
        rainChance: [10, 30],
        description: 'Mix of sun and clouds, good farming weather'
    },
    { 
        condition: 'Cloudy', 
        icon: 'cloud', 
        tempRange: [22, 28], 
        humidityRange: [60, 80],
        rainChance: [30, 50],
        description: 'Overcast skies, suitable for planting'
    },
    { 
        condition: 'Rainy', 
        icon: 'rainy', 
        tempRange: [20, 26], 
        humidityRange: [75, 95],
        rainChance: [60, 90],
        description: 'Rainfall expected, good for irrigation needs'
    }
];

const farmingAdvice = {
    sunny: "Perfect day for harvesting and drying crops. Apply pesticides in early morning.",
    partlyCloudy: "Good conditions for most farming activities. Monitor soil moisture levels.",
    cloudy: "Ideal for transplanting seedlings. Plants won't face heat stress.",
    rainy: "Avoid heavy machinery. Check drainage systems. Good for rain-fed crops."
};

const airQualityLevels = [
    { range: [0, 50], label: 'Good', color: '#4CAF50', advice: 'Excellent air quality for all farming activities' },
    { range: [51, 100], label: 'Moderate', color: '#FFC107', advice: 'Acceptable air quality for outdoor work' },
    { range: [101, 150], label: 'Unhealthy', color: '#FF5722', advice: 'Sensitive individuals should limit prolonged outdoor work' }
];

// Generate realistic weather data
function generateWeatherData() {
    const weatherType = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    const temp = Math.floor(Math.random() * (weatherType.tempRange[1] - weatherType.tempRange[0] + 1)) + weatherType.tempRange[0];
    const humidity = Math.floor(Math.random() * (weatherType.humidityRange[1] - weatherType.humidityRange[0] + 1)) + weatherType.humidityRange[0];
    const rainChance = Math.floor(Math.random() * (weatherType.rainChance[1] - weatherType.rainChance[0] + 1)) + weatherType.rainChance[0];
    const windSpeed = Math.floor(Math.random() * 20) + 5;
    const pressure = Math.floor(Math.random() * 30) + 1000;
    const feelsLike = temp + Math.floor(Math.random() * 5) - 2;
    
    // AQI
    const aqi = Math.floor(Math.random() * 120) + 10;
    const aqiData = airQualityLevels.find(level => aqi >= level.range[0] && aqi <= level.range[1]);
    
    return {
        temperature: temp,
        feelsLike: feelsLike,
        humidity: humidity,
        rainfall: rainChance,
        windSpeed: windSpeed,
        pressure: pressure,
        condition: weatherType.condition,
        icon: weatherType.icon,
        description: weatherType.description,
        aqi: aqi,
        aqiLabel: aqiData.label,
        aqiColor: aqiData.color,
        aqiAdvice: aqiData.advice,
        advice: getFarmingAdvice(weatherType.condition)
    };
}

function getFarmingAdvice(condition) {
    const key = condition.toLowerCase().replace(' ', '');
    return farmingAdvice[key] || "Monitor weather conditions regularly for optimal farming.";
}

// Show location change modal
function changeLocation() {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'location-modal';
    modal.innerHTML = `
        <div class="location-modal-content">
            <div class="location-modal-header">
                <h3>
                    <span class="material-symbols-outlined">location_on</span>
                    Select Your Location
                </h3>
                <button class="close-modal" onclick="closeLocationModal()">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="location-search">
                <input type="text" id="locationSearch" placeholder="Search city or state..." />
                <span class="material-symbols-outlined">search</span>
            </div>
            <div class="location-list" id="locationList">
                ${indianCities.map((city, index) => `
                    <div class="location-item ${city.name === currentLocation.name ? 'active' : ''}" onclick="selectLocation(${index})">
                        <span class="material-symbols-outlined">location_city</span>
                        <div class="location-info">
                            <div class="location-name">${city.name}</div>
                            <div class="location-state">${city.state}</div>
                        </div>
                        ${city.name === currentLocation.name ? '<span class="material-symbols-outlined check-icon">check_circle</span>' : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listener for search
    setTimeout(() => {
        const searchInput = document.getElementById('locationSearch');
        searchInput.focus();
        searchInput.addEventListener('input', filterLocations);
    }, 100);
    
    // Animate modal
    setTimeout(() => modal.classList.add('show'), 10);
}

// Filter locations based on search
function filterLocations() {
    const searchTerm = document.getElementById('locationSearch').value.toLowerCase();
    const locationList = document.getElementById('locationList');
    
    const filteredCities = indianCities.filter(city => 
        city.name.toLowerCase().includes(searchTerm) || 
        city.state.toLowerCase().includes(searchTerm)
    );
    
    locationList.innerHTML = filteredCities.map((city, index) => {
        const originalIndex = indianCities.findIndex(c => c.name === city.name);
        return `
            <div class="location-item ${city.name === currentLocation.name ? 'active' : ''}" onclick="selectLocation(${originalIndex})">
                <span class="material-symbols-outlined">location_city</span>
                <div class="location-info">
                    <div class="location-name">${city.name}</div>
                    <div class="location-state">${city.state}</div>
                </div>
                ${city.name === currentLocation.name ? '<span class="material-symbols-outlined check-icon">check_circle</span>' : ''}
            </div>
        `;
    }).join('');
}

// Select location
function selectLocation(index) {
    currentLocation = indianCities[index];
    
    // Update location display
    const locationDisplay = document.querySelector('.current-location span:last-child');
    if (locationDisplay) {
        locationDisplay.textContent = currentLocation.name;
    }
    
    // Close modal
    closeLocationModal();
    
    // Update weather for new location
    setTimeout(() => {
        showWeatherNotification(`Location changed to ${currentLocation.name}! 📍`, 'success');
        updateWeather();
    }, 300);
}

// Close location modal
function closeLocationModal() {
    const modal = document.querySelector('.location-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// Update weather with animation
function updateWeather() {
    const button = event?.target;
    
    // Show loading state
    if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">refresh</span> Updating...';
    }
    
    setTimeout(() => {
        const weather = generateWeatherData();
        
        // Update temperature with animation
        animateValue('temperature-val', parseInt(document.getElementById('temperature-val').textContent), weather.temperature, 1000);
        
        // Update other values
        document.getElementById('humidity-val').textContent = weather.humidity + '%';
        document.getElementById('rainfall-val').textContent = weather.rainfall + '%';
        document.getElementById('wind-val').textContent = weather.windSpeed + ' km/h';
        
        // Update pressure if element exists
        const pressureEl = document.querySelectorAll('.stat-value-weather')[3];
        if (pressureEl) {
            pressureEl.textContent = weather.pressure + ' hPa';
        }
        
        // Update weather icon and description
        const weatherIcon = document.querySelector('.weather-icon-main');
        if (weatherIcon) {
            weatherIcon.textContent = weather.icon;
            weatherIcon.style.animation = 'bounce 0.6s ease';
            setTimeout(() => weatherIcon.style.animation = '', 600);
        }
        
        const weatherDesc = document.querySelector('.weather-description');
        if (weatherDesc) {
            weatherDesc.textContent = weather.condition;
        }
        
        const feelsLike = document.querySelector('.feels-like');
        if (feelsLike) {
            feelsLike.textContent = `Feels like ${weather.feelsLike}°C`;
        }
        
        // Update farming advice
        const farmingCard = document.querySelector('.weather-info-card .info-card-content');
        if (farmingCard) {
            farmingCard.textContent = weather.advice;
        }
        
        // Update air quality
        const aqiCards = document.querySelectorAll('.weather-info-card');
        if (aqiCards.length > 1) {
            const aqiCard = aqiCards[1];
            const aqiContent = aqiCard.querySelector('.info-card-content');
            
            if (aqiContent) {
                aqiContent.innerHTML = `${weather.aqiAdvice}<div class="air-quality-badge" style="background: ${weather.aqiColor};">AQI: ${weather.aqi} - ${weather.aqiLabel}</div>`;
            }
        }
        
        // Success state
        if (button) {
            button.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Updated!';
            button.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
            
            setTimeout(() => {
                button.innerHTML = '<span class="material-symbols-outlined">refresh</span> Update Weather';
                button.style.background = '';
                button.disabled = false;
            }, 2000);
        }
        
        // Show success notification
        showWeatherNotification('Weather data updated successfully! 🌤️', 'success');
        
    }, 1500);
}

// Animate number changes
function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

// Generate 7-day forecast
function updatesevenWeather() {
    const button = event?.target;
    
    if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">refresh</span> Loading...';
    }
    
    setTimeout(() => {
        const forecastCards = document.querySelectorAll('.forecast-card');
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        forecastCards.forEach((card, index) => {
            const weatherType = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
            const temp = Math.floor(Math.random() * (weatherType.tempRange[1] - weatherType.tempRange[0] + 1)) + weatherType.tempRange[0];
            
            // Add animation
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.5s ease forwards';
                card.style.animationDelay = `${index * 0.1}s`;
            }, 10);
            
            card.querySelector('.forecast-day').textContent = days[index];
            card.querySelector('.forecast-icon').textContent = weatherType.icon;
            card.querySelector('.forecast-temp').textContent = temp + '°C';
            card.querySelector('.forecast-condition').textContent = weatherType.condition;
        });
        
        if (button) {
            button.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Updated!';
            button.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
            
            setTimeout(() => {
                button.innerHTML = '<span class="material-symbols-outlined">calendar_month</span> 7-Day Forecast';
                button.style.background = '';
                button.disabled = false;
            }, 2000);
        }
        
        showWeatherNotification('7-day forecast updated! 📅', 'success');
        
    }, 1500);
}

// Show notification
function showWeatherNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #66BB6A)' : 'linear-gradient(135deg, #f44336, #e57373)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 500;
        animation: slideInRight 0.4s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Add CSS for location modal and animations
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    @keyframes slideInRight {
        from { 
            opacity: 0;
            transform: translateX(100px);
        }
        to { 
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from { 
            opacity: 1;
            transform: translateX(0);
        }
        to { 
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Location Modal Styles */
    .location-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .location-modal.show {
        opacity: 1;
    }
    
    .location-modal-content {
        background: white;
        border-radius: 20px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    
    .location-modal.show .location-modal-content {
        transform: scale(1);
    }
    
    .location-modal-header {
        background: linear-gradient(135deg, var(--primary-green), var(--success-green));
        color: white;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .location-modal-header h3 {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.3rem;
    }
    
    .close-modal {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        cursor: pointer;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
    }
    
    .close-modal:hover {
        background: rgba(255, 255, 255, 0.3);
    }
    
    .location-search {
        padding: 1.5rem;
        border-bottom: 1px solid #E0E0E0;
        position: relative;
    }
    
    .location-search input {
        width: 100%;
        padding: 0.8rem 2.5rem 0.8rem 1rem;
        border: 2px solid var(--neutral-gray-lighter);
        border-radius: 12px;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.3s ease;
    }
    
    .location-search input:focus {
        border-color: var(--primary-green);
    }
    
    .location-search .material-symbols-outlined {
        position: absolute;
        right: 2rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
    }
    
    .location-list {
        max-height: 400px;
        overflow-y: auto;
    }
    
    .location-list::-webkit-scrollbar {
        width: 6px;
    }
    
    .location-list::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    
    .location-list::-webkit-scrollbar-thumb {
        background: var(--primary-green);
        border-radius: 3px;
    }
    
    .location-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 1rem 1.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        border-bottom: 1px solid #f5f5f5;
    }
    
    .location-item:hover {
        background: linear-gradient(135deg, #F1F8E9, #E8F5E9);
    }
    
    .location-item.active {
        background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
    }
    
    .location-item .material-symbols-outlined:first-child {
        color: var(--accent-orange);
        font-size: 1.8rem;
    }
    
    .location-info {
        flex: 1;
    }
    
    .location-name {
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 2px;
    }
    
    .location-state {
        font-size: 0.85rem;
        color: var(--text-secondary);
    }
    
    .check-icon {
        color: var(--success-green);
        font-size: 1.5rem;
    }
    
    .current-location {
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 8px 12px;
        border-radius: 10px;
    }
    
    .current-location:hover {
        background: rgba(245, 124, 0, 0.1);
    }
    
    @media (max-width: 768px) {
        .location-modal-content {
            width: 95%;
            max-height: 90vh;
        }
    }
`;
document.head.appendChild(style);

// Initialize weather on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial weather
    const initialWeather = generateWeatherData();
    
    document.getElementById('temperature-val').textContent = initialWeather.temperature;
    document.getElementById('humidity-val').textContent = initialWeather.humidity + '%';
    document.getElementById('rainfall-val').textContent = initialWeather.rainfall + '%';
    document.getElementById('wind-val').textContent = initialWeather.windSpeed + ' km/h';
    
    // Update weather icon
    const weatherIcon = document.querySelector('.weather-icon-main');
    if (weatherIcon) {
        weatherIcon.textContent = initialWeather.icon;
    }
    
    const weatherDesc = document.querySelector('.weather-description');
    if (weatherDesc) {
        weatherDesc.textContent = initialWeather.condition;
    }
    
    const feelsLike = document.querySelector('.feels-like');
    if (feelsLike) {
        feelsLike.textContent = `Feels like ${initialWeather.feelsLike}°C`;
    }
    
    // Make location clickable
    const locationDisplay = document.querySelector('.current-location');
    if (locationDisplay) {
        locationDisplay.onclick = changeLocation;
        locationDisplay.style.cursor = 'pointer';
        locationDisplay.title = 'Click to change location';
    }
    
    console.log('✅ Weather system with location change initialized successfully!');
});

// Generate random weather data (simulating API call)
function generateRandomWeather() {
    return {
        temperature: Math.floor(Math.random() * 20) + 15, // 15-35°C
        humidity: Math.floor(Math.random() * 40) + 40,    // 40-80%
        rainfall: Math.floor(Math.random() * 80) + 10,    // 10-90%
        windSpeed: Math.floor(Math.random() * 25) + 5     // 5-30 km/h
    };
}

// Chatbot functionality
function toggleChatbot() {
    const chatWindow = document.getElementById('chatbotWindow');
    chatbotOpen = !chatbotOpen;

    if (chatbotOpen) {
        chatWindow.style.display = 'flex';
        document.getElementById('chatInput').focus();
    } else {
        chatWindow.style.display = 'none';
    }
}

function handleEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message || isTyping) return;

    // Add user message
    addMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    showTyping();

    // Generate bot response
    setTimeout(async () => {
        const response = await generateBotResponse(message);
        hideTyping();
        addMessage(response, 'bot');
    }, Math.random() * 2000 + 1000); // Random delay 1-3 seconds
}

function addMessage(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message`;
    messageDiv.innerHTML = message;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTyping() {
    if (isTyping) return;
    isTyping = true;

    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTyping() {
    isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function generateBotResponse(userMessage) {
    try {
        // Create context for farming assistant
        const systemContext = `You are KrishiGrowAI Assistant, an expert AI farming assistant specializing in Indian agriculture. 
        You help farmers with:
        - Crop recommendations based on soil, weather, and season
        - Soil health and pH management
        - Pest and disease control
        - Market price insights
        - Irrigation and water management
        - Fertilizer recommendations
        - Weather-based farming decisions
        
        Provide practical, actionable advice in a friendly, encouraging tone. Use emojis appropriately. 
        Keep responses concise (2-4 sentences) but informative. Focus on Indian farming conditions and crops.`;

        const prompt = `${systemContext}\n\nFarmer's Question: ${userMessage}\n\nYour Response:`;

        // Call Gemini API
        const apiUrl = GEMINI_API_URL;
        const apiKey = GEMINI_API_KEY;
        
        const response = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300,
                    topP: 0.8,
                    topK: 40
                }
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        
        // Extract the generated text from Gemini response
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Invalid API response format');
        }

    } catch (error) {
        console.error('Gemini API Error:', error);
        
        // Fallback to local responses if API fails
        return generateLocalResponse(userMessage);
    }
}

// Fallback function for local responses when API is unavailable
function generateLocalResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Simple keyword matching for responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return getRandomResponse(chatbotResponses.greetings);
    }

    if (message.includes('weather') || message.includes('climate') || message.includes('temperature') || message.includes('rain')) {
        return getRandomResponse(chatbotResponses.weather);
    }

    if (message.includes('crop') || message.includes('plant') || message.includes('grow') || message.includes('recommend')) {
        return getRandomResponse(chatbotResponses.crops);
    }

    if (message.includes('soil') || message.includes('ph') || message.includes('nutrient')) {
        return getRandomResponse(chatbotResponses.soil);
    }

    if (message.includes('price') || message.includes('market') || message.includes('sell') || message.includes('profit')) {
        return getRandomResponse(chatbotResponses.market);
    }

    if (message.includes('pest') || message.includes('disease') || message.includes('insect') || message.includes('bug')) {
        return getRandomResponse(chatbotResponses.pests);
    }

    if (message.includes('fertilizer') || message.includes('manure') || message.includes('nutrition') || message.includes('npk')) {
        return getRandomResponse(chatbotResponses.fertilizer);
    }

    if (message.includes('water') || message.includes('irrigation') || message.includes('drought')) {
        return getRandomResponse(chatbotResponses.irrigation);
    }

    // Specific crop questions
    if (message.includes('rice')) {
        return "🌾 Rice is perfect for clayey soils with high water availability. Best grown in Kharif season (June-Oct). Key tips: maintain 2-5cm water level, use high-yielding varieties, and watch for blast disease. Current market price: ₹1,890/quintal. Need specific rice farming advice?";
    }

    if (message.includes('wheat')) {
        return "🌾 Wheat thrives in loamy soils with moderate water needs. Plant in Rabi season (Nov-Apr). Pro tips: sow early for better yield, use balanced NPK fertilization. Watch for rust diseases. Current price: ₹2,150/quintal. Want wheat cultivation details?";
    }

    if (message.includes('cotton')) {
        return "🌱 Cotton loves black cotton soil and warm weather. Kharif crop needing 600-1200mm rainfall. Use Bt varieties for bollworm control. Ensure proper plant spacing. Current price: ₹5,200/quintal. Need cotton farming guidance?";
    }

    // Thank you responses
    if (message.includes('thank') || message.includes('thanks')) {
        return "You're very welcome! 😊 I'm always here to help with your farming needs. Feel free to ask more questions anytime! 🌾";
    }

    // Default response with helpful suggestions
    return getRandomResponse(chatbotResponses.default);
}

function getRandomResponse(responseArray) {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}


 let communityOpen = false;
        let activeTab = 'community';

        // Sample community posts data
        const communityPosts = [
            {
                id: 1,
                user: "RameshF",
                avatar: "R",
                content: "Just harvested my wheat crop! Got 35 quintals per hectare this season. The AI recommendations really helped with the timing. 🌾",
                likes: 24,
                replies: 7,
                time: "2 hours ago"
            },
            {
                id: 2,
                user: "PriyaK",
                avatar: "P", 
                content: "Has anyone tried intercropping tomatoes with marigold? I'm seeing great results in pest control! 🍅🌼",
                likes: 18,
                replies: 12,
                time: "5 hours ago"
            },
            {
                id: 3,
                user: "SureshA",
                avatar: "S",
                content: "Cotton prices are looking good this month. Market analysis from the app was spot on! Thanks KrishiGrow! 📈",
                likes: 31,
                replies: 9,
                time: "1 day ago"
            },
            {
                id: 4,
                user: "MeeraS",
                avatar: "M",
                content: "Looking for advice on organic fertilizers for rice cultivation. What has worked best for you?",
                likes: 15,
                replies: 23,
                time: "2 days ago"
            }
        ];

        // Sample consultant data
        const consultants = [
            {
                id: 1,
                name: "Dr. Arvind Kumar",
                speciality: "Soil Health & Crop Nutrition",
                rating: "⭐⭐⭐⭐⭐",
                price: "₹500/hour",
                experience: "15+ years",
                available: true
            },
            {
                id: 2,
                name: "Prof. Sunita Sharma",
                speciality: "Pest Management & Organic Farming",
                rating: "⭐⭐⭐⭐⭐",
                price: "₹600/hour", 
                experience: "20+ years",
                available: true
            },
            {
                id: 3,
                name: "Rajesh Patil",
                speciality: "Market Analysis & Crop Planning",
                rating: "⭐⭐⭐⭐",
                price: "₹400/hour",
                experience: "12+ years",
                available: false
            },
            {
                id: 4,
                name: "Dr. Kavitha Reddy",
                speciality: "Water Management & Irrigation",
                rating: "⭐⭐⭐⭐⭐",
                price: "₹550/hour",
                experience: "18+ years", 
                available: true
            }
        ];

        // Toggle community panel
        function toggleCommunity() {
            const communityPanel = document.getElementById('communityPanel');
            communityOpen = !communityOpen;

            if (communityOpen) {
                communityPanel.style.display = 'flex';
                loadCommunityContent();
            } else {
                communityPanel.style.display = 'none';
            }
        }

        // Switch between tabs
        function switchTab(tab) {
            activeTab = tab;
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Show/hide content
            document.getElementById('communityTab').style.display = tab === 'community' ? 'block' : 'none';
            document.getElementById('consultancyTab').style.display = tab === 'consultancy' ? 'block' : 'none';
            
            if (tab === 'consultancy') {
                loadConsultancyContent();
            }
        }

        // Load community posts
        function loadCommunityContent() {
            const postsContainer = document.getElementById('communityPosts');
            let html = '';
            
            communityPosts.forEach(post => {
                html += `
                    <div class="post">
                        <div class="post-header">
                            <div class="user-avatar">${post.avatar}</div>
                            <div>
                                <div class="post-meta">
                                    <strong>${post.user}</strong> • ${post.time}
                                </div>
                            </div>
                        </div>
                        <div class="post-content">${post.content}</div>
                        <div class="post-actions">
                            <span onclick="likePost(${post.id})">👍 ${post.likes}</span>
                            <span onclick="replyToPost(${post.id})">💬 ${post.replies}</span>
                            <span onclick="sharePost(${post.id})">📤 Share</span>
                        </div>
                    </div>
                `;
            });
            
            postsContainer.innerHTML = html;
        }

        // Load consultancy options
        function loadConsultancyContent() {
            const consultancyContainer = document.getElementById('consultancyOptions');
            let html = '';
            
            consultants.forEach(consultant => {
                const statusColor = consultant.available ? '#4CAF50' : '#f44336';
                const statusText = consultant.available ? 'Available' : 'Busy';
                
                html += `
                    <div class="consultant-card">
                        <div class="consultant-header">
                            <div class="consultant-name">${consultant.name}</div>
                            <div class="consultant-price">${consultant.price}</div>
                        </div>
                        <div class="consultant-speciality">${consultant.speciality}</div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin: 0.5rem 0;">
                            <div>${consultant.rating} (${consultant.experience})</div>
                            <div style="color: ${statusColor}; font-weight: bold; font-size: 0.9rem;">${statusText}</div>
                        </div>
                        <button class="book-btn" onclick="bookConsultation(${consultant.id})" ${!consultant.available ? 'disabled style="opacity: 0.6; cursor: not-allowed;"' : ''}>
                            ${consultant.available ? '📅 Book Consultation' : '⏰ Join Waitlist'}
                        </button>
                    </div>
                `;
            });
            
            consultancyContainer.innerHTML = html;
        }

        // Create new post
        function createPost() {
            const postText = document.getElementById('postText').value.trim();
            if (!postText) {
                alert('Please write something to post!');
                return;
            }
            
            // Add new post to the beginning of the array
            const newPost = {
                id: Date.now(),
                user: "You",
                avatar: "Y",
                content: postText,
                likes: 0,
                replies: 0,
                time: "Just now"
            };
            
            communityPosts.unshift(newPost);
            document.getElementById('postText').value = '';
            loadCommunityContent();
            
            // Show success message
            showNotification('Post shared successfully! 🎉');
        }

        // Like post
        function likePost(postId) {
            const post = communityPosts.find(p => p.id === postId);
            if (post) {
                post.likes++;
                loadCommunityContent();
                showNotification('Post liked! 👍');
            }
        }

        // Reply to post
        function replyToPost(postId) {
            const reply = prompt('Write your reply:');
            if (reply && reply.trim()) {
                const post = communityPosts.find(p => p.id === postId);
                if (post) {
                    post.replies++;
                    loadCommunityContent();
                    showNotification('Reply posted! 💬');
                }
            }
        }

        // Share post
        function sharePost(postId) {
            showNotification('Post link copied to clipboard! 📤');
        }

        // Book consultation
        function bookConsultation(consultantId) {
            const consultant = consultants.find(c => c.id === consultantId);
            if (consultant) {
                if (consultant.available) {
                    // Simulate booking process
                    const confirmBooking = confirm(`Book consultation with ${consultant.name}?\n\nSpeciality: ${consultant.speciality}\nPrice: ${consultant.price}\n\nThis will redirect you to payment.`);
                    
                    if (confirmBooking) {
                        showNotification(`Consultation booked with ${consultant.name}! 📅\nYou'll receive a confirmation email shortly.`);
                        consultant.available = false;
                        loadConsultancyContent();
                    }
                } else {
                    showNotification(`Added to waitlist for ${consultant.name} ⏰\nWe'll notify you when they're available.`);
                }
            }
        }

        // Show notification
        function showNotification(message) {
            // Create temporary notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                padding: 1rem;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Initialize community when page loads
        document.addEventListener('DOMContentLoaded', function() {
            loadCommunityContent();
        });

        // ============================================
// MODERN MARKET PRICE SECTION JAVASCRIPT
// Add this to script.js
// ============================================

// Enhanced Market Data with more details
const marketDataEnhanced = [
    { 
        id: 1,
        crop: 'Wheat', 
        variety: 'Durum',
        icon: '🌾',
        price: 2150, 
        trend: 'up', 
        change: 5, 
        market: 'Delhi', 
        state: 'Delhi',
        minPrice: 2000,
        maxPrice: 2300,
        volume: '2500 quintals',
        quality: 'Grade A',
        updated: new Date() 
    },
    { 
        id: 2,
        crop: 'Rice', 
        variety: 'Basmati',
        icon: '🌾',
        price: 1890, 
        trend: 'down', 
        change: -2, 
        market: 'Amritsar', 
        state: 'Punjab',
        minPrice: 1800,
        maxPrice: 2000,
        volume: '3200 quintals',
        quality: 'Grade A',
        updated: new Date() 
    },
    { 
        id: 3,
        crop: 'Cotton', 
        variety: 'Medium Staple',
        icon: '🌱',
        price: 5200, 
        trend: 'up', 
        change: 8, 
        market: 'Rajkot', 
        state: 'Gujarat',
        minPrice: 4800,
        maxPrice: 5500,
        volume: '1800 quintals',
        quality: 'Grade B',
        updated: new Date() 
    },
    { 
        id: 4,
        crop: 'Sugarcane', 
        variety: 'Co 0238',
        icon: '🎋',
        price: 340, 
        trend: 'stable', 
        change: 0, 
        market: 'Lucknow', 
        state: 'UP',
        minPrice: 320,
        maxPrice: 360,
        volume: '5000 quintals',
        quality: 'Fresh',
        updated: new Date() 
    },
    { 
        id: 5,
        crop: 'Maize', 
        variety: 'Hybrid',
        icon: '🌽',
        price: 1750, 
        trend: 'up', 
        change: 3, 
        market: 'Belgaum', 
        state: 'Karnataka',
        minPrice: 1650,
        maxPrice: 1850,
        volume: '2100 quintals',
        quality: 'Grade A',
        updated: new Date() 
    },
    { 
        id: 6,
        crop: 'Soybean', 
        variety: 'JS 95-60',
        icon: '🫘',
        price: 4200, 
        trend: 'up', 
        change: 6, 
        market: 'Indore', 
        state: 'MP',
        minPrice: 3900,
        maxPrice: 4400,
        volume: '1900 quintals',
        quality: 'Grade A',
        updated: new Date() 
    },
    { 
        id: 7,
        crop: 'Tomato', 
        variety: 'Hybrid',
        icon: '🍅',
        price: 2800, 
        trend: 'down', 
        change: -12, 
        market: 'Pune', 
        state: 'Maharashtra',
        minPrice: 2500,
        maxPrice: 3200,
        volume: '800 quintals',
        quality: 'Fresh',
        updated: new Date() 
    },
    { 
        id: 8,
        crop: 'Onion', 
        variety: 'Red Onion',
        icon: '🧅',
        price: 3500, 
        trend: 'up', 
        change: 15, 
        market: 'Nashik', 
        state: 'Maharashtra',
        minPrice: 3000,
        maxPrice: 4000,
        volume: '4200 quintals',
        quality: 'Grade A',
        updated: new Date() 
    },
    { 
        id: 9,
        crop: 'Potato', 
        variety: 'Kufri Jyoti',
        icon: '🥔',
        price: 2200, 
        trend: 'stable', 
        change: 1, 
        market: 'Agra', 
        state: 'UP',
        minPrice: 2100,
        maxPrice: 2400,
        volume: '3500 quintals',
        quality: 'Grade A',
        updated: new Date() 
    },
    { 
        id: 10,
        crop: 'Chickpea', 
        variety: 'Kabuli',
        icon: '🫘',
        price: 4800, 
        trend: 'up', 
        change: 4, 
        market: 'Jaipur', 
        state: 'Rajasthan',
        minPrice: 4500,
        maxPrice: 5100,
        volume: '1600 quintals',
        quality: 'Grade A',
        updated: new Date() 
    },
    { 
        id: 11,
        crop: 'Groundnut', 
        variety: 'Bold',
        icon: '🥜',
        price: 5000, 
        trend: 'down', 
        change: -3, 
        market: 'Rajkot', 
        state: 'Gujarat',
        minPrice: 4700,
        maxPrice: 5300,
        volume: '1400 quintals',
        quality: 'Grade A',
        updated: new Date() 
    },
    { 
        id: 12,
        crop: 'Mustard', 
        variety: 'Yellow',
        icon: '🌼',
        price: 4500, 
        trend: 'stable', 
        change: 0, 
        market: 'Bharatpur', 
        state: 'Rajasthan',
        minPrice: 4300,
        maxPrice: 4700,
        volume: '1200 quintals',
        quality: 'Grade B',
        updated: new Date() 
    }
];

let currentFilter = 'all';
let filteredMarketData = [...marketDataEnhanced];

// Initialize market section
function initializeMarket() {
    renderMarketCards();
    updateMarketStats();
}

// Render market cards
function renderMarketCards() {
    const gridContainer = document.getElementById('marketGrid');
    if (!gridContainer) return;

    let html = '';

    filteredMarketData.forEach(item => {
        const trendIcon = {
            'up': 'trending_up',
            'down': 'trending_down',
            'stable': 'horizontal_rule'
        };

        const trendClass = `trend-${item.trend}`;
        
        const changeText = item.change > 0 
            ? `+${item.change}%` 
            : item.change < 0 
            ? `${item.change}%` 
            : 'No change';

        html += `
            <div class="market-card" data-crop="${item.crop.toLowerCase()}" data-trend="${item.trend}" onclick="showCropDetails(${item.id})">
                <div class="market-card-header">
                    <div class="crop-info">
                        <div class="crop-icon">${item.icon}</div>
                        <div class="crop-details">
                            <h3>${item.crop}</h3>
                            <div class="crop-variety">${item.variety}</div>
                        </div>
                    </div>
                    <div class="trend-badge ${trendClass}">
                        <span class="material-symbols-outlined">${trendIcon[item.trend]}</span>
                        ${changeText}
                    </div>
                </div>

                <div class="price-section">
                    <div class="current-price">₹${item.price.toLocaleString()}</div>
                    <div class="price-unit">per quintal</div>
                    <div class="price-change ${trendClass}">
                        Range: ₹${item.minPrice} - ₹${item.maxPrice}
                    </div>
                </div>

                <div class="market-details">
                    <div class="detail-item">
                        <div class="detail-label">📍 Market</div>
                        <div class="detail-value">${item.market}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">📦 Volume</div>
                        <div class="detail-value">${item.volume}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">⭐ Quality</div>
                        <div class="detail-value">${item.quality}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">🕐 Updated</div>
                        <div class="detail-value">${getTimeAgo(item.updated)}</div>
                    </div>
                </div>
            </div>
        `;
    });

    gridContainer.innerHTML = html;

    // Add animation
    setTimeout(() => {
        const cards = document.querySelectorAll('.market-card');
        cards.forEach((card, index) => {
            card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.05}s`;
        });
    }, 10);
}

// Update market stats
function updateMarketStats() {
    const totalCrops = marketDataEnhanced.length;
    const uniqueMandis = [...new Set(marketDataEnhanced.map(item => item.market))].length;
    const priceIncreases = marketDataEnhanced.filter(item => item.change > 0).length;

    document.getElementById('totalCrops').textContent = totalCrops;
    document.getElementById('totalMandis').textContent = uniqueMandis;
    document.getElementById('priceIncreases').textContent = priceIncreases;
}

// Filter market by trend
function filterMarket(type) {
    currentFilter = type;

    // Update button active state
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.filter-btn').classList.add('active');

    // Filter data
    if (type === 'all') {
        filteredMarketData = [...marketDataEnhanced];
    } else {
        filteredMarketData = marketDataEnhanced.filter(item => item.trend === type);
    }

    renderMarketCards();
    showMarketNotification(`Showing ${filteredMarketData.length} ${type === 'all' ? 'crops' : type + ' trend crops'}`, 'info');
}

// Search market
function searchMarket() {
    const searchTerm = document.getElementById('marketSearch').value.toLowerCase();

    if (searchTerm === '') {
        filteredMarketData = currentFilter === 'all' 
            ? [...marketDataEnhanced] 
            : marketDataEnhanced.filter(item => item.trend === currentFilter);
    } else {
        const baseData = currentFilter === 'all' 
            ? marketDataEnhanced 
            : marketDataEnhanced.filter(item => item.trend === currentFilter);

        filteredMarketData = baseData.filter(item => 
            item.crop.toLowerCase().includes(searchTerm) ||
            item.market.toLowerCase().includes(searchTerm) ||
            item.state.toLowerCase().includes(searchTerm) ||
            item.variety.toLowerCase().includes(searchTerm)
        );
    }

    renderMarketCards();
}

// Refresh market prices
function refreshMarketPrices() {
    const button = event.target;
    const originalHTML = button.innerHTML;

    button.disabled = true;
    button.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">refresh</span> Updating...';

    setTimeout(() => {
        // Update prices with random changes
        marketDataEnhanced.forEach(item => {
            const changePercent = (Math.random() - 0.5) * 0.15; // ±7.5%
            const priceChange = Math.round(item.price * changePercent);
            
            item.price = Math.max(item.minPrice, Math.min(item.maxPrice, item.price + priceChange));
            item.change = Math.round((priceChange / item.price) * 100);
            
            // Update trend
            if (item.change > 2) {
                item.trend = 'up';
            } else if (item.change < -2) {
                item.trend = 'down';
            } else {
                item.trend = 'stable';
            }

            item.updated = new Date();
        });

        // Re-filter based on current filter
        if (currentFilter !== 'all') {
            filteredMarketData = marketDataEnhanced.filter(item => item.trend === currentFilter);
        } else {
            filteredMarketData = [...marketDataEnhanced];
        }

        renderMarketCards();
        updateMarketStats();

        button.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Updated!';
        button.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.disabled = false;
        }, 2000);

        showMarketNotification('Market prices updated successfully! 📊', 'success');
    }, 1500);
}

// Show crop details
function showCropDetails(cropId) {
    const crop = marketDataEnhanced.find(item => item.id === cropId);
    if (!crop) return;

    const modal = document.createElement('div');
    modal.className = 'crop-details-modal';
    modal.innerHTML = `
        <div class="crop-details-content">
            <div class="crop-details-header">
                <div>
                    <h2>${crop.icon} ${crop.crop}</h2>
                    <p>${crop.variety}</p>
                </div>
                <button class="close-modal" onclick="closeCropModal()">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="crop-details-body">
                <div class="detail-row">
                    <div class="detail-col">
                        <h3>Current Price</h3>
                        <div class="big-price">₹${crop.price.toLocaleString()}</div>
                        <div class="price-subtext">per quintal</div>
                    </div>
                    <div class="detail-col">
                        <h3>Price Change</h3>
                        <div class="big-change trend-${crop.trend}">
                            ${crop.change > 0 ? '+' : ''}${crop.change}%
                        </div>
                        <div class="price-subtext">in last update</div>
                    </div>
                </div>

                <div class="info-grid">
                    <div class="info-item">
                        <span class="material-symbols-outlined">location_on</span>
                        <div>
                            <strong>Market Location</strong>
                            <p>${crop.market}, ${crop.state}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="material-symbols-outlined">inventory_2</span>
                        <div>
                            <strong>Available Volume</strong>
                            <p>${crop.volume}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="material-symbols-outlined">star</span>
                        <div>
                            <strong>Quality Grade</strong>
                            <p>${crop.quality}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="material-symbols-outlined">sync</span>
                        <div>
                            <strong>Last Updated</strong>
                            <p>${getTimeAgo(crop.updated)}</p>
                        </div>
                    </div>
                </div>

                <div class="price-range-info">
                    <h3>Price Range (Today)</h3>
                    <div class="range-bar">
                        <div class="range-marker" style="left: ${((crop.price - crop.minPrice) / (crop.maxPrice - crop.minPrice)) * 100}%"></div>
                    </div>
                    <div class="range-labels">
                        <span>Min: ₹${crop.minPrice}</span>
                        <span>Max: ₹${crop.maxPrice}</span>
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="modal-btn-primary" onclick="trackCrop(${crop.id})">
                        <span class="material-symbols-outlined">notifications</span>
                        Track Price
                    </button>
                    <button class="modal-btn-secondary" onclick="viewHistory(${crop.id})">
                        <span class="material-symbols-outlined">history</span>
                        View History
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

// Close crop modal
function closeCropModal() {
    const modal = document.querySelector('.crop-details-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// Toggle price chart
function toggleChart() {
    const chart = document.getElementById('priceChart');
    chart.classList.toggle('active');
    
    if (chart.classList.contains('active')) {
        showMarketNotification('Price trend chart displayed 📈', 'info');
    }
}

// Export market data
function exportMarketData() {
    showMarketNotification('Exporting market data... 📥', 'info');
    
    setTimeout(() => {
        // Create CSV data
        let csv = 'Crop,Variety,Price (₹/quintal),Change %,Market,State,Quality,Volume\n';
        
        marketDataEnhanced.forEach(item => {
            csv += `${item.crop},${item.variety},${item.price},${item.change}%,${item.market},${item.state},${item.quality},${item.volume}\n`;
        });

        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `market_prices_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        showMarketNotification('Market data exported successfully! ✅', 'success');
    }, 1000);
}

// Compare markets
function compareMarkets() {
    showMarketNotification('Market comparison feature coming soon! 🔄', 'info');
}

// Track crop
function trackCrop(cropId) {
    const crop = marketDataEnhanced.find(item => item.id === cropId);
    showMarketNotification(`Now tracking ${crop.crop} prices! 🔔`, 'success');
    closeCropModal();
}

// View history
function viewHistory(cropId) {
    const crop = marketDataEnhanced.find(item => item.id === cropId);
    showMarketNotification(`Loading price history for ${crop.crop}... 📊`, 'info');
}

// Get time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// Show market notification - ONLY CALLED FOR SUCCESS MESSAGES
function showMarketNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'linear-gradient(135deg, #4CAF50, #66BB6A)' 
                   : type === 'info' ? 'linear-gradient(135deg, #4CAF50, #66BB6A)'
                   : 'linear-gradient(135deg, #f44336, #e57373)';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 500;
        animation: slideInRight 0.4s ease-out;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}
// Add modal styles
const marketModalStyles = document.createElement('style');
marketModalStyles.textContent = `
    .crop-details-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .crop-details-modal.show {
        opacity: 1;
    }

    .crop-details-content {
        background: white;
        border-radius: 25px;
        width: 90%;
        max-width: 600px;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }

    .crop-details-modal.show .crop-details-content {
        transform: scale(1);
    }

    .crop-details-header {
        background: linear-gradient(135deg, var(--primary-green), var(--success-green));
        color: white;
        padding: 2rem;
        border-radius: 25px 25px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .crop-details-header h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .crop-details-header p {
        opacity: 0.9;
        font-size: 1.1rem;
    }

    .crop-details-body {
        padding: 2rem;
    }

    .detail-row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        margin-bottom: 2rem;
        text-align: center;
    }

    .detail-col h3 {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
    }

    .big-price {
        font-size: 3rem;
        font-weight: 700;
        color: var(--primary-green-dark);
    }

    .big-change {
        font-size: 2.5rem;
        font-weight: 700;
    }

    .price-subtext {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .info-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: linear-gradient(135deg, #F1F8E9, #E8F5E9);
        border-radius: 12px;
    }

    .info-item .material-symbols-outlined {
        font-size: 2rem;
        color: var(--accent-orange);
    }

    .info-item strong {
        display: block;
        color: var(--primary-green-dark);
        margin-bottom: 0.3rem;
        font-size: 0.9rem;
    }

    .info-item p {
        color: var(--text-secondary);
        font-size: 0.95rem;
    }

    .price-range-info {
        background: linear-gradient(135deg, #F1F8E9, #E8F5E9);
        padding: 1.5rem;
        border-radius: 15px;
        margin-bottom: 2rem;
    }

    .price-range-info h3 {
        color: var(--primary-green-dark);
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }

    .range-bar {
        height: 8px;
        background: #E0E0E0;
        border-radius: 10px;
        position: relative;
        margin-bottom: 0.5rem;
    }

    .range-marker {
        position: absolute;
        width: 16px;
        height: 16px;
        background: var(--primary-green);
        border-radius: 50%;
        top: -4px;
        transform: translateX(-50%);
        box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
    }

    .range-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: var(--text-secondary);
        font-weight: 600;
    }

    .action-buttons {
        display: flex;
        gap: 1rem;
    }

    .modal-btn-primary,
    .modal-btn-secondary {
        flex: 1;
        padding: 1rem;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
    }

    .modal-btn-primary {
        background: linear-gradient(135deg, var(--primary-green), var(--success-green));
        color: white;
    }

    .modal-btn-secondary {
        background: white;
        color: var(--primary-green-dark);
        border: 2px solid var(--primary-green);
    }

    .modal-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
    }

    .modal-btn-secondary:hover {
        background: var(--primary-green);
        color: white;
    }

    @media (max-width: 768px) {
        .detail-row,
        .info-grid {
            grid-template-columns: 1fr;
        }

        .action-buttons {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(marketModalStyles);

// Initialize market on page load
