// File: src/pages/LandingPage.jsx
// Modern landing page for Vaanshika family tree application

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Tree illustration component with animation
const TreeIllustration = () => {
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 800 600" className="w-full h-full">
        {/* Tree trunk */}
        <motion.path
          d="M400,500 L400,300"
          stroke="#4F7942"
          strokeWidth="20"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        />
        
        {/* Main branches */}
        <motion.path
          d="M400,300 L300,200"
          stroke="#4F7942"
          strokeWidth="15"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.7 }}
        />
        <motion.path
          d="M400,300 L500,200"
          stroke="#4F7942"
          strokeWidth="15"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.7 }}
        />
        
        {/* Secondary branches */}
        <motion.path
          d="M300,200 L250,150"
          stroke="#4F7942"
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 2.7 }}
        />
        <motion.path
          d="M300,200 L350,120"
          stroke="#4F7942"
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 2.7 }}
        />
        <motion.path
          d="M500,200 L450,120"
          stroke="#4F7942"
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 2.7 }}
        />
        <motion.path
          d="M500,200 L550,150"
          stroke="#4F7942"
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 2.7 }}
        />
        
        {/* Family members (circles) */}
        <motion.circle
          cx="400"
          cy="300"
          r="25"
          fill="#FFD700"
          stroke="#4F7942"
          strokeWidth="3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        />
        <motion.circle
          cx="300"
          cy="200"
          r="20"
          fill="#FFD700"
          stroke="#4F7942"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 2.5 }}
        />
        <motion.circle
          cx="500"
          cy="200"
          r="20"
          fill="#FFD700"
          stroke="#4F7942"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 2.5 }}
        />
        <motion.circle
          cx="250"
          cy="150"
          r="15"
          fill="#FFD700"
          stroke="#4F7942"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 3.5 }}
        />
        <motion.circle
          cx="350"
          cy="120"
          r="15"
          fill="#FFD700"
          stroke="#4F7942"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 3.5 }}
        />
        <motion.circle
          cx="450"
          cy="120"
          r="15"
          fill="#FFD700"
          stroke="#4F7942"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 3.5 }}
        />
        <motion.circle
          cx="550"
          cy="150"
          r="15"
          fill="#FFD700"
          stroke="#4F7942"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 3.5 }}
        />
      </svg>
    </div>
  );
};

// Animated blob backgrounds
const AnimatedBlobs = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    <motion.div 
      className="absolute top-20 left-10 w-64 h-64 bg-primary-300 opacity-20 rounded-full filter blur-3xl"
      animate={{ 
        x: [0, 30, 0],
        y: [0, 40, 0],
      }}
      transition={{ 
        repeat: Infinity,
        duration: 20,
        ease: "easeInOut"
      }}
    />
    <motion.div 
      className="absolute top-40 right-20 w-96 h-96 bg-secondary-300 opacity-20 rounded-full filter blur-3xl"
      animate={{ 
        x: [0, -50, 0],
        y: [0, 30, 0],
      }}
      transition={{ 
        repeat: Infinity,
        duration: 25,
        ease: "easeInOut"
      }}
    />
    <motion.div 
      className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent-300 opacity-20 rounded-full filter blur-3xl"
      animate={{ 
        x: [0, 40, 0],
        y: [0, -30, 0],
      }}
      transition={{ 
        repeat: Infinity,
        duration: 18,
        ease: "easeInOut"
      }}
    />
  </div>
);

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Features data
  const features = [
    {
      title: 'Interactive Family Tree',
      description: 'Create and visualize your family connections with our intuitive tree builder.',
      icon: '🌳'
    },
    {
      title: 'Media Gallery',
      description: 'Store and share your precious family photos and videos securely.',
      icon: '📸'
    },
    {
      title: 'Family Chat',
      description: 'Stay connected with your loved ones through private family messaging.',
      icon: '💬'
    },
    {
      title: 'Event Calendar',
      description: 'Never miss important family events with our shared calendar system.',
      icon: '📅'
    }
  ];
  
  // Testimonials data
  const testimonials = [
    {
      quote: "Vaanshika has transformed how our family stays connected. The family tree feature is simply amazing!",
      name: "Priya Sharma",
      role: "Mother of 3"
    },
    {
      quote: "I can finally organize all our family photos in one place. The media gallery is a game-changer for preserving memories.",
      name: "Raj Patel",
      role: "Family Historian"
    },
    {
      quote: "As someone living abroad, the chat feature helps me feel close to my family despite the distance.",
      name: "Ananya Gupta",
      role: "Expat Professional"
    }
  ];
  
  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="blob-1 animate-blob-slow"></div>
        <div className="blob-2 animate-blob-slow animation-delay-2000"></div>
        <div className="blob-3 animate-blob-slow animation-delay-4000"></div>
        <div className="bg-gradient-to-b from-primary-50/30 to-secondary-50/30 absolute inset-0"></div>
      </div>
      
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' : 'py-5 bg-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-4xl mr-3">🌳</span>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent m-0">Vaanshika</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="nav-link text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200">Features</a>
            <a href="#testimonials" className="nav-link text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200">Testimonials</a>
            <Link to="/login" className="nav-link text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200">Login</Link>
            <Link to="/register" className="btn-primary-glass px-5 py-2.5 rounded-full font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">Get Started</Link>
          </nav>
          
          <button 
            className="md:hidden text-2xl text-primary-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-4 px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-4">
              <a 
                href="#features" 
                className="nav-link text-neutral-700 hover:text-primary-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#testimonials" 
                className="nav-link text-neutral-700 hover:text-primary-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <Link 
                to="/login" 
                className="nav-link text-neutral-700 hover:text-primary-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn-primary-glass w-full text-center py-3 rounded-full font-medium transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </header>
      
      {/* Hero Section */}
      <section className="hero-section py-20 md:py-32 relative overflow-hidden">
        <AnimatedBlobs />
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Connect Your Family</span>
              <br />Across Generations
            </h1>
            <p className="text-lg md:text-xl mb-8 text-neutral-700 dark:text-neutral-300 max-w-lg mx-auto md:mx-0">
              Create your family tree, share memories, and stay connected with your loved ones in one beautiful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
              <Link to="/register" className="btn-primary-glass text-center px-8 py-3.5 rounded-full font-medium text-lg shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1">
                Start Your Family Tree
              </Link>
              <a href="#features" className="btn-secondary-glass text-center px-8 py-3.5 rounded-full font-medium text-lg shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1">
                Learn More
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            className="hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="card-glass p-8 rounded-3xl h-[450px] shadow-glass hover:shadow-glass-lg transition-all duration-300">
              <TreeIllustration />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Features Designed for Families
              </span>
            </h2>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
              Everything you need to document, connect, and celebrate your family heritage.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card-glass p-8 rounded-2xl text-center shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-5xl mb-5 mx-auto bg-primary-100 dark:bg-primary-900/30 w-20 h-20 flex items-center justify-center rounded-full">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-primary-700 dark:text-primary-400">{feature.title}</h3>
                <p className="text-neutral-700 dark:text-neutral-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-32 bg-gradient-to-b from-transparent to-primary-50/40 dark:to-primary-900/30 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                What Families Say
              </span>
            </h2>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
              Join thousands of families who are preserving their legacy with Vaanshika.
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <div className="testimonial-card-glass p-10 rounded-3xl relative shadow-glass bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-5xl">💬</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center pt-6"
                >
                  <p className="text-xl md:text-2xl italic mb-8 text-neutral-700 dark:text-neutral-300">"{testimonials[activeTestimonial].quote}"</p>
                  <div className="inline-block bg-primary-100 dark:bg-primary-900/30 px-6 py-3 rounded-full">
                    <p className="font-semibold text-lg text-primary-700 dark:text-primary-400 m-0">{testimonials[activeTestimonial].name}</p>
                    <p className="text-neutral-600 dark:text-neutral-400 m-0 text-sm">{testimonials[activeTestimonial].role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-center mt-10 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-3 rounded-full transition-all ${
                      activeTestimonial === index 
                        ? 'bg-primary-500 w-8' 
                        : 'bg-neutral-300 dark:bg-neutral-700 w-3'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            className="cta-card-glass p-10 md:p-16 rounded-3xl text-center max-w-4xl mx-auto shadow-glass-lg bg-gradient-to-br from-primary-50/80 to-secondary-50/80 dark:from-primary-900/50 dark:to-secondary-900/50 backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-6xl">🌳</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 pt-6">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Start Your Family Journey Today
              </span>
            </h2>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-neutral-700 dark:text-neutral-300">
              Join thousands of families who are documenting their history and staying connected with Vaanshika.
            </p>
            <Link to="/register" className="btn-primary-glass text-lg px-10 py-4 rounded-full font-medium shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1 inline-block">
              Create Your Free Account
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center mb-5">
                <span className="text-3xl mr-3">🌳</span>
                <h3 className="text-xl m-0 font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Vaanshika</h3>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Connecting families across generations.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition text-xl bg-primary-50 dark:bg-primary-900/30 p-2 rounded-full">📱</a>
                <a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition text-xl bg-primary-50 dark:bg-primary-900/30 p-2 rounded-full">💻</a>
                <a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition text-xl bg-primary-50 dark:bg-primary-900/30 p-2 rounded-full">📧</a>
                <a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition text-xl bg-primary-50 dark:bg-primary-900/30 p-2 rounded-full">📞</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-5 text-primary-700 dark:text-primary-400">Features</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">Family Tree</a></li>
                <li><a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">Media Gallery</a></li>
                <li><a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">Family Chat</a></li>
                <li><a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">Event Calendar</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-5 text-primary-700 dark:text-primary-400">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">About Us</a></li>
                <li><a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">Terms of Service</a></li>
                <li><a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-5 text-primary-700 dark:text-primary-400">Newsletter</h4>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">Subscribe to get updates on new features and family tips.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="form-input-glass px-4 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-primary-500 flex-grow"
                />
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-r-full transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 dark:border-neutral-800 mt-12 pt-8 text-center text-neutral-600 dark:text-neutral-400">
            <p>&copy; {new Date().getFullYear()} Vaanshika. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 