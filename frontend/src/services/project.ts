import { authorized_fetch } from "@/services";
import type Project from "@/models/Project";

export async function getProject(projectId: number): Promise<Project> {
    return authorized_fetch(`/api/projects/${projectId}`, { method: "GET" });
}

export async function makeSubmission(groupId: number, formData: FormData): Promise<void> {
    await authorized_fetch<void>(`/api/submissions/?group_id=${groupId}`, {
        method: "POST",
        body: formData,
    })
}
