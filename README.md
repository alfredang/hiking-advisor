# Trail Finder

![Next.js](https://img.shields.io/badge/Next.js-14.1-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google_Maps-API-4285F4?logo=googlemaps&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?logo=googlegemini&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

> Discover hiking trails across Singapore and Malaysia with interactive maps, real-time weather, and an AI-powered assistant.

[Live Demo](https://hiking-advisor.netlify.app) | [Report Bug](https://github.com/alfredang/hiking-advisor/issues)

---

![Trail Finder Screenshot](screenshot.png)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Features

- **Interactive Google Maps** - Trail markers, polyline paths, and user location tracking
- **Advanced Search & Filters** - Filter by difficulty, distance, elevation, trail type, and amenities
- **Real-time Weather** - Current conditions with hiking suitability indicators (good/caution/unsafe)
- **AI Chat Assistant** - Powered by Google Gemini for personalized trail recommendations
- **Trail Details** - Stats, facilities, safety notes, ratings, and photo galleries
- **Google Places Photos** - Real trail images fetched from Google Places API
- **Favorites System** - Save and manage favorite trails with local storage persistence
- **Responsive Design** - Mobile-first UI with dark mode support
- **Unit Preferences** - Toggle between metric and imperial units

---

## Tech Stack

| Layer | Technology | Description |
|-------|------------|-------------|
| Framework | Next.js 14 | App Router with SSR/SSG |
| Language | TypeScript | Type-safe codebase |
| Styling | Tailwind CSS | Utility-first CSS |
| State | Zustand | Lightweight state management |
| Data Fetching | TanStack Query | Server state management |
| Maps | Google Maps API | Interactive mapping |
| AI | Google Gemini | Chat assistant |
| Weather | OpenWeather API | Real-time weather data |
| Images | Google Places API | Trail photos |
| Deployment | Netlify | Serverless hosting |

---

## Architecture

```mermaid
graph TB
    subgraph Client
        A[React Components] --> B[Zustand Store]
        A --> C[TanStack Query]
    end

    subgraph API Routes
        D[/api/trails]
        E[/api/weather]
        F[/api/chat]
        G[/api/place-photo]
    end

    subgraph External Services
        H[Google Maps API]
        I[Google Places API]
        J[Google Gemini AI]
        K[OpenWeather API]
    end

    C --> D
    C --> E
    C --> F
    C --> G

    D --> L[(Mock Trail Data)]
    E --> K
    F --> J
    G --> I
    A --> H
```

---

## Project Structure

```
hiking-advisor/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── trails/          # Trail search & details
│   │   │   ├── weather/         # Weather data endpoint
│   │   │   ├── chat/            # Gemini AI chat endpoint
│   │   │   ├── place-photo/     # Google Places photo proxy
│   │   │   └── images/          # Image fetching endpoint
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Main page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   ├── layout/              # Header, Sidebar, Navigation
│   │   ├── map/                 # Map components
│   │   ├── search/              # Search & filter components
│   │   ├── trail/               # Trail card & details
│   │   ├── weather/             # Weather display
│   │   ├── chat/                # AI chat widget
│   │   └── recommendations/     # Trail recommendations
│   ├── store/                   # Zustand store
│   ├── types/                   # TypeScript interfaces
│   ├── lib/                     # Utilities & constants
│   └── data/                    # Mock trail data
├── public/                      # Static assets
├── .env.example                 # Environment template
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Google Cloud account with APIs enabled

### 1. Clone the repository

```bash
git clone https://github.com/alfredang/hiking-advisor.git
cd hiking-advisor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys (see [Configuration](#configuration)).

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps & Places API key | Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | No* |
| `OPENWEATHER_API_KEY` | OpenWeather API key | No* |
| `UNSPLASH_ACCESS_KEY` | Unsplash API key | No |

*Falls back to mock data if not provided.

### Getting API Keys

#### Google Maps & Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Maps JavaScript API** and **Places API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. (Recommended) Restrict the key to your domains

#### Google Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key

#### OpenWeather API
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key from the dashboard

---

## API Reference

### GET /api/trails

Search and filter hiking trails.

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query (name, location) |
| `difficulty` | string | easy, moderate, hard |
| `minDistance` | number | Minimum distance (km) |
| `maxDistance` | number | Maximum distance (km) |
| `trailType` | string | loop, out-and-back, point-to-point |
| `facilities` | string | parking, toilets, waterPoints, campsites |
| `lat`, `lng` | number | Coordinates for nearby search |

### GET /api/trails/[id]

Get details for a specific trail by ID.

### GET /api/weather

Get weather data for coordinates.

| Parameter | Type | Description |
|-----------|------|-------------|
| `lat` | number | Latitude (required) |
| `lng` | number | Longitude (required) |

### POST /api/chat

Send a message to the AI hiking assistant.

```json
{
  "messages": [{ "role": "user", "content": "Is this trail suitable for beginners?" }],
  "trailContext": { /* Trail object */ },
  "weatherContext": { /* Weather object */ },
  "suitabilityContext": { /* Suitability object */ }
}
```

### GET /api/place-photo

Proxy for Google Places photos.

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Search query for the place |
| `maxwidth` | number | Maximum image width (default: 800) |

---

## Deployment

### Netlify (Recommended)

1. Push your code to GitHub
2. Import your repository on [Netlify](https://app.netlify.com)
3. Add environment variables in **Site settings** → **Environment variables**
4. Deploy!

### Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

### Docker

```bash
# Build the image
docker build -t hiking-advisor .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key \
  -e GEMINI_API_KEY=your_key \
  hiking-advisor
```

### Manual Build

```bash
npm run build
npm start
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [Google Maps Platform](https://developers.google.com/maps) - Interactive maps and place photos
- [Google Gemini](https://ai.google.dev/) - AI chat assistant
- [OpenWeatherMap](https://openweathermap.org/) - Weather data
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
