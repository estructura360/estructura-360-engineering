import {
  projects,
  calculations,
  scheduleTasks,
  constructionLogs,
  type Project,
  type InsertProject,
  type Calculation,
  type InsertCalculation,
  type ScheduleTask,
  type InsertTask,
  type ConstructionLog,
  type InsertLog,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Projects
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;

  // Calculations
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getCalculationsByProject(projectId: number): Promise<Calculation[]>;
  deleteCalculation(id: number): Promise<void>;

  // Schedule
  getTasksByProject(projectId: number): Promise<ScheduleTask[]>;
  createTask(task: InsertTask): Promise<ScheduleTask>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<ScheduleTask>;
  deleteTask(id: number): Promise<void>;

  // Logs
  getLogsByProject(projectId: number): Promise<ConstructionLog[]>;
  createLog(log: InsertLog): Promise<ConstructionLog>;
}

export class DatabaseStorage implements IStorage {
  // ... existing methods ...

  // Schedule
  async getTasksByProject(projectId: number): Promise<ScheduleTask[]> {
    return await db.select().from(scheduleTasks).where(eq(scheduleTasks.projectId, projectId));
  }

  async createTask(task: InsertTask): Promise<ScheduleTask> {
    const [newTask] = await db.insert(scheduleTasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<ScheduleTask> {
    const [updated] = await db.update(scheduleTasks).set(task).where(eq(scheduleTasks.id, id)).returning();
    return updated;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(scheduleTasks).where(eq(scheduleTasks.id, id));
  }

  // Logs
  async getLogsByProject(projectId: number): Promise<ConstructionLog[]> {
    return await db.select().from(constructionLogs).where(eq(constructionLogs.projectId, projectId));
  }

  async createLog(log: InsertLog): Promise<ConstructionLog> {
    const [newLog] = await db.insert(constructionLogs).values(log).returning();
    return newLog;
  }
}

export const storage = new DatabaseStorage();
