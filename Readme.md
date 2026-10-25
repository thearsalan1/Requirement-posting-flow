# Requirement Posting Flow

A 4-step flow to post an event requirement for an **Event Planner**, **Performer**, or **Crew**.

**Stack:** Next.js (TypeScript) + Node.js + Express + MongoDB

## Live Demo

- Frontend: https://requirement-posting-flow-delta.vercel.app
- Backend: https://requirement-posting-flow-h00q.onrender.com
- Verify saved data: https://requirement-posting-flow-h00q.onrender.com/api/requirements

> The backend runs on a free tier, so the first request after a period of inactivity may take ~40 seconds to wake up.

## Flow

1. **Event Basics:** name, type, date / date range, location, optional venue, category
2. **Step 2:** category-specific fields (part 1)
3. **Step 3:** category-specific fields (part 2)
4. **Review & Submit:** data is saved to MongoDB under the selected category

## Category-specific fields (assumed)

The assignment did not specify exact fields, so these were chosen as sensible requirement fields.

| Category  | Step 2                        | Step 3                           |
|-----------|-------------------------------|----------------------------------|
| Planner   | expectedGuests, budget        | servicesNeeded, theme (optional) |
| Performer | performanceType, durationMins | techProvided (optional), budget  |
| Crew      | roleNeeded, crewCount         | experienceRequired, ratePerDay   |

Steps 2 and 3 are driven by a single config (`client/lib/config.ts`), so the form adapts automatically to the selected category.

## How data is stored

Each requirement is saved in one MongoDB collection with:

- `category`: `planner`, `performer` or `crew` (indexed)
- `details`: the category-specific fields from Steps 2 and 3
- basic fields: `eventName`, `eventType`, `startDate`, `endDate`, `location`, `venue`

## API

### Create a requirement

`POST /api/requirements`

### Verify that data is saved

```
GET /api/requirements
GET /api/requirements?category=planner
GET /api/requirements?category=performer
GET /api/requirements?category=crew
```

Or open MongoDB Compass / Atlas and check the `requirements` collection.

## Validation

- **Frontend:** required fields and date range check at every step
- **Backend:** Zod validates the payload based on the selected category and rejects invalid data with a 400 error

## Run Locally

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev   # http://localhost:5000
```

`server/.env`:

```
MONGO_URI=mongodb://localhost:27017/requirements_db
FRONTEND_URL=http://localhost:3000
```

### Frontend

```bash
cd client
npm install
cp .env.example .env.local
npm run dev   # http://localhost:3000
```

`client/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Deployment

| Part     | Platform      | Notes                                                              |
|----------|---------------|--------------------------------------------------------------------|
| Database | MongoDB Atlas | Network Access allows `0.0.0.0/0`                                  |
| Backend  | Render        | Root: `server`, Build: `npm install --include=dev && npm run build`, Start: `npm start` |
| Frontend | Vercel        | Root: `client`                                                     |

Environment variables:

- Render: `MONGO_URI`, `FRONTEND_URL` (Vercel URL, without a trailing slash)
- Vercel: `NEXT_PUBLIC_API_URL` (Render URL, without a trailing slash)

## Project Structure

```
server/
  src/
    model.ts      # Mongoose model
    schema.ts     # Zod validation
  index.ts      # Express app, routes  
client/
  app/page.tsx          # 4-step form
  components/           # Field, Stepper
  lib/config.ts         # categories and category-wise fields
```