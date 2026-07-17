# 🚀 Outscore

Outscore is a modern online assessment platform that enables educators and organizations to create, host, and evaluate secure online tests with built-in proctoring, participant management, and real-time monitoring.

---

## ✨ Features

### 👨‍🏫 Host Dashboard

- Google Authentication
- Create and manage assessments
- Publish, start and end tests
- Generate unique access codes
- View participant leaderboard
- Detailed participant reports
- Dynamic participant registration forms
- Configure assessment settings

### 📝 Test Management

- Multiple Choice Questions (MCQs)
- Automatic marks calculation
- Negative marking support
- Question ordering
- Test duration management
- Draft → Published → Live → Completed workflow

### 👨‍🎓 Student Portal

- Join tests using access code
- Dynamic registration form
- Waiting room before assessment
- Live timer
- Auto-saving answers
- Automatic submission on timeout
- Result page

### 🛡️ Proctoring

- Fullscreen enforcement
- Tab switching detection
- Window blur detection
- Copy detection
- Paste detection
- Warning system
- Automatic submission after maximum warnings
- Complete warning logs for each participant

### 📊 Reports & Analytics

- Leaderboard
- Participant ranking
- Accuracy calculation
- Detailed answer review
- Correct vs selected options
- Proctoring report
- Warning history
- Performance statistics

---

# 🛠️ Tech Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI
- Sonner Toast

### Backend

- Next.js Server Actions
- Prisma ORM
- PostgreSQL (Neon)

### Authentication

- Auth.js (NextAuth)
- Google OAuth

### Database

- PostgreSQL
- Prisma

---

# 📂 Project Structure

```
app/
components/
services/
validators/
lib/
prisma/
public/
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/outscore.git
```

```
cd outscore
```

## Install Dependencies

```bash
npm install
```

## Environment Variables

Create a `.env` file

```env
DATABASE_URL=

AUTH_SECRET=

AUTH_GOOGLE_ID=

AUTH_GOOGLE_SECRET=
```

---

## Prisma

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

---

## Run Development Server

```bash
npm run dev
```

Visit

```
http://localhost:3000
```

---

# 📸 Screenshots

> Add screenshots here

- Dashboard
- Create Test
- Question Builder
- Participant Form Builder
- Waiting Room
- Test Attempt
- Leaderboard
- Participant Report

---

# 🔐 Assessment Workflow

```
Host Login
      │
      ▼
Create Test
      │
      ▼
Add Questions
      │
      ▼
Configure Settings
      │
      ▼
Publish Test
      │
      ▼
Share Access Code
      │
      ▼
Student Registration
      │
      ▼
Waiting Room
      │
      ▼
Host Starts Test
      │
      ▼
Live Assessment
      │
      ▼
Auto Save Answers
      │
      ▼
Submission
      │
      ▼
Leaderboard & Reports
```

---

# 🎯 Future Improvements

- Subjective Questions
- Coding Assessments
- AI Proctoring
- Webcam Monitoring
- Face Detection
- Excel/PDF Export
- Email Notifications
- Analytics Dashboard
- Multi-language Support

---

# 👨‍💻 Author

**Lateesha Narnolia** and **Kunal Diwan**

B.Tech CSE • Delhi Technological University


---

# 📄 License

This project is developed for educational purposes.
