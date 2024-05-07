import type Submission from "@/models/Submission";
import { authorized_fetch } from ".";
import type FileInfo from "@/models/File";

// Function to fetch a specific submission by its ID
export async function getSubmission(submissionId: number): Promise<Submission> {
    return authorized_fetch(`/api/submissions/${submissionId}`, { method: "GET" });
}

// Function to create a new submission for a specific group
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

export async function getFiles(submissionId: number): Promise<FileInfo[]> {
    return authorized_fetch(`/api/submissions/${submissionId}/files`, {
        method: "GET",
    });
}
