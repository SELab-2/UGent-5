import { authorized_fetch } from "@/services";
import type Project from "@/models/Project";

export async function getProject(id: number): Promise<Project> {
    return authorized_fetch(`/api/projects/${id}`, { method: "GET" });
}
