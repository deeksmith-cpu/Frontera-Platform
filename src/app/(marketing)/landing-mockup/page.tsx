"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./landing.css";

// Intersection Observer hook for scroll animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

export default function LandingMockup() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="frontera-landing">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L30 9V23L16 30L2 23V9L16 2Z" fill="url(#logo-gradient-nav)"/>
              <path d="M16 2V30M2 9L30 23M30 9L2 23" stroke="white" strokeWidth="1.5" opacity="0.4"/>
              <defs>
                <linearGradient id="logo-gradient-nav" x1="2" y1="2" x2="30" y2="30">
                  <stop stopColor="#1a1f3a"/>
                  <stop offset="1" stopColor="#fbbf24"/>
                </linearGradient>
              </defs>
            </svg>
            <span>Frontera</span>
          </Link>

          <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="nav-dropdown">
              <button>Products <ChevronDown /></button>
            </div>
            <a href="#pricing">Pricing</a>
            <div className="nav-dropdown">
              <button>Features <ChevronDown /></button>
            </div>
            <div className="nav-dropdown">
              <button>Resources <ChevronDown /></button>
            </div>
          </div>

          <div className="nav-actions">
            <Link href="/sign-in" className="nav-login">Login</Link>
            <Link href="/sign-up" className="nav-cta">Get a demo</Link>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">✦</span>
              AI-powered coaching for strategic leaders
            </div>

            <h1 className="hero-title">
              Strategy that <em>works</em><br />
              as hard as you do
            </h1>

            <p className="hero-subtitle">
              A seamless platform to develop strategy, set strategic bets, and drive transformation—all in one place. Take control today.
            </p>

            <div className="hero-buttons">
              <Link href="/sign-up" className="btn-primary">Get started</Link>
              <a href="#features" className="btn-secondary">Explore features</a>
            </div>
          </div>

          <div className="hero-visual">
            {/* Phone Mockup */}
            <div className="phone-mockup">
              <div className="phone-frame">
                <div className="phone-notch"></div>
                <div className="phone-screen">
                  <div className="app-bar">
                    <span className="app-time">9:41</span>
                    <div className="app-icons">
                      <span>📶</span>
                      <span>🔋</span>
                    </div>
                  </div>

                  <div className="app-header-ui">
                    <div className="user-greeting">
                      <div className="user-avatar">
                        <span>NP</span>
                      </div>
                      <div className="user-info">
                        <span className="user-name">Nicole Palmer</span>
                        <span className="user-role">VP Strategy</span>
                      </div>
                    </div>
                  </div>

                  <div className="balance-card">
                    <span className="balance-label">Strategic Clarity Score</span>
                    <span className="balance-amount">94.2%</span>
                    <div className="balance-actions">
                      <button className="action-btn">📊 Report</button>
                      <button className="action-btn">🎯 Goals</button>
                      <button className="action-btn">⋯ More</button>
                    </div>
                  </div>

                  <div className="transactions-header">
                    <span>Recent Insights</span>
                    <a href="#">See all</a>
                  </div>

                  <div className="transaction-list">
                    <div className="transaction-item">
                      <div className="transaction-icon blue">📊</div>
                      <div className="transaction-details">
                        <span className="transaction-name">Market Analysis</span>
                        <span className="transaction-date">Completed today</span>
                      </div>
                      <span className="transaction-amount positive">+12 insights</span>
                    </div>
                    <div className="transaction-item">
                      <div className="transaction-icon teal">🎯</div>
                      <div className="transaction-details">
                        <span className="transaction-name">Strategic Bet #3</span>
                        <span className="transaction-date">In progress</span>
                      </div>
                      <span className="transaction-amount">High confidence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="floating-card card-notification">
              <div className="notification-icon">
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <path d="M9 12l2 2 4-4" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="#fbbf24" strokeWidth="2"/>
                </svg>
              </div>
              <div className="notification-content">
                <span className="notification-title">New insight discovered</span>
                <span className="notification-desc">Market opportunity identified</span>
              </div>
            </div>

            <div className="floating-card card-metric">
              <div className="metric-header">
                <span className="metric-label">This Quarter</span>
                <span className="metric-badge">↑ 23%</span>
              </div>
              <span className="metric-value">$4.2M</span>
              <span className="metric-sublabel">Strategic Impact</span>
            </div>

            <div className="floating-card card-visa">
              <div className="visa-chip"></div>
              <span className="visa-brand">Frontera</span>
              <div className="visa-logo">
                <svg width="40" height="24" viewBox="0 0 40 24">
                  <rect width="40" height="24" rx="4" fill="url(#card-grad)"/>
                  <text x="8" y="16" fill="white" fontSize="8" fontWeight="600">STRATEGY</text>
                  <defs>
                    <linearGradient id="card-grad" x1="0" y1="0" x2="40" y2="24">
                      <stop stopColor="#1a1f3a"/>
                      <stop offset="1" stopColor="#fbbf24"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By */}
        <div className="trusted-section">
          <p className="trusted-label">Built for enterprise teams, powered by AI</p>
          <div className="trusted-logos">
            {['Kinetic', 'Grasshopper', 'EdgeCorp', 'Nexus & Co'].map((company, i) => (
              <div key={company} className="logo-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="logo-icon">✦</span>
                <span>{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">FEATURES</span>
            <h2>
              Powerful features for<br />
              <em>smarter</em> strategic decisions
            </h2>
            <p>Everything you need to take control of your strategy—built to be simple, secure, and smart.</p>
          </div>

          <div className="features-grid">
            <FeatureCard
              mockup={
                <div className="feature-visual chart-visual">
                  <div className="chart-container">
                    <div className="chart-header">
                      <span className="chart-value">$550.00</span>
                      <span className="chart-percent">92%</span>
                    </div>
                    <div className="chart-bars">
                      <div className="bar" style={{ height: '60%' }}></div>
                      <div className="bar" style={{ height: '80%' }}></div>
                      <div className="bar" style={{ height: '45%' }}></div>
                      <div className="bar" style={{ height: '90%' }}></div>
                      <div className="bar active" style={{ height: '75%' }}></div>
                    </div>
                    <div className="chart-labels">
                      <span>$450.00</span>
                      <span>$190.00</span>
                    </div>
                  </div>
                  <div className="chart-actions">
                    <span className="action-pill">🏢 Colleague</span>
                    <span className="action-pill">👥 Customer</span>
                    <span className="action-pill">📊 Market</span>
                  </div>
                </div>
              }
              title="Research Pillars"
              description="Stay in control of your research with smart synthesis tools that categorize your insights and show you exactly where opportunities exist."
            />

            <FeatureCard
              mockup={
                <div className="feature-visual savings-visual">
                  <div className="savings-header">
                    <span className="savings-icon">🎯</span>
                    <div className="savings-info">
                      <span className="savings-title">Strategic Bet #1</span>
                      <span className="savings-amount">$285.00</span>
                    </div>
                  </div>
                  <div className="savings-breakdown">
                    <div className="savings-item">
                      <span>Target ARR</span>
                      <span>$148.00</span>
                    </div>
                    <div className="savings-item">
                      <span>Investment</span>
                      <span>$92.00</span>
                    </div>
                    <div className="savings-item">
                      <span>Timeline</span>
                      <span>Q3 2026</span>
                    </div>
                    <div className="savings-item highlight">
                      <span>Confidence</span>
                      <span>+2.5%</span>
                    </div>
                  </div>
                </div>
              }
              title="Strategic Bets"
              description="Create hypothesis-driven strategic bets and automate the validation process. Whether it&apos;s market entry or product pivot—your goals stay on track."
            />

            <FeatureCard
              mockup={
                <div className="feature-visual investing-visual">
                  <div className="crypto-card">
                    <div className="crypto-icon">🧠</div>
                    <div className="crypto-info">
                      <span className="crypto-name">AI Coach</span>
                      <span className="crypto-symbol">Active</span>
                    </div>
                    <span className="crypto-price">CA$30.46</span>
                  </div>
                  <div className="crypto-change negative">
                    <span>↓ 1.2%</span>
                  </div>
                </div>
              }
              title="AI Coaching"
              description="Explore strategic options tailored to your context. Start with a few questions, and grow your vision with confidence."
            />

            <FeatureCard
              mockup={
                <div className="feature-visual insights-visual">
                  <div className="insight-card">
                    <div className="insight-header">
                      <span className="insight-icon">💡</span>
                      <span>Smart Insights</span>
                    </div>
                    <p className="insight-text">Your market research indicates a 40% opportunity in the enterprise segment.</p>
                  </div>
                </div>
              }
              title="Smart Alerts & Insights"
              description="Get timely reminders, strategic alerts, and actionable tips that help you stay one step ahead—without lifting a finger."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-container">
          <div className="how-content">
            <div className="how-text">
              <span className="section-tag">HOW IT WORKS</span>
              <h2>
                How it works in<br />
                three <em>simple</em> steps
              </h2>
              <p>From setting goals to tracking your progress—here&apos;s how we help you take control of your strategy in just a few easy steps.</p>

              <div className="steps-list">
                <div className="step-item">
                  <div className="step-number">
                    <span>1</span>
                  </div>
                  <div className="step-content">
                    <h3>Sign up</h3>
                    <p>Create your free account in minutes—no paperwork, no hassle. Create your free account in 5 minutes.</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">
                    <span>2</span>
                  </div>
                  <div className="step-content">
                    <h3>Set your goals</h3>
                    <p>Tell us what you&apos;re working toward, and we&apos;ll help build a personalized plan that fits your timeline.</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">
                    <span>3</span>
                  </div>
                  <div className="step-content">
                    <h3>Track your progress</h3>
                    <p>Get real-time updates, hit your milestones, and stay motivated with smart insights and reminders.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="how-visual">
              <div className="tilted-card">
                <div className="card-front">
                  <div className="card-chip"></div>
                  <div className="card-logo">
                    <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
                      <path d="M16 4L30 10V22L16 28L2 22V10L16 4Z" fill="url(#tilt-grad)" opacity="0.9"/>
                      <defs>
                        <linearGradient id="tilt-grad" x1="2" y1="4" x2="30" y2="28">
                          <stop stopColor="#1a1f3a"/>
                          <stop offset="1" stopColor="#fbbf24"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>Frontera</span>
                  </div>
                  <div className="card-number">VISA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="security">
        <div className="section-container">
          <div className="security-content">
            <div className="security-text">
              <span className="section-tag">ENTERPRISE-READY AND ALWAYS SECURE</span>
              <h2>
                Enterprise-grade <em>security</em><br />
                for your peace of mind
              </h2>
              <p>Your data is encrypted with the highest standards, ensuring privacy and protection. Trusted by thousands of teams worldwide, we prioritize the safety of your strategic information.</p>
              <Link href="/sign-up" className="btn-primary">Get started</Link>
            </div>

            <div className="security-visual">
              <div className="shield-icon">
                <svg viewBox="0 0 80 96" fill="none">
                  <path d="M40 4L76 20V52C76 72 60 88 40 92C20 88 4 72 4 52V20L40 4Z" fill="url(#shield-grad)" opacity="0.1"/>
                  <path d="M40 4L76 20V52C76 72 60 88 40 92C20 88 4 72 4 52V20L40 4Z" stroke="url(#shield-grad)" strokeWidth="2" fill="none"/>
                  <path d="M28 48L36 56L52 40" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="shield-grad" x1="4" y1="4" x2="76" y2="92">
                      <stop stopColor="#1a1f3a"/>
                      <stop offset="1" stopColor="#fbbf24"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-container">
          <div className="testimonials-layout">
            <div className="testimonials-header">
              <span className="section-tag">TESTIMONIAL</span>
              <h2>
                Strategy talk, from<br />
                <em>real</em> leaders
              </h2>
              <p>From everyday wins to big milestones—here&apos;s how we&apos;ve helped others take control of their strategy.</p>
              <div className="testimonial-nav">
                <button className="nav-dot active"></button>
                <button className="nav-dot"></button>
              </div>
            </div>

            <div className="testimonial-card">
              <blockquote>
                &ldquo;I used to ignore anything strategy-related, but now I actually enjoy checking my progress. It&apos;s weirdly <em>satisfying</em>.&rdquo;
              </blockquote>
              <div className="testimonial-author">
                <div className="author-photo">
                  <span>JB</span>
                </div>
                <div className="author-info">
                  <span className="author-name">Jason Byrd</span>
                  <span className="author-role">VP of Product</span>
                </div>
                <div className="author-company">
                  <span className="company-icon">✦</span>
                  <span>Grapho</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="section-container">
          <h2>
            Start your strategic journey <em>today</em>
          </h2>
          <p>Join thousands of teams already transforming their strategy. Get started with a free account now—no credit card required.</p>
          <Link href="/sign-up" className="btn-cta">Create my free account</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <Link href="/" className="nav-logo">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2L30 9V23L16 30L2 23V9L16 2Z" fill="url(#logo-gradient-footer)"/>
                  <path d="M16 2V30M2 9L30 23M30 9L2 23" stroke="white" strokeWidth="1.5" opacity="0.4"/>
                  <defs>
                    <linearGradient id="logo-gradient-footer" x1="2" y1="2" x2="30" y2="30">
                      <stop stopColor="#1a1f3a"/>
                      <stop offset="1" stopColor="#fbbf24"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span>Frontera</span>
              </Link>
              <p>Empowering you to take control of your strategy—whether it&apos;s planning, executing, or transforming. We provide the tools you need to make smarter, more confident strategic decisions.</p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Careers</a>
                <a href="#">Contact Us</a>
                <a href="#">Resources</a>
              </div>
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">How It Works</a>
                <a href="#">Security</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Frontera. All Rights Reserved.</p>
            <div className="social-links">
              <a href="#" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M18 5C17.4 5.3 16.8 5.5 16.1 5.6C16.8 5.2 17.3 4.5 17.6 3.7C16.9 4.1 16.2 4.4 15.4 4.5C14.7 3.8 13.8 3.3 12.8 3.3C10.8 3.3 9.2 4.9 9.2 6.9C9.2 7.2 9.2 7.4 9.3 7.7C6.5 7.5 4 6.1 2.4 4C2.1 4.6 1.9 5.2 1.9 5.9C1.9 7.2 2.6 8.4 3.6 9.1C3 9.1 2.4 8.9 1.9 8.6V8.7C1.9 10.4 3.1 11.9 4.7 12.2C4.4 12.3 4 12.4 3.6 12.4C3.3 12.4 3.1 12.4 2.8 12.3C3.3 13.7 4.6 14.7 6.2 14.8C5 15.7 3.5 16.3 1.8 16.3C1.5 16.3 1.3 16.3 1 16.2C2.5 17.2 4.4 17.8 6.4 17.8C12.8 17.8 16.3 12.4 16.3 7.7V7.3C17 6.8 17.6 6.2 18 5.5V5Z"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4.5 3C3.7 3 3 3.7 3 4.5C3 5.3 3.7 6 4.5 6C5.3 6 6 5.3 6 4.5C6 3.7 5.3 3 4.5 3ZM3 8H6V17H3V8ZM8 8H11V9.5C11.5 8.5 12.8 7.8 14.2 7.8C16.8 7.8 17 9.6 17 11.5V17H14V12.2C14 11 14 9.5 12.5 9.5C11 9.5 11 11 11 12V17H8V8Z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2C12.2 2 12.5 2 13.4 2C14.3 2 14.8 2.2 15.2 2.3C15.6 2.5 16 2.7 16.3 3C16.6 3.3 16.8 3.6 17 4C17.1 4.4 17.3 4.9 17.3 5.8C17.3 6.7 17.3 7 17.3 9.2C17.3 11.4 17.3 11.7 17.3 12.6C17.3 13.5 17.1 14 17 14.4C16.8 14.8 16.6 15.2 16.3 15.5C16 15.8 15.6 16 15.2 16.2C14.8 16.3 14.3 16.5 13.4 16.5C12.5 16.5 12.2 16.5 10 16.5C7.8 16.5 7.5 16.5 6.6 16.5C5.7 16.5 5.2 16.3 4.8 16.2C4.4 16 4 15.8 3.7 15.5C3.4 15.2 3.2 14.8 3 14.4C2.9 14 2.7 13.5 2.7 12.6C2.7 11.7 2.7 11.4 2.7 9.2C2.7 7 2.7 6.7 2.7 5.8C2.7 4.9 2.9 4.4 3 4C3.2 3.6 3.4 3.2 3.7 2.9C4 2.6 4.4 2.4 4.8 2.2C5.2 2.1 5.7 1.9 6.6 1.9C7.5 2 7.8 2 10 2ZM10 4C7.8 4 7.5 4 6.7 4C5.9 4 5.5 4.2 5.2 4.3C4.9 4.4 4.7 4.6 4.5 4.8C4.3 5 4.1 5.2 4 5.5C3.9 5.8 3.7 6.2 3.7 7C3.7 7.8 3.7 8.1 3.7 10.3C3.7 12.5 3.7 12.8 3.7 13.6C3.7 14.4 3.9 14.8 4 15.1C4.1 15.4 4.3 15.6 4.5 15.8C4.7 16 4.9 16.2 5.2 16.3C5.5 16.4 5.9 16.6 6.7 16.6C7.5 16.6 7.8 16.6 10 16.6C12.2 16.6 12.5 16.6 13.3 16.6C14.1 16.6 14.5 16.4 14.8 16.3C15.1 16.2 15.3 16 15.5 15.8C15.7 15.6 15.9 15.4 16 15.1C16.1 14.8 16.3 14.4 16.3 13.6C16.3 12.8 16.3 12.5 16.3 10.3C16.3 8.1 16.3 7.8 16.3 7C16.3 6.2 16.1 5.8 16 5.5C15.9 5.2 15.7 5 15.5 4.8C15.3 4.6 15.1 4.4 14.8 4.3C14.5 4.2 14.1 4 13.3 4C12.5 4 12.2 4 10 4ZM10 6C12.4 6 14.3 7.9 14.3 10.3C14.3 12.7 12.4 14.6 10 14.6C7.6 14.6 5.7 12.7 5.7 10.3C5.7 7.9 7.6 6 10 6ZM10 7.9C8.7 7.9 7.6 9 7.6 10.3C7.6 11.6 8.7 12.7 10 12.7C11.3 12.7 12.4 11.6 12.4 10.3C12.4 9 11.3 7.9 10 7.9ZM14.5 5C14.5 5.5 14.9 6 15.5 6C16 6 16.5 5.6 16.5 5C16.5 4.5 16.1 4 15.5 4C14.9 4 14.5 4.5 14.5 5Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Chevron Down Icon
function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Feature Card Component
function FeatureCard({
  mockup,
  title,
  description
}: {
  mockup: React.ReactNode;
  title: string;
  description: string;
}) {
  const { ref, isInView } = useInView();

  return (
    <div ref={ref} className={`feature-card ${isInView ? 'in-view' : ''}`}>
      <div className="feature-mockup">
        {mockup}
      </div>
      <div className="feature-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
