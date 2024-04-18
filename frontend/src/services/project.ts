import { authorized_fetch } from "@/services";
import type Project from "@/models/Project";
import type Submission from "@/models/Submission";

export async function getProject(projectId: number): Promise<Project> {
    return authorized_fetch(`/api/projects/${projectId}`, { method: "GET" });
}

export async function getProjects(): Promise<Project[]> {
    const result = await authorized_fetch<{ projects: Project[] }>(`/api/users/me/projects`, {
        method: "GET",
    });
    return result.projects;
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

export async function getSubmissions(): Promise<Submission[]> {
    return authorized_fetch(`/api/submissions/`, { method: "GET" });
}
