# Trail Finder - Hiking Trail Discovery App

A modern, production-ready web application for discovering hiking trails with interactive maps, real-time weather data, and an AI-powered hiking assistant.

![Trail Finder](https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=400&fit=crop)

## Features

### Core Features

- **Interactive Map** - Google Maps integration with trail markers, paths, and user location
- **Trail Search & Discovery** - Search by location, filter by difficulty, distance, elevation, and facilities
- **Trail Details** - Comprehensive information including stats, facilities, safety notes, and photos
- **Real-time Weather** - Current conditions with hiking suitability indicators
- **AI Chat Assistant** - Context-aware chatbot for trail recommendations and hiking advice
- **Image Gallery** - Beautiful trail photos with lightbox viewer
- **Smart Recommendations** - Similar trails based on preferences and weather conditions

### Technical Features

- Server-side and client-side rendering with Next.js 14
- Responsive design with Tailwind CSS
- Global state management with Zustand
- Type-safe codebase with TypeScript
- RESTful API routes
- Mobile-first, accessible UI

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Maps**: Google Maps JavaScript API
- **UI Components**: Custom component library with Lucide icons
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys (see Environment Variables)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hiking-advisor.git
cd hiking-advisor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
OPENWEATHER_API_KEY=your_key_here
UNSPLASH_ACCESS_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes | Google Maps JavaScript API key |
| `OPENWEATHER_API_KEY` | No | OpenWeather API key (uses mock data if not provided) |
| `UNSPLASH_ACCESS_KEY` | No | Unsplash API key for trail images |
| `OPENAI_API_KEY` | No | OpenAI API key for AI chat (uses mock responses if not provided) |

### Getting API Keys

1. **Google Maps API**
   - Visit [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - Enable "Maps JavaScript API" and "Places API"
   - Create credentials and copy the API key

2. **OpenWeather API**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key from the dashboard

3. **Unsplash API**
   - Register at [Unsplash Developers](https://unsplash.com/developers)
   - Create an application and get your Access Key

4. **OpenAI API**
   - Sign up at [OpenAI Platform](https://platform.openai.com)
   - Generate an API key from the dashboard

## Project Structure

```
hiking-advisor/
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── trails/        # Trail search endpoint
│   │   │   ├── weather/       # Weather data endpoint
│   │   │   ├── images/        # Image fetch endpoint
│   │   │   └── chat/          # AI chat endpoint
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── layout/            # Layout components
│   │   ├── map/               # Map components
│   │   ├── search/            # Search components
│   │   ├── trail/             # Trail components
│   │   ├── weather/           # Weather components
│   │   ├── media/             # Image gallery components
│   │   ├── chat/              # Chat components
│   │   └── recommendations/   # Recommendation components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── store/                 # Zustand store
│   ├── types/                 # TypeScript types
│   └── data/                  # Mock data
├── public/                    # Static assets
├── .env.example               # Environment template
└── package.json
```

## API Endpoints

### GET /api/trails
Search and filter hiking trails.

**Query Parameters:**
- `q` - Search query (trail name, location)
- `difficulty` - Filter by difficulty (easy, moderate, hard)
- `minDistance` / `maxDistance` - Distance range in km
- `trailType` - Trail type (loop, out-and-back, point-to-point)
- `facilities` - Required facilities (parking, toilets, waterPoints, campsites)
- `lat` / `lng` - Coordinates for nearby search

### GET /api/trails/[id]
Get details for a specific trail.

### GET /api/weather
Get weather data for coordinates.

**Query Parameters:**
- `lat` - Latitude (required)
- `lng` - Longitude (required)

### POST /api/chat
Send a message to the AI hiking assistant.

**Body:**
```json
{
  "messages": [{ "role": "user", "content": "Is this trail safe?" }],
  "trailContext": { /* Trail object */ },
  "weatherContext": { /* Weather object */ },
  "suitabilityContext": { /* Suitability object */ }
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Docker

```bash
# Build the image
docker build -t hiking-advisor .

# Run the container
docker run -p 3000:3000 hiking-advisor
```

### Manual Build

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Trail data inspired by AllTrails and Hiking Project
- Weather icons from OpenWeatherMap
- Trail images from Unsplash
- Icons from Lucide React
