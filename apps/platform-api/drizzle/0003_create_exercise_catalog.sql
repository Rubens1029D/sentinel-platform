CREATE TYPE "public"."exercise_category" AS ENUM('strength', 'cardio', 'mobility', 'endurance', 'power', 'operational', 'recovery');--> statement-breakpoint
CREATE TYPE "public"."exercise_difficulty" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."exercise_impact" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(160) NOT NULL,
	"description" text NOT NULL,
	"category" "exercise_category" NOT NULL,
	"difficulty" "exercise_difficulty" NOT NULL,
	"impact" "exercise_impact" NOT NULL,
	"default_duration_seconds" integer,
	"default_repetitions" integer,
	"default_sets" integer DEFAULT 1 NOT NULL,
	"rest_seconds" integer DEFAULT 30 NOT NULL,
	"required_equipment" "equipment"[] DEFAULT ARRAY[]::equipment[] NOT NULL,
	"excluded_for_injuries" "injury_area"[] DEFAULT ARRAY[]::injury_area[] NOT NULL,
	"instructions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"safety_notes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_operational" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "exercises_slug_unique" ON "exercises" USING btree ("slug");