# Implementation Plan: Bold Redesign + Critical UX Improvements

**Created**: January 18, 2026
**Timeline**: 12-17 days total
**Approach**: Parallel tracks (Visual + UX)
**Goal**: Transform Frontera to bold, distinctive product with critical UX fixes

---

## Executive Summary

Based on design review findings and your direction, we're implementing:

1. **Bold Visual System**: Linear-inspired bold colors, Stripe-level typography, Amplitude analytical feel
2. **Critical UX Fixes**: AI Streaming (Mockup 1), Territory Navigation (Mockup 2)
3. **Data Visualization**: Strategic Opportunity Map (Mockup 3) + Synthesis phase
4. **Defer UAT**: Test after full implementation complete

**Design References**: Linear + Stripe + Amplitude/Dovetail

---

## Implementation Phases

| Phase | Focus | Days | Status |
|-------|-------|------|--------|
| **Phase 1** | Bold Visual Foundation | 2-3 days | 🔄 Starting |
| **Phase 2** | Mockup 1 (AI Streaming) + Visual Integration | 2-3 days | ⏳ Pending |
| **Phase 3** | Mockup 2 (Territory Sidebar Nav) | 3-4 days | ⏳ Pending |
| **Phase 4** | Mockup 3 (2x2 Matrix) + Synthesis Phase | 5-7 days | ⏳ Pending |
| **Phase 5** | Polish + Deployment | 1-2 days | ⏳ Pending |

**Total**: 13-19 days (targeting 15 days)

---

## Phase 1: Bold Visual Foundation (Days 1-3)

### **Objective**
Create distinctive design system with bold phase colors, strong typography, custom iconography.

### **Deliverables**

#### **1.1 Design Tokens & Tailwind Config** (Day 1, 4 hours)

**File**: `tailwind.config.ts`

**Actions**:
- [ ] Add bold phase colors (emerald-500, amber-500, purple-600, cyan-500)
- [ ] Configure variable font weights (300-900)
- [ ] Add colored shadow utilities
- [ ] Create gradient utilities

**Implementation**:
```typescript
// tailwind.config.ts updates
theme: {
  extend: {
    colors: {
      // Phase-specific bold colors
      'discovery': {
        DEFAULT: '#10B981', // emerald-500
        light: '#34D399',
        dark: '#059669',
      },
      'landscape': {
        DEFAULT: '#F59E0B', // amber-500
        light: '#FBBF24',
        dark: '#D97706',
      },
      'synthesis': {
        DEFAULT: '#9333EA', // purple-600
        light: '#A855F7',
        dark: '#7C3AED',
      },
      'bets': {
        DEFAULT: '#06B6D4', // cyan-500
        light: '#22D3EE',
        dark: '#0891B2',
      },
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    boxShadow: {
      'emerald': '0 8px 24px rgba(16, 185, 129, 0.3)',
      'amber': '0 8px 24px rgba(245, 158, 11, 0.3)',
      'purple': '0 8px 24px rgba(147, 51, 234, 0.3)',
      'cyan': '0 8px 24px rgba(6, 182, 212, 0.3)',
    },
  },
}
```

---

#### **1.2 Icon Component Library** (Day 1-2, 6 hours)

**Files**:
- `src/components/icons/TerritoryIcons.tsx`
- `src/components/icons/PhaseIcons.tsx`

**Actions**:
- [ ] Create CompanyIcon (hand-drawn building)
- [ ] Create CustomerIcon (hand-drawn people)
- [ ] Create MarketIcon (hand-drawn compass)
- [ ] Create DiscoveryIcon (magnifying glass + spark)
- [ ] Create LandscapeIcon (terrain map)
- [ ] Create SynthesisIcon (connected dots)
- [ ] Create BetsIcon (flag on summit)

**Implementation Example**:
```typescript
// src/components/icons/TerritoryIcons.tsx
export function CompanyIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 21h18M5 21V7l7-4 7 4v14M9 10h2M9 14h2M13 10h2M13 14h2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ strokeDasharray: '2, 2' }}
      />
    </svg>
  );
}

export function CustomerIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="15" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3 20c0-3 2.5-5 6-5s6 2 6 5M13 20c0-2 2-3.5 4-3.5s4 1.5 4 3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
```

---

#### **1.3 Typography Update** (Day 2, 3 hours)

**Files to Update**:
- `src/components/product-strategy-agent/CanvasPanel/ResearchSection.tsx`
- `src/components/product-strategy-agent/CanvasPanel/DiscoverySection.tsx`
- `src/components/product-strategy-agent/CanvasPanel/HorizontalProgressStepper.tsx`

**Actions**:
- [ ] Update phase titles: `text-2xl` → `text-4xl font-bold`
- [ ] Update section headers: `text-xl` → `text-3xl font-bold`
- [ ] Update labels: Add `font-semibold uppercase tracking-wider`
- [ ] Increase line-height for readability

**Before/After**:
```tsx
// BEFORE
<h1 className="text-3xl font-bold text-slate-900 mb-2">Landscape</h1>

// AFTER
<h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Landscape</h1>
```

---

#### **1.4 Bold Component Redesigns** (Day 2-3, 8 hours)

**Priority Components**:

##### **A. HorizontalProgressStepper** (2 hours)

**Changes**:
- Larger circles: `w-10 h-10` → `w-14 h-14`
- Bold phase colors with gradients
- Colored shadows for current phase
- Stronger animations

```tsx
// Current phase - bold gradient + colored shadow
<div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg transition-all duration-300 shadow-lg
  ${isCurrent
    ? `bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 text-white shadow-${step.color} scale-110`
    : isComplete
    ? `bg-${step.color}-500 text-white`
    : 'bg-slate-200 text-slate-400'
  }`}
>
  {isComplete ? <CheckIcon /> : step.id}
</div>
```

---

##### **B. Territory Cards** (3 hours)

**Changes**:
- Bold colored borders: `border-2 border-${color}-400`
- Gradient icon backgrounds
- Colored shadows on hover
- Larger cards with more breathing room

```tsx
<button className="group relative bg-white rounded-2xl border-3 border-amber-400 p-8 transition-all hover:border-amber-500 hover:shadow-2xl hover:shadow-amber/30 hover:-translate-y-1">
  {/* Icon with gradient */}
  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-amber/30">
    <CustomerIcon className="w-8 h-8 text-white" />
  </div>

  {/* Title */}
  <h3 className="text-2xl font-bold text-slate-900 mb-2">
    Customer Territory
  </h3>

  {/* Status Badge */}
  <div className="absolute top-4 right-4">
    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">
      <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
      In Progress
    </span>
  </div>
</button>
```

---

##### **C. Primary Buttons** (1 hour)

**Changes**:
- Bold gradients instead of solid colors
- Colored shadows
- Stronger hover states (lift + glow)

```tsx
// Primary CTA
<button className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all">
  Begin Discovery
  <ArrowRightIcon className="w-5 h-5" />
</button>

// Phase-specific button
<button className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald/30">
  Start Exploration
</button>
```

---

##### **D. Status Badges** (1 hour)

**Changes**:
- Bold phase colors
- Gradients for active states
- Pulsing dot animations
- Colored shadows

```tsx
// Active phase badge
<div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-landscape to-landscape-dark text-white rounded-full font-bold text-sm shadow-lg shadow-amber">
  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
  Strategic Terrain Mapping
</div>

// Completion badge
<div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full font-bold text-sm shadow-lg shadow-green-500/30">
  <CheckCircleIcon className="w-4 h-4" />
  Territory Mapped
</div>
```

---

##### **E. Background Illustrations** (1 hour)

**Changes**:
- Subtle topographic contours behind progress stepper
- Gradient overlays on territory cards
- Abstract terrain patterns in backgrounds

```tsx
// Progress stepper background
<div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white py-8 px-10">
  {/* Topographic lines */}
  <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none">
    <defs>
      <pattern id="contours" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M0,50 Q25,30 50,50 T100,50" stroke="currentColor" fill="none" strokeWidth="1.5" />
        <path d="M0,70 Q25,50 50,70 T100,70" stroke="currentColor" fill="none" strokeWidth="1.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#contours)" />
  </svg>

  {/* Progress stepper */}
  <HorizontalProgressStepper currentPhase={currentPhase} />
</div>
```

---

### **Phase 1 Testing Checklist**

- [ ] All phase colors render correctly (emerald, amber, purple, cyan)
- [ ] Typography hierarchy is clear (4xl headings, bold weights)
- [ ] Icons display properly across all screen sizes
- [ ] Shadows appear with correct phase colors
- [ ] Hover states work (lift, glow, scale)
- [ ] Animations are smooth (200-300ms)
- [ ] No visual regressions on existing pages

---

## Phase 2: Mockup 1 - AI Streaming with Bold Visual System (Days 4-6)

### **Objective**
Implement real-time AI streaming with bold visual feedback, using new design system.

### **Deliverables**

#### **2.1 Create Streaming Components** (Day 4, 4 hours)

**Files**:
- `src/components/product-strategy-agent/CoachingPanel/ThinkingIndicator.tsx`
- `src/components/product-strategy-agent/CoachingPanel/StreamingMessage.tsx`
- `src/components/product-strategy-agent/CoachingPanel/ErrorMessage.tsx`

**ThinkingIndicator with Bold Design**:
```tsx
export function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3 bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200">
      {/* Coach avatar with gradient */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
        <img src="/frontera-logo-F.jpg" alt="Coach" className="w-full h-full object-cover rounded-xl" />
      </div>

      {/* Thinking animation - bold colors */}
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 animate-pulse thinking-dot-1" />
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 animate-pulse thinking-dot-2" />
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 animate-pulse thinking-dot-3" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider text-indigo-600">
            Thinking...
          </span>
        </div>
      </div>
    </div>
  );
}
```

**StreamingMessage with Bold Design**:
```tsx
export function StreamingMessage({ content, isStreaming, onStop }: Props) {
  return (
    <div className="flex items-start gap-3 bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-indigo-200">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
        <img src="/frontera-logo-F.jpg" alt="Coach" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="text-base text-slate-900 leading-relaxed">
          {content}
          {isStreaming && (
            <span className="inline-block w-0.5 h-5 bg-gradient-to-b from-indigo-600 to-cyan-600 animate-pulse ml-1" />
          )}
        </div>

        {/* Actions - bold buttons */}
        {isStreaming && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
            <button
              onClick={onStop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-red-300 rounded-lg text-red-700 font-semibold hover:bg-red-50 hover:border-red-400 transition-all"
            >
              <StopIcon className="w-3.5 h-3.5" />
              Stop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

#### **2.2 Update CoachingPanel Streaming Logic** (Day 4-5, 6 hours)

**File**: `src/components/product-strategy-agent/CoachingPanel/CoachingPanel.tsx`

**Changes**:
- Add real-time streaming state
- Implement AbortController for stop functionality
- Display ThinkingIndicator → StreamingMessage → final Message
- Bold visual feedback at each state

*(Full implementation code per Mockup 1 spec)*

---

#### **2.3 Testing** (Day 6, 2 hours)

- [ ] Thinking indicator appears immediately
- [ ] Transition to streaming is smooth
- [ ] Text streams character-by-character
- [ ] Typing cursor pulses (bold indigo-cyan gradient)
- [ ] Stop button works and preserves partial content
- [ ] Error states show bold red styling
- [ ] All states use new bold design system

---

## Phase 3: Mockup 2 - Territory Sidebar Navigation (Days 7-10)

### **Objective**
Replace full-screen territory deep-dive with persistent sidebar navigation (25% width).

### **Deliverables**

#### **3.1 Create Sidebar Component** (Day 7-8, 6 hours)

**File**: `src/components/product-strategy-agent/CanvasPanel/TerritoryDeepDiveSidebar.tsx`

**Bold Design Features**:
- Phase-colored territory badge with gradient
- Bold research area indicators
- Colored progress dots
- Large, clear typography

```tsx
export function TerritoryDeepDiveSidebar({ territory, researchAreas, selectedAreaId }: Props) {
  return (
    <aside className="w-1/4 min-w-[280px] max-w-[320px] bg-white border-r-2 border-slate-200 p-6 flex flex-col h-full">
      {/* Territory Badge - bold gradient */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 mb-6 shadow-lg shadow-amber">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <CustomerIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Customer Territory</h3>
            <p className="text-xs font-semibold text-amber-100 uppercase tracking-wider">Market & User Insights</p>
          </div>
        </div>
      </div>

      {/* Research Areas - bold indicators */}
      <div className="flex-1 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
          Research Areas
        </h4>
        {researchAreas.map((area, index) => (
          <button
            key={area.id}
            className={`w-full text-left py-3 px-4 rounded-xl transition-all ${
              selectedAreaId === area.id
                ? 'bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-500 shadow-md'
                : 'hover:bg-slate-50 border-2 border-transparent'
            }`}
          >
            {/* Area title */}
            <h5 className={`text-sm mb-2 ${
              selectedAreaId === area.id ? 'font-bold text-amber-900' : 'font-semibold text-slate-900'
            }`}>
              {index + 1}. {area.title}
            </h5>

            {/* Progress dots - bold colors */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: area.questionCount }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${
                      i < answeredCount ? 'bg-amber-500' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-600">
                {answeredCount}/{area.questionCount}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Overall Progress - bold gradient bar */}
      <div className="pt-6 border-t-2 border-slate-200">
        <div className="mb-3">
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500 shadow-lg"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
        <p className="text-xl font-black text-slate-900">{progress.percentage}% Complete</p>
      </div>
    </aside>
  );
}
```

---

#### **3.2 Create Content Component** (Day 8-9, 4 hours)

**File**: `src/components/product-strategy-agent/CanvasPanel/TerritoryDeepDiveContent.tsx`

**Bold Design Features**:
- Large headings (text-3xl)
- Colored question cards
- Bold action buttons with phase colors

*(Full implementation per Mockup 2 spec with bold design applied)*

---

#### **3.3 Refactor Deep-Dive Components** (Day 9-10, 6 hours)

**Files**:
- `src/components/product-strategy-agent/CanvasPanel/CompanyTerritoryDeepDive.tsx`
- `src/components/product-strategy-agent/CanvasPanel/CustomerTerritoryDeepDive.tsx`

**Changes**:
- Replace full-screen with sidebar + content layout
- Apply bold visual system
- Test navigation and data persistence

---

#### **3.4 Testing** (Day 10, 2 hours)

- [ ] Sidebar persists across area switches
- [ ] Selected area highlighted with bold colors
- [ ] Progress dots update in real-time
- [ ] Sidebar width is 25% with bold visual presence
- [ ] All navigation smooth and intuitive

---

## Phase 4: Mockup 3 - Strategic Opportunity Map + Synthesis (Days 11-17)

### **Objective**
Build Synthesis phase with bold 2x2 matrix visualization, reduce text-heavy UI.

### **Deliverables**

#### **4.1 Create 2x2 Matrix Component** (Day 11-12, 8 hours)

**File**: `src/components/product-strategy-agent/CanvasPanel/StrategicOpportunityMap.tsx`

**Bold Design Features**:
- Large, colorful quadrants
- Bold axis labels
- Opportunity cards with gradients
- Interactive hover states

```tsx
export function StrategicOpportunityMap({ opportunities }: Props) {
  return (
    <div className="strategic-map bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-xl">
      {/* Title */}
      <h2 className="text-3xl font-black text-slate-900 mb-2">Strategic Opportunity Map</h2>
      <p className="text-base text-slate-600 mb-8">Prioritize opportunities by market attractiveness and capability fit</p>

      {/* 2x2 Matrix */}
      <div className="relative">
        {/* Axes */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-4">
          <div className="text-sm font-bold uppercase tracking-wider text-slate-700 -rotate-90 whitespace-nowrap">
            Market Attractiveness
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-4">
          <div className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Capability Fit
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-0 border-2 border-slate-300">
          {/* Top-left: LOW FIT, HIGH MARKET - Monitor */}
          <div className="relative p-8 border-r-2 border-b-2 border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 min-h-[300px]">
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1.5 bg-slate-200 text-slate-700 rounded-full text-xs font-bold uppercase">
                Monitor
              </span>
            </div>
            {/* Opportunity cards */}
            {opportunities.filter(o => o.quadrant === 'monitor').map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} color="slate" />
            ))}
          </div>

          {/* Top-right: HIGH FIT, HIGH MARKET - Prioritize */}
          <div className="relative p-8 border-b-2 border-slate-300 bg-gradient-to-br from-purple-50 to-purple-100 min-h-[300px]">
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full text-xs font-bold uppercase shadow-lg shadow-purple">
                Prioritize
              </span>
            </div>
            {opportunities.filter(o => o.quadrant === 'prioritize').map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} color="purple" />
            ))}
          </div>

          {/* Bottom-left: LOW FIT, LOW MARKET - Divest */}
          <div className="relative p-8 border-r-2 border-slate-300 bg-gradient-to-br from-red-50 to-red-100 min-h-[300px]">
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1.5 bg-red-200 text-red-800 rounded-full text-xs font-bold uppercase">
                Divest
              </span>
            </div>
            {opportunities.filter(o => o.quadrant === 'divest').map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} color="red" />
            ))}
          </div>

          {/* Bottom-right: HIGH FIT, LOW MARKET - Selective */}
          <div className="relative p-8 bg-gradient-to-br from-amber-50 to-amber-100 min-h-[300px]">
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1.5 bg-amber-200 text-amber-800 rounded-full text-xs font-bold uppercase">
                Selective
              </span>
            </div>
            {opportunities.filter(o => o.quadrant === 'selective').map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} color="amber" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Opportunity Card - bold, draggable
function OpportunityCard({ opportunity, color }: Props) {
  return (
    <div
      className={`
        group cursor-move p-4 rounded-xl border-2 border-${color}-300
        bg-white shadow-md hover:shadow-xl hover:-translate-y-1
        transition-all duration-200
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full bg-${color}-500 flex-shrink-0 mt-1`} />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 mb-1">{opportunity.title}</h4>
          <p className="text-xs text-slate-600">{opportunity.description}</p>
        </div>
      </div>
    </div>
  );
}
```

---

#### **4.2 Build Synthesis Section** (Day 13-15, 12 hours)

**File**: `src/components/product-strategy-agent/CanvasPanel/SynthesisSection.tsx`

**Features**:
- Strategic Opportunity Map (2x2 matrix)
- Cross-territory insights visualization
- Reduce long text, increase visual frameworks
- Bold colors and gradients throughout

---

#### **4.3 API & Data Layer** (Day 16, 4 hours)

**File**: `src/app/api/product-strategy-agent/synthesis/route.ts`

**Actions**:
- Create synthesis endpoint
- Store opportunity data
- Return formatted opportunities for 2x2 matrix

---

#### **4.4 Testing** (Day 17, 3 hours)

- [ ] 2x2 matrix renders with correct quadrants
- [ ] Opportunity cards are bold and interactive
- [ ] Drag-and-drop works (if implemented)
- [ ] Colors match design system (purple, amber, red, slate)
- [ ] Synthesis phase accessible from progress stepper

---

## Phase 5: Polish & Deployment (Days 18-19)

### **Objective**
Final polish, testing, and deployment preparation.

### **Deliverables**

#### **5.1 Visual QA** (Day 18, 4 hours)

- [ ] All components use bold design system consistently
- [ ] No muted colors (all vibrant phase colors)
- [ ] Typography hierarchy clear (text-3xl, text-4xl, font-bold)
- [ ] Shadows use phase colors (emerald, amber, purple, cyan)
- [ ] Animations smooth and performant
- [ ] Icons render correctly across browsers

---

#### **5.2 Functional Testing** (Day 18, 3 hours)

- [ ] AI streaming works (Mockup 1)
- [ ] Territory sidebar navigation works (Mockup 2)
- [ ] 2x2 matrix interactive (Mockup 3)
- [ ] All phases navigable
- [ ] Data persists correctly
- [ ] No console errors

---

#### **5.3 Cross-Browser Testing** (Day 19, 2 hours)

- [ ] Chrome (primary)
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

#### **5.4 Performance Check** (Day 19, 2 hours)

- [ ] Lighthouse score > 90
- [ ] No layout shifts (CLS < 0.1)
- [ ] Fast interaction (INP < 200ms)
- [ ] Font loading optimized

---

#### **5.5 Deployment** (Day 19, 2 hours)

- [ ] Create git branch: `feature/bold-redesign-mvp`
- [ ] Commit all changes with clear messages
- [ ] Push to GitHub
- [ ] Deploy to Vercel preview
- [ ] Share preview link for review

---

## Success Metrics

### **Visual Transformation**

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| **Distinctive Score** (subjective) | 2/10 | 8/10 | 8+ |
| **Phase Color Usage** | Muted gradients | Bold solids + gradients | All phases bold |
| **Typography Hierarchy** | Weak (text-2xl) | Strong (text-4xl, font-black) | Clear 3-level hierarchy |
| **Icon Usage** | Generic | Custom hand-drawn | 100% custom |
| **Shadow Depth** | Minimal | Bold phase-colored | All elevated elements |

### **UX Improvements**

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| **Streaming Visibility** | Silent 10s pause | Real-time character display | <2s perceived wait |
| **Territory Nav Efficiency** | 3 clicks to switch | 1 click (sidebar) | 1 click |
| **Synthesis Visualization** | Text-only | 2x2 matrix + visuals | Visual-first |
| **User Confusion** (UAT) | High | Low | <20% confused users |

---

## Risk Mitigation

### **Risk 1: Bold colors feel overwhelming**

**Mitigation**:
- Use phase colors strategically (not everywhere)
- Maintain white/slate backgrounds for breathing room
- Test with 3 beta users before full rollout

### **Risk 2: Performance degradation (gradients/shadows)**

**Mitigation**:
- Use CSS transforms (GPU-accelerated)
- Limit shadows to elevated elements only
- Monitor Lighthouse scores continuously

### **Risk 3: Accessibility regression**

**Mitigation**:
- Use WCAG AA Large (3:1) for decorative elements
- Maintain 4.5:1 for all body text
- Defer full keyboard nav to Phase 4 (post-MVP)

---

## Next Steps

1. ✅ **Bold Design System**: Review and approve [BOLD_DESIGN_SYSTEM_V1.md](BOLD_DESIGN_SYSTEM_V1.md)
2. 🔄 **Phase 1 Start**: Implement Tailwind config + icons (starting now)
3. ⏳ **Phase 2**: Build Mockup 1 with bold design
4. ⏳ **Phase 3**: Build Mockup 2 with bold design
5. ⏳ **Phase 4**: Build Mockup 3 + Synthesis phase
6. ⏳ **Phase 5**: Polish and deploy
7. 📋 **UAT**: Test with Maya & Tom personas after deployment

---

**Implementation Plan Complete** ✅

**Status**: Ready to execute Phase 1
**Estimated Completion**: 15-17 days
**UAT Reminder**: Scheduled after full deployment

---

**Questions or adjustments before I start coding?**
