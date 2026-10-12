# StudySpace — Smart Notes Organizer 📚✨

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Vercel Ready](https://img.shields.io/badge/Deployment-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A modern, full-stack academic and developer note-taking workspace inspired by contemporary Dribbble designs. Organize lecture notes, system designs, coding summaries, and revision lists with custom subjects, multi-tag filtering, debounced full-text search, live word counting, and soft-delete Trash protection.

---

## 🌟 Key Features

### 🎨 Design & User Experience
* **Dribbble-Inspired Interface**: Clean, minimal, and refined aesthetic with delicate shadows, rounded cards, and generous whitespace.
* **Light & Dark Themes**: System-aware theme toggle with instant persistence in local storage and smooth transitions.
* **Responsive Layouts**: Desktop dual-column workspace with collapsible sidebar, tablet optimization, and mobile slide-out drawer.
* **Micro-Animations & Feedback**: Skeleton card loaders, toast alerts for CRUD actions, confirmation dialogs, and subtle hover states.

### 📝 Notes Management & CRUD
* **Distraction-Free Editor**: Create and edit notes with rich headings, code snippets, and structured formatting.
* **Live Word Counter**: Real-time word count and reading time estimator.
* **Soft Delete & Trash Bin**: Safe note deletion that moves records to a dedicated Trash view. Restore notes anytime or permanently purge them.
* **Pinning**: Keep high-priority cheat sheets and active exam notes pinned to the top of your workspace.
* **Color Accents**: Assign distinctive card tints (Default, Sky Blue, Emerald Green, Amber Gold, Purple, Rose).

### 🏷️ Subjects & Tags
* **Custom Subject Management**: Group notes into subjects (e.g., *Programming*, *Database*, *Cloud Computing*, *Interview Prep*).
* **Multi-Tag System**: Add instant tags (`#react`, `#mongodb`, `#system-design`) with keyboard shortcuts. Filter notes by clicking any tag chip.
* **Subject Note Counters**: Automatic aggregations showing total active notes per subject category.

### 🔍 Search & Filtering
* **Debounced Search**: Responsive, case-insensitive search across note titles, body text, and tags without UI stutter.
* **Multi-Criteria Sorting**: Sort by *Recently Updated*, *Newest First*, *Oldest First*, or *Alphabetical (A-Z)*.
* **Quick Filter Bar**: Filter by subject, active tag, and sort order with 1-click filter reset.

### 🔒 Security & Architecture
* **JWT Authentication**: Secure token generation with password hashing via `bcryptjs` and HTTP-only cookie support.
* **Strict Ownership Isolation**: Every note, subject, and trash query verifies `userId` ownership on the database level.
* **Input Validation**: Robust validation for requests and payloads powered by `Zod`.
* **Serverless Connection Caching**: Cached Mongoose client lifecycle optimized for Vercel Serverless Functions.
* **Rate Limiting & Security Headers**: Protection against brute-force attacks (`express-rate-limit`) and security headers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS 3.4, Lucide React, React Router v7, Axios |
| **Backend** | Node.js, Express.js, Mongoose 8, JWT (`jsonwebtoken`), `bcryptjs`, `cookie-parser` |
| **Validation** | Zod |
| **Database** | MongoDB Atlas (Cloud NoSQL Database) |
| **Hosting & Deploy** | Vercel (Frontend Static SPA + Serverless `/api` routing) |
| **Testing** | Node.js Test Runner (`node:test`, `node:assert`), Supertest |

---

## 📂 Architecture & Folder Structure

```
smart-notes-organizer/
├── api/
│   └── index.js                 # Vercel serverless function entrypoint
├── server/
│   ├── app.js                   # Express application setup, security, and middleware
│   ├── server.js                # Standalone local dev backend server
│   ├── config/
│   │   └── db.js                # Cached Mongoose connection module for serverless
│   ├── controllers/
│   │   ├── authController.js    # Register, login, logout, profile
│   │   ├── noteController.js    # Note CRUD, pinning, trash, restore, purge
│   │   ├── subjectController.js # Subject CRUD and note counts
│   │   └── dashboardController.js# Stats aggregation and demo seeder
│   ├── middleware/
│   │   ├── authMiddleware.js    # Bearer token & cookie verification
│   │   ├── errorMiddleware.js   # Centralized error and 404 handler
│   │   └── validateRequest.js   # Zod request validation wrapper
│   ├── models/
│   │   ├── User.js              # User schema & password comparison
│   │   ├── Note.js              # Note schema, indexes, soft delete & wordCount virtual
│   │   └── Subject.js           # Subject schema with per-user compound unique index
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth routes
│   │   ├── noteRoutes.js        # /api/notes routes
│   │   ├── trashRoutes.js       # /api/trash routes
│   │   ├── subjectRoutes.js     # /api/subjects routes
│   │   └── dashboardRoutes.js   # /api/dashboard routes
│   ├── validators/
│   │   ├── authValidators.js    # Zod schemas for auth
│   │   └── noteValidators.js    # Zod schemas for notes and subjects
│   └── utils/
│       └── tokenUtils.js        # JWT generation, verification, and cookie helpers
├── src/
│   ├── components/
│   │   ├── common/              # Button, Input, Modal, Loader, EmptyState
│   │   ├── layout/              # AppLayout, Sidebar, Header, MobileNavigation
│   │   └── notes/               # NoteCard, NoteGrid, NoteEditor, NoteFilters, DeleteNoteDialog
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication state and session restore
│   │   └── ThemeContext.jsx     # Light/Dark mode state
│   ├── hooks/
│   │   └── useDebounce.js       # Search input debouncing hook
│   ├── pages/
│   │   ├── LandingPage.jsx      # Marketing hero, feature breakdown, and preview
│   │   ├── LoginPage.jsx        # Login form
│   │   ├── RegisterPage.jsx     # Registration form
│   │   ├── DashboardPage.jsx    # Analytics cards, pinned notes, recent notes
│   │   ├── AllNotesPage.jsx     # Complete notes catalog with multi-filters
│   │   ├── PinnedNotesPage.jsx  # Pinned bookmarks view
│   │   ├── SubjectsPage.jsx     # Subject management and categorized counts
│   │   ├── RecentNotesPage.jsx  # Recently edited notes timeline
│   │   ├── TrashPage.jsx        # Soft-deleted notes with restore & purge
│   │   ├── SettingsPage.jsx     # Account settings, demo seeder, theme switch
│   │   └── NotFoundPage.jsx     # 404 handler
│   ├── services/
│   │   ├── api.js               # Axios instance with auth interceptors
│   │   ├── authService.js       # Auth API client
│   │   ├── noteService.js       # Notes & trash API client
│   │   └── subjectService.js    # Subjects & stats API client
│   ├── utils/
│   │   └── formatDate.js        # Humanized relative date & word calculations
│   ├── App.jsx                  # Main router and route protection
│   ├── main.jsx                 # Vite application mount
│   └── index.css                # Tailwind CSS layers and theme styles
├── tests/                       # Automated test suite (22 unit & integration tests)
├── .env.example                 # Template for environment configuration
├── .gitignore                   # Ignored files and security boundaries
├── vercel.json                  # Single-deployment Vercel routing configuration
├── vite.config.js               # Vite build config with dev proxy
├── tailwind.config.js           # Custom colors, shadows, and fonts
└── package.json                 # Scripts and dependencies
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or later, v20+ recommended)
* [Git](https://git-scm.com/)
* A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/smart-notes-organizer.git
cd smart-notes-organizer
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your values:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.yourdomain.mongodb.net/studyspace?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long
CLIENT_URL=http://localhost:3000
```

### 5. Run the Application in Development Mode
You can run both the Express backend and the Vite frontend simultaneously with one command:
```bash
npm run dev
```
* **Frontend**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:5000](http://localhost:5000)
* **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Running Automated Tests

StudySpace includes an automated test suite verifying auth validation, tokens, API security, and note query logic:

```bash
npm test
```

Test coverage includes:
* **API Security**: Unauthenticated requests to protected endpoints return 401.
* **Validation**: Input boundary testing on user registration, login, note creation, and subject creation.
* **Token Logic**: JWT signature validation, expiration, and tampering rejection.
* **Query Scoping**: User data isolation guarantees preventing cross-user note leakage.
* **Utilities**: Word count accuracy, reading time estimation, and relative date formatting.

---

## 🌐 Deploying to Vercel & MongoDB Atlas

The repository is pre-configured with `vercel.json` for a **unified single-deployment architecture** where:
* The React frontend is statically built to `/dist`.
* All `/api/*` routes are handled by `/api/index.js` as serverless functions.

### Step 1: Set Up MongoDB Atlas
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a user with read/write privileges.
3. Under **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere) to permit connections from Vercel's dynamic serverless IP pool.
4. Click **Connect** → **Drivers** and copy your MongoDB connection string.

### Step 2: Push Code to GitHub
```bash
git init
git add .
git commit -m "feat: initial StudySpace full-stack commit"
git remote add origin https://github.com/your-username/smart-notes-organizer.git
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Log into [Vercel](https://vercel.com) and click **Add New...** → **Project**.
2. Import your `smart-notes-organizer` GitHub repository.
3. Keep default build settings (Vite build command: `npm run build`, Output Directory: `dist`).
4. Add the following **Environment Variables** in the Vercel dashboard:
   * `MONGODB_URI`: Your MongoDB Atlas connection string.
   * `JWT_SECRET`: A secure, random string (e.g. 64 characters).
   * `NODE_ENV`: `production`
5. Click **Deploy**. Vercel will build both the frontend bundle and serverless API in under 60 seconds!

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user & seed default subjects | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |
| `POST` | `/api/auth/logout` | Clear authentication cookie & session | No |
| `GET` | `/api/auth/me` | Retrieve profile of authenticated user | Yes |
| `PATCH` | `/api/auth/profile` | Update name or change password | Yes |

### Notes Management (`/api/notes`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notes` | Query notes with search, tags, subjects, sort, pagination | Yes |
| `GET` | `/api/notes/:id` | Retrieve single note by ID | Yes |
| `POST` | `/api/notes` | Create a new note | Yes |
| `PATCH` | `/api/notes/:id` | Update note title, content, tags, color, subject | Yes |
| `PATCH` | `/api/notes/:id/pin`| Toggle pinned status | Yes |
| `DELETE`| `/api/notes/:id` | Move note to Trash (soft delete) | Yes |

### Trash Management (`/api/trash`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/trash` | View all soft-deleted notes | Yes |
| `PATCH` | `/api/trash/:id/restore` | Restore note back to active workspace | Yes |
| `DELETE`| `/api/trash/:id/permanent` | Permanently delete note from database | Yes |
| `DELETE`| `/api/trash/empty` | Empty entire trash bin | Yes |

### Subjects & Dashboard (`/api/subjects`, `/api/dashboard`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/subjects` | List subjects with note counts | Yes |
| `POST` | `/api/subjects` | Create custom subject | Yes |
| `PATCH` | `/api/subjects/:id` | Update subject name or color | Yes |
| `DELETE`| `/api/subjects/:id` | Delete subject and unbind associated notes | Yes |
| `GET` | `/api/dashboard/stats` | Aggregated note counts, word totals, recent notes | Yes |
| `POST` | `/api/dashboard/seed` | Seed realistic study notes for demo | Yes |

---

## 🔮 Future Enhancements
* Markdown rich preview and syntax highlighting with PrismJS/Shiki.
* Flashcard revision mode generated automatically from note bullet points.
* Note export to PDF and Markdown files.
* Bi-directional wiki-links between related notes.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
