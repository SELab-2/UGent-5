import type Project from "@/models/Project";
import type { ProjectForm } from "@/models/Project";
import type Submission from "@/models/Submission";
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

export async function updateProject(projectId: number, projectData: Partial<ProjectForm>): Promise<void> {
    const response = await authorized_fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
    });
    return;
}

// Function to fetch a specific project by its ID
export async function getProject(projectId: number): Promise<Project> {
    return authorized_fetch(`/api/projects/${projectId}`, { method: "GET" });
}

export async function getProjects(): Promise<Project[]> {
    const result = await authorized_fetch<{ projects: Project[] }>(`/api/users/me/projects`, {
        method: "GET",
    });
    return result.projects;
}

// Function to upload test files to a specific project
export async function uploadProjectFiles(projectId: number, formData: FormData): Promise<void> {
    return authorized_fetch(
        `/api/projects/${projectId}/test_files`,
        {
            method: "PUT",
            body: formData,
        },
        true
    );
}

export async function fetchProjectFiles(projectId: number): Promise<any> {
    return authorized_fetch(
        `/api/projects/${projectId}/test_files`,
        {
            method: "GET"
        }
    ).then(response => response.json())
        .catch(error => console.error("Failed to fetch project files:", error));
}

export async function deleteProjectFiles(projectId: number, filesToDelete: string[]): Promise<void> {
    return authorized_fetch(
        `/api/projects/${projectId}/test_files`,
        {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ files: filesToDelete }),
        },
        true
    );
}

// Function to create a new submission for a specific group
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
