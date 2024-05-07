import type Project from "@/models/Project";
import type { ProjectForm } from "@/models/Project";
import { authorized_fetch } from "@/services";

export async function createProject(projectData: ProjectForm): Promise<number> {
    try {
        const response = await authorized_fetch<Project>(`/api/projects/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(projectData),
        });

        const createdProjectId = response.id;
        return createdProjectId;
    } catch (error) {
        console.error("Error in creating project:", error);
        throw error;
    }
}

// Function to fetch a specific project by its ID
export async function getProject(projectId: number): Promise<Project> {
    return authorized_fetch(`/api/projects/${projectId}`, { method: "GET" });
}

export async function getProjects(): Promise<Project[]> {
    const result = await authorized_fetch<{ projects: Project[] }>(`/api/users/me/projects`, {
        method: "GET",
    });
    const projects = result.projects.map((project) => ({
        ...project,
        deadline: new Date(project.deadline),
    }));
    return projects;
}
