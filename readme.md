# TaskTrack - Task Management Application

## Overview

TaskTrack is a full-stack task management application built with a React frontend and Express.js backend. The application provides user authentication through Replit's OAuth system and allows users to create, manage, and track their tasks with features like priority levels, due dates, and completion tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with OpenID Connect (Replit OAuth)
- **Session Management**: Express-session with PostgreSQL storage
- **API Design**: RESTful endpoints with proper error handling
- **Middleware**: Custom logging, error handling, and authentication middleware

### Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations with schema validation
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- **Provider**: Replit OAuth integration using OpenID Connect
- **Session Storage**: PostgreSQL-backed session store for persistence
- **Security**: HTTP-only cookies with secure flags for production
- **User Management**: Automatic user creation/update on login

### Task Management
- **CRUD Operations**: Full create, read, update, delete functionality
- **Task Properties**: Title, description, priority levels (low/medium/high), due dates, completion status
- **Bulk Operations**: Mark all complete, clear completed tasks
- **Real-time Updates**: Optimistic updates with TanStack Query

### UI Components
- **Design System**: Consistent component library with variants
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Dark Mode**: CSS variable-based theming system (prepared but not implemented)
- **Accessibility**: ARIA labels and keyboard navigation support

## Data Flow

1. **Authentication Flow**:
   - User clicks login → Redirects to Replit OAuth
   - OAuth callback creates/updates user in database
   - Session established with secure cookie
   - Frontend checks authentication status on load

2. **Task Operations**:
   - Frontend sends API requests with credentials
   - Backend validates session and user permissions
   - Database operations performed through Drizzle ORM
   - Response sent back with updated data
   - Frontend updates UI optimistically

3. **Error Handling**:
   - API errors caught and displayed as toast notifications
   - Unauthorized errors trigger automatic re-authentication
   - Network errors handled gracefully with retry logic

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **passport**: Authentication middleware
- **express-session**: Session management

### UI Dependencies
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development
- **Hot Reloading**: Vite dev server with HMR
- **API Proxy**: Vite proxies API requests to Express server
- **Database**: Environment-based connection string
- **Replit Integration**: Cartographer plugin for Replit-specific features

### Production
- **Build Process**: 
  - Frontend built with Vite to `dist/public`
  - Backend bundled with esbuild to `dist/index.js`
- **Static Serving**: Express serves built frontend files
- **Environment Variables**: 
  - `DATABASE_URL`: PostgreSQL connection string
  - `SESSION_SECRET`: Session encryption key
  - `REPL_ID`: Replit application identifier
- **Session Storage**: PostgreSQL table for persistent sessions

### Database Setup
- **Migrations**: Drizzle Kit handles schema migrations
- **Schema**: Defined in `shared/schema.ts` for type sharing
- **Tables**: Users, tasks, and sessions with proper relationships
- **Indexes**: Optimized for common query patterns

The application follows a monorepo structure with shared TypeScript types between frontend and backend, ensuring type safety across the entire stack. The authentication system is specifically designed for Replit's platform but can be adapted for other OAuth providers.