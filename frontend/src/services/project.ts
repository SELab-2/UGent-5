import type Project from "@/models/Project";
import type { ProjectForm, UserProjectList } from "@/models/Project";
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
export async function getProjects(): Promise<UserProjectList> {
    const result = await authorized_fetch<UserProjectList>(`/api/users/me/projects`, {
        method: "GET",
    });
    return {
        as_student: result.as_student.map(initProjectDate),
        as_instructor: result.as_instructor.map(initProjectDate),
    };
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

export async function updateProject(
    projectId: number,
    projectData: Partial<ProjectForm>
): Promise<void> {
    console.log(projectData);
    const response = await authorized_fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
    });
    return;
}




// Function to upload test files to a specific project
export async function uploadProjectFiles(projectId: number, formData: FormData): Promise<void> {
    await authorized_fetch(`/api/projects/${projectId}/test_files`, {
        method: 'PUT',
        body: formData,
    }, {omitContentType: true});
}

export async function fetchProjectFiles(projectId: number): Promise<any> {
    return authorized_fetch(`/api/projects/${projectId}/test_files`, {
        method: "GET",
    })
        .then((response) => {
            return response;
        })
        .catch((error) => console.error("Failed to fetch project files:", error));
}

export async function deleteProjectFiles(
    projectId: number,
    filesToDelete: string[]
): Promise<void> {
    return authorized_fetch(
        `/api/projects/${projectId}/test_files`,
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
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
