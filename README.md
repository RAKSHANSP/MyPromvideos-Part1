# Video Competitor Intelligence SaaS

This is a full-stack SaaS application that generates custom PowerPoint analytics reports based on YouTube channel statistics.

## Project Structure
- **/frontend**: React + Vite frontend application (running on port 5173).
- **/backend**: Express + Node.js backend with Prisma and SQLite (running on port 5000).

---

## Steps to Run the Application

Since I have already configured the local SQLite database for you, running the app is very straightforward. You will need to open **two separate terminal windows** (one for the backend, and one for the frontend).

### 1. Start the Backend
Open a new terminal window and run the following commands:
```bash
cd backend
npm install
npx prisma db push
npm run dev
```
> **Note:** Ensure you have added your actual `YOUTUBE_API_KEY` in the `backend/.env` file to fetch real-world data from YouTube.

### 2. Start the Frontend
Open a second, separate terminal window and run the following commands:
```bash
cd frontend
npm install
npm run dev
```

### 3. Open the App
Once both servers are running, open your browser and navigate to:
**http://localhost:5173**

You can now enter your company name and up to 4 competitors to generate a beautifully aligned, 10-slide PowerPoint intelligence report!
