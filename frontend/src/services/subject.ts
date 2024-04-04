import { authorized_fetch } from "@/services";
import type Subject from "@/models/Subject";
import type User from "@/models/User";

export async function getSubject(subjectId: number): Promise<Subject> {
    return authorized_fetch(`/api/subjects/${subjectId}`, { method: "GET" });
}

export async function getSubjectTeachers(subjectId: number): Promise<User[]> {
    return authorized_fetch(`/api/subjects/${subjectId}/teachers`, { method: "GET" });
}

export async function getSubjectStudents(subjectId: number): Promise<User[]> {
    return authorized_fetch(`/api/subjects/${subjectId}/students`, { method: "GET" });
}

export async function getSubjectProjects(subjectId: number): Promise<User[]> {
    return authorized_fetch(`/api/subjects/${subjectId}/projects`, { method: "GET" });
}

export async function getSubjects(): Promise<Subject[]> {
    return authorized_fetch("/api/subjects", { method: "GET" });
}
