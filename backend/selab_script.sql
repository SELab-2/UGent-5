DROP TRIGGER IF EXISTS trg_check_submission_before_deadline ON submission;
DROP FUNCTION IF EXISTS check_submission_before_deadline();

DROP TABLE IF EXISTS submission CASCADE;
DROP TABLE IF EXISTS status CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS student_group CASCADE;
DROP TABLE IF EXISTS team CASCADE;
DROP TABLE IF EXISTS student_subject CASCADE;
DROP TABLE IF EXISTS teacher_subject CASCADE;
DROP TABLE IF EXISTS subject CASCADE;
DROP TABLE IF EXISTS website_user CASCADE;
DROP TABLE IF EXISTS file CASCADE;

CREATE TABLE website_user (
    uid INT PRIMARY KEY,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE subject (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE student_subject (
    uid INT NOT NULL,
    subject_id TEXT NOT NULL,
    PRIMARY KEY (uid, subject_id),
    FOREIGN KEY (uid) REFERENCES website_user(uid) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subject(id) ON DELETE CASCADE
);

CREATE TABLE teacher_subject (
    uid INT NOT NULL,
    subject_id TEXT NOT NULL,
    PRIMARY KEY (uid, subject_id),
    FOREIGN KEY (uid) REFERENCES website_user(uid) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON DELETE CASCADE
);

CREATE TABLE project (
    id BIGSERIAL PRIMARY KEY,
    deadline DATE NOT NULL,
    name TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON DELETE SET NULL
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
    uid INT NOT NULL,
    team_id BIGINT NOT NULL,
    PRIMARY KEY (uid, team_id),
    FOREIGN KEY (uid) REFERENCES website_user(uid) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES team(team_id) ON DELETE CASCADE
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
    FOREIGN KEY (team_id) REFERENCES team(team_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES status(status_id) ON DELETE RESTRICT
);

CREATE TABLE file (
    file_id BIGSERIAL PRIMARY KEY,
    submission_id BIGINT,  -- Optional, can be linked to a submission, project, or standalone
    project_id BIGINT,     -- Optional, same as above
    FOREIGN KEY (submission_id) REFERENCES submission(submission_id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE SET NULL
);

-- Constraints and checks
ALTER TABLE project ADD CONSTRAINT deadline_check CHECK (deadline >= CURRENT_DATE);

-- Trigger to prevent submissions after the project deadline
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
