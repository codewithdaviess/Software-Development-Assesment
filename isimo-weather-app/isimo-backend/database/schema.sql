-- Reset sequences to start from 1
ALTER SEQUENCE locations_id_seq RESTART WITH 1;
ALTER SEQUENCE weather_snapshots_id_seq RESTART WITH 1;
ALTER SEQUENCE user_preferences_id_seq RESTART WITH 1;

-- Locations
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Weather Snapshots
CREATE TABLE IF NOT EXISTS weather_snapshots (
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id) ON DELETE CASCADE,
    temperature DECIMAL(5,2),
    humidity INT,
    wind_speed DECIMAL(5,2),
    description VARCHAR(255),
    snapshot_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    unit VARCHAR(10) DEFAULT 'metric',
    refresh_interval INT DEFAULT 60, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compact IDs after deletion (remove gaps)
CREATE OR REPLACE FUNCTION compact_location_ids()
RETURNS void AS $$
BEGIN
    WITH numbered_rows AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id
        FROM locations
        WHERE deleted_at IS NULL
    )
    UPDATE locations
    SET id = numbered_rows.new_id
    FROM numbered_rows
    WHERE locations.id = numbered_rows.id AND locations.deleted_at IS NULL;
    
    -- Reset sequence to max id + 1
    EXECUTE 'SELECT SETVAL(''locations_id_seq'', (SELECT MAX(id) FROM locations) + 1)';
END;
$$ LANGUAGE plpgsql;
