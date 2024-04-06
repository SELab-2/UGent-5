import { authorized_fetch } from "@/services";
import type Project from "@/models/Project";
import type Submission from "@/models/Submission";

export async function getProject(projectId: number): Promise<Project> {
    return authorized_fetch(`/api/projects/${projectId}`, { method: "GET" });
}

export async function createSubmission(groupId: number, formData: FormData): Promise<Submission> {
    return authorized_fetch(
        `/api/submissions/?group_id=${groupId}`,
        {
            method: "POST",
            body: formData,
        },
        true
    );
}
