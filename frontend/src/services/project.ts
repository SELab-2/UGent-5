import type Project from "@/models/Project";
import type { ProjectForm } from "@/models/Project";
import { authorized_fetch } from "@/services";

function initProjectDate(project: Project): Project {
    return { ...project, deadline: new Date(project.deadline) };
}

/**
 * Fetches the project with the given ID.
 */
export async function getProject(projectId: number): Promise<Project> {
    const result = await authorized_fetch<Project>(`/api/projects/${projectId}`, { method: "GET" });
    return initProjectDate(result);
}

/**
 * Fetches all projects that the current user is a member of.
 */
export async function getProjects(): Promise<Project[]> {
    const result = await authorized_fetch<{ projects: Project[] }>(`/api/users/me/projects`, {
        method: "GET",
    });
    return result.projects.map(initProjectDate);
}

/**
 * Fetches all projects of the subject with the given ID.
 */
export async function getSubjectProjects(subjectId: number): Promise<Project[]> {
    const result = await authorized_fetch<{ projects: Project[] }>(
        `/api/subjects/${subjectId}/projects`,
        { method: "GET" }
    );
    return result.projects.map(initProjectDate);
}

/**
 * Creates a new project.
 */
export async function createProject(projectData: ProjectForm): Promise<number> {
    const response = await authorized_fetch<Project>(`/api/projects/`, {
        method: "POST",
        body: JSON.stringify(projectData),
    });
    return response.id;
}
