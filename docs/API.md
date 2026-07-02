# API Reference

Base URL (local): `http://localhost:5000/api`

All authenticated endpoints require `Authorization: Bearer <JWT_TOKEN>` header.

---

## Authentication

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name":     "Jane Smith",
  "email":    "jane@example.com",
  "password": "securepass123",
  "role":     "INDIVIDUAL"
}
```
Roles: `INDIVIDUAL` | `INDUSTRY` | `ADMIN`

**Response 201:**
```json
{
  "token": "<jwt>",
  "user":  { "id": 1, "name": "Jane Smith", "email": "jane@example.com", "role": "INDIVIDUAL" }
}
```

**Errors:** `400` — missing fields / email taken / invalid role

---

### POST /api/auth/login
Authenticate and receive a JWT token.

**Request Body:**
```json
{ "email": "jane@example.com", "password": "securepass123" }
```

**Response 200:**
```json
{
  "token": "<jwt>",
  "user":  { "id": 1, "name": "Jane Smith", "email": "jane@example.com", "role": "INDIVIDUAL" }
}
```

**Errors:** `401` — invalid credentials

---

### GET /api/auth/me
Returns the currently authenticated user profile.

**Auth:** Required

**Response 200:**
```json
{ "id": 1, "name": "Jane Smith", "email": "jane@example.com", "role": "INDIVIDUAL" }
```

---

## Emissions — Individual

### POST /api/emissions/user
Log an individual carbon footprint calculation.

**Auth:** Required · **Role:** `INDIVIDUAL`

**Request Body:**
```json
{
  "country":               "India",
  "commuteDistanceKm":     25,
  "wasteGeneratedKg":      10,
  "electricityConsumedKwh": 150,
  "mealsPerDay":           3
}
```

**Emission Formulas:**
| Factor | Formula |
|--------|---------|
| Commute | `commuteDistanceKm × 0.05` |
| Waste | `wasteGeneratedKg × 0.1` |
| Electricity | `electricityConsumedKwh × 0.4` |
| Meals | `mealsPerDay × 0.3` |
| **Total** | Sum of above, rounded to 3 decimal places |

**Response 201:**
```json
{
  "message": "Individual emissions calculated and recorded successfully.",
  "data": { "id": 42, "userId": 1, "country": "India", "totalEmissionsKg": 65.25, "createdAt": "2026-06-22T..." }
}
```

---

## Emissions — Industry

### POST /api/emissions/industry
Log an industrial process emission calculation.

**Auth:** Required · **Role:** `INDUSTRY`

**Request Body:**
```json
{
  "month":                   "June",
  "processType":             "Manufacturing",
  "energyConsumedKwh":       25000,
  "rawMaterialUsedTons":     5.5,
  "totalWasteProducedTons":  3000,
  "transportationDistanceKm": 1500
}
```

**Emission Formulas:**
| Factor | Formula |
|--------|---------|
| Energy | `energyConsumedKwh × 0.92` |
| Materials | `rawMaterialUsedTons × 1.5` |
| Waste | `totalWasteProducedTons × 0.2` |
| Transport | `transportationDistanceKm × 0.05` |
| **Total** | Sum of above, rounded to 3 decimal places |

**Response 201:**
```json
{
  "message": "Industry emissions calculated and recorded successfully.",
  "data": { "id": 7, "totalEmissionsKg": 23683.25, ... },
  "highEmissionWarning": false
}
```
`highEmissionWarning: true` when total > 45,000 kg.

---

## Emissions — History

### GET /api/emissions/history
Returns the authenticated user's emission history.

**Auth:** Required · **Role:** `INDIVIDUAL` or `INDUSTRY`

Returns `UserEmission[]` for INDIVIDUAL, `IndustryEmission[]` for INDUSTRY, ordered by `createdAt DESC`.

---

## Admin

### GET /api/emissions/admin/stats
Returns global aggregate statistics.

**Auth:** Required · **Role:** `ADMIN`

**Response 200:**
```json
{
  "summary": {
    "totalUsers": 3,
    "individualUsersCount": 1,
    "industryUsersCount": 1,
    "totalUserEmissionsKg": 130.5,
    "averageUserEmissionKg": 65.25,
    "totalIndustryEmissionsKg": 47366.5,
    "averageIndustryEmissionKg": 23683.25
  },
  "recentIndividualLogs": [...],
  "recentIndustryLogs": [...]
}
```

---

## Error Format

All errors return:
```json
{ "error": "Human readable error message" }
```

| Code | Meaning |
|------|---------|
| 400 | Bad request / validation failure |
| 401 | Missing or expired token |
| 403 | Insufficient role permissions |
| 404 | Route not found |
| 500 | Internal server error |
