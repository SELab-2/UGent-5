import { authorized_fetch } from "@/services";
import type Subject from "@/models/Subject";
import type User from "@/models/User";

export async function getSubject(subjectId: number): Promise<Subject> {
    return authorized_fetch(`/api/subjects/${subjectId}`, { method: "GET" });
}

export async function getSubjectInstructors(subjectId: number): Promise<User[]> {
    return authorized_fetch(`/api/subjects/${subjectId}/instructors`, { method: "GET" });
}
