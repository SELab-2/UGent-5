import type User from "@/models/User";
import type Project from "@/models/Project";

export default interface SubjectDetails {
    id: number;
    name: string;
    instructors: User[];
    students: User[];
    projects: Project[];
    uuid: string;
}
