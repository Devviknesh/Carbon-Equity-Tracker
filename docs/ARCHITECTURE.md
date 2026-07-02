# Architecture Documentation

## System Overview

Carbon Equity Tracker is a three-tier SaaS application:

```mermaid
graph TD
    User["👤 User (Browser)"]
    CDN["Vercel CDN\nReact SPA"]
    API["Render\nNode.js / Express API"]
    DB[("MySQL / PostgreSQL\nPrisma ORM")]

    User -->|"HTTPS (port 443)"| CDN
    CDN -->|"REST API calls\n/api/..."| API
    API -->|"Prisma queries"| DB
```

---

## Component Architecture

```mermaid
graph LR
    subgraph Frontend
        Landing --> Login
        Landing --> Signup
        Login --> UserDash["UserDashboard"]
        Login --> IndustryDash["IndustryDashboard"]
        Login --> AdminDash["AdminDashboard"]
        AuthCtx["AuthContext\n(JWT + Theme)"] --> UserDash
        AuthCtx --> IndustryDash
        AuthCtx --> AdminDash
        AppShell["AppShell\n(Navbar + Aurora BG)"] --> UserDash
        AppShell --> IndustryDash
        AppShell --> AdminDash
    end

    subgraph Backend
        AuthRoutes["/api/auth"] --> AuthCtrl["authController\n(register, login, me)"]
        EmissionsRoutes["/api/emissions"] --> EmissionsCtrl["emissionsController\n(user, industry, history, admin/stats)"]
        JWTMiddleware["JWT Middleware"] --> EmissionsRoutes
    end

    subgraph Database
        Users[("users")]
        UserEmissions[("user_emissions")]
        IndustryEmissions[("industry_emissions")]
    end

    AuthCtrl --> Users
    EmissionsCtrl --> UserEmissions
    EmissionsCtrl --> IndustryEmissions
    UserEmissions --> Users
    IndustryEmissions --> Users
```

---

## Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant DB

    User->>Frontend: Enter email + password
    Frontend->>API: POST /api/auth/login
    API->>DB: findUnique({ email })
    DB-->>API: User record
    API->>API: bcrypt.compare(password, hash)
    API-->>Frontend: { token, user }
    Frontend->>Frontend: localStorage.setItem('token', ...)
    Frontend->>Frontend: Redirect based on role
    Note over Frontend: axios.defaults.headers.Authorization = Bearer {token}
    Frontend->>API: GET /api/emissions/history (with token)
    API->>API: jwt.verify(token)
    API-->>Frontend: Emission records
```

---

## Database ER Diagram

```mermaid
erDiagram
    USER {
        Int    id          PK
        String name
        String email       UK
        String passwordHash
        Role   role
        DateTime createdAt
    }

    USER_EMISSION {
        Int    id          PK
        Int    userId      FK
        String country
        Float  commuteDistanceKm
        Float  wasteGeneratedKg
        Float  electricityConsumedKwh
        Int    mealsPerDay
        Float  totalEmissionsKg
        DateTime createdAt
    }

    INDUSTRY_EMISSION {
        Int    id          PK
        Int    userId      FK
        String month
        String processType
        Float  energyConsumedKwh
        Float  rawMaterialUsedTons
        Float  totalWasteProducedTons
        Float  transportationDistanceKm
        Float  totalEmissionsKg
        DateTime createdAt
    }

    USER ||--o{ USER_EMISSION    : "logs"
    USER ||--o{ INDUSTRY_EMISSION : "logs"
```

---

## Frontend Component Tree

```
App
├── Landing (public, /)
├── Login   (public, /login)
├── Signup  (public, /signup)
└── [PrivateRoute]
    ├── UserDashboard    (INDIVIDUAL role, /user-dashboard)
    │   └── AppShell → Navbar + AnimatedBackground
    │       ├── KpiCard × 4
    │       ├── SustainabilityScore (radial gauge)
    │       ├── CustomSlider × 3
    │       ├── CategoryBreakdown (PieChart)
    │       ├── EmissionsTrend (AreaChart)
    │       └── DataTable (paginated history)
    ├── IndustryDashboard (INDUSTRY role, /industry-dashboard)
    │   └── AppShell
    │       ├── KpiCard × 4
    │       ├── Warning Banner (conditional)
    │       ├── CustomSlider × 3
    │       ├── CategoryBreakdown
    │       ├── BenchmarkBar
    │       └── DataTable
    └── AdminDashboard    (ADMIN role, /admin-dashboard)
        └── AppShell
            ├── KpiCard × 6
            ├── BenchmarkBar (avg comparison)
            ├── EmissionsTrend × 2
            └── DataTable × 2
```
