import React from 'react';
import { Download } from 'lucide-react';
export function LogoSection() {
  const logoUrl = "/frontera-logo-white.jpg";

  const iconUrl = "/image.png";

  return (
    <section
      id="logo"
      className="scroll-mt-16 space-y-8 border-t border-slate-200 pt-16">

      <div>
        <h2 className="text-3xl font-bold text-slate-900">Logo & Identity</h2>
        <p className="mt-2 text-lg text-slate-600">
          The Frontera logo combines a solid foundation with forward momentum.
          The arrow integrated into the 'F' symbolizes progress and
          transformation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Primary Logo Display */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Primary Logo
          </h3>
          <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-[#1a1f3a] p-8">
            <img
              src={logoUrl}
              alt="Frontera Logo"
              className="max-h-24 w-auto object-contain" />

          </div>
          <div className="mt-4 flex gap-4">
            <button className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
              <Download className="h-4 w-4" /> SVG
            </button>
            <button className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
              <Download className="h-4 w-4" /> PNG
            </button>
          </div>
        </div>

        {/* Clearspace & Construction */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Clearspace
          </h3>
          <div className="relative flex aspect-video w-full items-center justify-center rounded-lg bg-slate-100 p-8">
            <div className="relative">
              {/* Clearspace indicators */}
              <div className="absolute -inset-8 border border-dashed border-blue-300 bg-blue-50/50"></div>
              <div className="relative z-10 bg-[#1a1f3a] p-4 rounded-lg">
                <img
                  src={logoUrl}
                  alt="Frontera Logo Construction"
                  className="h-12 w-auto" />

              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Always maintain clear space around the logo equal to the height of
            the 'F' icon to ensure visibility and impact.
          </p>
        </div>
      </div>

      {/* Variations */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Variations
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="relative mb-4 flex h-32 w-full items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,107,53,0.08),transparent_50%)]"></div>
              <img
                src={iconUrl}
                alt="Frontera Icon"
                className="relative z-10 object-contain"
                style={{
                  imageRendering: 'crisp-edges'
                }} />

            </div>
            <span className="text-sm font-medium text-slate-900">
              Icon Only
            </span>
            <p className="mt-1 text-center text-xs text-slate-500">
              Use for app icons, favicons, and social media profiles
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-6">
            <div className="mb-4 flex h-32 w-full items-center justify-center rounded bg-[#1a1f3a]">
              <span className="text-2xl font-bold text-white">Frontera</span>
            </div>
            <span className="text-sm font-medium text-slate-900">
              Wordmark White
            </span>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-6">
            <div className="mb-4 flex h-32 w-full items-center justify-center rounded bg-white border border-slate-100">
              <span className="text-2xl font-bold text-[#1a1f3a]">
                Frontera
              </span>
            </div>
            <span className="text-sm font-medium text-slate-900">
              Wordmark Navy
            </span>
          </div>
        </div>
      </div>
    </section>);

}