import React from 'react';
import { Check, X } from 'lucide-react';
export function UsageSection() {
  return (
    <section
      id="guidelines"
      className="scroll-mt-16 space-y-8 border-t border-slate-200 pt-16 pb-24">

      <div>
        <h2 className="text-3xl font-bold text-slate-900">Usage Guidelines</h2>
        <p className="mt-2 text-lg text-slate-600">
          Best practices for maintaining brand consistency across all
          touchpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Do's */}
        <div className="rounded-xl border border-green-200 bg-green-50/50 p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Check className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-green-900">Do</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-green-900">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <span>
                Use the primary navy for main headings and key structural
                elements.
              </span>
            </li>
            <li className="flex items-start gap-3 text-green-900">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <span>
                Use the orange accent sparingly for calls to action and
                highlights.
              </span>
            </li>
            <li className="flex items-start gap-3 text-green-900">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <span>
                Maintain generous whitespace to create a professional,
                uncluttered feel.
              </span>
            </li>
            <li className="flex items-start gap-3 text-green-900">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <span>
                Use high-quality photography that reflects a modern corporate
                environment.
              </span>
            </li>
          </ul>
        </div>

        {/* Don'ts */}
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
              <X className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-red-900">Don't</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-red-900">
              <X className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <span>
                Don't use the orange color for background areas or large blocks
                of text.
              </span>
            </li>
            <li className="flex items-start gap-3 text-red-900">
              <X className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <span>
                Don't alter the logo proportions, colors, or orientation.
              </span>
            </li>
            <li className="flex items-start gap-3 text-red-900">
              <X className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <span>
                Don't use gradients that aren't part of the official brand
                assets.
              </span>
            </li>
            <li className="flex items-start gap-3 text-red-900">
              <X className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <span>
                Don't clutter layouts with excessive borders or decorative
                elements.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>);

}