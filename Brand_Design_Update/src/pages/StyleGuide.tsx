import React, { useEffect, useState, Component } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { LogoSection } from '../components/LogoSection';
import { ColorSection } from '../components/ColorSection';
import { TypographySection } from '../components/TypographySection';
import { ComponentSection } from '../components/ComponentSection';
import { UsageSection } from '../components/UsageSection';
export function StyleGuide() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const iconUrl = "/image.png";

  // Handle scroll spy for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
      'overview',
      'logo',
      'colors',
      'typography',
      'components',
      'guidelines'];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
      setActiveSection(id);
      setIsMobileMenuOpen(false);
    }
  };
  const NavItem = ({ id, label }: {id: string;label: string;}) =>
  <button
    onClick={() => scrollToSection(id)}
    className={`group flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${activeSection === id ? 'bg-[#1a1f3a] text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>

      {label}
      {activeSection === id &&
    <ChevronRight className="h-4 w-4 text-[#fbbf24]" />
    }
    </button>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <img
            src={iconUrl}
            alt="Frontera Icon"
            className="h-8 w-8 object-contain" />

          <span className="font-bold text-[#1a1f3a]">Frontera</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100">

          {isMobileMenuOpen ?
          <X className="h-6 w-6" /> :

          <Menu className="h-6 w-6" />
          }
        </button>
      </div>

      <div className="mx-auto max-w-[1600px] flex">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

          <div className="flex h-full flex-col p-6">
            <div className="mb-8 hidden lg:flex items-center gap-3">
              <img
                src={iconUrl}
                alt="Frontera Icon"
                className="h-10 w-10 object-contain" />

              <div>
                <h1 className="text-xl font-bold text-[#1a1f3a]">Frontera</h1>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Design System
                </p>
              </div>
            </div>

            <nav className="flex-1 space-y-1">
              <NavItem id="overview" label="Overview" />
              <NavItem id="logo" label="Logo & Identity" />
              <NavItem id="colors" label="Color Palette" />
              <NavItem id="typography" label="Typography" />
              <NavItem id="components" label="Components" />
              <NavItem id="guidelines" label="Guidelines" />
            </nav>

            <div className="mt-auto border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Design Team
                  </p>
                  <p className="text-xs text-slate-500">v1.0.0</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-12 sm:px-8 lg:px-16 lg:py-16">
          <div className="mx-auto max-w-4xl space-y-24">
            {/* Overview Section */}
            <section id="overview" className="scroll-mt-16">
              <div className="mb-8 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                Brand Guidelines 2024
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Building the future of <br />
                <span className="text-[#1a1f3a]">Enterprise Coaching</span>
              </h1>
              <p className="mt-6 text-xl leading-relaxed text-slate-600">
                Frontera is an enterprise coaching platform that trains
                companies in how to adopt and embed digital product operating
                models. Our design system reflects our core values of expertise,
                transformation, and professional excellence.
              </p>

              <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="border-l-4 border-[#1a1f3a] pl-4">
                  <h3 className="font-bold text-slate-900">Professional</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Clean, authoritative, and trusted by enterprise leaders.
                  </p>
                </div>
                <div className="border-l-4 border-[#fbbf24] pl-4">
                  <h3 className="font-bold text-slate-900">Transformative</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Dynamic, energetic, and focused on forward progress.
                  </p>
                </div>
                <div className="border-l-4 border-[#2d3561] pl-4">
                  <h3 className="font-bold text-slate-900">Structured</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Organized, clear, and easy to navigate.
                  </p>
                </div>
              </div>
            </section>

            <LogoSection />
            <ColorSection />
            <TypographySection />
            <ComponentSection />
            <UsageSection />
          </div>
        </main>
      </div>
    </div>);

}