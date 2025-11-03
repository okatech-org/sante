import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env files
// This ensures VITE_* vars are available during build even if the sandbox misses them
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins: any[] = [react()];
  if (mode === "development") {
    try {
      const { componentTagger } = await import("lovable-tagger");
      plugins.push(componentTagger());
    } catch {}
  }

  // Safe fallbacks to prevent runtime "supabaseUrl is required" crashes
  const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://bolidzesitkkfojdyuyg.supabase.co";
  const VITE_SUPABASE_PUBLISHABLE_KEY =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbGlkemVzaXRra2ZvamR5dXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTMxMzUsImV4cCI6MjA3NDkyOTEzNX0.bKmwG96ju8nRHLOizeMtp-VleN658wI6CpOkCChgc2A";
  const VITE_SUPABASE_PROJECT_ID = process.env.VITE_SUPABASE_PROJECT_ID || "bolidzesitkkfojdyuyg";

  return {
    base: '/',
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(VITE_SUPABASE_URL),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(VITE_SUPABASE_PUBLISHABLE_KEY),
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(VITE_SUPABASE_PROJECT_ID),
    },
  };
});
