-- Drop the old column
ALTER TABLE lodash_parity
DROP COLUMN IF EXISTS weekly_downloads_num;

-- Add the new column if it doesn't exist
ALTER TABLE lodash_parity
ADD COLUMN IF NOT EXISTS weekly_downloads_num INTEGER;

-- Update the new column with calculated values
UPDATE lodash_parity
SET weekly_downloads_num = 
  CAST(
    CASE 
      WHEN weekly_downloads LIKE '%M' THEN 
        REPLACE(weekly_downloads, 'M', '')::NUMERIC * 1000000
      WHEN weekly_downloads LIKE '%K' THEN 
        REPLACE(weekly_downloads, 'K', '')::NUMERIC * 1000
      ELSE 
        weekly_downloads::NUMERIC
    END 
  AS INTEGER);

-- Create an index on the new column for better query performance
CREATE INDEX IF NOT EXISTS idx_weekly_downloads_num ON lodash_parity(weekly_downloads_num);