# Frontera Bold Design System v1.0

**Created**: January 18, 2026
**Design Philosophy**: Linear's boldness + Stripe's data clarity + Amplitude's analytical depth
**Goal**: Transform Frontera from bland to bold, distinctive, memorable

---

## 1. Color System: Phase-Driven Bold Palette

### **Philosophy**
Each phase has a bold, distinctive color that creates visual rhythm through the journey. Colors are vibrant, high-saturation, and memorable.

### **Phase Colors** (Primary)

| Phase | Color Name | Tailwind | Hex | Usage |
|-------|------------|----------|-----|-------|
| **Discovery** | Vibrant Emerald | `emerald-500` | `#10B981` | Discovery phase indicators, CTAs, badges |
| **Landscape** | Bold Amber | `amber-500` | `#F59E0B` | Research phase indicators, territory cards |
| **Synthesis** | Rich Purple | `purple-600` | `#9333EA` | Synthesis phase, insights, patterns |
| **Strategic Bets** | Strong Cyan | `cyan-500` | `#06B6D4` | Planning phase, strategic outputs |

### **Supporting Colors**

| Purpose | Color | Tailwind | Hex | Usage |
|---------|-------|----------|-----|-------|
| **Primary Action** | Indigo | `indigo-600` | `#4F46E5` | Primary buttons, links |
| **Success** | Green | `green-600` | `#16A34A` | Completion states, positive feedback |
| **Warning** | Orange | `orange-500` | `#F97316` | Alerts, important notices |
| **Error** | Red | `red-600` | `#DC2626` | Errors, destructive actions |
| **Neutral Text** | Slate 900 | `slate-900` | `#0F172A` | Primary text |
| **Secondary Text** | Slate 600 | `slate-600` | `#475569` | Secondary text, metadata |
| **Backgrounds** | Slate 50 | `slate-50` | `#F8FAFC` | Page backgrounds |
| **Borders** | Slate 200 | `slate-200` | `#E2E8F0` | Borders, dividers |

### **Gradients** (Bold + Distinctive)

```css
/* Discovery Gradient */
.gradient-discovery {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
}

/* Landscape Gradient */
.gradient-landscape {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
}

/* Synthesis Gradient */
.gradient-synthesis {
  background: linear-gradient(135deg, #9333EA 0%, #7C3AED 100%);
}

/* Strategic Bets Gradient */
.gradient-bets {
  background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%);
}

/* Primary Action Gradient */
.gradient-primary {
  background: linear-gradient(135deg, #4F46E5 0%, #4338CA 100%);
}
```

### **Color Application Guidelines**

**✅ DO**:
- Use bold phase colors for progress indicators, badges, completion states
- Use gradients for primary CTAs and phase transitions
- Use solid colors for data visualization (charts, matrices)
- Maintain color consistency within a phase

**❌ DON'T**:
- Mix phase colors within a single component
- Use muted/pastel versions of phase colors
- Apply phase colors to body text (use slate)

---

## 2. Typography System: Bold Hierarchy

### **Philosophy**
Strong typographic hierarchy using variable font weights. Larger headings create visual impact. System fonts for performance.

### **Font Stack**

```css
--font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### **Type Scale**

| Element | Class | Size | Weight | Line Height | Letter Spacing | Usage |
|---------|-------|------|--------|-------------|----------------|-------|
| **Hero Heading** | `text-5xl font-black` | 48px | 900 | 1.1 | -0.02em | Landing pages, major milestones |
| **Phase Title** | `text-4xl font-bold` | 36px | 700 | 1.2 | -0.01em | Phase section headers |
| **Section Heading** | `text-3xl font-bold` | 30px | 700 | 1.25 | 0 | Main content sections |
| **Subsection** | `text-2xl font-semibold` | 24px | 600 | 1.3 | 0 | Subsections, card titles |
| **Component Title** | `text-xl font-semibold` | 20px | 600 | 1.4 | 0 | Component headings |
| **Body Large** | `text-lg font-normal` | 18px | 400 | 1.6 | 0 | Descriptions, important text |
| **Body** | `text-base font-normal` | 16px | 400 | 1.6 | 0 | Standard body text |
| **Body Small** | `text-sm font-normal` | 14px | 400 | 1.5 | 0 | Secondary content |
| **Label** | `text-xs font-semibold uppercase` | 12px | 600 | 1.4 | 0.05em | Labels, metadata |
| **Caption** | `text-xs font-normal` | 12px | 400 | 1.3 | 0 | Captions, timestamps |

### **Font Weight Scale**

Use variable weights to create distinction:

```css
.font-light { font-weight: 300; }    /* Subtle, secondary */
.font-normal { font-weight: 400; }   /* Body text */
.font-medium { font-weight: 500; }   /* Emphasis */
.font-semibold { font-weight: 600; } /* Strong emphasis */
.font-bold { font-weight: 700; }     /* Headings */
.font-extrabold { font-weight: 800; }/* Major headings */
.font-black { font-weight: 900; }    /* Hero elements */
```

### **Typography Examples**

```tsx
// Phase Title
<h1 className="text-4xl font-bold text-slate-900 mb-3">
  Discovery
</h1>
<p className="text-sm font-semibold uppercase tracking-wider text-emerald-600 mb-6">
  Context Setting
</p>

// Section Heading
<h2 className="text-3xl font-bold text-slate-900 mb-6">
  Map Your Strategic Terrain
</h2>

// Card Title
<h3 className="text-xl font-semibold text-slate-900">
  Company Territory
</h3>

// Body Text
<p className="text-base text-slate-700 leading-relaxed">
  Explore your organization's internal landscape...
</p>

// Label
<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
  Phase 2
</span>
```

---

## 3. Iconography: Hand-Drawn Territory Icons

### **Philosophy**
Custom, hand-drawn style icons that feel exploratory and human. Inspired by map-making and terrain exploration.

### **Territory Icons** (SVG, 24x24px base)

**Company Territory** - Building/Structure
```svg
<!-- Hand-drawn building icon -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h2M9 14h2M13 10h2M13 14h2"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="stroke-dasharray: 2, 2;" />
</svg>
```

**Customer Territory** - People/Community
```svg
<!-- Hand-drawn people icon -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <circle cx="9" cy="7" r="3" stroke="currentColor" stroke-width="2" />
  <circle cx="15" cy="9" r="2.5" stroke="currentColor" stroke-width="2" />
  <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5M13 20c0-2 2-3.5 4-3.5s4 1.5 4 3.5"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round" />
</svg>
```

**Market Context Territory** - Compass/Navigation
```svg
<!-- Hand-drawn compass icon -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
  <path d="M12 3v2M12 19v2M21 12h-2M5 12H3"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round" />
  <path d="M10 8l4 4-4 4-4-4z"
        fill="currentColor"
        opacity="0.7" />
</svg>
```

### **Phase Icons**

**Discovery** - Magnifying glass with spark
**Landscape** - Terrain map with contours
**Synthesis** - Connected dots/network
**Strategic Bets** - Flag on summit

### **Icon Usage Guidelines**

```tsx
// Icon with phase color
<div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24">
    {/* Icon path */}
  </svg>
</div>

// Icon in button
<button className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold">
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
    {/* Icon */}
  </svg>
  Begin Discovery
</button>
```

---

## 4. Illustration System: Abstract Terrain Maps

### **Philosophy**
Abstract, stylized terrain maps that represent the strategic journey. Visual metaphors for exploration, mapping, and navigation.

### **Illustration Styles**

1. **Topographic Contours**: Curved lines suggesting terrain elevation
2. **Path Markers**: Dotted lines showing journey progression
3. **Milestone Markers**: Flags, pins, or markers for completed phases
4. **Gradient Overlays**: Bold gradients suggesting depth and layers

### **Example Implementations**

**Progress Background** (behind stepper):
```tsx
<div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white">
  {/* Topographic lines */}
  <svg className="absolute inset-0 w-full h-full opacity-10">
    <path d="M0,50 Q250,30 500,50 T1000,50"
          stroke="currentColor"
          fill="none"
          stroke-width="2" />
    <path d="M0,80 Q250,60 500,80 T1000,80"
          stroke="currentColor"
          fill="none"
          stroke-width="2" />
  </svg>

  {/* Content */}
  <HorizontalProgressStepper />
</div>
```

**Territory Card Background**:
```tsx
<div className="relative bg-white rounded-2xl border-2 border-amber-200 p-6 overflow-hidden">
  {/* Abstract terrain gradient */}
  <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-gradient-to-br from-amber-100 to-transparent rounded-full blur-3xl opacity-30" />

  {/* Card content */}
  <h3>Customer Territory</h3>
</div>
```

---

## 5. Component Patterns: Bold Applications

### **Progress Stepper** (Bold Phase Colors)

```tsx
// Current phase - Bold gradient
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/50">
  <span className="text-white font-bold text-lg">1</span>
</div>

// Completed phase - Solid bold color
<div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
  <svg className="w-6 h-6 text-white" fill="currentColor">
    <path d="M5 13l4 4L19 7" />
  </svg>
</div>

// Future phase - Subtle
<div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
  <span className="text-slate-500 font-semibold text-lg">3</span>
</div>
```

### **Territory Cards** (Bold Borders + Hover States)

```tsx
<button className="group relative bg-white rounded-2xl border-3 border-amber-400 p-8 transition-all hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1">
  {/* Icon */}
  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
    <svg className="w-8 h-8 text-white" />
  </div>

  {/* Title */}
  <h3 className="text-2xl font-bold text-slate-900 mb-2">
    Customer Territory
  </h3>

  {/* Description */}
  <p className="text-base text-slate-600">
    Investigate customer needs, behaviors...
  </p>

  {/* Status Badge */}
  <div className="absolute top-4 right-4">
    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider">
      <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
      In Progress
    </span>
  </div>
</button>
```

### **Primary Buttons** (Bold Gradients + Shadows)

```tsx
// Primary CTA
<button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all">
  Begin Mapping
  <svg className="w-5 h-5" />
</button>

// Phase-specific CTA
<button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30">
  Start Discovery
</button>
```

### **Badges & Status Indicators** (Bold + Animated)

```tsx
// Active phase badge
<div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full font-bold text-sm shadow-lg shadow-cyan-500/30">
  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
  Strategic Terrain Mapping
</div>

// Completion badge
<div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full font-bold text-sm shadow-lg shadow-green-500/30">
  <svg className="w-4 h-4" fill="currentColor">
    <path d="M5 13l4 4L19 7" />
  </svg>
  Territory Mapped
</div>
```

---

## 6. Spacing & Layout: Bold Breathing Room

### **Spacing Scale** (More generous)

| Name | Class | Value | Usage |
|------|-------|-------|-------|
| **Tight** | `gap-3` | 12px | Icon + text |
| **Default** | `gap-6` | 24px | Related elements |
| **Relaxed** | `gap-8` | 32px | Section spacing |
| **Loose** | `gap-12` | 48px | Major sections |
| **Extra Loose** | `gap-16` | 64px | Phase transitions |

### **Padding Scale**

| Context | Class | Value |
|---------|-------|-------|
| **Button** | `px-6 py-3` | 24px / 12px |
| **Card** | `p-8` | 32px |
| **Section** | `p-12` | 48px |
| **Page** | `p-16` | 64px |

### **Border Radius** (Softer curves)

| Element | Class | Value |
|---------|-------|-------|
| **Button** | `rounded-xl` | 12px |
| **Card** | `rounded-2xl` | 16px |
| **Modal** | `rounded-3xl` | 24px |
| **Badge** | `rounded-full` | 9999px |

---

## 7. Shadows: Depth & Elevation

### **Shadow Scale** (Bolder, colored shadows)

```css
/* Subtle elevation */
.shadow-subtle {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Default card */
.shadow-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Elevated card */
.shadow-elevated {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Bold phase-colored shadows */
.shadow-emerald {
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
}

.shadow-amber {
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
}

.shadow-purple {
  box-shadow: 0 8px 24px rgba(147, 51, 234, 0.3);
}

.shadow-cyan {
  box-shadow: 0 8px 24px rgba(6, 182, 212, 0.3);
}
```

---

## 8. Animation & Transitions

### **Transition Timing**

```css
.transition-base {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-smooth {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-bounce {
  transition: all 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### **Hover States**

```css
/* Lift + Shadow */
.hover-lift {
  @apply transition-all hover:-translate-y-1 hover:shadow-xl;
}

/* Scale */
.hover-scale {
  @apply transition-transform hover:scale-105;
}

/* Glow */
.hover-glow {
  @apply transition-shadow hover:shadow-2xl hover:shadow-indigo-500/40;
}
```

---

## 9. Implementation Checklist

### **Phase 1: Foundation** (Day 1)
- [ ] Update Tailwind config with bold color palette
- [ ] Create design token CSS variables
- [ ] Build icon component library
- [ ] Create gradient utility classes

### **Phase 2: Typography** (Day 1-2)
- [ ] Update all heading sizes (text-3xl, text-4xl)
- [ ] Apply variable font weights (font-bold, font-black)
- [ ] Increase letter-spacing on labels
- [ ] Test readability across screen sizes

### **Phase 3: Components** (Day 2-3)
- [ ] Redesign HorizontalProgressStepper with bold colors
- [ ] Update Territory Cards with bold borders + shadows
- [ ] Redesign all buttons with gradients
- [ ] Update badges with phase colors + animations
- [ ] Add illustration backgrounds to key sections

### **Phase 4: Visual Polish** (Day 3)
- [ ] Add colored shadows to elevated elements
- [ ] Implement hover states (lift, scale, glow)
- [ ] Add subtle animations (pulse, fade-in)
- [ ] Test visual hierarchy across all pages

---

## 10. Before/After Comparison

### **Before** (Current - Bland)
- Muted indigo-600/cyan-600 gradients
- Small headings (text-2xl = 24px)
- Generic system fonts (weight 400-600)
- Subtle shadows (rgba(0,0,0,0.1))
- Minimal color differentiation

### **After** (Bold Design System)
- Vibrant phase colors (emerald-500, amber-500, purple-600, cyan-500)
- Large headings (text-4xl = 36px, text-5xl = 48px)
- Variable weights (300-900, heavy use of 700-900)
- Colored shadows (phase-specific, 30% opacity)
- Strong visual rhythm per phase

---

## Design System Complete ✅

This bold design system transforms Frontera from generic enterprise SaaS to a distinctive, memorable product that feels like **Linear** (bold gradients) + **Stripe** (data clarity) + **Amplitude** (analytical depth).

**Next Steps**:
1. Implement design tokens in Tailwind config
2. Build component library with new system
3. Apply to Mockups 1, 2, 3 simultaneously
4. Test with UAT personas after deployment

---

**Document Version**: 1.0
**Status**: Ready for Implementation
**Estimated Implementation**: 2-3 days (parallel with Mockup development)
