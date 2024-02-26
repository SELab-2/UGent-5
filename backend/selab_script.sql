DROP TABLE IF EXISTS Indiening CASCADE;
DROP TABLE IF EXISTS Status CASCADE;
DROP TABLE IF EXISTS Project CASCADE;
DROP TABLE IF EXISTS StudentGroep CASCADE;
DROP TABLE IF EXISTS Groep CASCADE;
DROP TABLE IF EXISTS StudentVak CASCADE;
DROP TABLE IF EXISTS LesgeverVak CASCADE;
DROP TABLE IF EXISTS Vak CASCADE;
DROP TABLE IF EXISTS WebsiteUser CASCADE;
DROP TABLE IF EXISTS Bestand CASCADE;
DROP TABLE IF EXISTS Status CASCADE;


CREATE TABLE WebsiteUser(
    azureObjectId text PRIMARY KEY,
    is_admin boolean
);

CREATE TABLE Vak (
    vak_id TEXT PRIMARY KEY,
    Naam TEXT NOT NULL
);

CREATE TABLE StudentVak (
    azureObjectId TEXT NOT NULL,
    vak_id TEXT NOT NULL,
    PRIMARY KEY (azureObjectId, vak_id),
    FOREIGN KEY (azureObjectId) REFERENCES WebsiteUser(azureObjectId) ON DELETE CASCADE,
    FOREIGN KEY (vak_id) REFERENCES Vak(vak_id) ON DELETE CASCADE
);

CREATE TABLE LesgeverVak (
    azureObjectId TEXT NOT NULL,
    vak_id TEXT NOT NULL,
    PRIMARY KEY (azureObjectId, vak_id),
    FOREIGN KEY (azureObjectId) REFERENCES WebsiteUser(azureObjectId) ON DELETE CASCADE,
    FOREIGN KEY (vak_id) REFERENCES Vak(vak_id) ON DELETE CASCADE
);


CREATE TABLE Project (
    id BIGSERIAL PRIMARY KEY,
    deadline DATE,
    naam TEXT NOT NULL,
    vak_id TEXT NOT NULL,
    FOREIGN KEY (vak_id) REFERENCES Vak(vak_id) ON DELETE SET NULL
);

CREATE TABLE Groep (
    groep_id BIGSERIAL PRIMARY KEY,
    groep TEXT NOT NULL,
    score BIGINT,
    project_id BIGINT,
    FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE
);


CREATE TABLE StudentGroep (
    azureObjectId TEXT NOT NULL,
    groep_id BIGINT NOT NULL,
    PRIMARY KEY (azureObjectId, groep_id),
    FOREIGN KEY (azureObjectId) REFERENCES WebsiteUser(azureObjectId) ON DELETE CASCADE,
    FOREIGN KEY (groep_id) REFERENCES Groep(groep_id) ON DELETE CASCADE
);

CREATE TABLE Status (
    status_id BIGSERIAL PRIMARY KEY,
    status_name TEXT NOT NULL UNIQUE
);

INSERT INTO Status (status_name) VALUES ('inProgress');
INSERT INTO Status (status_name) VALUES ('Accepted');
INSERT INTO Status (status_name) VALUES ('Denied');


CREATE TABLE Indiening (
    indiening_id BIGSERIAL PRIMARY KEY,
    datum TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    groep_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    status_id BIGINT NOT NULL DEFAULT 1, -- Default to 'inProgress'
    FOREIGN KEY (groep_id) REFERENCES Groep(groep_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES Status(status_id) ON DELETE RESTRICT
);

CREATE TABLE Bestand (
    bestand_id BIGSERIAL PRIMARY KEY,
    indiening_id BIGINT,  -- mag null zijn -> kunnen linken aan zowel indiening of project of standalone
    project_id BIGINT,    -- same
    -- TODO nog effectief bestand columns toevoegen ie file type etc.. not sure about exact implementatie rn
    FOREIGN KEY (indiening_id) REFERENCES Indiening(indiening_id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE SET NULL
);













