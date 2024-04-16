import type User from "@/models/User";
import type Subject from "@/models/Subject";
import { authorized_fetch } from "@/services";

// Fetches a list of instructors for a given subject
export async function get_instructors_for_subject(subjectId: number): Promise<User[]> {
    return authorized_fetch(`/api/subjects/${subjectId}/instructors`, { method: "GET" });
}

// Fetches details for a specific subject by its ID
export async function getSubject(subjectId: number): Promise<Subject> {
    return authorized_fetch(`/api/subjects/${subjectId}`, { method: "GET" });
}

export async function get_students_for_subject(subjectId: number): Promise<User[]>{
    return authorized_fetch(`/api/subjects/${subjectId}/students`, {method: "GET"});
}
