CREATE TYPE "public"."application_status" AS ENUM('applied', 'oa', 'interview', 'hr_round', 'rejected', 'offer', 'accepted');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"status" "application_status" DEFAULT 'applied' NOT NULL,
	"job_url" text,
	"location" varchar(255),
	"salary" varchar(100),
	"notes" text,
	"applied_date" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "applications_user_id_idx" ON "applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "applications_user_id_status_idx" ON "applications" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "applications_applied_date_idx" ON "applications" USING btree ("applied_date" DESC NULLS LAST);