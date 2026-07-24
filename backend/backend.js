const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const dataFile = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
const initializeData = () => {
  if (!fs.existsSync(dataFile)) {
    const initialData = {
      blogs: {
        productManager: [],
        projects: []
      },
      users: {
        name: "Nithyasree",
        email: "nithyasreehere@gmail.com",
        github: "https://github.com/n-ithy-a",
        linkedin: "https://www.linkedin.com/in/nithyasree-m-09034830a/"
      }
    };
    fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
  }
};

// Read data from file
const readData = () => {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { blogs: { productManager: [], projects: [] }, users: {} };
  }
};

// Write data to file
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data:', error);
  }
};

// Calculate streak for a category
const calculateStreak = (blogs) => {
  if (blogs.length === 0) return 0;

  const sortedDates = blogs
    .map(blog => new Date(blog.date))
    .sort((a, b) => b - a);

  let streak = 1;
  let currentDate = new Date(sortedDates[0]);
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i]);
    prevDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
};

// Initialize data on startup
initializeData();

// ==================== ROUTES ====================

// Get all blogs
app.get('/api/blogs', (req, res) => {
  const data = readData();
  res.json({
    productManager: data.blogs.productManager,
    projects: data.blogs.projects,
    streaks: {
      productManager: calculateStreak(data.blogs.productManager),
      projects: calculateStreak(data.blogs.projects)
    }
  });
});

// Get blogs by category
app.get('/api/blogs/:category', (req, res) => {
  const { category } = req.params;
  const data = readData();
  
  if (category !== 'productManager' && category !== 'projects') {
    return res.status(400).json({ error: 'Invalid category' });
  }

  res.json({
    blogs: data.blogs[category],
    streak: calculateStreak(data.blogs[category])
  });
});

// Add new blog
app.post('/api/blogs', (req, res) => {
  const { title, content, image, videoUrl, category, date } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (category !== 'productManager' && category !== 'projects') {
    return res.status(400).json({ error: 'Invalid category' });
  }

  const data = readData();
  const newBlog = {
    id: Date.now(),
    title,
    content,
    image: image || null,
    videoUrl: videoUrl || null,
    category,
    date: date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };

  data.blogs[category].push(newBlog);
  writeData(data);

  res.status(201).json({
    success: true,
    blog: newBlog,
    streak: calculateStreak(data.blogs[category])
  });
});

// Update blog
app.put('/api/blogs/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, image, videoUrl, date } = req.body;

  const data = readData();
  let found = false;

  for (const category in data.blogs) {
    const blogIndex = data.blogs[category].findIndex(b => b.id === parseInt(id));
    if (blogIndex !== -1) {
      data.blogs[category][blogIndex] = {
        ...data.blogs[category][blogIndex],
        title: title || data.blogs[category][blogIndex].title,
        content: content || data.blogs[category][blogIndex].content,
        image: image !== undefined ? image : data.blogs[category][blogIndex].image,
        videoUrl: videoUrl !== undefined ? videoUrl : data.blogs[category][blogIndex].videoUrl,
        date: date || data.blogs[category][blogIndex].date,
        updatedAt: new Date().toISOString()
      };
      writeData(data);
      found = true;
      res.json({ success: true, blog: data.blogs[category][blogIndex] });
      break;
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Blog not found' });
  }
});

// Delete blog
app.delete('/api/blogs/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  let found = false;

  for (const category in data.blogs) {
    const blogIndex = data.blogs[category].findIndex(b => b.id === parseInt(id));
    if (blogIndex !== -1) {
      data.blogs[category].splice(blogIndex, 1);
      writeData(data);
      found = true;
      res.json({ success: true, message: 'Blog deleted' });
      break;
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Blog not found' });
  }
});

// Get streaks for all categories
app.get('/api/streaks', (req, res) => {
  const data = readData();
  res.json({
    productManager: calculateStreak(data.blogs.productManager),
    projects: calculateStreak(data.blogs.projects)
  });
});

// Get user info
app.get('/api/user', (req, res) => {
  const data = readData();
  res.json(data.users);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ Nithyasree's Portfolio Backend running on http://localhost:${PORT}`);
  console.log(`📁 Data stored in: ${dataFile}`);
});
