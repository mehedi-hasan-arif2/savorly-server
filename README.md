# 🍲 Savorly — Server

Express.js + TypeScript + MongoDB backend for Savorly, a recipe-sharing platform. Handles authentication, recipe CRUD, image upload, and platform statistics.

## 🚀 Purpose
Powers the Savorly API — user registration/login, posting and browsing recipes, role-based recipe moderation (admin vs regular user), and image hosting for recipe photos.

## 🛠 Key Features
- **Authentication:** JWT stored in an HTTP-only cookie, with register, login, logout, and "current user" endpoints.
- **Role-Based Access:** `user` and `admin` roles — admins can delete any recipe, regular users can only manage their own.
- **Recipe Management:** Create, list (with search/filter/sort/pagination), view single recipe with related recipes, and delete.
- **Image Upload:** Recipe photos are uploaded to ImgBB and the returned URL is stored with the recipe.
- **Stats Endpoint:** Aggregates total recipes, category breakdown, and average rating for the home page.
- **Seeding Script:** Populates the database with an admin account, a demo user, and sample recipes for quick local testing.

## 📦 NPM Packages Used
- `express` — Web framework
- `mongoose` — MongoDB ODM
- `bcryptjs` — Password hashing
- `jsonwebtoken` — Auth token signing/verification
- `cookie-parser` — Reads the JWT cookie off incoming requests
- `cors` — Cross-origin access, locked to the client's URL
- `dotenv` — Loads environment variables
- `tsx` / `typescript` — Dev server and build tooling

## ⚙️ Setup Instructions

1. Clone the repository and move into the server folder:
   ```bash
   git clone <repository-url>
   cd savorly-server
   npm install
   ```

2. Create a `.env` file in the root with the following keys:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=any_long_random_string
   IMGBB_API_KEY=your_imgbb_api_key
   CLIENT_URL=http://localhost:3000
   PORT=5000
   ```

3. (Optional) Seed the database with an admin account, a demo user, and 8 sample recipes:
   ```bash
   npm run seed
   ```
   This clears existing users/recipes first, so only run it on a fresh or test database.

4. Run the dev server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000` by default.

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

## 🔐 Routes Overview
| Route | Method | Access |
|---|---|---|
| `/api/auth/register` | POST | Public |
| `/api/auth/login` | POST | Public |
| `/api/auth/logout` | POST | Public |
| `/api/auth/me` | GET | Public (returns null if not logged in) |
| `/api/recipes` | GET | Public — supports `search`, `category`, `difficulty`, `sort`, `page`, `limit`, `mine` |
| `/api/recipes/:id` | GET | Public |
| `/api/recipes` | POST | Logged-in users only |
| `/api/recipes/:id` | DELETE | Owner of the recipe, or admin |
| `/api/stats` | GET | Public |
| `/api/upload` | POST | Logged-in users only (ImgBB image upload) |

## 🔒 Security Notes
- Passwords are hashed with bcrypt before storage.
- JWT is stored in an HTTP-only cookie, not accessible from client-side JS.
- Role checks happen server-side on delete requests — the client never decides who can delete what.