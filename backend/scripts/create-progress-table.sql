-- Run this in your MySQL database to add progress recording per user.

CREATE TABLE IF NOT EXISTS progress_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    current_weight DECIMAL(5,2) NULL,
    target_weight DECIMAL(5,2) NULL,

    bust DECIMAL(5,2) NULL,
    talie DECIMAL(5,2) NULL,
    solduri DECIMAL(5,2) NULL,
    coapse DECIMAL(5,2) NULL,

    age INT NULL,
    height DECIMAL(5,2) NULL,
    activity_level VARCHAR(50) NULL,
    sleep_hours DECIMAL(4,2) NULL,
    water_liters DECIMAL(4,2) NULL,
    meals_per_day INT NULL,

    photo_front_url VARCHAR(255) NULL,
    photo_side_url VARCHAR(255) NULL,
    photo_back_url VARCHAR(255) NULL,

    CONSTRAINT fk_progress_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);
