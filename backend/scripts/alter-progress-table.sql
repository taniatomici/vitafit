-- Run this if you already have progress_records (fix column types and switch to file paths).
ALTER TABLE progress_records
  MODIFY COLUMN sleep_hours DECIMAL(4,2) NULL,
  MODIFY COLUMN water_liters DECIMAL(4,2) NULL,
  MODIFY COLUMN photo_front_url VARCHAR(255) NULL,
  MODIFY COLUMN photo_side_url VARCHAR(255) NULL,
  MODIFY COLUMN photo_back_url VARCHAR(255) NULL;
