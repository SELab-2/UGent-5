import { authorized_fetch } from "@/services";
import type Subject from "@/models/Subject";
import type User from "@/models/User";
import type Project from "@/models/Project";

export async function getSubject(subjectId: number): Promise<Subject> {
    return authorized_fetch(`/api/subjects/${subjectId}`, { method: "GET" });
}

export async function getSubjectInstructors(subjectId: number): Promise<User[]> {
    return authorized_fetch(`/api/subjects/${subjectId}/instructors`, { method: "GET" });
}

export async function getSubjectStudents(subjectId: number): Promise<User[]> {
    return authorized_fetch(`/api/subjects/${subjectId}/students`, { method: "GET" });
}

export async function getSubjectProjects(subjectId: number): Promise<Project[]> {
    const data = await authorized_fetch<{ projects: Project[] }>(
        `/api/subjects/${subjectId}/projects`,
        { method: "GET" }
    );
    return data.projects;
}

export async function getSubjects(): Promise<Subject[]> {
    return authorized_fetch("/api/subjects", { method: "GET" });
}
