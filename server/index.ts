import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import connectPgSimple from "connect-pg-simple";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Inisialisasi aplikasi Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Konfigurasi Session Store dengan PostgreSQL
const PgStore = connectPgSimple(session);
app.use(
  session({
    store: new PgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false,
      tableName: 'sessions',
    }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // Sesi berlaku selama 30 hari
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Gunakan cookie aman di produksi
    },
  }),
);

// Inisialisasi Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Middleware untuk logging (opsional, tapi berguna)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      const duration = Date.now() - start;
      log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Fungsi utama untuk menjalankan server
(async () => {
  const server = await registerRoutes(app);

  // Middleware untuk error handling
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Konfigurasi Vite untuk development atau serve file statis untuk produksi
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Menjalankan server
  const port = 5000;
  server.listen({
    port,
    host: "localhost", // Gunakan localhost untuk kompatibilitas Windows
  }, () => {
    log(`serving on port ${port}`);
  });
})();
