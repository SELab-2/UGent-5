DROP TRIGGER IF EXISTS trg_check_submission_before_deadline ON submission;
DROP FUNCTION IF EXISTS check_submission_before_deadline();
DROP FUNCTION IF EXISTS check_team_size_before_joining();

DROP TABLE IF EXISTS submission CASCADE;
DROP TABLE IF EXISTS status CASCADE;
DROP TABLE IF EXISTS file CASCADE;
DROP TABLE IF EXISTS student_group CASCADE;
DROP TABLE IF EXISTS team CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS teacher_subject CASCADE;
DROP TABLE IF EXISTS student_subject CASCADE;
DROP TABLE IF EXISTS subject CASCADE;
DROP TABLE IF EXISTS website_user CASCADE;

CREATE TABLE website_user (
    uid TEXT PRIMARY KEY,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    given_name TEXT NOT NULL,
    mail TEXT NOT NULL
);

CREATE TABLE subject (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE student_subject (
    uid TEXT NOT NULL,
    subject_id BIGSERIAL NOT NULL,
    PRIMARY KEY (uid, subject_id),
    FOREIGN KEY (uid) REFERENCES website_user(uid) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subject(id) ON DELETE CASCADE
);

CREATE TABLE teacher_subject (
    uid TEXT NOT NULL,
    subject_id BIGSERIAL NOT NULL,
    PRIMARY KEY (uid, subject_id),
    FOREIGN KEY (uid) REFERENCES website_user(uid) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subject(id) ON DELETE CASCADE
);

CREATE TABLE project (
    id BIGSERIAL PRIMARY KEY,
    deadline DATE NOT NULL,
    name TEXT NOT NULL,
    subject_id BIGSERIAL NOT NULL,
    description TEXT,
    max_team_size INT NOT NULL DEFAULT 4, -- Added column for maximum team size
    FOREIGN KEY (subject_id) REFERENCES subject(id) ON DELETE SET NULL,
    CONSTRAINT deadline_check CHECK (deadline >= CURRENT_DATE)
);

CREATE TABLE team (
    id BIGSERIAL PRIMARY KEY,
    team_name TEXT NOT NULL,
    score BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
    CONSTRAINT score_check CHECK (score BETWEEN 0 AND 20)
);

CREATE TABLE student_group (
    uid TEXT NOT NULL,
    team_id BIGINT NOT NULL,
    PRIMARY KEY (uid, team_id),
    FOREIGN KEY (uid) REFERENCES website_user(uid) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE CASCADE
);

CREATE TABLE status (
    id BIGSERIAL PRIMARY KEY,
    status_name TEXT NOT NULL UNIQUE
);

INSERT INTO status (status_name) VALUES ('InProgress');
INSERT INTO status (status_name) VALUES ('Accepted');
INSERT INTO status (status_name) VALUES ('Denied');

CREATE TABLE submission (
    id BIGSERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    team_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    status_id BIGINT NOT NULL DEFAULT 1, -- Default to 'InProgress'
    FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES status(id) ON DELETE RESTRICT
);

CREATE TABLE file (
    id BIGSERIAL PRIMARY KEY,
    submission_id BIGINT,  -- Optional, can be linked to a submission, project, or standalone
    project_id BIGINT,     -- Optional, same as above
    FOREIGN KEY (submission_id) REFERENCES submission(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE SET NULL
);

-- Function to check submission deadline
CREATE OR REPLACE FUNCTION check_submission_before_deadline()
RETURNS TRIGGER AS $$
DECLARE
    project_deadline DATE;
BEGIN
    SELECT deadline INTO project_deadline FROM project WHERE id = NEW.project_id;

    IF CURRENT_TIMESTAMP > project_deadline THEN
        RAISE EXCEPTION 'Submissions are not allowed after the deadline.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_submission_before_deadline
BEFORE INSERT ON submission
FOR EACH ROW
EXECUTE FUNCTION check_submission_before_deadline();

-- Function to check team size before adding a new member
CREATE OR REPLACE FUNCTION check_team_size_before_joining()
RETURNS TRIGGER AS $$
DECLARE
    current_team_size INT;
    max_size INT;
BEGIN
    SELECT COUNT(*) INTO current_team_size FROM student_group WHERE team_id = NEW.team_id;
    SELECT max_team_size INTO max_size FROM project JOIN team ON team.project_id = project.id WHERE team.id = NEW.team_id;

    IF current_team_size >= max_size THEN
        RAISE EXCEPTION 'The team is already at its maximum capacity of % members.', max_size;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_team_size_before_joining
BEFORE INSERT ON student_group
FOR EACH ROW
EXECUTE FUNCTION check_team_size_before_joining();
