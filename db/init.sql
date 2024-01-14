CREATE SCHEMA sns_db;

-- create table of users
CREATE TABLE sns_db.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL
    );

-- create table of audio files
CREATE TABLE sns_db.audio_files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL UNIQUE,
    file_path VARCHAR(255) NOT NULL UNIQUE,
    file_type VARCHAR(255) NOT NULL,
    file_duration VARCHAR(255) NOT NULL,
    file_bitrate VARCHAR(255) NOT NULL,
    file_sample_rate VARCHAR(255) NOT NULL,
    file_size VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES sns_db.users (id)
    );

-- add default user to users table
INSERT INTO sns_db.users (username, password, name, phone_number)
VALUES ('admin', 'd3f4ult@', 'admin', '80081355');