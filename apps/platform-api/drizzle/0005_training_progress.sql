ALTER TABLE "training_session_exercises" ADD COLUMN "completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "training_session_exercises" ADD COLUMN "completed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "training_session_exercises" ADD COLUMN "actual_repetitions" integer;--> statement-breakpoint
ALTER TABLE "training_session_exercises" ADD COLUMN "actual_duration_seconds" integer;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "completed_at" timestamp with time zone;