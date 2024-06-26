import type User from "@/models/User";
import type Subject from "@/models/Subject";
import type { UserSubjectList } from "@/models/Subject";
import { authorized_fetch } from "@/services";
import type { SubjectForm } from "@/models/Subject";

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
export async function getSubjects(): Promise<UserSubjectList> {
    return await authorized_fetch<UserSubjectList>("/api/users/me/subjects", {
        method: "GET",
    });
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

export async function getSubjectUuid(subjectId: number): Promise<string> {
    const result = await authorized_fetch<{ subject_uuid: string }>(
        `/api/subjects/${subjectId}/uuid`,
        { method: "GET" }
    );
    return result.subject_uuid;
}

/**
 * Creates a new subject.
 */
export async function createSubject(subjectData: SubjectForm): Promise<number> {
    const response = await authorized_fetch<Subject>(`/api/subjects/`, {
        method: "POST",
        body: JSON.stringify(subjectData),
    });
    return response.id;
}

/**
 * Updates the subject with the given ID.
 */
export async function updateSubject(subjectId: number, subjectData: SubjectForm): Promise<void> {
    return await authorized_fetch(`/api/subjects/${subjectId}`, {
        method: "PATCH",
        body: JSON.stringify(subjectData),
    });
}

/**
 * Creates a new subject instructor.
 */
export async function createSubjectInstructor(subjectId: number, uid: string): Promise<void> {
    return authorized_fetch(`/api/subjects/${subjectId}/instructors?user_id=${uid}`, {
        method: "POST",
    });
}

export async function deleteSubjectInstructor(subjectId: number, uid: string): Promise<void> {
    return authorized_fetch(`/api/subjects/${subjectId}/instructors/${uid}`, {
        method: "DELETE",
    });
}
