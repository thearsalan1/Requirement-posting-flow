import { z } from "zod";

const basics = z.object({
  eventName: z.string().min(2),
  eventType: z.string().min(2),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  location: z.string().min(2),
  venue: z.string().optional(),
});

const planner = z.object({
  category: z.literal("planner"),
  details: z.object({
    expectedGuests: z.number().int().positive(),
    budget: z.number().positive(),
    servicesNeeded: z.array(z.string()).min(1),
    theme: z.string().optional(),
  }),
});

const performer = z.object({
  category: z.literal("performer"),
  details: z.object({
    performanceType: z.string().min(2),
    durationMins: z.number().int().positive(),
    techProvided: z.string().optional(),
    budget: z.number().positive(),
  }),
});

const crew = z.object({
  category: z.literal("crew"),
  details: z.object({
    roleNeeded: z.string().min(2),
    crewCount: z.number().int().positive(),
    experienceRequired: z.number().int().min(0),
    ratePerDay: z.number().positive(),
  }),
});

export const requirementSchema = basics
  .and(z.discriminatedUnion("category", [planner, performer, crew]))
  .refine((d) => !d.endDate || d.endDate >= d.startDate, {
    message: "End date must be greater then start date",
    path: ["endDate"],
  });