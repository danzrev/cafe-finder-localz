# Café Finder Localz ☕

**Café Finder** — a community-powered directory of cafés in **Davao City, Philippines**. Discover, rate, save, and explore the best coffee spots in the city.

A full-stack TypeScript monorepo featuring a React frontend, Express backend, and PostgreSQL database, built with modern web technologies and best practices.

---

## 🎯 Features

- **Discover Cafés** — Browse 12+ real Davao City coffee shops with rich details, images, and reviews
- **Search & Filter** — Find cafés by name, district, price level, and ratings
- **User Accounts** — Register, login, and manage your profile
- **Reviews & Ratings** — Share your café experiences and rate coffee quality
- **Save Favorites** — Bookmark your favorite spots for quick access
- **Interactive Maps** — Explore café locations on an embedded Google Map
- **Blog Posts** — Read guides and stories about Davao's coffee scene
- **Owner Dashboard** — Café owners can claim and manage their listings
- **Admin Panel** — Approve submissions and moderate content

---

## 🛠️ Tech Stack

| Layer       | Technology                                        |
| ----------- | ------------------------------------------------- |
| **Frontend**    | React 19 · TypeScript · Vite · Tailwind CSS · React Router · Framer Motion |
| **Backend**     | Node.js 20+ · Express · TypeScript · Prisma ORM   |
| **Database**    | PostgreSQL 14+                                    |
| **Auth**        | Custom JWT · Argon2 password hashing · HTTP-only cookies |
| **Security**    | Helmet · CORS · Rate limiting · Input validation (Zod) |
| **Maps**        | Google Maps JavaScript API                        |
| **Images**      | Unsplash (demo) · S3-compatible storage ready     |
| **Styling**     | Custom design system with warm café-inspired colors |

---

## 📁 Repository Structure

```
cafe-finder-localz/
├── shared/              # Shared TypeScript types, enums, and utilities
│   ├── src/
│   │   ├── types/       # Common types (User, Cafe, Blog, API responses)
│   │   ├── enums/       # Enums (UserRole, CafeStatus, OpenStatus)
│   │   └── utils/       # Constants and utilities (PASSWORD_MIN_LENGTH, etc.)
│   └── package.json
│
├── client/              # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components (Home, Explore, CafeDetail, etc.)
│   │   ├── services/    # API client and services
│   │   ├── context/     # React context (Auth)
│   │   └── utils/       # Helper functions
│   └── package.json
│
├── server/              # Express backend (TypeScript)
│   ├── src/
│   │   ├── routes/      # API route handlers
│   │   ├── middleware/  # Express middleware
│   │   ├── validators/  # Zod validation schemas
│   │   └── utils/       # Helper functions
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── seed.ts          # Seed script (12 real Davao cafés)
│   │   └── migrations/      # Database migrations
│   └── package.json
│
└── package.json         # Root workspace configuration
```

---

## 🚀 Quick Start (Development)

### Prerequisites

- **Node.js** ≥ 20.0.0
- **PostgreSQL** ≥ 14.0
- **npm** ≥ 10.0.0 (comes with Node.js)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cafe-finder-localz
```

### 2. Install Dependencies

```bash
npm install
```

This installs dependencies for all workspaces (`shared`, `client`, `server`) in one command.

### 3. Set Up Environment Variables

#### Server Environment (Required)

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cafefinder"

# Server
PORT=3000
NODE_ENV=development

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# CORS
CORS_ORIGIN="http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Google Maps API (for geocoding)
GOOGLE_MAPS_API_KEY=""

# Optional: Storage (S3/Cloudinary for image uploads)
STORAGE_PROVIDER="local"
# AWS_ACCESS_KEY_ID=""
# AWS_SECRET_ACCESS_KEY=""
# AWS_REGION=""
# AWS_S3_BUCKET=""
```

#### Client Environment (Required)

```bash
cp client/.env.example client/.env
```

Edit `client/.env`:

```env
# API endpoint
VITE_API_BASE_URL=http://localhost:3000

# Optional: Google Maps API (for map display)
VITE_GOOGLE_MAPS_API_KEY=""
```

### 4. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cafefinder;

# Exit psql
\q
```

Update `DATABASE_URL` in `server/.env` with your PostgreSQL credentials.

### 5. Build Shared Package

The shared package must be built before running the server:

```bash
npm run build -w shared
```

### 6. Run Database Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 7. Seed the Database

Load 12 real Davao City cafés with images:

```bash
npm run prisma:seed
```

This creates:
- Admin account: `admin@cafefinder.ph` / `ChangeMe123!`
- 12 cafés with real Davao locations and Unsplash images
- 1 sample blog post

### 8. Start Development Servers

```bash
npm run dev
```

This concurrently runs:
- **Shared package** (watch mode) on changes
- **Backend server** at http://localhost:3000
- **Frontend dev server** at http://localhost:5173

### 9. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Prisma Studio:** `npm run db:studio` (opens on http://localhost:5555)

---

## 🧪 Testing the Application

### Default Admin Account

```
Email: admin@cafefinder.ph
Password: ChangeMe123!
```

### Test User Accounts

Create new accounts via the registration page, or add them directly via Prisma Studio.

### Exploring Features

1. **Browse Cafés** — Visit the homepage to see featured cafés
2. **Search** — Use the Explore page to search and filter
3. **View Details** — Click any café card to see full details
4. **Login** — Use the admin account or create a new user
5. **Leave Reviews** — Rate and review cafés (requires login)
6. **Save Favorites** — Bookmark cafés to your profile
7. **Admin Panel** — Access `/admin` with the admin account

---

## 📦 Available Scripts

### Root Level (Workspace Commands)

| Command                  | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `npm install`            | Install all workspace dependencies             |
| `npm run dev`            | Run shared + server + client in watch mode     |
| `npm run build`          | Build all workspaces for production            |
| `npm run typecheck`      | Type-check all workspaces                      |
| `npm run prisma:generate`| Generate Prisma Client                         |
| `npm run prisma:migrate` | Run database migrations                        |
| `npm run prisma:seed`    | Seed database with sample data                 |
| `npm run db:studio`      | Open Prisma Studio (database GUI)              |

### Workspace-Specific Commands

```bash
# Run commands in a specific workspace
npm run dev -w server       # Server only
npm run dev -w client       # Client only
npm run build -w shared     # Build shared package
npm run typecheck -w client # Type-check client
```

---

## 🚢 Production Deployment

### 1. Environment Setup

Create production environment files:

**server/.env.production:**

```env
DATABASE_URL="postgresql://user:password@production-db-host:5432/cafefinder?sslmode=require"
PORT=3000
NODE_ENV=production

JWT_SECRET="<strong-random-secret-at-least-32-chars>"
JWT_EXPIRES_IN="7d"

CORS_ORIGIN="https://yourdomain.com"

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

# Production storage (recommended)
STORAGE_PROVIDER="s3"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="cafefinder-images"

GOOGLE_MAPS_API_KEY="your-production-maps-key"
```

**client/.env.production:**

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_GOOGLE_MAPS_API_KEY="your-production-maps-key"
```

### 2. Build for Production

```bash
# Build all workspaces
npm run build

# This creates:
# - shared/dist/        (compiled TypeScript)
# - server/dist/        (compiled Express app)
# - client/dist/        (optimized static files)
```

### 3. Database Migration (Production)

```bash
# On production server
cd server
npm run prisma:deploy  # Run migrations without prompts
npm run prisma:seed    # Optional: seed data
```

### 4. Deployment Options

#### Option A: Traditional Server (VPS/Dedicated)

```bash
# 1. Upload built files to server
scp -r . user@server:/var/www/cafefinder

# 2. On server, install production dependencies
cd /var/www/cafefinder
npm install --production

# 3. Start server with PM2
npm install -g pm2
pm2 start server/dist/index.js --name cafefinder-api
pm2 save
pm2 startup

# 4. Serve client with Nginx
# Configure Nginx to serve client/dist/ and proxy /api to backend
```

**nginx.conf example:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve frontend
    location / {
        root /var/www/cafefinder/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Option B: Docker Deployment

**Dockerfile.server:**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY shared/ ./shared/
COPY server/ ./server/
RUN npm install
RUN npm run build -w shared
RUN npm run build -w server

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/server/package*.json ./server/
COPY --from=builder /app/server/prisma ./server/prisma
RUN cd server && npm install --production
EXPOSE 3000
CMD ["node", "server/dist/index.js"]
```

**Dockerfile.client:**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY client/ ./client/
COPY shared/ ./shared/
RUN npm install
RUN npm run build -w shared
RUN npm run build -w client

FROM nginx:alpine
COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: cafefinder
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: cafefinder
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  server:
    build:
      context: .
      dockerfile: Dockerfile.server
    environment:
      DATABASE_URL: postgresql://cafefinder:${DB_PASSWORD}@postgres:5432/cafefinder
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN}
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  client:
    build:
      context: .
      dockerfile: Dockerfile.client
    ports:
      - "80:80"
    depends_on:
      - server

volumes:
  postgres_data:
```

Run with:

```bash
docker-compose up -d
```

#### Option C: Platform as a Service

**Vercel (Frontend):**

```bash
cd client
vercel --prod
```

**Railway/Render/Heroku (Backend + Database):**

1. Create new project
2. Connect GitHub repository
3. Set environment variables
4. Deploy automatically on push

---

## 🗄️ Database Schema

Key tables:

- **User** — Authentication and profiles
- **Cafe** — Café listings with details
- **CafeImage** — Multiple images per café
- **Review** — User ratings and reviews
- **SavedCafe** — User bookmarks
- **BlogPost** — Blog articles
- **ClaimRequest** — Café ownership claims

See `server/prisma/schema.prisma` for full schema.

---

## 🔐 Security Features

- ✅ **Argon2 password hashing** — Industry-standard secure hashing
- ✅ **JWT with HTTP-only cookies** — Prevents XSS attacks
- ✅ **Rate limiting** — Protects against brute force
- ✅ **Helmet middleware** — Security headers
- ✅ **CORS configuration** — Controls API access
- ✅ **Input validation** — Zod schemas validate all inputs
- ✅ **SQL injection protection** — Prisma ORM parameterized queries

---

## 🎨 Design System

The application uses a warm, café-inspired design system:

### Colors

- **Paper** — Warm off-white background (#FBF7EF)
- **Espresso** — Deep brown for text (#241A12)
- **Leaf** — Coffee leaf green for accents (#42693F)
- **Mango** — Gold for ratings (#DF9A2E)
- **Latte** — Milky wash for cards (#EDE3D0)

### Typography

- **Display:** Fraunces (serif)
- **Body:** Work Sans (sans-serif)
- **Mono:** IBM Plex Mono

### Components

All components follow a consistent design with rounded corners (`border-radius: 1.5rem`), soft shadows, and smooth transitions.

---

## 📝 Recent Updates (September 2026)

### Database Improvements
- ✅ Seeded 12 real Davao City cafés with authentic data
- ✅ Added high-quality Unsplash cover images
- ✅ Realistic locations across districts (Poblacion, Lanang, Calinan, Toril, etc.)
- ✅ Detailed descriptions, amenities, and tags

### UI/UX Enhancements
- ✅ Enhanced hero section with gradients and animations
- ✅ Improved café cards with hover effects and image zoom
- ✅ Better typography hierarchy and spacing
- ✅ Smooth Framer Motion animations throughout
- ✅ Professional button styles with active states
- ✅ Enhanced search and filter UI
- ✅ Added social proof elements

### Technical Improvements
- ✅ Fixed shared package ESM module resolution
- ✅ Improved build pipeline with watch mode
- ✅ Added `"type": "module"` to shared package
- ✅ Better TypeScript configuration

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Private project. All rights reserved.

---

## 🙏 Acknowledgments

- **Davao City Coffee Community** — For inspiration
- **Unsplash** — For beautiful café imagery
- **Fraunces & Work Sans** — For excellent typography
- **React, Vite, Prisma** — For amazing developer tools

---

## 📧 Support

For issues or questions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Contact the development team

---

**Built with ☕ in Davao City, Philippines**
