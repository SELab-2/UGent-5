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
}
