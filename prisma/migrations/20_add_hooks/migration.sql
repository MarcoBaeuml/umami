-- CreateTable
CREATE TABLE "hook" (
    "hook_id" UUID NOT NULL,
    "website_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "trigger_type" VARCHAR(20) NOT NULL,
    "trigger_config" JSONB NOT NULL,
    "event_name" VARCHAR(50) NOT NULL,
    "event_data" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "hook_pkey" PRIMARY KEY ("hook_id")
);

-- CreateIndex
CREATE INDEX "hook_website_id_idx" ON "hook"("website_id");
CREATE INDEX "hook_website_id_enabled_idx" ON "hook"("website_id", "enabled");
