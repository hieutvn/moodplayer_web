# MoodPlayer - Development Guidelines

A web application for searching albums, managing playback queues, and adaptive recommendations based on user input (albums, artists, genres).

---

## Project Overview

**Purpose:** Interactive music discovery and playlist management platform powered by Spotify API with intelligent mood-based recommendations.

**Key Features:**
- Album/artist/genre search with autocomplete suggestions
- Queue management (add up to 4 mood tags per search)
- Real-time playlist building
- Mood-based music recommendations

---

## Build & Configuration

### Frontend (Client)
- **Framework:** React 18+ with Hooks
- **Build Tool:** Vite
- **Package Manager:** npm
- **CSS:** Vanilla CSS Modules
- **Testing:** Vitest + React Testing Library

**Build Commands:**
```bash
cd client
npm install
npm run dev       # development server
npm run build     # production build
npm run test      # run tests
npm run lint      # ESLint check
```

### Backend (Server)
- **Runtime:** Node.js (v16+)
- **Framework:** Express.js
- **Package Manager:** npm
- **Testing:** Vitest

**Build Commands:**
```bash
cd server
npm install
npm run dev       # development server with nodemon
npm run start     # production server
npm run test      # run tests
```

### Environment Configuration

Create `.env` files in both `client/` and `server/` directories:

**`server/.env`:**
```
SPOTIFY_CLIENT_ID=<your_spotify_client_id>
SPOTIFY_CLIENT_SECRET=<your_spotify_client_secret>
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
SESSION_SECRET=<your_session_secret>
NODE_ENV=development
```

**`client/.env`:**
```
VITE_API_BASE_URL=http://localhost:3000
VITE_SPOTIFY_CLIENT_ID=<your_spotify_client_id>
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

---

## Architecture

### Directory Structure

```
MoodPlayer_2/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── assets/
│   │   │   ├── styles/        # CSS modules
│   │   │   ├── icons/
│   │   │   ├── img/
│   │   │   └── genres.json    # Mood/genre list
│   │   ├── contexts.js        # React Context providers
│   │   └── main.jsx
│   ├── public/                # Static assets
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Express backend
│   ├── routes/                # API endpoints
│   │   ├── auth.js
│   │   ├── search.js          # Mood/album autocomplete
│   │   ├── album.js
│   │   ├── artist.js
│   │   └── user.js
│   ├── controllers/           # Business logic
│   │   └── auth.controller.js
│   ├── scripts/
│   │   ├── classes/
│   │   │   ├── APIService.js  # Spotify API wrapper
│   │   │   └── LinkedList.js
│   │   └── moods.js
│   ├── services/              # Reusable services
│   ├── server.js              # Entry point
│   └── package.json
│
└── agents/
    └── guidelines.md          # This file
```

### Data Flow

```
User Input (React)
    ↓
useMoodAutocomplete Hook (debounce + local filter)
    ↓
GET /api/search?q=<term>
    ↓
Server (mood filter + Spotify album lookup)
    ↓
Return suggestions { suggestions: [...] }
    ↓
UserInput Component (display tags)
    ↓
onClick: submitMoods(selectedMoods, accessToken)
    ↓
POST /api/search/url (build playlist)
    ↓
Spotify API (fetch albums by genre/mood)
    ↓
Store in req.session.currentPlaylist
    ↓
GET /api/search/getplaylist
    ↓
Player Component (display & play)
```

### Component Responsibility

| Component | Purpose |
|-----------|---------|
| `UserInput` | Search input with autocomplete, mood tag selection |
| `Player` | Album playback controls and metadata display |
| `AlbumList` | Display queue and playlist items |
| `AlbumSwiper` | Carousel view for albums |
| `Navigation` | Global navigation and app state links |
| `Login` | Spotify OAuth authentication |
| `Settings` | User preferences and configuration |

### API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/search` | Mood/album autocomplete suggestions |
| `GET` | `/api/search/url` | Search Spotify for albums by mood |
| `GET` | `/api/search/getplaylist` | Retrieve session playlist |
| `GET` | `/api/auth/login` | Spotify OAuth login |
| `GET` | `/api/auth/callback` | OAuth callback handler |
| `GET` | `/api/user/profile` | Current user profile |
| `GET` | `/api/album` | Album details |
| `GET` | `/api/artist` | Artist details |

---

## Coding Standards

### JavaScript/React

**Style:**
- Use ES6+ syntax (const/let, arrow functions, destructuring)
- Prefer functional components with Hooks over class components
- Use JSX prop spreading cautiously (only for known safe props)
- Avoid `any` or implicit `unknown` types when possible

**Max Function Length:** 40 lines of code
- Keep functions small and focused
- Extract complex logic into separate functions or utilities
- Use early returns to reduce nesting

**Naming Conventions:**
- **Components:** PascalCase (`UserInput.jsx`, `AlbumSwiper.jsx`)
- **Hooks:** camelCase, prefixed with `use` (`useAuth`, `useMoodAutocomplete`)
- **Functions/Variables:** camelCase (`fetchPlaylist`, `selectedMoods`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`, `DEBOUNCE_DELAY`)
- **CSS Classes:** kebab-case (`.search-bar`, `.dropdown-menu`)

**Control Flow:**
```javascript
// ✅ Good: early return, no nesting
function processUser(user) {
  if (!user) return null;
  if (!user.id) throw new Error('Missing user ID');

  return { ...user, processed: true };
}

// ❌ Avoid: nested conditions
function processUser(user) {
  if (user) {
    if (user.id) {
      return { ...user, processed: true };
    }
  }
  return null;
}
```

### React Hooks

**useCallback Dependencies:**
- Include all variables/functions used in the callback
- Use ESLint plugin `eslint-plugin-react-hooks` to catch missing deps
- Extract dependencies into separate variables for clarity

**Cleanup in useEffect:**
```javascript
// ✅ Good: cleanup timer
useEffect(() => {
  const timer = setTimeout(() => {
    // logic
  }, 300);
  return () => clearTimeout(timer);
}, []);

// Good: cleanup event listener
useEffect(() => {
  const handler = (e) => { /* ... */ };
  document.addEventListener('click', handler);
  return () => document.removeEventListener('click', handler);
}, []);
```

### Error Handling

**API Calls:**
- Always include try/catch blocks
- Log errors for debugging (don't suppress silently)
- Provide user feedback for network errors
- Fallback gracefully (e.g., local suggestions if API fails)

**Example:**
```javascript
async function fetchSuggestions(query) {
  try {
    const res = await fetch(`/api/search?q=${query}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Autocomplete failed:', err);
    return { suggestions: [] }; // fallback
  }
}
```

### CSS & Styling

- Use CSS Modules for component-scoped styles (`*.module.css`)
- Avoid inline styles except for dynamic values
- Use CSS variables for shared colors, spacing, timing
- Mobile-first responsive design
- Max nesting depth: 3 levels in CSS

**Example CSS Module:**
```css
/* components/UserInput.module.css */
.search {
  display: flex;
  gap: 1rem;
}

.search_bar {
  flex: 1;
  position: relative;
}

.search_bar_input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
}

.dropdown {
  position: absolute;
  top: 100%;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
}
```

---

## Tools & Dependencies

### Frontend

| Tool | Purpose | Version |
|------|---------|---------|
| React | UI library | 18+ |
| Vite | Build tool | latest |
| Vitest | Testing framework | latest |
| ESLint | Code linting | latest |
| Prettier | Code formatting | latest |

**Key Packages:**
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "eslint": "^8.0.0",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
```

### Backend

| Tool | Purpose | Version |
|------|---------|---------|
| Express | Web framework | 4+ |
| Node.js | Runtime | 16+ |
| Vitest | Testing | latest |
| Nodemon | Development auto-reload | latest |

**Key Packages:**
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "express-session": "^1.17.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "nodemon": "^3.0.0"
  }
}
```

### Machine Learning (Future Integration)

- **TensorFlow.js:** Client-side neural network models for mood classification
- **Scikit-learn:** Python backend for advanced recommendation algorithms
- **LightFM:** Hybrid recommendation engine (collaborative + content-based)

---

## Workflow

### Setting Up Development Environment

1. **Clone the repository:**
   ```bash
   git clone <repo>
   cd MoodPlayer_2
   ```

2. **Install dependencies:**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

3. **Create `.env` files** in both `client/` and `server/`

4. **Start development servers:**
   ```bash
   # Terminal 1: Frontend
   cd client && npm run dev

   # Terminal 2: Backend
   cd server && npm run dev
   ```

5. **Access the app:**
   - Frontend: http://localhost:5173 (Vite default)
   - Backend: http://localhost:3000

### Version Control

**Branch Naming:**
- `main` – production-ready code
- `develop` – integration branch
- `feature/<name>` – new features
- `bugfix/<name>` – bug fixes
- `refactor/<name>` – code improvements

**Commit Messages:**
```
[TYPE] Short description (max 50 chars)

Optional longer explanation if needed.
- Bullet points for changes
- Keep it clear and concise

Closes #<issue_number>
```

**Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`

### Code Review Checklist

Before submitting a PR, ensure:
- [ ] Code follows naming conventions
- [ ] Functions are ≤40 lines
- [ ] No deeply nested conditions
- [ ] Error handling in place for API calls
- [ ] Tests written for new logic
- [ ] CSS is scoped (CSS Modules)
- [ ] No console warnings (ESLint clean)
- [ ] Performance considered (debounce, memoization)

### Testing

**Write tests for:**
- Hook logic (custom hooks)
- API integration (fetch calls)
- User interactions (form submission, clicks)
- Edge cases (empty data, errors)

**Run tests:**
```bash
npm run test              # all tests
npm run test -- --ui      # visual UI
npm run test -- --coverage # coverage report
```

---

## Rules

### DO

**Do use Context for global state** (auth token, playlist)
**Do debounce API calls** (use hooks/utilities, 300ms default)
**Do handle network errors gracefully** (fallback UI, user feedback)
**Do test edge cases** (empty arrays, missing fields, network timeout)
**Do document complex logic** with comments
**Do use TypeScript/JSDoc** where possible for type safety
**Do keep components small** (one responsibility per component)
**Do validate user input** on both client and server
**Do use early returns** to reduce nesting
**Do commit early and often** with clear messages

### DON'T

**Don't use global variables** (use Context or props)
**Don't make synchronous API calls** (always async/await)
**Don't ignore errors** (no silent failures)
**Don't deeply nest conditions** or loops (max 2 levels)
**Don't hardcode values** (use .env or constants)
**Don't mutate component state directly** (always use setState)
**Don't pass excessive props** (refactor with Context if >5 props)
**Don't mix concerns** (API logic should not live in UI components)
**Don't assume network connectivity** (always provide fallbacks)
**Don't skip error boundaries** in production UI

### API Design

**Request Format:**
- Use query parameters for GET filters (`?q=search&limit=10`)
- Use JSON body for POST/PUT requests
- Always include `Content-Type: application/json`
- Pass auth tokens in request headers

**Response Format:**
```javascript
// Success (2xx)
{ 
  data: [...],
  message: "Optional success message"
}

// Error (4xx, 5xx)
{
  error: "Human-readable error message",
  code: "ERROR_CODE",
  statusCode: 400
}
```

### Session & Auth

- Use `express-session` for session management
- Store minimal data in session (user ID, Spotify token)
- Validate token before processing requests
- Implement CORS properly for cross-origin requests
- Use `credentials: 'include'` in fetch for cookie-based auth

### Performance

- **Debounce input handlers** (300ms for search)
- **Memoize expensive computations** (useCallback, useMemo)
- **Lazy load components** when not immediately needed
- **Optimize re-renders** (keys in lists, dependency arrays)
- **Cache API responses** where appropriate (playlist data)
- **Monitor bundle size** (run `npm run build` and check dist/)

---

## References

- [Spotify Web API Docs](https://developer.spotify.com/documentation/web-api)
- [React Hooks API](https://react.dev/reference/react)
- [Express.js Guide](https://expressjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Guide](https://vitest.dev/)
- [CSS Modules](https://github.com/css-modules/css-modules)

---

**Last Updated:** March 2026
**Owner:** MoodPlayer Team