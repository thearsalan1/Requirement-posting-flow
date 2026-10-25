# Requirement Posting Flow

A 4-step flow to post an event requirement for an **Event Planner**, **Performer**, or **Crew**.

**Stack:** Next.js (TypeScript) + Node.js + Express + MongoDB

## Flow

1. **Event Basics:** name, type, date / date range, location, optional venue, category
2. **Step 2:** category-specific fields (part 1)
3. **Step 3:** category-specific fields (part 2)
4. **Review & Submit:** data is saved to MongoDB under the selected category

## Setup

### Backend
```bash
cd server
npm install
```
Create `.env`:
```
MONGO_URI=mongodb-atlas-uri
```
```bash
npm run dev   # runs on http://localhost:5000
```

### Frontend
```bash
cd client
npm install
```
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
```bash
npm run dev   # runs on http://localhost:3000
```

## Category-specific fields (assumed)

| Category  | Step 2                         | Step 3                              |
|-----------|--------------------------------|-------------------------------------|
| Planner   | expectedGuests, budget         | servicesNeeded, theme (optional)    |
| Performer | performanceType, durationMins  | techProvided (optional), budget     |
| Crew      | roleNeeded, crewCount          | experienceRequired, ratePerDay      |

The assignment did not specify exact fields, so these were chosen as sensible requirement fields.

## API

### Create a requirement
`POST /api/requirements`

Each requirement is stored with a `category` field (`planner`, `performer` or `crew`), and its category-specific fields are stored inside `details`.

### Verify that data is saved

Get all requirements:
```
GET http://localhost:5000/api/requirements
```

Get requirements of one category:
```
GET http://localhost:5000/api/requirements?category=planner
GET http://localhost:5000/api/requirements?category=performer
GET http://localhost:5000/api/requirements?category=crew
```


## Validation

- Frontend: required fields and date range check at every step
- Backend: Zod validates the payload based on the selected category