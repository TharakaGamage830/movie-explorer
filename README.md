# Movie Explorer - Discover Your Favorite Films

Movie Explorer is a modern React web application that allows users to discover trending movies, search for titles, view detailed movie information and trailers, and manage a personal list of favorite films using data from The Movie Database (TMDb) API.

## Features

- Trending Movies Hero and Row: Displays top weekly trending movies with high-resolution backdrop art, synopsis, and direct trailer access.
- Debounced Movie Search: Live search powered by a 400ms debounce hook to minimize unnecessary API requests.
- Genre Filtering: Quick genre chips to filter titles dynamically.
- Infinite Scroll: Automatic pagination powered by IntersectionObserver as the user scrolls down the results grid.
- Lazy Loaded Images and Routes: Smooth asset delivery with skeleton placeholders and route code splitting using React.lazy and Suspense.
- Movie Details: Comprehensive film view including release year, runtime, ratings, genres, overview, cast list, and embedded YouTube trailers.
- Favorites Management: Save and remove favorite movies with persistent storage in browser local storage.
- Light and Dark Theme: Cinematic dark-first design aesthetic with support for light mode, persisted across sessions.
- Demo Authentication: Client-side login flow with input validation and route protection.

## Tech Stack

- React 18 (Create React App, JavaScript)
- Material-UI (MUI v5) and @mui/icons-material
- React Router v6 for client-side navigation
- Axios for HTTP requests and API response interceptors
- React Context API for global state management

## Folder Structure

```
movie-explorer/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── api/
│   │   ├── movieService.js   # TMDb API service functions
│   │   └── tmdbApi.js        # Axios instance and response interceptor
│   ├── components/
│   │   ├── EmptyState.js     # Fallback when no items are present
│   │   ├── ErrorMessage.js   # Error display with retry button
│   │   ├── Footer.js         # Footer with TMDb attribution notice
│   │   ├── GenreChips.js     # Genre filter chips
│   │   ├── LazyImage.js      # Image component with skeleton and fallback
│   │   ├── Loader.js         # Full-page loading spinner for route transitions
│   │   ├── MovieCard.js      # Individual movie poster card with rating and favorite toggle
│   │   ├── MovieGrid.js      # Responsive grid with infinite scroll sentinel
│   │   ├── MovieRow.js       # Horizontal scrollable movie carousel
│   │   ├── Navbar.js         # Translucent top navigation bar
│   │   ├── ProtectedRoute.js # Route guard redirecting unauthenticated users
│   │   ├── SearchBar.js      # Search input with icon
│   │   ├── SkeletonCard.js   # Placeholder skeleton matching card dimensions
│   │   └── ThemeToggle.js    # Dark/light mode switcher
│   ├── context/
│   │   ├── AuthContext.js    # Demo authentication and session state
│   │   ├── MovieContext.js   # Favorites list and last search query persistence
│   │   └── ThemeContext.js   # Theme mode management
│   ├── hooks/
│   │   ├── useDebounce.js    # Debounce hook for search input
│   │   ├── useInfiniteScroll.js # IntersectionObserver hook for pagination
│   │   └── useLocalStorage.js   # Local storage synchronization hook
│   ├── pages/
│   │   ├── Favorites.js      # Saved movies list
│   │   ├── Home.js           # Main landing page with hero, search, and grid
│   │   ├── Login.js          # User sign-in page
│   │   ├── MovieDetails.js   # Detailed film view with cast and trailer
│   │   └── NotFound.js       # 404 error page
│   ├── routes/
│   │   ├── AppRoutes.js      # Central route definitions with lazy loading
│   │   └── index.js          # Routes export
│   ├── theme/
│   │   └── theme.js          # MUI light and dark theme configurations
│   ├── utils/
│   │   ├── constants.js      # Application constants and configuration flags
│   │   └── helpers.js        # Formatters, URL builders, and deduplication
│   ├── App.js                # Root application component
│   ├── index.css             # Global stylesheet
│   └── index.js              # Application entry point
├── .env.example              # Sample environment variables file
├── .gitignore                # Git ignore rules
├── package.json
└── README.md
```

## Setup and Installation

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (v8 or higher)
- A free TMDb API key from [The Movie Database](https://www.themoviedb.org/settings/api)

### 1. Clone or Open the Project Directory

```bash
cd "d:/Loons Lab Assigment/movie-explorer"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and set your TMDb API key:

```env
REACT_APP_TMDB_API_KEY=your_actual_tmdb_api_key_here
```

### 4. Run the Development Server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Usage

The app uses the official TMDb v3 API via Axios. The base URL is `https://api.themoviedb.org/3`.

Key endpoints integrated:
- `GET /trending/movie/week`: Fetches trending movies for the current week.
- `GET /search/movie`: Searches movies matching user queries with pagination.
- `GET /movie/{id}?append_to_response=credits,videos`: Retrieves full movie details, credits, and YouTube video keys in a single request.
- `GET /genre/movie/list`: Retrieves the official list of movie genres.

Error responses (invalid key, rate limits, network failures) are intercepted in `src/api/tmdbApi.js` and converted into clear, actionable messages for the user.

## Infinite Scroll Implementation

Infinite scroll is implemented using a custom React hook `useInfiniteScroll` based on the native browser `IntersectionObserver` API.

- Sentinel Element: A zero-height sentinel element is placed at the bottom of the movie grid.
- Viewport Intersection: When the sentinel enters the viewport (with a 200px prefetch margin), the hook triggers the next page fetch.
- Duplicate Prevention: Incoming results are deduplicated against existing items before appending.
- Request Cancellation: When a new search query is typed, pending requests are cancelled using `AbortController`.
- Load More Alternative: A toggle is available in `src/utils/constants.js` (`INFINITE_SCROLL = true`). Setting this to `false` switches the UI to a manual "Load More" button without modifying component code.

## Lazy Loading Strategy

1. Route-Level Code Splitting: All page components (`Home`, `MovieDetails`, `Favorites`, `Login`, `NotFound`) are loaded on demand with `React.lazy` and wrapped in a central `Suspense` boundary with a `Loader` fallback.
2. Responsive Image Optimization: The `LazyImage` component leverages native browser `loading="lazy"` along with explicit aspect-ratio styling to eliminate cumulative layout shift (CLS). Skeleton placeholders are shown during loading, and a fallback box is displayed on load failure.
3. YouTube Trailer Embeds: Embedded players use the privacy-enhanced `youtube-nocookie.com` domain and are only rendered when the user explicitly clicks "Watch Trailer".

## Authentication Note

This application includes a front-end demo login flow. User credentials and login state are stored in browser local storage for demonstration purposes only. Production systems require a secure backend service with password hashing, session cookies, and token validation.

## Attribution

This product uses the TMDb API but is not endorsed or certified by TMDb.
