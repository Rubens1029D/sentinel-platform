CREATE TYPE "public"."biological_sex" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."equipment" AS ENUM('scba', 'jacket', 'helmet', 'boots', 'ladder', 'hose');--> statement-breakpoint
CREATE TYPE "public"."fitness_level" AS ENUM('very-low', 'low', 'medium', 'good', 'excellent');--> statement-breakpoint
CREATE TYPE "public"."injury_area" AS ENUM('knee', 'back', 'shoulder', 'ankle', 'none');--> statement-breakpoint
CREATE TYPE "public"."operational_role" AS ENUM('firefighter', 'industrial-brigade', 'civil-protection', 'rescuer');--> statement-breakpoint
CREATE TYPE "public"."training_goal" AS ENUM('weight-loss', 'endurance', 'initial-training', 'operational-readiness', 'promotion', 'competition');--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"age" integer NOT NULL,
	"sex" "biological_sex" NOT NULL,
	"height_cm" integer NOT NULL,
	"weight_kg" real NOT NULL,
	"role" "operational_role" NOT NULL,
	"experience_years" integer NOT NULL,
	"fitness_level" "fitness_level" NOT NULL,
	"injuries" "injury_area"[] DEFAULT ARRAY[]::injury_area[] NOT NULL,
	"equipment" "equipment"[] DEFAULT ARRAY[]::equipment[] NOT NULL,
	"available_minutes" integer NOT NULL,
	"goals" "training_goal"[] DEFAULT ARRAY[]::training_goal[] NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_user_id_unique" ON "profiles" USING btree ("user_id");