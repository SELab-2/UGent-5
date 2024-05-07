import type User from "@/models/User";
import type Subject from "@/models/Subject";
import { authorized_fetch } from "@/services";
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
    const result = await authorized_fetch<{ as_instructor: Subject[]; as_student: Subject[] }>(
        "/api/users/me/subjects",
        {
            method: "GET",
        }
    );
    if (!result) return [];
    return [...result.as_instructor, ...result.as_student];
}

export async function getSubjectByUuid(subjectUuid: string): Promise<Subject> {
    return authorized_fetch(`/api/subjects/uuid/${subjectUuid}`, { method: "GET" });
}

export async function registerToSubject(subjectUuid: string): Promise<Subject> {
    return authorized_fetch(`/api/subjects/register?subject_uuid=${subjectUuid}`, {
        method: "POST",
    });
}
