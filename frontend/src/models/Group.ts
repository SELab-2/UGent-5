export default interface Group {
    id: number;
    project_id: number;
    score: number;
    team_name: string;
}

export interface GroupForm {
    project_id: number;
    score: number;
    team_name: string;
}
