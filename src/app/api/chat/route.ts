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

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, trailContext, weatherContext, suitabilityContext } = body;

    // Build system message with context
    const systemMessage = buildSystemMessage(trailContext, weatherContext, suitabilityContext);

    if (GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

      // Build conversation history for Gemini
      const chatHistory = messages.slice(0, -1).map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });

      const lastMessage = messages[messages.length - 1]?.content || '';
      const prompt = chatHistory.length === 0
        ? `${systemMessage}\n\nUser: ${lastMessage}`
        : lastMessage;

      const result = await chat.sendMessage(prompt);
      const responseMessage = result.response.text() || 'Sorry, I could not generate a response.';

      return NextResponse.json({ message: responseMessage });
    }

    // Return mock response if no API key
    const mockResponse = generateMockResponse(messages[messages.length - 1]?.content || '', trailContext, weatherContext, suitabilityContext);
    return NextResponse.json({ message: mockResponse });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

function buildSystemMessage(
  trail: Trail | null,
  weather: Weather | null,
  suitability: HikingSuitability | null
): string {
  let context = `You are a helpful and knowledgeable hiking assistant. You help users find trails, prepare for hikes, and stay safe outdoors. Be friendly, concise, and safety-focused. Always prioritize hiker safety in your recommendations.`;

  if (trail) {
    context += `\n\nCurrently selected trail: ${trail.name}
- Location: ${trail.location.city}, ${trail.location.state}
- Distance: ${trail.stats.distance}km
- Elevation gain: ${trail.stats.elevationGain}m
- Difficulty: ${trail.stats.difficulty}
- Trail type: ${trail.stats.trailType}
- Facilities: ${Object.entries(trail.facilities).filter(([, v]) => v).map(([k]) => k).join(', ') || 'None'}
- Safety notes: ${trail.safetyNotes.join('; ') || 'None'}`;
  }

  if (weather) {
    context += `\n\nCurrent weather at trail:
- Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)
- Condition: ${weather.condition}
- Wind: ${weather.windSpeed}km/h
- Humidity: ${weather.humidity}%
- Rain probability: ${weather.rainProbability}%`;
  }

  if (suitability) {
    context += `\n\nHiking suitability: ${suitability.status}
- Reasons: ${suitability.reasons.join('; ')}`;
  }

  return context;
}

function generateMockResponse(
  question: string,
  trail: Trail | null,
  weather: Weather | null,
  suitability: HikingSuitability | null
): string {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('beginner') || lowerQuestion.includes('suitable')) {
    if (trail) {
      if (trail.stats.difficulty === 'easy') {
        return `Yes, ${trail.name} is a great choice for beginners! It's rated as easy with a distance of ${trail.stats.distance}km and ${trail.stats.elevationGain}m elevation gain. The trail is well-maintained and suitable for hikers of all skill levels.`;
      } else if (trail.stats.difficulty === 'moderate') {
        return `${trail.name} is rated as moderate difficulty. While it may be challenging for absolute beginners, it's manageable if you're in decent physical condition. Consider starting with an easier trail first to build your experience.`;
      } else {
        return `${trail.name} is rated as a hard trail with significant elevation gain. I'd recommend starting with an easier trail if you're new to hiking. Would you like me to suggest some beginner-friendly alternatives?`;
      }
    }
    return "Could you select a trail first? I'd be happy to assess its suitability for beginners once you've chosen one.";
  }

  if (lowerQuestion.includes('bring') || lowerQuestion.includes('pack') || lowerQuestion.includes('gear')) {
    let response = "Here's what I recommend bringing on your hike:\n\n";
    response += "Essential items:\n";
    response += "- Water (at least 2L for a full day)\n";
    response += "- Snacks and/or lunch\n";
    response += "- Navigation (map/compass or phone with downloaded maps)\n";
    response += "- First aid kit\n";
    response += "- Sun protection (sunscreen, hat, sunglasses)\n";
    response += "- Extra layers\n\n";

    if (weather && weather.rainProbability > 30) {
      response += "Weather note: There's a chance of rain, so bring a waterproof jacket!\n";
    }

    if (trail && trail.stats.difficulty === 'hard') {
      response += "For this challenging trail, also consider:\n- Trekking poles\n- Extra water\n- Emergency shelter";
    }

    return response;
  }

  if (lowerQuestion.includes('safe') || lowerQuestion.includes('weather')) {
    if (suitability) {
      if (suitability.status === 'good') {
        return `Current conditions look great for hiking! ${suitability.reasons.join(' ')} Have a wonderful hike!`;
      } else if (suitability.status === 'caution') {
        return `You can hike today, but use caution. ${suitability.reasons.join(' ')} Make sure you're prepared for these conditions.`;
      } else {
        return `I'd recommend postponing your hike today. ${suitability.reasons.join(' ')} Safety first! Would you like me to suggest a better day or an alternative indoor activity?`;
      }
    }
    return "I'd need to check the current weather at your trail location. Please select a trail first, and I'll assess the conditions for you.";
  }

  if (lowerQuestion.includes('similar') || lowerQuestion.includes('recommend') || lowerQuestion.includes('nearby')) {
    if (trail) {
      return `Based on your interest in ${trail.name}, I'd recommend checking out similar trails in the area. Look for trails with ${trail.stats.difficulty} difficulty and similar elevation gain. The recommendations section below shows some great alternatives!`;
    }
    return "I'd be happy to recommend trails! Tell me what you're looking for - difficulty level, distance, or location - and I'll help you find the perfect hike.";
  }

  // Default response
  return `I'm here to help with any hiking-related questions! I can help you with:\n
- Trail suitability and difficulty assessments
- Packing lists and gear recommendations
- Weather and safety information
- Trail recommendations based on your preferences\n
What would you like to know?`;
}
