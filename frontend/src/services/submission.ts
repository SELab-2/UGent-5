import type Submission from "@/models/Submission";
import { authorized_fetch } from ".";
import type FileInfo from "@/models/File";

/**
 * Fetches the submission with the given ID.
 */
export async function getSubmission(submissionId: number): Promise<Submission> {
    return authorized_fetch(`/api/submissions/${submissionId}`, { method: "GET" });
}

/**
 * Fetches all submissions of a group.
 */
export async function getSubmissions(groupId: number): Promise<Submission[]> {
    return authorized_fetch(`/api/groups/${groupId}/submissions`, { method: "GET" });
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
