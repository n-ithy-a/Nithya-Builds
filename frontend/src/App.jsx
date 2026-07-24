import React, { useState, useEffect } from 'react';
import { ChevronDown, Mail, Github, Linkedin, Plus, Trash2 } from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [blogs, setBlogs] = useState(() => {
    const saved = localStorage.getItem('blogs');
    return saved ? JSON.parse(saved) : {
      productManager: [],
      projects: []
    };
  });
  const [expandedSection, setExpandedSection] = useState('productManager');
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    videoUrl: '',
    category: 'productManager',
    date: new Date().toISOString().split('T')[0]
  });

  // Save blogs to localStorage
  useEffect(() => {
    localStorage.setItem('blogs', JSON.stringify(blogs));
  }, [blogs]);

  // Calculate streak
  const calculateStreak = (category) => {
    const categoryBlogs = category === 'productManager' ? blogs.productManager : blogs.projects;
    if (categoryBlogs.length === 0) return 0;

    const sortedDates = categoryBlogs
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

  const handleAddBlog = (e) => {
    e.preventDefault();
    const newBlog = {
      id: Date.now(),
      ...formData,
      date: formData.date || new Date().toISOString().split('T')[0]
    };

    setBlogs(prev => ({
      ...prev,
      [formData.category === 'productManager' ? 'productManager' : 'projects']: [
        newBlog,
        ...(formData.category === 'productManager' ? prev.productManager : prev.projects)
      ]
    }));

    setFormData({
      title: '',
      content: '',
      image: '',
      videoUrl: '',
      category: 'productManager',
      date: new Date().toISOString().split('T')[0]
    });
    setShowBlogForm(false);
  };

  const handleDeleteBlog = (id, category) => {
    setBlogs(prev => ({
      ...prev,
      [category === 'productManager' ? 'productManager' : 'projects']: 
        (category === 'productManager' ? prev.productManager : prev.projects).filter(blog => blog.id !== id)
    }));
  };

  const renderHome = () => (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', fontFamily: 'Caveat, cursive', fontWeight: '400', color: '#333', lineHeight: '1.8', marginBottom: '30px' }}>
          Dear Nithya,
        </p>
        <p style={{ fontSize: '18px', fontFamily: 'Caveat, cursive', fontWeight: '400', color: '#333', lineHeight: '1.8', marginBottom: '20px' }}>
          You are in the process of becoming a Product Manager and Business Analyst. I believe in you and you are doing great. Keep going!
        </p>
        <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #ddd' }}>
          <p style={{ fontSize: '16px', fontFamily: 'Caveat, cursive', fontWeight: '400', color: '#333', lineHeight: '1.8' }}>
            With love,
          </p>
          <p style={{ fontSize: '16px', fontFamily: 'Caveat, cursive', fontWeight: '400', color: '#333', lineHeight: '1.8' }}>
            Your future self.
          </p>
        </div>
      </div>
    </div>
  );

  const renderBuilding = () => (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Product Manager Section */}
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => setExpandedSection(expandedSection === 'productManager' ? null : 'productManager')}
            style={{
              width: '100%',
              padding: '20px',
              backgroundColor: '#f9f9f9',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '18px',
              fontWeight: '600'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>Product Manager</span>
              {blogs.productManager.length > 0 && (
                <span style={{ fontSize: '14px', color: '#00a86b', fontWeight: '700' }}>
                  🔥 Streak: {calculateStreak('productManager')}
                </span>
              )}
            </div>
            <ChevronDown style={{ transform: expandedSection === 'productManager' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
          </button>

          {expandedSection === 'productManager' && (
            <div style={{ padding: '20px', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
              <button
                onClick={() => {
                  setShowBlogForm(!showBlogForm);
                  setFormData({ ...formData, category: 'productManager' });
                }}
                style={{
                  marginBottom: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                <Plus size={18} /> Add Blog
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {blogs.productManager.map(blog => (
                  <div key={blog.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    {blog.image && (
                      <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    )}
                    <div style={{ padding: '20px' }}>
                      <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{blog.date}</p>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>{blog.title}</h3>
                      <p style={{ fontSize: '14px', color: '#555', marginBottom: '12px', lineHeight: '1.6' }}>{blog.content}</p>
                      {blog.videoUrl && (
                        <div style={{ marginTop: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                          <iframe
                            width="100%"
                            height="200"
                            src={blog.videoUrl.replace('watch?v=', 'embed/')}
                            title={blog.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}
                      <button
                        onClick={() => handleDeleteBlog(blog.id, 'productManager')}
                        style={{
                          marginTop: '12px',
                          padding: '6px 12px',
                          backgroundColor: '#fee',
                          color: '#c33',
                          border: '1px solid #fcc',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {blogs.productManager.length === 0 && !showBlogForm && (
                <p style={{ textAlign: 'center', color: '#999', padding: '40px 20px' }}>No blogs yet. Add your first one!</p>
              )}
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => setExpandedSection(expandedSection === 'projects' ? null : 'projects')}
            style={{
              width: '100%',
              padding: '20px',
              backgroundColor: '#f9f9f9',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '18px',
              fontWeight: '600'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>Projects</span>
              {blogs.projects.length > 0 && (
                <span style={{ fontSize: '14px', color: '#00a86b', fontWeight: '700' }}>
                  🔥 Streak: {calculateStreak('projects')}
                </span>
              )}
            </div>
            <ChevronDown style={{ transform: expandedSection === 'projects' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
          </button>

          {expandedSection === 'projects' && (
            <div style={{ padding: '20px', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
              <button
                onClick={() => {
                  setShowBlogForm(!showBlogForm);
                  setFormData({ ...formData, category: 'projects' });
                }}
                style={{
                  marginBottom: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                <Plus size={18} /> Add Blog
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {blogs.projects.map(blog => (
                  <div key={blog.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    {blog.image && (
                      <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    )}
                    <div style={{ padding: '20px' }}>
                      <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{blog.date}</p>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>{blog.title}</h3>
                      <p style={{ fontSize: '14px', color: '#555', marginBottom: '12px', lineHeight: '1.6' }}>{blog.content}</p>
                      {blog.videoUrl && (
                        <div style={{ marginTop: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                          <iframe
                            width="100%"
                            height="200"
                            src={blog.videoUrl.replace('watch?v=', 'embed/')}
                            title={blog.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}
                      <button
                        onClick={() => handleDeleteBlog(blog.id, 'projects')}
                        style={{
                          marginTop: '12px',
                          padding: '6px 12px',
                          backgroundColor: '#fee',
                          color: '#c33',
                          border: '1px solid #fcc',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {blogs.projects.length === 0 && !showBlogForm && (
                <p style={{ textAlign: 'center', color: '#999', padding: '40px 20px' }}>No blogs yet. Add your first one!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Blog Form Modal */}
      {showBlogForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Add New Blog Post</h2>
            <form onSubmit={handleAddBlog}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Blog title"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '120px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Write your blog content here..."
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>YouTube Video URL (optional)</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowBlogForm(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderAboutMe = () => (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', fontFamily: 'Caveat, cursive', fontWeight: '400', color: '#333', lineHeight: '1.8', marginBottom: '20px' }}>
          I'm Nithyasree and I'm currently in my 3rd year of Computer Science Course.
        </p>
        <p style={{ fontSize: '18px', fontFamily: 'Caveat, cursive', fontWeight: '400', color: '#333', lineHeight: '1.8' }}>
          Happy to see you reading! Wish you have a nice day today!
        </p>
      </div>
    </div>
  );

  const renderContact = () => (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '28px', fontWeight: '600' }}>Get in Touch</h1>
        
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <Mail size={24} style={{ color: '#333' }} />
          <div>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Email</p>
            <a href="mailto:nithyasreehere@gmail.com" style={{ fontSize: '16px', color: '#333', textDecoration: 'none', fontWeight: '500' }}>
              nithyasreehere@gmail.com
            </a>
          </div>
        </div>

        <div style={{
          padding: '20px',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <Github size={24} style={{ color: '#333' }} />
          <div>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>GitHub</p>
            <a href="https://github.com/n-ithy-a" target="_blank" rel="noopener noreferrer" style={{ fontSize: '16px', color: '#333', textDecoration: 'none', fontWeight: '500' }}>
              github.com/n-ithy-a
            </a>
          </div>
        </div>

        <div style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <Linkedin size={24} style={{ color: '#333' }} />
          <div>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>LinkedIn</p>
            <a href="https://www.linkedin.com/in/nithyasree-m-09034830a/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '16px', color: '#333', textDecoration: 'none', fontWeight: '500' }}>
              nithyasree-m-09034830a
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
      
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #ddd',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, fontFamily: 'Caveat, cursive', letterSpacing: '2px' }}>NITHYASREE</h1>
        
        <div style={{ display: 'flex', gap: '30px' }}>
          <button
            onClick={() => setCurrentPage('home')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: currentPage === 'home' ? '600' : '400',
              color: currentPage === 'home' ? '#000' : '#666',
              padding: '0'
            }}
          >
            HOME
          </button>
          <button
            onClick={() => setCurrentPage('building')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: currentPage === 'building' ? '600' : '400',
              color: currentPage === 'building' ? '#000' : '#666',
              padding: '0'
            }}
          >
            BUILDING
          </button>
          <button
            onClick={() => setCurrentPage('about')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: currentPage === 'about' ? '600' : '400',
              color: currentPage === 'about' ? '#000' : '#666',
              padding: '0'
            }}
          >
            ABOUT ME
          </button>
          <button
            onClick={() => setCurrentPage('contact')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: currentPage === 'contact' ? '600' : '400',
              color: currentPage === 'contact' ? '#000' : '#666',
              padding: '0'
            }}
          >
            CONTACT
          </button>
        </div>
      </nav>

      {/* Page Content */}
      {currentPage === 'home' && renderHome()}
      {currentPage === 'building' && renderBuilding()}
      {currentPage === 'about' && renderAboutMe()}
      {currentPage === 'contact' && renderContact()}
    </div>
  );
};

export default App;
