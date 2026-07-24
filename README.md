# Nithyasree's Portfolio Website - Setup Guide

## 🎯 Project Overview

A beautiful, personal portfolio website for showcasing your journey as a Product Manager and Business Analyst. Features:
- 4 Pages: HOME, BUILDING, ABOUT ME, CONTACT
- Daily blog posting with streak tracking
- Embedded images and YouTube videos
- Persistent data storage

## 📋 Project Structure

```
nithyasree-portfolio/
├── frontend.jsx          # React component (all pages in one file)
├── backend.js            # Express.js server
├── package.json          # Node.js dependencies
├── data.json            # Automatically created on first run
└── SETUP.md             # This file
```

## 🚀 Quick Start

### Option 1: Frontend Only (Quick Demo)

If you want to test the website immediately without a backend:

1. Copy the `frontend.jsx` code
2. Paste it into a React environment (Create React App, Vite, or CodeSandbox)
3. Install dependencies: `npm install lucide-react`
4. The app uses browser localStorage - data persists locally

**Note:** Data will only be stored in your browser, not accessible from other devices.

### Option 2: Full Stack (Recommended)

#### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

#### Setup Steps

1. **Create project directory:**
   ```bash
   mkdir nithyasree-portfolio
   cd nithyasree-portfolio
   ```

2. **Initialize backend:**
   ```bash
   npm install
   ```

3. **Start backend server:**
   ```bash
   npm start
   ```
   Server runs on: `http://localhost:5000`

4. **Setup frontend:**
   - **Using Create React App:**
     ```bash
     npx create-react-app frontend
     cd frontend
     npm install lucide-react
     ```
   - Replace the content of `src/App.jsx` with the `frontend.jsx` code
   - Update API calls if needed (currently set to localhost:5000)

   - **Alternative: Using Vite (Faster):**
     ```bash
     npm create vite@latest frontend -- --template react
     cd frontend
     npm install
     npm install lucide-react
     ```

5. **Run frontend in development:**
   ```bash
   npm start  # for Create React App
   # or
   npm run dev  # for Vite
   ```

Frontend runs on: `http://localhost:3000` (Create React App) or `http://localhost:5173` (Vite)

## 🔧 Configuration

### Backend Configuration
- **Port:** Default 5000 (change via `PORT` environment variable)
- **Data Storage:** JSON file (`data.json`) - automatically created
- **CORS:** Enabled for all origins (change in backend.js if needed)

### Frontend Configuration
- **API URL:** Update the API endpoint in the React component if using a different backend URL
- **Font:** Uses Google Fonts "Caveat" for handwritten style
- **Storage:** Uses browser localStorage as fallback

## 📝 Features

### HOME Page
- Personal letter from your future self
- Handwritten font styling

### BUILDING Page
**Product Manager Tab:**
- Create and manage blog posts
- Add images and YouTube videos
- Automatic daily streak tracking
- Card-based layout

**Projects Tab:**
- Same features as Product Manager
- Separate streak tracking

### ABOUT ME Page
- Personal introduction
- Handwritten font styling

### CONTACT Page
- Email address
- GitHub profile link
- LinkedIn profile link
- Clean contact layout

## 🔥 Streak System

Streaks are calculated automatically based on:
- Daily blog posts in each category
- Consecutive days with posts
- Displayed as 🔥 indicator

**Example:**
- Post on July 24 → Streak: 1
- Post on July 25 → Streak: 2
- Miss July 26 → Streak resets to 0
- Post on July 27 → Streak: 1

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🎨 Design Features

- **Color Scheme:** Pure white background, dark text
- **Typography:** Handwritten "Caveat" font for personal touches, clean sans-serif for content
- **Layout:** Minimalist, distraction-free design
- **Animations:** Smooth transitions and hover effects

## 📦 Blog Post Format

Each blog post includes:
- **Title:** Main heading (required)
- **Content:** Body text (required)
- **Image:** URL to cover image (optional)
- **Video:** YouTube video URL (optional - auto-embeds)
- **Date:** Publication date (auto-set to today)
- **Category:** Product Manager or Projects

## 🌐 Deployment

### Deploy Frontend

**Vercel (Recommended for React):**
```bash
npm install -g vercel
vercel
```

**Netlify:**
1. Build: `npm run build`
2. Connect your repo or upload the build folder

**GitHub Pages:**
Add to `package.json`:
```json
"homepage": "https://n-ithy-a.github.io"
```

### Deploy Backend

**Heroku:**
```bash
heroku create nithyasree-portfolio
git push heroku main
```

**Railway, Render, or Fly.io:**
- Connect your GitHub repo
- Set buildpack to Node.js
- Deploy

**VPS (DigitalOcean, AWS, etc.):**
1. Install Node.js
2. Upload files
3. Run: `npm start`
4. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start backend.js
   pm2 save
   ```

## 🔗 API Endpoints

### Get all blogs
```
GET /api/blogs
Returns: All blogs from both categories + streaks
```

### Get blogs by category
```
GET /api/blogs/:category
Parameters: productManager | projects
```

### Add new blog
```
POST /api/blogs
Body: {
  title: string (required),
  content: string (required),
  category: string (required),
  image?: string,
  videoUrl?: string,
  date?: string (YYYY-MM-DD)
}
```

### Update blog
```
PUT /api/blogs/:id
Body: { title?, content?, image?, videoUrl?, date? }
```

### Delete blog
```
DELETE /api/blogs/:id
```

### Get streaks
```
GET /api/streaks
Returns: { productManager: number, projects: number }
```

## 🐛 Troubleshooting

### Blog posts not saving
- **Frontend only:** Check browser storage permissions
- **With backend:** Ensure backend is running on port 5000
- **CORS errors:** Backend CORS is configured - if still issues, check firewall

### Images not loading
- Use full HTTPS URLs: `https://example.com/image.jpg`
- Avoid relative paths

### Videos not embedding
- Use YouTube URLs in format: `https://www.youtube.com/watch?v=VIDEO_ID`
- Supported platforms: YouTube

### Streak not calculating
- Ensure dates are in YYYY-MM-DD format
- Posts must be on consecutive days
- Check browser console for errors

## 💡 Tips & Tricks

1. **Backup your data:** Periodically download your `data.json` file
2. **Custom domain:** Configure your registrar to point to your hosted frontend
3. **Email notifications:** Add a cron job to remind you to post daily
4. **Analytics:** Add Google Analytics by including the tracking code in HTML head
5. **SEO:** Add meta tags for better search engine visibility

## 🎓 Next Steps

1. Deploy the website
2. Start posting daily in the BUILDING section
3. Build your streak 🔥
4. Share with friends and mentors
5. Iterate and improve

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review browser console errors
3. Ensure all dependencies are installed
4. Verify API endpoints are correct

---

**Happy building, Nithyasree! 🚀**

Your future self believes in you! 💪
