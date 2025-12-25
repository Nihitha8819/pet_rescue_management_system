
CREATE DATABASE IF NOT EXISTS pet_rescue
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pet_rescue;

--Table for users
CREATE TABLE roles (
    role_id     INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(30) NOT NULL UNIQUE  -- e.g., 'USER', 'ADMIN'
);
 
INSERT INTO roles (name) VALUES ('USER'), ('ADMIN');

--Table for pet species
CREATE TABLE pet_species (
    species_id  INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE   -- e.g., 'Dog', 'Cat'
);

--Table for pet breeds
CREATE TABLE pet_breeds (
    breed_id    INT AUTO_INCREMENT PRIMARY KEY,
    species_id  INT NOT NULL,
    name        VARCHAR(80) NOT NULL,
    CONSTRAINT fk_breed_species
        FOREIGN KEY (species_id) REFERENCES pet_species(species_id)
);

--Table to report_status (if the pet if found/not found)
CREATE TABLE report_status (
    status_id   INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(30) NOT NULL UNIQUE  -- e.g., 'OPEN', 'MATCHED', 'CLOSED', 'REJECTED'
);

INSERT INTO report_status (name)
VALUES ('OPEN'), ('MATCHED'), ('CLOSED'), ('REJECTED');

--Table for users 
CREATE TABLE users (
    user_id         INT AUTO_INCREMENT PRIMARY KEY,
    role_id         INT NOT NULL,                -- FK to roles
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(120) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,       -- store hashed password
    phone           VARCHAR(20),
    
    address_line1   VARCHAR(200),
    address_line2   VARCHAR(200),
    city            VARCHAR(80),
    state           VARCHAR(80),
    pincode         VARCHAR(10),
    
    is_active       TINYINT(1) DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

--Table fot pets
CREATE TABLE pets (
    pet_id          INT AUTO_INCREMENT PRIMARY KEY,
    owner_id        INT NULL,                    -- FK to users; NULL for stray/found pets
    species_id      INT NOT NULL,                -- FK to pet_species
    breed_id        INT NULL,                    -- FK to pet_breeds (optional)
    
    name            VARCHAR(80),
    gender          ENUM('MALE','FEMALE','UNKNOWN') DEFAULT 'UNKNOWN',
    color           VARCHAR(80),
    
    date_of_birth   DATE NULL,
    approx_age_years INT NULL,                   -- if DOB unknown
    
    size            ENUM('SMALL','MEDIUM','LARGE') DEFAULT 'MEDIUM',
    is_vaccinated   TINYINT(1) DEFAULT 0,
    is_neutered     TINYINT(1) DEFAULT 0,
    microchip_id    VARCHAR(80),
    
    special_notes   TEXT,
    
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pets_owner
        FOREIGN KEY (owner_id) REFERENCES users(user_id),
    CONSTRAINT fk_pets_species
        FOREIGN KEY (species_id) REFERENCES pet_species(species_id),
    CONSTRAINT fk_pets_breed
        FOREIGN KEY (breed_id) REFERENCES pet_breeds(breed_id)
);

--Table for pet photos
CREATE TABLE pet_photos (
    photo_id    INT AUTO_INCREMENT PRIMARY KEY,
    pet_id      INT NOT NULL,
    image_url   VARCHAR(255) NOT NULL,    -- path or URL to stored image
    is_primary  TINYINT(1) DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_photos_pet
        FOREIGN KEY (pet_id) REFERENCES pets(pet_id)
        ON DELETE CASCADE
);

--Tble for prt_reports
CREATE TABLE pet_reports (
    report_id       INT AUTO_INCREMENT PRIMARY KEY,
    pet_id          INT NULL,              -- link to pets table if we have/created a pet record
    reporter_id     INT NOT NULL,          -- user who raised the request
    report_type     ENUM('LOST', 'FOUND') NOT NULL,
    
    title           VARCHAR(150) NOT NULL,
    description     TEXT,
    
    last_seen_location VARCHAR(255),
    last_seen_date  DATE,
    contact_phone   VARCHAR(20),
    
    status_id       INT NOT NULL,          -- FK to report_status
    
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_reports_reporter
        FOREIGN KEY (reporter_id) REFERENCES users(user_id),
    CONSTRAINT fk_reports_pet
        FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
    CONSTRAINT fk_reports_status
        FOREIGN KEY (status_id) REFERENCES report_status(status_id)
);

USE pet_rescue;
SHOW TABLES;


