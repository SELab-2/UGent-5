import { authorized_fetch } from "@/services";
import type Subject from "@/models/Subject";

export async function getSubject(subjectId: number): Promise<Subject> {
    return authorized_fetch(`/api/subjects/${subjectId}`, { method: "GET" });
}
