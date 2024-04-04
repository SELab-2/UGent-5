import type Project from '@/models/Project';
import {authorized_fetch} from "@/services/index";
export async function createProject(projectData: Project) {
    try {
        await authorized_fetch(`/api/projects/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData), // Ensure projectData is not nested inside { project: ... }
        });
    } catch (error) {
        console.error("Error in creating project:", error);
        throw error;
    }
import { authorized_fetch } from "@/services";
import type Project from "@/models/Project";
import type Submission from "@/models/Submission";

export async function getProject(projectId: number): Promise<Project> {
    return authorized_fetch(`/api/projects/${projectId}`, { method: "GET" });
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
