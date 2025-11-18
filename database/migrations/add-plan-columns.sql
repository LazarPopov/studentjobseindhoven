-- Migration: Add pricing plan columns to employer_job_submissions
-- Run this if you already have the table created

ALTER TABLE employer_job_submissions 
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'basic' NOT NULL,
ADD COLUMN IF NOT EXISTS plan_price_eur TEXT;

-- Optional: Update existing rows to have default plan
UPDATE employer_job_submissions 
SET plan = 'basic' 
WHERE plan IS NULL;

-- Add comment for clarity
COMMENT ON COLUMN employer_job_submissions.plan IS 'Selected pricing plan: basic, featured, or premium';
COMMENT ON COLUMN employer_job_submissions.plan_price_eur IS 'Price in EUR for the selected plan';

