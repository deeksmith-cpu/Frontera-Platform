import React from 'react';
export function TypographySection() {
  return (
    <section
      id="typography"
      className="scroll-mt-16 space-y-8 border-t border-slate-200 pt-16">

      <div>
        <h2 className="text-3xl font-bold text-slate-900">Typography</h2>
        <p className="mt-2 text-lg text-slate-600">
          We use Inter for headings to convey modernity and professionalism,
          paired with system fonts for body text to ensure optimal readability
          and performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Typeface
            </h3>
            <div className="rounded-xl border border-slate-200 bg-white p-8">
              <div className="mb-8">
                <span className="mb-2 block text-xs font-semibold text-slate-400">
                  HEADINGS
                </span>
                <p className="text-4xl font-bold text-slate-900">Inter</p>
                <p className="mt-2 text-slate-500">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  0123456789
                </p>
              </div>
              <div>
                <span className="mb-2 block text-xs font-semibold text-slate-400">
                  BODY
                </span>
                <p className="text-4xl font-normal text-slate-900">System UI</p>
                <p className="mt-2 text-slate-500">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  0123456789
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Scale & Hierarchy
            </h3>
            <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-8">
              <div className="flex items-baseline gap-4 border-b border-slate-100 pb-4">
                <span className="w-24 text-xs text-slate-400">
                  Display (64px)
                </span>
                <h1 className="text-6xl font-bold text-slate-900">Transform</h1>
              </div>
              <div className="flex items-baseline gap-4 border-b border-slate-100 pb-4">
                <span className="w-24 text-xs text-slate-400">H1 (48px)</span>
                <h1 className="text-5xl font-bold text-slate-900">
                  Digital Product
                </h1>
              </div>
              <div className="flex items-baseline gap-4 border-b border-slate-100 pb-4">
                <span className="w-24 text-xs text-slate-400">H2 (32px)</span>
                <h2 className="text-3xl font-bold text-slate-900">
                  Operating Model
                </h2>
              </div>
              <div className="flex items-baseline gap-4 border-b border-slate-100 pb-4">
                <span className="w-24 text-xs text-slate-400">H3 (24px)</span>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Enterprise Coaching
                </h3>
              </div>
              <div className="flex items-baseline gap-4 border-b border-slate-100 pb-4">
                <span className="w-24 text-xs text-slate-400">Body (16px)</span>
                <p className="text-base text-slate-600">
                  Frontera helps organizations adopt and embed digital product
                  operating models through expert coaching and transformation
                  strategies.
                </p>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="w-24 text-xs text-slate-400">
                  Small (14px)
                </span>
                <p className="text-sm text-slate-500">
                  Copyright © 2024 Frontera. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}