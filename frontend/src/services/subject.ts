import type User from "@/models/User";
import {authorized_fetch} from "@/services/index";


export async function get_instructors_for_subject(subject_id: string): Promise<User[]> {
    return authorized_fetch(`/api/subjects/${subject_id}/teachers`, { method: "GET" });
import { authorized_fetch } from "@/services";
import type Subject from "@/models/Subject";

export async function getSubject(subjectId: number): Promise<Subject> {
    return authorized_fetch(`/api/subjects/${subjectId}`, { method: "GET" });
}
