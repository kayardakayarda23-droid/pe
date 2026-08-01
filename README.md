# Personal Expense Analysis and Budget Management System

A personal finance app: track expenses & income, set budgets, and analyze
spending trends. This repo currently contains a **complete, working backend**
(Node.js + Express + Prisma + MySQL) and a **scaffolded client** folder ready
for the React Native (Expo) frontend.

## What's implemented

**Backend (`/server`) — fully functional:**
- JWT authentication (register, login, forgot/reset password, profile, change password) with bcrypt hashing
- Expense CRUD with search/filters and receipt image upload (Multer)
- Income CRUD
- Budget CRUD with live usage/remaining/percentage calculation
- Custom + default categories
- Dashboard summary endpoint (income, expenses, balance, budget status, recent transactions)
- Analytics endpoint for daily/weekly/monthly/quarterly/yearly breakdowns + income-vs-expense trend
- **Reports**: generate Daily/Weekly/Monthly/Quarterly/Yearly/Budget/Income/Expense reports as downloadable **PDF** (pdfkit), **Excel** (exceljs), or **CSV** (json2csv) — `GET /api/reports/:type?format=pdf|excel|csv`, plus a JSON category-report endpoint and report history log
- **Notifications**: Firebase Cloud Messaging push + in-app notification log for budget-exceeded alerts (auto-triggered when an expense pushes a budget over its limit), daily expense reminders, weekly/monthly report-ready notices, savings reminders, and bill-due reminders — with `node-cron` scheduled jobs for the time-based ones
- Centralized validation (express-validator) and error handling
- Prisma schema covering User, Expense, Income, Budget, Category, Report, Notification, Settings (now including a device push token field)

**Database (`/prisma`):**
- `schema.prisma` with all models, relations, indexes
- `seed.js` to populate default categories

**Client (`/client`) — fully functional Expo app:**
- Auth flow: Login, Register, Forgot Password, session persistence (AsyncStorage) and auto-restore on launch
- Redux Toolkit store: auth, expenses, income, budgets, dashboard, categories, analytics slices, all wired to the backend API via axios (with JWT interceptor + 401 auto-logout)
- Bottom tab navigation: Dashboard, Expenses, Income, Budgets, Analytics, Profile — each of Expenses/Income/Budgets has its own list → add/edit stack, and Profile has its own stack for Reports and Notifications
- Dashboard: balance card, monthly budget card, stat cards, recent transactions
- Expenses: search, add/edit with category & payment method pickers, receipt photo attach (expo-image-picker), swipe/long-press delete
- Income: add/edit/delete
- Budgets: progress bars with overspend styling, period (daily/weekly/monthly) and category selection
- Analytics: pie chart (category distribution), bar chart (spending timeline), line chart (income vs expense trend) via `react-native-gifted-charts`, with a daily/weekly/monthly/quarterly/yearly period switcher
- **Reports**: pick a report type + format (PDF/Excel/CSV), downloads and opens the native share sheet (expo-file-system + expo-sharing)
- **Notifications**: push registration hook (expo-notifications) wired into the Dashboard, plus an in-app notification list with read/unread state
- Profile: user info, dark mode toggle, logout
- Reusable components: `Card`, `PrimaryButton`, `InputField`, `TransactionItem`, `BudgetProgressBar`
- Shared design tokens in `utils/theme.js` (colors, spacing, typography, category colors)

## Not yet built (next steps)

- Offline sync, receipt OCR, AI spending insights (advanced/optional features from the original spec)
- Unit/integration tests
- Multi-language support (currently English only)
- Multi-currency support — the app is intentionally Naira (NGN)-only for now; all amounts, reports, and notifications display ₦

These are substantial pieces of work in their own right — best tackled as
separate follow-ups so each gets real, complete code rather than stubs.

## Getting the client running

```bash
cd client
npm install
```

Open `services/api.js` and set `BASE_URL` to your backend's address — on a
physical device or emulator `localhost` won't reach your dev machine, so use
your computer's LAN IP, e.g. `http://192.168.1.20:5000/api`.

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `i`/`a` for a simulator. Register a
new account from the app, then start adding expenses/income/budgets.

## Getting the backend running

```bash
cd server
npm install
cp .env.example .env
# edit .env: set DATABASE_URL to your MySQL instance and a strong JWT_SECRET

npx prisma migrate dev --schema=../prisma/schema.prisma --name init
node ../prisma/seed.js

npm run dev
```

The API will be available at `http://localhost:5000/api`. Try `GET /api/health`
to confirm it's running, then `POST /api/auth/register` to create a user.

Push notifications work without any extra setup for the in-app notification
list (bell icon), but actual push delivery needs a Firebase service account:
put its path in `FIREBASE_SERVICE_ACCOUNT_PATH` (or the JSON itself in
`FIREBASE_SERVICE_ACCOUNT_JSON`) in `.env`. Without it, notifications are
still logged and visible in-app — they just won't push to the device.

## Project structure

```
personal-expense-app/
├── client/                 # React Native (Expo) app — fully implemented
│   ├── components/          Card, PrimaryButton, InputField, TransactionItem, BudgetProgressBar
│   ├── screens/              auth/ expenses/ income/ budgets/ analytics/ Dashboard Profile
│   ├── navigation/           RootNavigator, MainNavigator (tabs), per-feature stacks
│   ├── redux/                store + slices (auth, expenses, income, budgets, dashboard, categories, analytics)
│   ├── services/              api.js + per-resource service functions
│   ├── utils/                 theme.js, formatters.js
│   └── App.js
├── server/                 # Express API — fully implemented
│   ├── controllers/  routes/  middleware/  config/  uploads/  server.js
├── prisma/
│   ├── schema.prisma
│   └── seed.js
└── README.md
```
