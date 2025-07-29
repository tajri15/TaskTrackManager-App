import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { isAuthenticated } from "./auth";
import { insertTaskSchema, updateTaskSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // --- RUTE AUTENTIKASI & PROFIL ---
  app.post('/api/auth/register', async (req, res) => {
    const { email, password, firstName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password dibutuhkan." });
    }
    try {
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Email sudah digunakan." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await storage.createUser({ email, password: hashedPassword, firstName });
      res.status(201).json({ message: "User berhasil dibuat." });
    } catch (error) {
      res.status(500).json({ message: "Registrasi gagal." });
    }
  });

  app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
  });

  app.get('/api/auth/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/login');
      });
    });
  });

  app.get('/api/auth/user', isAuthenticated, (req, res) => {
    res.json(req.user);
  });

  app.patch('/api/auth/me', isAuthenticated, async (req: any, res) => {
    try {
      const { firstName } = req.body;
      const updatedUser = await storage.updateUser(req.user.id, { firstName });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Gagal memperbarui profil." });
    }
  });

  app.post('/api/auth/change-password', isAuthenticated, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await storage.getUser(req.user.id);
      if (!user || !user.password) return res.status(404).json({ message: "User tidak ditemukan." });
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(401).json({ message: "Password saat ini salah." });
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(req.user.id, { password: hashedNewPassword });
      res.status(200).json({ message: "Password berhasil diperbarui." });
    } catch (error) {
      res.status(500).json({ message: "Gagal mengubah password." });
    }
  });

  // --- RUTE TASKS ---
  app.get('/api/tasks', isAuthenticated, async (req: any, res) => {
    const tasks = await storage.getTasks(req.user.id);
    res.json(tasks);
  });

  app.post('/api/tasks', isAuthenticated, async (req: any, res) => {
    const result = insertTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: fromZodError(result.error).message });
    }
    const task = await storage.createTask(result.data, req.user.id);
    res.status(201).json(task);
  });

  app.patch('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    const taskId = parseInt(req.params.id);
    const result = updateTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: fromZodError(result.error).message });
    }
    const task = await storage.updateTask(taskId, result.data, req.user.id);
    res.json(task);
  });

  app.delete('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    const taskId = parseInt(req.params.id);
    await storage.deleteTask(taskId, req.user.id);
    res.status(204).send();
  });

  app.patch('/api/tasks/:id/toggle', isAuthenticated, async (req: any, res) => {
    const taskId = parseInt(req.params.id);
    const task = await storage.toggleTaskComplete(taskId, req.user.id);
    res.json(task);
  });

  app.post('/api/tasks/mark-all-complete', isAuthenticated, async (req: any, res) => {
    await storage.markAllTasksComplete(req.user.id);
    res.status(204).send();
  });

  app.delete('/api/tasks/completed', isAuthenticated, async (req: any, res) => {
    await storage.clearCompletedTasks(req.user.id);
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
