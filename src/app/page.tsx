"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

// Animated counter hook
function useCounter(end: number, duration: number = 2000, isInView: boolean) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  return count;
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = useCallback((index: number) => {
    setActiveFaq(prev => prev === index ? null : index);
  }, []);

  return (
    <div className="frontera-v2">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <img src="/frontera-logo-white.jpg" alt="Frontera" height="20" style={{ width: 'auto' }} />
          </Link>

          <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="nav-actions">
            <Link href="/sign-in" className="nav-login">Sign In</Link>
            <Link href="/onboarding" className="nav-cta">Book a Demo</Link>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={mobileMenuOpen ? "open" : ""}></span>
            <span className={mobileMenuOpen ? "open" : ""}></span>
            <span className={mobileMenuOpen ? "open" : ""}></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Trusted By */}
      <TrustedBySection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Features */}
      <FeaturesSection />

      {/* Stats */}
      <StatsSection />

      {/* Testimonial */}
      <TestimonialSection />

      {/* FAQ */}
      <FAQSection activeFaq={activeFaq} toggleFaq={toggleFaq} />

      {/* Final CTA */}
      <FinalCTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

function HeroSection() {
  const { ref, isInView } = useInView(0.2);

  return (
    <section className="hero" ref={ref}>
      <div className="hero-bg-shapes">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="hero-grid"></div>
      </div>

      <div className="hero-container">
        <div className={`hero-content ${isInView ? "animate-in" : ""}`}>
          <div className="hero-eyebrow">
            <span className="eyebrow-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L10 6L15 6L11 9.5L12.5 15L8 11.5L3.5 15L5 9.5L1 6L6 6L8 1Z" fill="currentColor" />
              </svg>
            </span>
            AI-Powered Strategic Coaching Platform
          </div>

          <h1 className="hero-title">
            Transform Strategy<br />
            <span className="gradient-text">into Outcomes</span>
          </h1>

          <p className="hero-subtitle">
            Stop the transformation theatre. Frontera embeds AI coaching into your
            product strategy workflow—helping enterprise teams move from vision to
            execution with clarity and confidence.
          </p>

          <div className="hero-ctas">
            <Link href="/onboarding" className="btn-primary">
              Book a Demo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a href="#features" className="btn-secondary">
              Explore Platform
            </a>
          </div>

          <div className="hero-metrics">
            <div className="metric-item">
              <span className="metric-value">£4.2M+</span>
              <span className="metric-label">Saved from failed transformations</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-value">94%</span>
              <span className="metric-label">Strategic clarity score</span>
            </div>
          </div>
        </div>

        <div className={`hero-visual ${isInView ? "animate-in" : ""}`}>
          <div className="phone-mockup-wrapper">
            <div className="phone-glow"></div>
            <div className="phone-mockup">
              <div className="phone-frame">
                <div className="phone-notch"></div>
                <div className="phone-screen">
                  <div className="app-status-bar">
                    <span>9:41</span>
                    <div className="status-icons">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 10h2v4H1zM5 7h2v7H5zM9 4h2v10H9zM13 1h2v13h-2z" /></svg>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 6h12v6H2z" /><path d="M14 7h1v4h-1z" /></svg>
                    </div>
                  </div>

                  <div className="app-content">
                    <div className="app-header">
                      <div className="user-avatar">SC</div>
                      <div className="user-info">
                        <span className="user-name">Sarah Chen</span>
                        <span className="user-role">Chief Product Officer</span>
                      </div>
                    </div>

                    <div className="coach-card">
                      <div className="coach-header">
                        <div className="coach-icon">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
                            <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                        <span>Strategy Coach</span>
                        <span className="coach-badge">Active</span>
                      </div>
                      <div className="coach-message">
                        Based on your market research, I&apos;ve identified 3 strategic opportunities in the enterprise segment...
                      </div>
                    </div>

                    <div className="clarity-score">
                      <div className="score-header">
                        <span>Strategic Clarity</span>
                        <span className="score-trend">+12%</span>
                      </div>
                      <div className="score-value">94.2%</div>
                      <div className="score-bar">
                        <div className="score-fill" style={{ width: "94.2%" }}></div>
                      </div>
                    </div>

                    <div className="pillars-preview">
                      <div className="pillar-chip active">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="4" /></svg>
                        Market
                      </div>
                      <div className="pillar-chip">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="4" /></svg>
                        Customer
                      </div>
                      <div className="pillar-chip">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="4" /></svg>
                        Colleague
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="floating-card floating-insight">
              <div className="floating-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="floating-content">
                <span className="floating-label">New Insight</span>
                <span className="floating-text">Market opportunity identified</span>
              </div>
            </div>

            <div className="floating-card floating-bet">
              <div className="floating-header">
                <span className="bet-label">Strategic Bet #1</span>
                <span className="bet-confidence">High</span>
              </div>
              <div className="bet-hypothesis">We believe enterprise segment...</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustedBySection() {
  const { ref, isInView } = useInView(0.3);

  const companies = [
    "Aberdeen",
    "Kinetic Systems",
    "Nexus Group",
    "EdgeCorp",
    "Meridian Tech",
  ];

  return (
    <section className="trusted-by" ref={ref}>
      <div className="trusted-container">
        <p className={`trusted-label ${isInView ? "animate-in" : ""}`}>
          Trusted by product teams at leading enterprises
        </p>
        <div className={`trusted-logos ${isInView ? "animate-in" : ""}`}>
          {companies.map((company, i) => (
            <div
              key={company}
              className="logo-item"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="logo-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L18 6V14L10 18L2 14V6L10 2Z" fill="currentColor" opacity="0.2" />
                  <path d="M10 2L18 6V14L10 18L2 14V6L10 2Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <span>{company}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const { ref, isInView } = useInView(0.2);

  const steps = [
    {
      number: "01",
      title: "Research Your Market",
      description: "Synthesize insights across three pillars—Macro Market forces, Customer needs, and Colleague intelligence—to build a complete strategic picture.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2.5" />
          <path d="M22 22L28 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="14" cy="14" r="4" fill="currentColor" opacity="0.2" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Define Strategic Bets",
      description: "Transform insights into hypothesis-driven bets: 'We believe... Which means... So we will explore... Success looks like...'",
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="currentColor" strokeWidth="2.5" />
          <path d="M16 4V28M4 10L28 22M28 10L4 22" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <circle cx="16" cy="16" r="4" fill="currentColor" opacity="0.2" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Track Your Progress",
      description: "Measure outcomes, not outputs. Get real-time clarity scores and AI-powered recommendations to keep your strategy on track.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M4 24L12 16L18 22L28 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="28" cy="8" r="3" fill="currentColor" />
          <path d="M4 28H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        </svg>
      ),
    },
  ];

  return (
    <section className="how-it-works" id="how-it-works" ref={ref}>
      <div className="section-container">
        <div className={`section-header ${isInView ? "animate-in" : ""}`}>
          <span className="section-eyebrow">How It Works</span>
          <h2>
            From research to results<br />
            in <span className="gradient-text">three steps</span>
          </h2>
          <p>
            Simplify your strategic journey with our AI-powered process.
            Research, define, and track—all in one integrated platform.
          </p>
        </div>

        <div className={`steps-grid ${isInView ? "animate-in" : ""}`}>
          {steps.map((step, index) => (
            <div key={step.number} className="step-card" style={{ animationDelay: `${index * 0.15}s` }}>
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <svg width="40" height="8" viewBox="0 0 40 8" fill="none">
                    <path d="M0 4H36M36 4L32 1M36 4L32 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section className="features" id="features" ref={ref}>
      <div className="section-container">
        <div className={`section-header ${isInView ? "animate-in" : ""}`}>
          <span className="section-eyebrow">Features</span>
          <h2>
            Powerful tools for<br />
            <span className="gradient-text">strategic excellence</span>
          </h2>
          <p>
            Everything you need to transform your product strategy—from AI coaching
            to research synthesis to outcome tracking.
          </p>
        </div>

        <div className={`features-grid ${isInView ? "animate-in" : ""}`}>
          {/* Strategy Coach Feature */}
          <div className="feature-card feature-large">
            <div className="feature-content">
              <div className="feature-badge">AI-Powered</div>
              <h3>Strategy Coach</h3>
              <p>
                Your AI strategic partner that works in the flow of your product
                development. Get personalized coaching, not generic frameworks—tailored
                to your context, customers, and outcomes.
              </p>
              <ul className="feature-list">
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L7 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Context-aware recommendations
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L7 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Real-time strategic guidance
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L7 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Evidence-based insights
                </li>
              </ul>
            </div>
            <div className="feature-visual coach-visual">
              <div className="coach-interface">
                <div className="coach-conversation">
                  <div className="message user-message">
                    How should we approach the enterprise segment?
                  </div>
                  <div className="message coach-message">
                    <div className="coach-avatar">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
                        <path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="message-content">
                      Based on your research pillars, I recommend focusing on three key areas...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Research Pillars Feature */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="7" cy="14" r="5" stroke="currentColor" strokeWidth="2" />
                <circle cx="21" cy="7" r="5" stroke="currentColor" strokeWidth="2" />
                <circle cx="21" cy="21" r="5" stroke="currentColor" strokeWidth="2" />
                <path d="M12 14H16M16 14L18 10M16 14L18 18" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              </svg>
            </div>
            <h3>Research Pillars</h3>
            <p>
              Synthesize market forces, customer insights, and colleague intelligence
              into a unified strategic view.
            </p>
            <div className="feature-pills">
              <span className="pill">Macro Market</span>
              <span className="pill">Customer</span>
              <span className="pill">Colleague</span>
            </div>
          </div>

          {/* Strategic Flow Canvas Feature */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="3" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                <rect x="15" y="3" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="15" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                <rect x="15" y="15" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M13 8H15M13 20H15M8 13V15M20 13V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Strategic Flow Canvas</h3>
            <p>
              Transform research insights into actionable strategic context with
              our structured canvas framework.
            </p>
            <div className="feature-preview canvas-preview">
              <div className="canvas-section">Market Reality</div>
              <div className="canvas-section">Customer Insights</div>
              <div className="canvas-section">Org Context</div>
              <div className="canvas-section highlight">Strategic Bets</div>
            </div>
          </div>

          {/* Strategic Bets Feature */}
          <div className="feature-card feature-wide">
            <div className="feature-content">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 4L24 9V19L14 24L4 19V9L14 4Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M14 4V24" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                  <circle cx="14" cy="14" r="3" fill="currentColor" />
                </svg>
              </div>
              <h3>Strategic Bets</h3>
              <p>
                Frame your initiatives as hypothesis-driven bets with clear success criteria.
                Move from vague plans to measurable experiments.
              </p>
            </div>
            <div className="bet-format">
              <div className="bet-row">
                <span className="bet-prefix">We believe</span>
                <span className="bet-value">[trend/customer need]</span>
              </div>
              <div className="bet-row">
                <span className="bet-prefix">Which means</span>
                <span className="bet-value">[opportunity/problem space]</span>
              </div>
              <div className="bet-row">
                <span className="bet-prefix">So we will explore</span>
                <span className="bet-value">[hypothesis/initiative]</span>
              </div>
              <div className="bet-row highlight">
                <span className="bet-prefix">Success looks like</span>
                <span className="bet-value">[leading indicator metric]</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const { ref, isInView } = useInView(0.3);
  const savedValue = useCounter(42, 2000, isInView);
  const clarityScore = useCounter(94, 1800, isInView);
  const speedMultiplier = useCounter(3, 1500, isInView);

  return (
    <section className="stats" ref={ref}>
      <div className="stats-bg"></div>
      <div className="section-container">
        <div className={`stats-grid ${isInView ? "animate-in" : ""}`}>
          <div className="stat-item">
            <span className="stat-value">£{savedValue / 10}M</span>
            <span className="stat-label">Saved from failed transformations</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">{clarityScore}%</span>
            <span className="stat-label">Average strategic clarity score</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">{speedMultiplier}x</span>
            <span className="stat-label">Faster strategy execution</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  const { ref, isInView } = useInView(0.2);

  return (
    <section className="testimonial" ref={ref}>
      <div className="section-container">
        <div className={`testimonial-card ${isInView ? "animate-in" : ""}`}>
          <div className="testimonial-quote-mark">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M14 24C14 18.48 18.48 14 24 14V10C16.27 10 10 16.27 10 24V38H24V24H14ZM34 24C34 18.48 38.48 14 44 14V10C36.27 10 30 16.27 30 24V38H44V24H34Z" fill="currentColor" />
            </svg>
          </div>
          <blockquote>
            Frontera helped us do what the big consultancies never could—translate
            strategy into action, and outcomes into culture. We now coach capability,
            not compliance.
          </blockquote>
          <div className="testimonial-author">
            <div className="author-avatar">
              <span>SC</span>
            </div>
            <div className="author-info">
              <span className="author-name">Sarah Chen</span>
              <span className="author-role">Chief Product & Technology Officer</span>
            </div>
            <div className="author-company">
              <div className="company-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L21 8V16L12 21L3 16V8L12 3Z" fill="currentColor" opacity="0.2" />
                  <path d="M12 3L21 8V16L12 21L3 16V8L12 3Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <span>Aberdeen</span>
            </div>
          </div>
          <div className="testimonial-results">
            <div className="result-item">
              <span className="result-value">6 months</span>
              <span className="result-label">to full deployment</span>
            </div>
            <div className="result-item">
              <span className="result-value">12 teams</span>
              <span className="result-label">aligned to strategy</span>
            </div>
            <div className="result-item">
              <span className="result-value">100%</span>
              <span className="result-label">outcome adoption</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection({ activeFaq, toggleFaq }: { activeFaq: number | null; toggleFaq: (index: number) => void }) {
  const { ref, isInView } = useInView(0.2);

  const faqs = [
    {
      question: "How is Frontera different from traditional consulting?",
      answer: "Unlike static decks or 'one-and-done' workshops, Frontera is embedded, modular, intelligent, and coach-led. It supports real-time strategy execution, competency uplift, and product thinking that sticks—measured by outcomes, not activity. We work in the flow of your product development, not separate from it.",
    },
    {
      question: "Who is Frontera designed for?",
      answer: "Frontera is designed for large enterprises ready to modernise how they build products—from digital-native scale-ups to legacy corporates struggling to adopt a product mindset. It supports leaders, teams, and domain specialists including CPOs, VPs of Product, and product managers.",
    },
    {
      question: "How does the AI coaching work?",
      answer: "Our Strategy Coach AI is trained on the Product Strategy Research Playbook methodology. It provides context-aware guidance through your strategic process—helping you research market forces, synthesize insights, frame strategic bets, and track outcomes. Think of it as having a strategic advisor available 24/7.",
    },
    {
      question: "Does Frontera replace our existing tool stack?",
      answer: "No. At Frontera we design our products and partnerships to enhance your product tool chain. We are strategic partners with Atlassian, ServiceNow, Linear, and others. Frontera helps you transform the effectiveness of your product development tool chain, not replace it.",
    },
    {
      question: "What does implementation look like?",
      answer: "Implementation starts with a 30-day pilot focused on your most critical strategic challenge. We embed the platform, train your teams on the methodology, and measure clarity improvement. Most enterprises see measurable results within the first quarter.",
    },
  ];

  return (
    <section className="faq" id="faq" ref={ref}>
      <div className="section-container">
        <div className={`section-header ${isInView ? "animate-in" : ""}`}>
          <span className="section-eyebrow">FAQ</span>
          <h2>
            Questions? <span className="gradient-text">Answered.</span>
          </h2>
        </div>

        <div className={`faq-list ${isInView ? "animate-in" : ""}`}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeFaq === index ? "active" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                className="faq-question"
                onClick={() => toggleFaq(index)}
                aria-expanded={activeFaq === index}
              >
                <span>{faq.question}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="faq-icon">
                  <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  const { ref, isInView } = useInView(0.3);

  return (
    <section className="final-cta" id="demo" ref={ref}>
      <div className="cta-bg">
        <div className="cta-shape cta-shape-1"></div>
        <div className="cta-shape cta-shape-2"></div>
      </div>
      <div className="section-container">
        <div className={`cta-content ${isInView ? "animate-in" : ""}`}>
          <h2>
            Replace Transformation Theatre<br />
            <span>with Real Results</span>
          </h2>
          <p>
            Join leading enterprises who have moved beyond consultancy decks to
            embedded strategic coaching. Book a demo to see how Frontera can
            transform your product strategy.
          </p>
          <div className="cta-actions">
            <Link href="/onboarding" className="btn-cta-primary">
              Book a Demo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a href="#features" className="btn-cta-secondary">
              Explore Features
            </a>
          </div>
          <p className="cta-note">No credit card required. 30-day pilot available.</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <img src="/frontera-logo-white.jpg" alt="Frontera" height="24" style={{ width: 'auto' }} />
            </Link>
            <p>
              The future of product strategy transformation. AI-powered coaching
              that embeds into your workflow and delivers measurable outcomes.
            </p>
            <div className="social-links">
              <a href="#" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4.5 3C3.7 3 3 3.7 3 4.5S3.7 6 4.5 6 6 5.3 6 4.5 5.3 3 4.5 3zM3 8h3v9H3V8zm5 0h3v1.2c.4-.7 1.4-1.4 2.8-1.4 3 0 3.2 2 3.2 4v5.2h-3V12c0-1-.4-2-1.5-2s-1.5 1-1.5 2v5h-3V8z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M18.3 5.4c-.6.3-1.3.4-2 .5.7-.4 1.3-1.1 1.5-1.9-.7.4-1.4.7-2.2.8-.6-.7-1.5-1.1-2.5-1.1-1.9 0-3.4 1.5-3.4 3.4 0 .3 0 .5.1.8-2.8-.1-5.3-1.5-7-3.5-.3.5-.5 1.1-.5 1.7 0 1.2.6 2.2 1.5 2.8-.6 0-1.1-.2-1.6-.4v.1c0 1.6 1.2 3 2.7 3.3-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H2c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4c.6-.5 1.2-1 1.6-1.7l.4.5z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Platform</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Security</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
              <a href="#">Blog</a>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">Case Studies</a>
              <a href="#">Methodology</a>
              <a href="#">Support</a>
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
          <p>© 2026 Frontera. All rights reserved.</p>
          <p className="footer-tagline">From Strategy to Outcomes.</p>
        </div>
      </div>
    </footer>
  );
}
