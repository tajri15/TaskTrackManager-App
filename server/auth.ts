import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import type { User } from "@shared/schema";
import type { Request, Response, NextFunction } from "express";

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return done(null, false, { message: 'Email tidak ditemukan.' });
    }
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return done(null, false, { message: 'Password salah.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};