# Trendlog Frontend

A modern React frontend for tracking trends across various fields with AI-powered summaries and multi-source content aggregation.

## Tech Stack

- **Framework:** React 19 + Vite 6
- **Routing:** TanStack Router with file-based routing
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **Styling:** Tailwind CSS 4
- **Type Safety:** TypeScript + Zod validation
- **Linting:** ESLint 9 with TypeScript support

## Features

- � **Trend Tracking** - Monitor trends across various fields and topics of interest
- 🤖 **AI-Powered Summaries** - Generate intelligent text summaries of trending content
- 🎧 **Text-to-Audio** - Convert summaries and articles to audio format
- 📰 **Multi-Source Content** - Aggregate content from Reddit, news sites, and other platforms
- 🔍 **Search & Filtering** - Search through trends with real-time filtering
- 📱 **Responsive Design** - Modern UI with Tailwind CSS
- 🛡️ **Type Safety** - Full TypeScript coverage with runtime validation
- ⚡ **Performance** - Optimized with Vite and modern React patterns
- 🧭 **Routing** - File-based routing with TanStack Router

## Project Structure

```
src/
├── routes/           # File-based routing
│   ├── __root.tsx   # Root layout
│   ├── index.tsx    # Home page
│   └── posts/       # Trends and content section
│       ├── index.tsx     # Trends listing
│       └── $postId.tsx   # Individual trend/content page
├── schemas/         # Zod validation schemas
│   └── posts.schema.ts
├── store/           # Zustand state management
└── assets/          # Static assets
```

## Getting Started

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Start development server:**
   ```bash
   yarn dev
   ```

3. **Build for production:**
   ```bash
   yarn build
   ```

4. **Preview production build:**
   ```bash
   yarn preview
   ```

## API Integration

The frontend is designed to work with a backend API but currently uses mock data (`public/posts.json`) for development. The data structure includes:

- **Trending Content** with title, summary, AI-generated insights, author, source, and metadata
- **Multi-source data** from Reddit, news sites, and other platforms
- **AI-generated summaries** and trend analysis
- **Audio conversion** capabilities for text-to-speech
- **Search functionality** with query parameters across multiple fields
- **Pagination** support for large datasets
- **Type-safe validation** with Zod schemas

## Development Notes

- Uses traditional `node_modules` (migrated away from Yarn PnP)
- Configured with modern ESLint rules
- Hot module replacement for fast development
- TypeScript strict mode enabled
