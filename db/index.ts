import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return drizzle(neon(url), { schema });
}

type DB = ReturnType<typeof createDb>;

let instance: DB | null = null;

/**
 * Lazy Drizzle client. The connection (and the DATABASE_URL check) is deferred
 * until the first query at request time — so `next build` never needs the
 * database secret, and a missing/invalid URL surfaces as a caught runtime error
 * instead of crashing the build.
 */
export const db = new Proxy({} as DB, {
  get(_target, prop, receiver) {
    instance ??= createDb();
    const value = Reflect.get(instance as object, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
