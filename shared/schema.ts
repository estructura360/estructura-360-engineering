import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
// ===============================
// INSERT SCHEMAS (ZOD MANUAL)
// ===============================

export const insertProjectSchema = z.object({
  clientName: z.string().min(1),
  profitMargin: z.string().optional(),
  laborCostPerM2: z.string().optional(),
});

export const insertCalculationSchema = z.object({
  projectId: z.number(),
  type: z.string(),
  area: z.string(),
  specs: z.unknown(),
  results: z.unknown(),
});

export const insertTaskSchema = z.object({
  projectId: z.number(),
  title: z.string(),
  startDate: z.union([z.string(), z.date()]),
  endDate: z.union([z.string(), z.date()]),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  priority: z.string().optional(),
  dependencies: z.array(z.number()).optional(),
  status: z.string().optional(),
});

export const insertLogSchema = z.object({
  projectId: z.number(),
  notes: z.string().optional(),
  photoUrl: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

// === TABLE DEFINITIONS ===

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  profitMargin: decimal("profit_margin").default("20.0"),
  laborCostPerM2: decimal("labor_cost_per_m2").default("0.0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  type: text("type").notNull(),
  area: decimal("area").notNull(),
  specs: jsonb("specs").notNull(),
  results: jsonb("results").notNull(),
});

export const scheduleTasks = pgTable("schedule_tasks", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  title: text("title").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  priority: text("priority").default("medium"),
  dependencies: integer("dependencies").array(),
  status: text("status").default("pending"),
});

export const constructionLogs = pgTable("construction_logs", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  notes: text("notes"),
  photoUrl: text("photo_url"),
  latitude: decimal("latitude"),
  longitude: decimal("longitude"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// === RELATIONS ===
export const projectsRelations = relations(projects, ({ many }) => ({
  calculations: many(calculations),
  tasks: many(scheduleTasks),
  logs: many(constructionLogs),
}));

export const calculationsRelations = relations(calculations, ({ one }) => ({
  project: one(projects, {
    fields: [calculations.projectId],
    references: [projects.id],
  }),
}));

export const scheduleTasksRelations = relations(scheduleTasks, ({ one }) => ({
  project: one(projects, {
    fields: [scheduleTasks.projectId],
    references: [projects.id],
  }),
}));

export const constructionLogsRelations = relations(constructionLogs, ({ one }) => ({
  project: one(projects, {
    fields: [constructionLogs.projectId],
    references: [projects.id],
  }),
}));

// === EXPLICIT API CONTRACT TYPES ===
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type ScheduleTask = typeof scheduleTasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type ConstructionLog = typeof constructionLogs.$inferSelect;
export type InsertLog = z.infer<typeof insertLogSchema>;

// Inputs
export type CreateProjectRequest = InsertProject;
export type AddCalculationRequest = InsertCalculation;

// Specs Types for strict typing in frontend/backend logic
export const SlabSpecsSchema = z.object({
  beamDepth: z.enum(["P-15", "P-20", "P-25"]),
  polystyreneDensity: z.number().min(10).max(25),
});

export const WallSpecsSchema = z.object({
  wallType: z.enum(["load-bearing", "partition", "ceiling", "retaining"]),
});

export type SlabSpecs = z.infer<typeof SlabSpecsSchema>;
export type WallSpecs = z.infer<typeof WallSpecsSchema>;
