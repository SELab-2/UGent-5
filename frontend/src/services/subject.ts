import type User from "@/models/User";
import type Subject from "@/models/Subject";
import { authorized_fetch } from "@/services";

/**
 * Fetches the subject with the given ID.
 */
export async function getSubject(subjectId: number): Promise<Subject> {
    return authorized_fetch(`/api/subjects/${subjectId}`, { method: "GET" });
}

/**
 * Fetches the subject with the given UUID.
 */
export async function getSubjectByUuid(subjectUuid: string): Promise<Subject> {
    return authorized_fetch(`/api/subjects/uuid/${subjectUuid}`, { method: "GET" });
}

/**
 * Fetches all subjects the current user is enrolled in.
 */
export async function getSubjects(): Promise<Subject[]> {
    const result = await authorized_fetch<{ as_instructor: Subject[]; as_student: Subject[] }>(
        "/api/users/me/subjects",
        {
            method: "GET",
        }
    );
    return [...result.as_instructor, ...result.as_student];
}

/**
 * Fetches all instructors of the subject with the given ID.
 */
export async function getSubjectInstructors(subjectId: number): Promise<User[]> {
    return authorized_fetch(`/api/subjects/${subjectId}/instructors`, { method: "GET" });
}

/**
 * Fetches all students of the subject with the given ID.
 */
export async function getSubjectStudents(subjectId: number): Promise<User[]> {
    return authorized_fetch(`/api/subjects/${subjectId}/students`, { method: "GET" });
}

/**
 * Registers the current user to the subject with the given UUID.
 */
export async function registerToSubject(subjectUuid: string): Promise<Subject> {
    return authorized_fetch(`/api/subjects/register?subject_uuid=${subjectUuid}`, {
        method: "POST",
    });
}
