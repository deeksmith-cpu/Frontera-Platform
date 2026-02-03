import React, { Component } from 'react';
import { ArrowRight, Search, Mail, Bell } from 'lucide-react';
export function ComponentSection() {
  return (
    <section
      id="components"
      className="scroll-mt-16 space-y-8 border-t border-slate-200 pt-16">

      <div>
        <h2 className="text-3xl font-bold text-slate-900">Components</h2>
        <p className="mt-2 text-lg text-slate-600">
          Core UI elements that ensure consistency across the Frontera platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Buttons */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Buttons
          </h3>
          <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200 bg-white p-8">
            <button className="inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2">
              Primary Action
            </button>
            <button className="inline-flex items-center justify-center rounded-lg bg-[#1a1f3a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2d3561] focus:outline-none focus:ring-2 focus:ring-[#1a1f3a] focus:ring-offset-2">
              Secondary Action
            </button>
            <button className="inline-flex items-center justify-center rounded-lg border border-cyan-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2">
              Tertiary
            </button>
            <button className="inline-flex items-center justify-center rounded-lg text-sm font-semibold text-[#fbbf24] hover:text-[#f59e0b]">
              Text Link <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Form Elements */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Form Elements
          </h3>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-8">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700">

                Email Address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:border-[#fbbf24] focus:outline-none focus:ring-1 focus:ring-[#fbbf24] sm:text-sm"
                  placeholder="you@company.com" />

              </div>
            </div>
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-slate-700">

                Search
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-cyan-500" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full rounded-lg border border-cyan-200 bg-cyan-50/50 py-2.5 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:border-[#22d3ee] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#22d3ee] sm:text-sm"
                  placeholder="Search resources..." />

              </div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-6 lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Cards & Containers
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="group relative overflow-hidden rounded-2xl border border-cyan-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                <Bell className="h-6 w-6" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-slate-900">
                Standard Card
              </h4>
              <p className="text-slate-600">
                Used for features, resources, and general content. Features a
                subtle hover state and clean typography.
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-[#fbbf24]">
                Learn more{' '}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[#1a1f3a] p-6 text-white shadow-lg">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#fbbf24]/20 blur-2xl"></div>
              <div className="relative">
                <h4 className="mb-2 text-lg font-bold">Premium Card</h4>
                <p className="text-slate-300">
                  Used for highlighted content, calls to action, or premium
                  features. Uses the primary navy background with gold accents.
                </p>
                <button className="mt-4 rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-[#f59e0b]">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}