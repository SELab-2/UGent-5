import { authorized_fetch } from "@/services";
import type Subject from "@/models/Subject";

export async function getSubject(subjectId: number): Promise<Subject> {
    return authorized_fetch(`/api/subjects/${subjectId}`, { method: "GET" });
}

export async function registerToSubject(subjectUuid: string): Promise<Subject> {
    return authorized_fetch(`/api/subjects/register?subject_uuid=${subjectUuid}`, {method: "POST"})
}
