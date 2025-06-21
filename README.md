# News Scraper Frontend

A modern React frontend for a news scraping and aggregation platform with AI/NLP features.

## Tech Stack

- **Framework:** React 19 + Vite 6
- **Routing:** TanStack Router with file-based routing
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **Styling:** Tailwind CSS 4
- **Type Safety:** TypeScript + Zod validation
- **Linting:** ESLint 9 with TypeScript support

## Features

- 📰 **News Posts Display** - Browse and view news articles
- 🔍 **Search & Filtering** - Search through posts with real-time filtering
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
│   └── posts/       # Posts section
│       ├── index.tsx     # Posts listing
│       └── $postId.tsx   # Individual post page
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

- **Posts** with title, summary, content, author, source, and metadata
- **Search functionality** with query parameters
- **Pagination** support
- **Type-safe validation** with Zod schemas

## Development Notes

- Uses traditional `node_modules` (migrated away from Yarn PnP)
- Configured with modern ESLint rules
- Hot module replacement for fast development
- TypeScript strict mode enabled
