// File: src/pages/Home.jsx
// Home page component for the landing page

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="container">
          <div className="logo">
            <h1>Vaanshika</h1>
          </div>
          <nav className="main-nav">
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#about">About</a></li>
              <li>
                {currentUser ? (
                  <Link to="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Preserve Your Family Legacy</h1>
            <p>
              Vaanshika helps you create, manage, and share your family tree with loved ones.
              Document your heritage, share memories, and connect generations.
            </p>
            <div className="hero-buttons">
              {currentUser ? (
                <Link to="/dashboard">
                  <Button variant="primary" size="large">Go to Dashboard</Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button variant="primary" size="large">Get Started</Button>
                </Link>
              )}
              <a href="#features">
                <Button variant="secondary" size="large">Learn More</Button>
              </a>
            </div>
          </div>
          <div className="hero-image">
            {/* Placeholder for hero image */}
            <div className="image-placeholder">Family Tree Illustration</div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="container">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌳</div>
              <h3>Family Tree</h3>
              <p>Create and visualize your family tree with an intuitive interface.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access your family tree on any device, anytime, anywhere.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure</h3>
              <p>Your family data is protected with enterprise-grade security.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📷</div>
              <h3>Media Storage</h3>
              <p>Upload and store family photos, documents, and videos.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Events & Reminders</h3>
              <p>Keep track of birthdays, anniversaries, and family events.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Family Chat</h3>
              <p>Communicate with family members through integrated messaging.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create an Account</h3>
              <p>Sign up for free and set up your profile.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Add Family Members</h3>
              <p>Start building your family tree by adding members.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Upload Media</h3>
              <p>Add photos, documents, and videos to preserve memories.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Share & Collaborate</h3>
              <p>Invite family members to view and contribute to the tree.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="container">
          <h2>About Vaanshika</h2>
          <p>
            Vaanshika is a family tree management application designed to help you preserve your family history and connect with relatives across generations. Our mission is to make family history accessible, engaging, and meaningful for everyone.
          </p>
        </div>
      </section>

      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h2>Vaanshika</h2>
              <p>Family Tree Management</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h3>Product</h3>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#how-it-works">How It Works</a></li>
                  <li><a href="#about">About</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h3>Legal</h3>
                <ul>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h3>Account</h3>
                <ul>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Vaanshika. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 