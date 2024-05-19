import type User from "@/models/User";

export default interface Group {
    id: number;
    project_id: number;
    num: number;
    score: number;
    members: User[];
}

export interface GroupForm {
    project_id: number;
    score: number;
}
