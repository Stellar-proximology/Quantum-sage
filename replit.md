# Esoteric Knowledge System

A comprehensive platform integrating human design astrology, I Ching divination, quantum mechanics, and AI-powered analysis using MiniMax LLM with RAG capabilities.

## Overview

This application combines ancient wisdom systems with modern AI to provide:
- **AI Chat**: Query about esoteric concepts with document-based context using RAG
- **Document Library**: Upload and manage PDFs on human design, I Ching, quantum mechanics, Gene Keys, etc.
- **Human Design**: Generate bodygraph charts with centers, gates, channels, type, and profile
- **I Ching Oracle**: Cast hexagrams with changing lines and interpretations
- **Astrology**: Create natal charts with planetary positions, houses, and aspects
- **Cymatics**: Visualize sound frequencies and resonance patterns
- **Magic Squares**: Generate mathematical matrices with mystical properties

## Recent Changes

### 2025-01-10: Initial MVP Development
- Configured mystical color palette with purple/violet primary colors for light and dark modes
- Implemented complete data schema for documents, chat messages, readings, and visualizations
- Built all frontend pages with beautiful, responsive UI:
  - Home page with tool cards and getting started guide
  - Document library with upload, categorization, and search
  - AI chat interface with document context selection and streaming support
  - Human Design bodygraph generator with SVG visualization
  - I Ching hexagram casting with trigrams and interpretations
  - Astrology chart wheel with planetary positions
  - Cymatics visualizer with live canvas animation
  - Magic squares generator with mathematical properties
- Integrated sidebar navigation with all tools
- Added dark mode support with theme toggle
- Configured fonts: Inter (sans), Cinzel (serif), JetBrains Mono (monospace)

## Project Architecture

### Frontend
- React + TypeScript + Vite
- Wouter for routing
- TanStack Query for data fetching
- Shadcn UI components with Tailwind CSS
- Custom mystical color palette and sacred geometry elements

### Backend
- Express.js server (to be implemented in Task 2)
- In-memory storage (MemStorage) for MVP
- MiniMax AI integration with streaming
- PDF parsing and text extraction
- Vector embeddings for RAG

### Data Models
- **Documents**: PDF files with extracted text and chunks for RAG
- **Document Chunks**: Text segments with embeddings for similarity search
- **Chat Messages**: Conversation history with context document references
- **Saved Readings**: Stored charts and interpretations
- **Chart Types**: HumanDesignChart, IChingReading, AstrologyChart, CymaticsPattern, MagicSquare

## User Preferences

### Design System
- Mystical purple/violet color scheme (270° hue)
- Sacred geometry integration
- Golden ratio proportions for layouts
- Clean, information-dense visualizations
- Smooth animations (200-250ms transitions)
- High contrast ratios for accessibility

### Typography
- Primary: Inter for UI and body text
- Accent: Cinzel for headers and mystical sections
- Monospace: JetBrains Mono for data labels and code

## Development Status

### Completed (Task 1)
- ✅ Complete data schema and TypeScript interfaces
- ✅ Design system configuration (colors, fonts, spacing)
- ✅ All React components and pages
- ✅ Sidebar navigation and routing
- ✅ Theme provider with dark mode
- ✅ Document upload UI
- ✅ Chat interface with context selection
- ✅ All visualization tools (Human Design, I Ching, Astrology, Cymatics, Magic Squares)

### In Progress (Task 2)
- Backend API implementation
- PDF text extraction and chunking
- MiniMax AI integration with streaming
- Vector embeddings and RAG search
- Chart generation algorithms

### Planned (Task 3)
- Frontend-backend integration
- Real-time AI streaming in chat
- Document processing pipeline
- Error handling and loading states
- End-to-end testing

## API Endpoints (To Be Implemented)

- `POST /api/documents/upload` - Upload and process PDF
- `GET /api/documents` - List all documents
- `DELETE /api/documents/:id` - Delete document
- `POST /api/chat/send` - Send message with streaming response
- `GET /api/chat/messages` - Get message history
- `POST /api/human-design/generate` - Generate bodygraph
- `POST /api/iching/cast` - Cast I Ching hexagram
- `POST /api/astrology/generate` - Generate natal chart
- `POST /api/magic-squares/generate` - Generate magic square

## Environment Variables

- `MINIMAX_API_KEY` - Required for AI chat functionality
- `SESSION_SECRET` - Session encryption key

## Running the Project

The workflow "Start application" runs `npm run dev` which starts:
- Express server for backend on port 5000
- Vite dev server for frontend
- Both served on the same port through Vite proxy

## Notes

- All visualizations use SVG and Canvas for dynamic rendering
- Sacred geometry patterns integrated throughout the UI
- Design guidelines strictly followed for consistent visual quality
- Offline-first approach with local document storage
- RAG implementation for contextual AI responses based on uploaded materials
