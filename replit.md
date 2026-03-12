# Overview

This is a full-stack web application that combines a modern React frontend with an Express.js backend. The project features a unique hybrid architecture where the main application serves as a creative coding platform with p5.js integration for interactive visual art. The application includes both a React-based routing system and static HTML pages for the creative coding features.

The project is designed as a creative canvas application where users can interact with generative art and visual effects through p5.js sketches. It includes standard web application features like user management alongside the creative coding components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18 with TypeScript**: Modern React application using function components and hooks
- **Vite Build System**: Fast development server and optimized production builds
- **Hybrid Routing**: Combines Wouter for React routing with direct navigation to static HTML pages
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack Query for server state management
- **Creative Integration**: p5.js library integrated for generative art and interactive visuals

## Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript support
- **Modular Design**: Separated concerns with distinct storage, routing, and server setup modules
- **Storage Abstraction**: Interface-based storage system with in-memory implementation (ready for database integration)
- **Development Integration**: Vite middleware integration for seamless full-stack development

## Database & Storage
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **Schema Definition**: Centralized schema definitions in shared directory
- **Migration Support**: Database migration system with Drizzle Kit
- **Current Implementation**: In-memory storage with interface ready for PostgreSQL integration

## Styling & Design System
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Design System**: Consistent theming with CSS custom properties
- **Component Library**: Comprehensive UI component set from shadcn/ui
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Dark Mode Support**: Built-in theme switching capabilities

## Development Experience
- **TypeScript**: Full type safety across frontend, backend, and shared code
- **Path Aliases**: Organized import structure with @ aliases for better DX
- **Hot Reload**: Fast development with Vite HMR and Express server restart
- **Error Handling**: Runtime error overlays and comprehensive error boundaries
- **Code Quality**: ESLint and TypeScript strict mode for code consistency

## Project Structure
- **Monorepo Setup**: Frontend, backend, and shared code in single repository
- **Shared Types**: Common TypeScript definitions and schemas shared between client and server
- **Asset Management**: Organized asset handling with Vite's asset pipeline
- **Configuration**: Centralized configuration files for build tools and development

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database platform (@neondatabase/serverless)
- **Connection Management**: Environment-based database URL configuration

## UI & Component Libraries
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Lucide React**: Icon library with consistent SVG icons
- **Embla Carousel**: Smooth carousel/slider functionality
- **React Hook Form**: Performant form handling with validation

## Development Tools
- **Vite**: Next-generation frontend tooling for fast builds and HMR
- **TanStack Query**: Powerful data synchronization for React applications
- **Class Variance Authority**: Type-safe component variants
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing with autoprefixer

## Creative Coding Libraries
- **p5.js**: JavaScript library for creative coding and generative art
- **Canvas Integration**: HTML5 Canvas for interactive visual experiences

## Utility Libraries
- **date-fns**: Modern JavaScript date utility library
- **clsx**: Utility for constructing className strings conditionally
- **nanoid**: Secure, URL-friendly unique ID generator
- **Zod**: TypeScript-first schema validation library

## Authentication & Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **Session Infrastructure**: Ready for session-based authentication implementation