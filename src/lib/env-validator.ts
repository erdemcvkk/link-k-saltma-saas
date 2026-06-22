const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "SUPER_ADMIN_TOKEN",
  "ADMIN_TOKEN",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY"
];

export function validateEnv() {
  const missing: string[] = [];

  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error("\x1b[31m%s\x1b[0m", "CRITICAL ERROR: Missing environment variables:");
    for (const key of missing) {
      console.error("\x1b[31m%s\x1b[0m", ` - ${key}`);
    }
    throw new Error(`Build failed: Missing environment variables: ${missing.join(", ")}`);
  }
}

// Automatically validate when imported
validateEnv();
