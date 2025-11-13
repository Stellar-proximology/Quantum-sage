# Design Guidelines: Esoteric Knowledge System

## Design Approach
**System-Based with Mystical Adaptation**: Using Material Design principles adapted for esoteric aesthetics - prioritizing information clarity for complex data visualizations while incorporating sacred geometry and mystical elements where appropriate.

## Core Design Principles
1. **Clarity over Decoration**: Complex data (human design charts, hexagrams, astrology) demands clean, readable presentations
2. **Functional Mysticism**: Sacred geometry as functional UI elements (navigation patterns, data containers) not mere decoration
3. **Information Density Balance**: Dense specialized content organized through clear hierarchy and spacing
4. **Tool-First Navigation**: Quick access to different analysis tools (Human Design, I Ching, Astrology, Cymatics, Magic Squares)

## Typography System

**Font Families**:
- Primary: 'Inter' (UI, body text, data labels) - exceptional readability for dense information
- Accent: 'Cinzel' or 'Cormorant Garamond' (headers, mystical section titles) - serif dignity for esoteric content
- Monospace: 'JetBrains Mono' (hexagram readings, mathematical formulas)

**Hierarchy**:
- H1: 2.5rem (tool section headers)
- H2: 1.875rem (chart titles, subsections)
- H3: 1.5rem (component headers)
- Body: 1rem (descriptions, readings)
- Small: 0.875rem (data labels, metadata)
- Caption: 0.75rem (chart annotations)

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: space-y-8 to space-y-12
- Card gaps: gap-6
- Micro-spacing: space-y-2 to space-y-4

**Container Strategy**:
- Main workspace: max-w-7xl centered
- Tool panels: Full-width with internal max-w-6xl
- Chat interface: max-w-4xl for readability
- Chart viewers: Responsive containers maintaining aspect ratios

## Component Library

### Navigation & Layout
**Primary Navigation**: Vertical sidebar (fixed left, w-64)
- Tool categories with sacred geometry icons
- Collapsible sections for sub-tools
- Active state with subtle geometric accent

**Tool Dashboard**: Grid-based tool launcher
- 3-column grid (lg:grid-cols-3 md:grid-cols-2)
- Tool cards with icon, title, brief description
- Hover state with subtle elevation

### Specialized Visualizations
**Human Design Chart Container**:
- Centered bodygraph SVG display
- Side panels for gate/channel details
- Responsive scaling preserving geometric integrity
- Data overlays with semi-transparent backgrounds

**I Ching Hexagram Display**:
- Large hexagram visualization (trigrams clearly separated)
- Line-by-line interpretation panels
- Transformation animation for changing lines

**Astrology Chart Wheel**:
- Circular SVG chart with house divisions
- Planetary position markers
- Aspect lines with varying weights
- Legend panel (detachable/floating)

**Cymatics Visualizer**:
- Canvas-based frequency visualization
- Real-time waveform rendering
- Control panel for frequency/pattern parameters

**Magic Square Generator**:
- Responsive grid display (auto-sizing cells)
- Mathematical property annotations
- Export/download options

### Document Management
**Library View**:
- List/grid toggle for PDF documents
- Filter by topic/category
- Search with highlighting
- Upload dropzone (dashed border, hover state)

**Document Viewer**:
- Split view: PDF preview + extracted text
- Annotation capabilities
- Quick-reference bookmark system

### AI Chat Interface
**Chat Container**: 
- Full-height conversation area
- Message bubbles (user: right-aligned, AI: left-aligned)
- Code/formula blocks with syntax highlighting
- Citation links to source documents
- Regenerate/copy/share message actions

**Input Area**:
- Multi-line textarea with auto-expand
- Document context selector
- Voice input option
- Submit on Enter (Shift+Enter for new line)

### Data Display Components
**Info Cards**: Elevated cards (shadow-md) with:
- Header with icon
- Body content (readings, interpretations)
- Footer actions (save, share, export)

**Stat Panels**: For numerical/astrological data
- Large value display
- Label and context
- Trend indicators where applicable

**Tabs**: For multi-view content
- Underline active state
- Smooth content transitions
- Keyboard navigation support

### Forms & Controls
**Input Fields**:
- Birth data forms (date, time, location)
- Outlined style with floating labels
- Validation states (error, success)
- Helper text below fields

**Date/Time Pickers**:
- Calendar dropdown for birth dates
- Time slider with precise input
- Timezone selector

**Sliders**: For frequency controls, parameter adjustments
- Track with current value bubble
- Stepped increments where relevant

## Animations
**Minimal, Purposeful Motion**:
- Chart generation: Fade-in with slight scale (200ms ease-out)
- Navigation transitions: Slide content (150ms ease-in-out)
- Tool switching: Cross-fade (250ms)
- NO continuous animations, pulsing, or distracting effects
- Hexagram line changes: Sequential reveal (400ms total)

## Sacred Geometry Integration
**Functional Geometric Elements**:
- Flower of Life pattern: Subtle background for meditation/focus tools
- Golden ratio proportions: Chart containers and major layout divisions
- Metatron's Cube: Loading state or data processing indicator
- Vesica Piscis: Intersection/overlay panels
**Applied as**: SVG overlays (10-15% opacity), container borders, section dividers

## Images
No hero images required. This is a utility application.

**Icon System**: Use Heroicons for UI controls, custom SVG for esoteric symbols (gates, hexagrams, planets)

**Visualization Assets**: All charts/diagrams generated programmatically (SVG/Canvas) - no static images except:
- Tool thumbnails in dashboard (geometric abstractions)
- Document PDF previews (generated thumbnails)

## Accessibility & Responsiveness
- WCAG AA contrast ratios for all text/data
- Keyboard navigation for all tools
- Screen reader labels for chart elements
- Mobile: Stack sidebars below content, horizontal scroll for large charts with pinch-zoom
- Touch-friendly controls (minimum 44px tap targets)