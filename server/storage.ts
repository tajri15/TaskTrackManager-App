import {
  users,
  tasks,
  type User,
  type UpsertUser,
  type Task,
  type InsertTask,
  type UpdateTask,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export class DatabaseStorage {
  // === FUNGSI USER ===

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: { ...userData, updatedAt: new Date() },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Omit<UpsertUser, 'id' | 'updatedAt' | 'createdAt' | 'profileImageUrl' | 'lastName'>): Promise<User> {
    const [user] = await db.insert(users).values({
      id: `user_${nanoid()}`,
      ...userData,
    }).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // === FUNGSI TASK ===

  async getTasks(userId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async createTask(task: InsertTask, userId: string): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values({ ...task, userId })
      .returning();
    return newTask;
  }

  async updateTask(id: number, task: UpdateTask, userId: string): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...task, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return result.rowCount > 0;
  }

  async toggleTaskComplete(id: number, userId: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    if (!task) return undefined;
    const [updatedTask] = await db
      .update(tasks)
      .set({ completed: !task.completed, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return updatedTask;
  }

  async markAllTasksComplete(userId: string): Promise<void> {
    await db
      .update(tasks)
      .set({ completed: true, updatedAt: new Date() })
      .where(and(eq(tasks.userId, userId), eq(tasks.completed, false)));
  }

  async clearCompletedTasks(userId: string): Promise<void> {
    await db
      .delete(tasks)
      .where(and(eq(tasks.userId, userId), eq(tasks.completed, true)));
  }
  
  async getTaskOwner(taskId: number): Promise<string | undefined> {
    const [task] = await db
      .select({ userId: tasks.userId })
      .from(tasks)
      .where(eq(tasks.id, taskId));
    return task?.userId;
  }
}

export const storage = new DatabaseStorage();
