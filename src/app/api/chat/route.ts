import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Trail, Weather, HikingSuitability } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface ChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
  trailContext: Trail | null;
  weatherContext: Weather | null;
  suitabilityContext: HikingSuitability | null;
}

// Singapore trails knowledge base
const SINGAPORE_TRAILS_INFO = `
Available hiking trails in Singapore:

1. MacRitchie TreeTop Walk - 11km loop, moderate difficulty
   - Famous 250m free-standing suspension bridge
   - Opens 9am-5pm, closed Mondays
   - Wildlife: monkeys, flying lemurs

2. Bukit Timah Nature Reserve - 3.2km, moderate difficulty
   - Singapore's highest point (163.63m)
   - Primary rainforest with rich biodiversity
   - Multiple trail routes available

3. Southern Ridges - 10km point-to-point, easy difficulty
   - Connects 5 parks including Henderson Waves bridge
   - Great for sunset views
   - Multiple entry/exit points

4. Pulau Ubin Chek Jawa - 8.5km loop, easy difficulty
   - Offshore island with diverse ecosystems
   - Take bumboat from Changi Point Ferry Terminal
   - Check tide times for boardwalk

5. Green Corridor (Rail Corridor) - 24km, easy difficulty
   - Former railway line heritage trail
   - Mostly flat, suitable for all ages
   - Can be done in sections

6. Sungei Buloh Wetland Reserve - 4km loop, easy difficulty
   - ASEAN Heritage Park, famous for migratory birds
   - Best for birdwatching Sep-Mar
   - Crocodiles present - stay on paths

7. Coney Island Park - 5.5km loop, easy difficulty
   - Rustic island park, beaches and mangroves
   - No shops - bring water and snacks
   - Watch out for wild boars

8. Chestnut Nature Park - 8.2km loop, moderate difficulty
   - Singapore's largest nature park
   - Separate trails for hikers and bikers
   - North easier, South more challenging

9. Labrador Nature Reserve - 2.1km loop, easy difficulty
   - Coastal reserve with WWII relics
   - Connects to Southern Ridges
   - Good for sunset views

10. Fort Canning Park - 2.5km loop, easy difficulty
    - Historical hilltop park in city center
    - Famous spiral staircase photo spot
    - Near Dhoby Ghaut MRT
`;

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, trailContext, weatherContext, suitabilityContext } = body;

    // Build system message with context
    const systemMessage = buildSystemMessage(trailContext, weatherContext, suitabilityContext);

    if (GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Build conversation history for Gemini
        const chatHistory = messages.slice(0, -1).map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

        // Always include system context as the first user message if history is empty
        // Or prepend it to ensure context is maintained
        const chat = model.startChat({
          history: chatHistory.length > 0 ? [
            { role: 'user', parts: [{ text: 'System context: ' + systemMessage }] },
            { role: 'model', parts: [{ text: 'I understand. I\'m a helpful hiking assistant for Singapore trails. I\'ll help users with trail information, safety tips, and hiking preparation. How can I assist you today?' }] },
            ...chatHistory
          ] : [],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          },
        });

        const lastMessage = messages[messages.length - 1]?.content || '';
        const prompt = chatHistory.length === 0
          ? `${systemMessage}\n\nUser question: ${lastMessage}\n\nPlease provide a helpful, friendly response about hiking in Singapore.`
          : lastMessage;

        const result = await chat.sendMessage(prompt);
        const responseMessage = result.response.text() || 'Sorry, I could not generate a response. Please try again.';

        return NextResponse.json({ message: responseMessage });
      } catch (apiError) {
        console.error('Gemini API error:', apiError);
        // Fall back to mock response if API fails
        const mockResponse = generateMockResponse(messages[messages.length - 1]?.content || '', trailContext, weatherContext, suitabilityContext);
        return NextResponse.json({ message: mockResponse });
      }
    }

    // Return mock response if no API key
    const mockResponse = generateMockResponse(messages[messages.length - 1]?.content || '', trailContext, weatherContext, suitabilityContext);
    return NextResponse.json({ message: mockResponse });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message', message: 'Sorry, something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

function buildSystemMessage(
  trail: Trail | null,
  weather: Weather | null,
  suitability: HikingSuitability | null
): string {
  let context = `You are a friendly and knowledgeable hiking assistant specializing in Singapore trails. You help users find trails, prepare for hikes, and stay safe outdoors. Be conversational, helpful, and safety-focused. Provide specific, actionable advice.

${SINGAPORE_TRAILS_INFO}`;

  if (trail) {
    context += `\n\n=== CURRENTLY SELECTED TRAIL ===
Trail: ${trail.name}
Location: ${trail.location.city}, ${trail.location.state}
Distance: ${trail.stats.distance}km
Elevation gain: ${trail.stats.elevationGain}m
Difficulty: ${trail.stats.difficulty}
Trail type: ${trail.stats.trailType}
Estimated time: ${Math.round(trail.stats.estimatedTime / 60)} hours
Facilities: ${Object.entries(trail.facilities).filter(([, v]) => v).map(([k]) => k).join(', ') || 'Limited facilities'}
Safety notes: ${trail.safetyNotes.join('; ') || 'Standard precautions apply'}
Rating: ${trail.rating}/5 (${trail.reviewCount} reviews)`;
  }

  if (weather) {
    context += `\n\n=== CURRENT WEATHER ===
Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)
Condition: ${weather.condition}
Wind: ${weather.windSpeed}km/h
Humidity: ${weather.humidity}%
Rain probability: ${weather.rainProbability}%`;
  }

  if (suitability) {
    context += `\n\n=== HIKING CONDITIONS ===
Status: ${suitability.status.toUpperCase()}
Assessment: ${suitability.reasons.join('; ')}`;
  }

  context += `\n\nGuidelines:
- Always prioritize hiker safety
- Suggest appropriate trails based on fitness level
- Remind users to bring water (Singapore is hot and humid)
- Mention insect repellent and sun protection
- Be aware of Singapore's tropical climate
- If asked about something outside hiking, politely redirect to hiking topics`;

  return context;
}

function generateMockResponse(
  question: string,
  trail: Trail | null,
  weather: Weather | null,
  suitability: HikingSuitability | null
): string {
  const lowerQuestion = question.toLowerCase();

  // Greetings
  if (lowerQuestion.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
    return `Hello! 👋 I'm your hiking assistant for Singapore trails. I can help you with:

• **Trail recommendations** - Find the perfect trail for your fitness level
• **Packing advice** - What to bring on your hike
• **Weather & safety** - Current conditions and safety tips
• **Trail information** - Details about specific trails

${trail ? `I see you're looking at **${trail.name}**. Would you like to know more about it?` : 'Which trail are you interested in, or would you like some recommendations?'}`;
  }

  // Trail recommendations
  if (lowerQuestion.includes('recommend') || lowerQuestion.includes('suggest') || lowerQuestion.includes('which trail')) {
    if (lowerQuestion.includes('beginner') || lowerQuestion.includes('easy')) {
      return `For beginners, I recommend these Singapore trails:

🥾 **Southern Ridges** (10km, Easy)
   Perfect for beginners with scenic views and the iconic Henderson Waves bridge.

🥾 **Fort Canning Park** (2.5km, Easy)
   Short historical trail in the city, great for first-timers.

🥾 **Labrador Nature Reserve** (2.1km, Easy)
   Coastal walk with WWII history, beautiful sunset views.

🥾 **Coney Island Park** (5.5km, Easy)
   Rustic island experience with beaches and wildlife.

All these trails are well-maintained with clear paths. Start early to avoid the midday heat! ☀️`;
    }

    if (lowerQuestion.includes('challenge') || lowerQuestion.includes('hard') || lowerQuestion.includes('difficult')) {
      return `For a challenge, try these trails:

🏔️ **Bukit Timah Nature Reserve** (3.2km, Moderate)
   Climb Singapore's highest natural point at 163.63m!

🏔️ **MacRitchie TreeTop Walk** (11km, Moderate)
   Long trail with the famous suspension bridge.

🏔️ **Chestnut Nature Park South** (8.2km, Moderate)
   Undulating terrain, great workout!

Tips for challenging hikes:
• Start before 8am to beat the heat
• Bring at least 2L of water
• Take breaks as needed
• Consider trekking poles for steep sections`;
    }

    return `Here are my top trail recommendations in Singapore:

**For Nature Lovers:**
• MacRitchie TreeTop Walk - iconic suspension bridge
• Sungei Buloh - amazing for birdwatching

**For Scenic Views:**
• Southern Ridges - Henderson Waves bridge
• Labrador Nature Reserve - coastal sunset views

**For Adventure:**
• Pulau Ubin Chek Jawa - island exploration
• Bukit Timah - climb Singapore's highest point

What type of experience are you looking for? I can give more specific recommendations!`;
  }

  if (lowerQuestion.includes('beginner') || lowerQuestion.includes('suitable') || lowerQuestion.includes('fitness')) {
    if (trail) {
      if (trail.stats.difficulty === 'easy') {
        return `Yes! **${trail.name}** is perfect for beginners! 👍

✅ Rated as **easy** difficulty
✅ Distance: ${trail.stats.distance}km
✅ Elevation gain: Only ${trail.stats.elevationGain}m
✅ Estimated time: ~${Math.round(trail.stats.estimatedTime / 60)} hours

**Tips for your first hike:**
• Start early morning (before 9am) to avoid heat
• Bring at least 1.5L of water
• Wear comfortable shoes with good grip
• Apply sunscreen and insect repellent

You'll have a great time! 🌿`;
      } else if (trail.stats.difficulty === 'moderate') {
        return `**${trail.name}** is rated **moderate** difficulty.

For beginners:
⚠️ It may be challenging if you're new to hiking
✅ But it's doable with proper preparation!

**Preparation tips:**
• Build stamina with shorter walks first
• Start very early (7-8am) to avoid heat
• Bring 2L+ of water
• Take regular breaks
• Go with experienced friends if possible

Want me to suggest an easier trail to start with?`;
      } else {
        return `**${trail.name}** is rated as **hard** - I'd suggest building up to this one first.

For beginners, I recommend starting with:
• **Fort Canning Park** (2.5km, easy)
• **Labrador Nature Reserve** (2.1km, easy)
• **Southern Ridges** (10km but very manageable)

Build your stamina and confidence, then tackle the harder trails! 💪`;
      }
    }
    return "I'd be happy to assess a trail's suitability! Please select a trail from the list, or tell me which trail you're interested in.";
  }

  if (lowerQuestion.includes('bring') || lowerQuestion.includes('pack') || lowerQuestion.includes('gear') || lowerQuestion.includes('what should i')) {
    let response = `**Essential Hiking Gear for Singapore:** 🎒

**Hydration & Food:**
• Water: 1.5-2L minimum (more for longer trails)
• Energy snacks: Trail mix, energy bars, fruits
• Light lunch for hikes >3 hours

**Protection:**
• Sunscreen SPF50+
• Insect repellent (mosquitoes are common!)
• Hat or cap
• Sunglasses

**Clothing:**
• Light, breathable clothes
• Good hiking shoes with grip
• Extra shirt (you WILL sweat!)

**Safety:**
• Fully charged phone
• First aid kit
• Downloaded offline maps
• Whistle (for emergencies)

**Nice to have:**
• Trekking poles (for steep trails)
• Waterproof bag (sudden rain is common)
• Small towel\n`;

    if (weather && weather.rainProbability > 30) {
      response += `\n⚠️ **Rain Alert:** ${weather.rainProbability}% chance of rain today. Definitely bring a poncho or rain jacket!`;
    }

    if (trail && trail.stats.difficulty === 'hard') {
      response += `\n\n**Extra gear for ${trail.name}:**
• Trekking poles recommended
• Extra water (2.5L+)
• More snacks for energy`;
    }

    return response;
  }

  if (lowerQuestion.includes('safe') || lowerQuestion.includes('weather') || lowerQuestion.includes('condition')) {
    if (suitability && weather) {
      if (suitability.status === 'good') {
        return `**Great news! Conditions are good for hiking today!** ✅

🌡️ Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)
🌤️ Condition: ${weather.condition}
💨 Wind: ${weather.windSpeed}km/h
🌧️ Rain chance: ${weather.rainProbability}%

${suitability.reasons.join('\n')}

**Tips:**
• Still start early to avoid midday heat
• Stay hydrated throughout your hike
• Take breaks in shaded areas

Have a wonderful hike! 🥾`;
      } else if (suitability.status === 'caution') {
        return `**You can hike today, but use caution** ⚠️

Current conditions:
🌡️ Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)
🌧️ Rain chance: ${weather.rainProbability}%

**Concerns:**
${suitability.reasons.map(r => `• ${r}`).join('\n')}

**Recommendations:**
• Start earlier than usual
• Bring extra water
• Have a backup plan
• Monitor weather updates
• Turn back if conditions worsen`;
      } else {
        return `**I'd recommend postponing your hike today** ❌

Current conditions are not ideal:
${suitability.reasons.map(r => `• ${r}`).join('\n')}

**Alternatives:**
• Check forecast for better days this week
• Consider indoor activities
• Plan your hike for early morning if you must go

Safety first! The trails will be there when conditions improve. 🙏`;
      }
    }
    return "Please select a trail first, and I'll check the current weather conditions for you!";
  }

  if (lowerQuestion.includes('time') || lowerQuestion.includes('how long') || lowerQuestion.includes('duration')) {
    if (trail) {
      return `**${trail.name}** takes approximately **${Math.round(trail.stats.estimatedTime / 60)} hours** to complete.

📏 Distance: ${trail.stats.distance}km
⛰️ Elevation: ${trail.stats.elevationGain}m gain
🥾 Difficulty: ${trail.stats.difficulty}

**Time can vary based on:**
• Your fitness level
• Number of photo stops
• Rest breaks
• Trail conditions

**Pro tip:** Add 30-60 minutes buffer for beginners, and always start early in Singapore's heat! ☀️`;
    }
    return "Select a trail and I'll tell you the estimated duration!";
  }

  // Default response with helpful options
  return `I'm here to help with your Singapore hiking adventures! 🌿

**I can help you with:**

🥾 **Trail Recommendations**
   "Recommend a trail for beginners"
   "What's a challenging hike?"

🎒 **Packing Advice**
   "What should I bring?"
   "Essential hiking gear"

🌤️ **Weather & Safety**
   "Is it safe to hike today?"
   "Check weather conditions"

📍 **Trail Information**
   "Tell me about MacRitchie"
   "How long is Southern Ridges?"

${trail ? `\nYou're currently viewing **${trail.name}**. Ask me anything about it!` : '\nSelect a trail from the list or ask me for recommendations!'}`;
}
