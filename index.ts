
import "dotenv/config";
import express from "express";
import { prisma } from "./prisma.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";
import { router as usersRoute } from "./routes/user.route.js";
import { router as categoryRoute } from "./routes/category.route.js";

const app = express();
app.use(cors());
app.options("*all", cors());

app.use(express.json());
// routes
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

app.get("/", (req, res, next) => {
  res.send("test, route is mounted");
});
app.use('/api/v1/users/', usersRoute)
app.use('/api/v1/categories/', categoryRoute)

// 404 handler: must come after all routes.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Express error handler: must come last.
app.use(errorHandler);

// Process-level error handlers.
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);

  // Investigate and fix the rejected Promise.
  // Use a process manager to restart the app if it exits.
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);

  // The process may be in an unsafe state.
  process.exit(1);
});

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await prisma.$connect();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
    await prisma.$disconnect().catch(console.error);
  }
}

void startServer();
