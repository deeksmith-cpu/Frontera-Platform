import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
type ColorSwatchProps = {
  name: string;
  hex: string;
  description?: string;
  textColor?: string;
};
const ColorSwatch = ({
  name,
  hex,
  description,
  textColor = 'text-white'
}: ColorSwatchProps) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="group flex flex-col">
      <button
        onClick={handleCopy}
        className={`relative h-32 w-full rounded-lg shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${textColor}`}
        style={{
          backgroundColor: hex
        }}
        aria-label={`Copy ${name} hex code ${hex}`}>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          {copied ?
          <div className="flex items-center rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
              <Check className="mr-1.5 h-4 w-4" />
              <span className="text-sm font-medium">Copied</span>
            </div> :

          <div className="flex items-center rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
              <Copy className="mr-1.5 h-4 w-4" />
              <span className="text-sm font-medium">Copy Hex</span>
            </div>
          }
        </div>
        <div className="absolute bottom-3 left-3 text-left">
          <p className="text-sm font-bold">{name}</p>
          <p className="text-xs opacity-80">{hex}</p>
        </div>
      </button>
      {description &&
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      }
    </div>);

};
export function ColorSection() {
  return (
    <section id="colors" className="scroll-mt-16 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Color Palette</h2>
        <p className="mt-2 text-lg text-slate-600">
          Our color palette reflects our values of trust, transformation, and
          expertise. The deep navy provides a stable foundation, while the
          refined gold represents premium quality and forward momentum.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-xl font-semibold text-slate-900">
            Primary Colors
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ColorSwatch
              name="Frontera Navy"
              hex="#1a1f3a"
              description="Primary brand color. Used for backgrounds, primary text, and key UI elements." />

            <ColorSwatch
              name="Premium Gold"
              hex="#fbbf24"
              textColor="text-slate-900"
              description="Accent color. Used for CTAs, highlights, and premium features." />

            <ColorSwatch
              name="Deep Blue"
              hex="#2d3561"
              description="Secondary brand color. Used for gradients and secondary interactions." />

          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-slate-900">
            Neutrals & Cyan Scale
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ColorSwatch
              name="Charcoal"
              hex="#2a2d3a"
              description="Dark text and active states." />

            <ColorSwatch
              name="Slate"
              hex="#64748b"
              description="Secondary text and borders." />

            <ColorSwatch
              name="Cyan 600"
              hex="#0891b2"
              description="Accent neutral for data visualization." />

            <ColorSwatch
              name="Cyan 400"
              hex="#22d3ee"
              textColor="text-slate-900"
              description="Bright cyan for highlights and interactive elements." />

            <ColorSwatch
              name="Cyan 200"
              hex="#a5f3fc"
              textColor="text-slate-900"
              description="Light cyan for backgrounds and subtle accents." />

            <ColorSwatch
              name="Cyan 50"
              hex="#ecfeff"
              textColor="text-slate-900"
              description="Subtle cyan tint for panels and cards." />

            <ColorSwatch
              name="Light Gray"
              hex="#f1f5f9"
              textColor="text-slate-900"
              description="Backgrounds and panels." />

            <ColorSwatch
              name="White"
              hex="#ffffff"
              textColor="text-slate-900"
              description="Card backgrounds and negative space." />

          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-slate-900">
            Semantic Colors
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ColorSwatch
              name="Success"
              hex="#10b981"
              description="Confirmation and success states." />

            <ColorSwatch
              name="Warning"
              hex="#f59e0b"
              description="Alerts and pending states." />

            <ColorSwatch
              name="Error"
              hex="#ef4444"
              description="Critical errors and destructive actions." />

            <ColorSwatch
              name="Info"
              hex="#3b82f6"
              description="Information and guidance." />

          </div>
        </div>
      </div>
    </section>);

}