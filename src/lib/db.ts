import { PrismaClient } from "@prisma/client";

const isDev = process.env.NODE_ENV === "development";

const databaseUrl = isDev
  ? (process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/clinkor_dev?schema=public")
  : (process.env.PRODUCTION_DATABASE_URL || process.env.DATABASE_URL || "");

const isSQLite = databaseUrl.startsWith("file:");

const jsonFields = ["socialLinks", "templateSettings", "customSchema", "settings"];

function stringifyJsonFieldsDeep(item: any) {
  if (!item || typeof item !== "object") return;
  
  if (Array.isArray(item)) {
    for (const sub of item) {
      stringifyJsonFieldsDeep(sub);
    }
    return;
  }
  
  for (const key of Object.keys(item)) {
    if (jsonFields.includes(key) && item[key] !== undefined && item[key] !== null && typeof item[key] === "object") {
      item[key] = JSON.stringify(item[key]);
    } else if (item[key] && typeof item[key] === "object") {
      stringifyJsonFieldsDeep(item[key]);
    }
  }
}

function parseJsonFieldsDeep(item: any) {
  if (!item || typeof item !== "object") return;
  
  if (Array.isArray(item)) {
    for (const sub of item) {
      parseJsonFieldsDeep(sub);
    }
    return;
  }
  
  for (const key of Object.keys(item)) {
    if (jsonFields.includes(key) && item[key] !== undefined && item[key] !== null && typeof item[key] === "string") {
      try {
        item[key] = JSON.parse(item[key]);
      } catch (e) {
        // Keep as string if parsing fails
      }
    } else if (item[key] && typeof item[key] === "object") {
      parseJsonFieldsDeep(item[key]);
    }
  }
}

const prismaClientSingleton = () => {
  const baseDb = new PrismaClient({
    log: isDev ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  return baseDb.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (args) {
            const isWrite = ["create", "update", "upsert", "updateMany", "createMany"].includes(operation);
            if (isWrite) {
              const writeArgs = args as any;
              if (writeArgs.data) stringifyJsonFieldsDeep(writeArgs.data);
              if (writeArgs.create) stringifyJsonFieldsDeep(writeArgs.create);
              if (writeArgs.update) stringifyJsonFieldsDeep(writeArgs.update);
            }
          }

          const result = await query(args);

          if (result) {
            parseJsonFieldsDeep(result);
          }

          return result;
        },
      },
    },
  }) as unknown as PrismaClient;
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}
