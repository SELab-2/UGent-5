import type Group from "@/models/Group";
import type Project from "@/models/Project";
import type { ProjectForm, UserProjectList } from "@/models/Project";
import type Submission from "@/models/Submission";
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

export async function getGroups(projectId: number): Promise<Group[]> {
    const result = await authorized_fetch<{ groups: Group[] }>(
        `/api/projects/${projectId}/groups`,
        {
            method: "GET",
        }
    );
    return result.groups;
}

export async function getSubmissions(projectId: number): Promise<Submission[]> {
    const result = await authorized_fetch<Submission[]>(`/api/projects/${projectId}/submissions`, {
        method: "GET",
    });
    return result;
}
