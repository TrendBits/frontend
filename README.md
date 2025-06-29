# TrendBits Frontend

A modern React frontend for an AI-powered trend summarization tool that analyzes trends and provides intelligent summaries with links to relevant online articles.

## Features

- 🤖 **AI Trend Summarization** - Intelligent AI-powered summaries of trending topics and patterns
- 🔐 **Authentication System** - Complete user authentication with registration, login, and password recovery
- 🔗 **Article References** - Direct links to relevant online articles and sources
- 🎧 **Text-to-Audio** - Convert summaries and articles to audio format
- 📊 **Multi-Source Analysis** - Analyze trends from Reddit, news sites, and other platforms
- 🔍 **Search & Filtering** - Search through trend summaries with real-time filtering
- 📱 **Responsive Design** - Modern UI with Tailwind CSS
- 🛡️ **Type Safety** - Full TypeScript coverage with runtime validation
- ⚡ **Performance** - Optimized with Vite and modern React patterns
- 🧭 **Routing** - File-based routing with TanStack Router

## Tech Stack

- **Framework:** React 19 + Vite 6
- **Routing:** TanStack Router with file-based routing
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **Forms & Validation:** TanStack Form + Zod schemas
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Type Safety:** TypeScript + Zod validation
- **Linting:** ESLint 9 with TypeScript support

## Features

- 🔐 **User Authentication** - Secure registration and login system with password recovery
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
│   ├── auth/        # Authentication routes
│   │   ├── login.tsx         # User login page
│   │   ├── register.tsx      # User registration page
│   │   └── requestPasswordReset.tsx  # Password recovery
│   └── posts/       # Trend summaries section
│       ├── index.tsx     # Trend summaries listing
│       └── $postId.tsx   # Individual trend summary page
├── components/      # Reusable UI components
│   ├── Layouts/     # Layout components
│   │   └── RootLayout.tsx   # Main app layout
│   └── ui/          # UI components
│       ├── Button.tsx       # Styled button component
│       └── Input.tsx        # Form input component
├── pages/           # Page components
│   └── auth/        # Authentication pages
│       ├── Login.tsx        # Login form component
│       ├── Register.tsx     # Registration form component
│       └── RequestResetPassword.tsx  # Request password reset form
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

- **AI Trend Summaries** with intelligent analysis, key insights, and trend patterns
- **Article References** with direct links to relevant online sources and articles
- **Multi-source analysis** from Reddit, news sites, and other platforms
- **AI-generated summaries** with contextual understanding
- **Audio conversion** capabilities for text-to-speech
- **Search functionality** with query parameters across summaries and references
- **Pagination** support for large datasets
- **Type-safe validation** with Zod schemas

## Development Notes

- Uses traditional `node_modules` (migrated away from Yarn PnP)
- Configured with modern ESLint rules
- Hot module replacement for fast development
- TypeScript strict mode enabled
