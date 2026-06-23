import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const applicationStatus = pgEnum("application_status", [
  "applied",
  "oa",
  "interview",
  "hr_round",
  "rejected",
  "offer",
  "accepted",
]);

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("user_id", { length: 255 }).notNull(), // Clerk user id
    companyName: varchar("company_name", { length: 255 }).notNull(),
    role: varchar("role", { length: 255 }).notNull(),
    status: applicationStatus("status").notNull().default("applied"),
    jobUrl: text("job_url"),
    location: varchar("location", { length: 255 }),
    salary: varchar("salary", { length: 100 }),
    notes: text("notes"),
    appliedDate: timestamp("applied_date", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("applications_user_id_idx").on(table.userId),
    index("applications_user_id_status_idx").on(table.userId, table.status),
    index("applications_applied_date_idx").on(table.appliedDate.desc()),
  ]
);

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
