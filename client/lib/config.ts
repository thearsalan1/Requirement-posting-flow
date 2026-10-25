export type Category = "planner" | "performer" | "crew";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "number" | "list"; 
  optional?: boolean;
};

export const CATEGORIES = [
  { value: "planner", label: "Event Planner", icon: "📋", desc: "Plan & manage the event" },
  { value: "performer", label: "Performer", icon: "🎤", desc: "Artists, DJs, singers" },
  { value: "crew", label: "Crew", icon: "🛠️", desc: "Sound, lights, staff" },
];

// [Step 2 fields, Step 3 fields]
export const CATEGORY_FIELDS: Record<Category, [FieldConfig[], FieldConfig[]]> = {
  planner: [
    [
      { name: "expectedGuests", label: "Expected Guests", type: "number" },
      { name: "budget", label: "Budget (₹)", type: "number" },
    ],
    [
      { name: "servicesNeeded", label: "Services Needed (comma separated)", type: "list" },
      { name: "theme", label: "Theme", type: "text", optional: true },
    ],
  ],
  performer: [
    [
      { name: "performanceType", label: "Performance Type (DJ, Singer...)", type: "text" },
      { name: "durationMins", label: "Duration (mins)", type: "number" },
    ],
    [
      { name: "techProvided", label: "Tech Provided at Venue", type: "text", optional: true },
      { name: "budget", label: "Budget (₹)", type: "number" },
    ],
  ],
  crew: [
    [
      { name: "roleNeeded", label: "Role Needed (Sound, Lights...)", type: "text" },
      { name: "crewCount", label: "Crew Count", type: "number" },
    ],
    [
      { name: "experienceRequired", label: "Experience Required (years)", type: "number" },
      { name: "ratePerDay", label: "Rate per Day (₹)", type: "number" },
    ],
  ],
};