import { authorized_fetch } from "@/services";
import type Project from "@/models/Project";

export async function getProject(projectId: number): Promise<Project> {
    return authorized_fetch(`/api/projects/${projectId}`, { method: "GET" });
}

export async function submitProject(projectId: number, formData: FormData): Promise<void> {
    await authorized_fetch<void>(`/api/projects/${projectId}`, {
        method: "POST",
        body: formData,
    })
}
