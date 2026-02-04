import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "./providers";
import { PostHogPageView } from "./PostHogPageView";

// Frontera-branded Clerk theme to ensure consistent styling
const clerkAppearance = {
  variables: {
    colorPrimary: '#1a1f3a',           // Frontera Navy
    colorDanger: '#ef4444',            // Red-500
    colorSuccess: '#10b981',           // Emerald-500
    colorWarning: '#d97706',           // Amber-600
    colorNeutral: '#475569',           // Slate-600
    colorText: '#0f172a',              // Slate-900
    colorTextOnPrimaryBackground: '#ffffff',
    colorTextSecondary: '#64748b',     // Slate-500
    colorBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorInputText: '#0f172a',
    borderRadius: '0.75rem',           // rounded-xl
    fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
    fontSize: '0.875rem',
  },
  elements: {
    card: 'shadow-lg border border-slate-200 rounded-2xl',
    headerTitle: 'text-slate-900 font-bold',
    headerSubtitle: 'text-slate-600',
    socialButtonsBlockButton: 'border-slate-200 hover:bg-slate-50',
    formButtonPrimary: 'bg-[#1a1f3a] hover:bg-[#2d3561] text-white font-semibold',
    footerActionLink: 'text-[#1a1f3a] hover:text-[#2d3561]',
    identityPreviewEditButton: 'text-[#1a1f3a]',
    formFieldInput: 'border-slate-200 focus:border-[#fbbf24] focus:ring-[#fbbf24]/20',
    avatarBox: 'rounded-xl',
  },
};

// Only load Inter - the primary brand font
// Other fonts use system fallbacks to reduce network requests and improve first load
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1a1f3a',
};

export const metadata: Metadata = {
  title: "Frontera | AI-Powered Product Strategy Coaching for Enterprise Transformations",
  description: "Transform your enterprise with AI-powered product strategy coaching. Frontera helps C-suite leaders navigate product model transformations with confidence.",
  keywords: ["product strategy", "enterprise transformation", "AI coaching", "product operating model", "digital transformation"],
  authors: [{ name: "Frontera" }],
  openGraph: {
    title: "Frontera | AI-Powered Product Strategy Coaching",
    description: "Transform your enterprise with AI-powered product strategy coaching.",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontera | AI-Powered Product Strategy Coaching",
    description: "Transform your enterprise with AI-powered product strategy coaching.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className="scroll-smooth">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <link rel="apple-touch-icon" href="/frontera-logo-F.jpg" />
        </head>
        <body className={`${inter.variable} font-sans antialiased`}>
          <PostHogProvider>
            <PostHogPageView />
            {children}
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
