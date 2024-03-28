import { authorized_fetch } from "@/services";
import type Project from "@/models/Project";

export async function getProject(projectId: number): Promise<Project> {
    return authorized_fetch(`/api/projects/${projectId}`, { method: "GET" });
}
