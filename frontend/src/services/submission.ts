import type Submission from "@/models/Submission";
import { authorized_fetch } from ".";
import type FileInfo from "@/models/File";

function initSubmissionDate(submission: Submission): Submission {
    return { ...submission, date: new Date(submission.date) };
}

/**
 * Fetches the submission with the given ID.
 */
export async function getSubmission(submissionId: number): Promise<Submission> {
    const result = await authorized_fetch<Submission>(`/api/submissions/${submissionId}`, {
        method: "GET",
    });
    return initSubmissionDate(result);
}

/**
 * Fetches all submissions of a group.
 */
export async function getSubmissions(groupId: number): Promise<Submission[]> {
    const result = await authorized_fetch<Submission[]>(`/api/groups/${groupId}/submissions`, {
        method: "GET",
    });
    return result.map(initSubmissionDate);
}

/**
 * Fetches all latest submissions of each group from a project.
 */
export async function getProjectSubmissions(projectId: number): Promise<Submission[]> {
    const result = await authorized_fetch<Submission[]>(`/api/projects/${projectId}/submissions`, {
        method: "GET",
    });
    return result;
}

/**
 * Creates a new submission for a group.
 */
export async function createSubmission(groupId: number, formData: FormData): Promise<Submission> {
    return authorized_fetch(
        `/api/submissions/?group_id=${groupId}`,
        {
            method: "POST",
            body: formData,
        },
        { omitContentType: true }
    );
}

/**
 * Fetches fileinfo of files of a submission.
 */
export async function getFiles(submissionId: number): Promise<FileInfo[]> {
    return authorized_fetch(`/api/submissions/${submissionId}/files`, {
        method: "GET",
    });
}
