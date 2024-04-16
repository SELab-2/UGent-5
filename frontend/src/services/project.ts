import type Project from '@/models/Project';
import type Submission from '@/models/Submission';
import { authorized_fetch } from "@/services";


export async function createProject(projectData: Project): Promise<void> {
    try {
        await authorized_fetch(`/api/projects/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData),
        });
    } catch (error) {
        console.error("Error in creating project:", error);
        throw error; // Rethrow the error for further handling or showing a user-friendly message
    }
}


// export async function createProject(projectData: Project): Promise<Project> {
//     try {
//         const response = await authorized_fetch(`/api/projects/`, {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(projectData),
//         });
//         return response.json();
//     } catch (error) {
//         console.error("Error in creating project:", error);
//         throw error; // Rethrow the error for further handling or showing a user-friendly message
//     }
// }

// Function to fetch a specific project by its ID
export async function getProject(projectId: number): Promise<Project> {
    return authorized_fetch(`/api/projects/${projectId}`, { method: "GET" });
}

// Function to create a new submission for a specific group
export async function createSubmission(groupId: number, formData: FormData): Promise<Submission> {
    return authorized_fetch(
        `/api/submissions/?group_id=${groupId}`,
        {
            method: "POST",
            body: formData,
        },
        true // If this flag is intended for handling multipart/form-data or a different response, consider adding a comment to clarify its purpose
    );
}
