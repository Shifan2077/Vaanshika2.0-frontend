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
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        />
        <motion.circle
          cx="300"
          cy="200"
          r="20"
          fill="#FFD700"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 2.5 }}
        />
        <motion.circle
          cx="500"
          cy="200"
          r="20"
          fill="#FFD700"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 2.5 }}
        />
        <motion.circle
          cx="250"
          cy="150"
          r="15"
          fill="#FFD700"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 3.5 }}
        />
        <motion.circle
          cx="350"
          cy="120"
          r="15"
          fill="#FFD700"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 3.5 }}
        />
        <motion.circle
          cx="450"
          cy="120"
          r="15"
          fill="#FFD700"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 3.5 }}
        />
        <motion.circle
          cx="550"
          cy="150"
          r="15"
          fill="#FFD700"
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="blob-1 animate-blob-slow"></div>
        <div className="blob-2 animate-blob-slow animation-delay-2000"></div>
        <div className="blob-3 animate-blob-slow animation-delay-4000"></div>
        <div className="bg-gradient-to-b from-primary-50/30 to-secondary-50/30 absolute inset-0"></div>
      </div>
      
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md' : 'py-4 bg-transparent'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-3xl mr-2">🌳</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Vaanshika</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="nav-link">Features</a>
            <a href="#testimonials" className="nav-link">Testimonials</a>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary-glass">Get Started</Link>
          </nav>
          
          <button className="md:hidden text-2xl">☰</button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="hero-section py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
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
            <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300 max-w-lg">
              Create your family tree, share memories, and stay connected with your loved ones in one beautiful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/register" className="btn-primary-glass text-center">
                Start Your Family Tree
              </Link>
              <a href="#features" className="btn-secondary-glass text-center">
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
            <div className="card-glass p-6 rounded-2xl h-[400px]">
              <TreeIllustration />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Features Designed for Families
              </span>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to document, connect, and celebrate your family heritage.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card-glass p-6 rounded-xl text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-b from-transparent to-primary-50/30 dark:to-primary-900/20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                What Families Say
              </span>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of families who are preserving their legacy with Vaanshika.
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <div className="testimonial-card-glass p-8 rounded-2xl relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <p className="text-xl md:text-2xl italic mb-6">"{testimonials[activeTestimonial].quote}"</p>
                  <div>
                    <p className="font-semibold text-lg">{testimonials[activeTestimonial].name}</p>
                    <p className="text-gray-600 dark:text-gray-400">{testimonials[activeTestimonial].role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeTestimonial === index 
                        ? 'bg-primary-500 w-6' 
                        : 'bg-gray-300 dark:bg-gray-700'
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
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="cta-card-glass p-8 md:p-12 rounded-2xl text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Start Your Family Journey Today
              </span>
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
              Join thousands of families who are documenting their history and staying connected with Vaanshika.
            </p>
            <Link to="/register" className="btn-primary-glass text-lg px-8 py-3">
              Create Your Free Account
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">🌳</span>
                <h3 className="text-xl m-0 font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Vaanshika</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Connecting families across generations.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition">Family Tree</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition">Media Gallery</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition">Family Chat</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition">Event Calendar</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition">About Us</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition text-xl">📱</a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition text-xl">💻</a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition text-xl">📧</a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition text-xl">📞</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Vaanshika. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 