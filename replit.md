# DIGI OFFICE - Construction Site Management System

## Overview

DIGI OFFICE is a comprehensive web application designed for managing and supervising high-risk construction sites for OCP (Office Chérifien des Phosphates). The system provides real-time monitoring, production tracking, maintenance scheduling, security alerts, and performance analytics through an intuitive dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom OCP branding colors
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **API Design**: RESTful API with proper HTTP methods and status codes
- **Middleware**: Custom logging, CORS, and JSON parsing
- **Session Management**: PostgreSQL session store with connect-pg-simple

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
├── server/           # Express backend server
├── shared/           # Shared TypeScript types and schemas
└── migrations/       # Database migration files
```

## Key Components

### Core Pages
1. **Home** (`/`) - Landing page with system overview
2. **Dashboard** (`/dashboard`) - Real-time KPI monitoring with auto-refresh
3. **Production** (`/production`) - Production activity management
4. **Maintenance** (`/maintenance`) - Maintenance scheduling and tracking
5. **Security** (`/security`) - Security alerts and incident management
6. **Site Map** (`/map`) - Interactive site zone visualization
7. **Performance** (`/performance`) - Employee and machine performance metrics
8. **Notifications** (`/notifications`) - System notifications and alerts

### Database Schema
- **Users**: Authentication and user management
- **Production Activities**: Production task tracking with status management
- **Maintenance Schedules**: Preventive and corrective maintenance planning
- **Security Alerts**: Safety incident tracking with severity levels
- **Notifications**: System-wide messaging and alerts

### UI Components
- **KPICard**: Reusable metric display component with trend indicators
- **Forms**: Production and maintenance data entry forms
- **Layout**: Responsive navigation with sidebar and header
- **Tables**: Data display with sorting and filtering capabilities

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query
2. **Server Processing**: Express routes handle business logic and database operations
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Handling**: Structured JSON responses with proper error handling
5. **State Management**: React Query caches and synchronizes server state
6. **UI Updates**: Components re-render based on query state changes

### Real-time Features
- Dashboard auto-refreshes every 10 seconds
- Live KPI updates with simulated data changes
- Instant notifications for critical alerts
- Interactive zone status updates on site map

## External Dependencies

### Frontend Dependencies
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing library
- **lucide-react**: Icon library
- **date-fns**: Date manipulation utilities

### Backend Dependencies
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: PostgreSQL database adapter
- **express**: Web application framework
- **connect-pg-simple**: PostgreSQL session store
- **drizzle-zod**: Schema validation integration

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **drizzle-kit**: Database schema management
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR (Hot Module Replacement)
- **Backend**: Node.js with tsx for TypeScript execution
- **Database**: Neon Database serverless PostgreSQL
- **Environment**: Replit-optimized with custom plugins

### Production Build
- **Frontend**: Vite production build with optimization
- **Backend**: ESBuild compilation to Node.js compatible format
- **Database**: Managed PostgreSQL with connection pooling
- **Deployment**: Single-command deployment with `npm run build`

### Key Features
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Real-time Updates**: WebSocket-ready architecture for live data
- **Security**: Input validation with Zod schemas
- **Performance**: Optimized queries and component rendering
- **Scalability**: Modular architecture supporting feature expansion

The application uses modern development practices with TypeScript for type safety, comprehensive error handling, and a clean separation of concerns between frontend and backend code.