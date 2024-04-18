export default interface Submission {
    id: number;
    group_id: number;
    date: Date;
    project_id: number;
    status: string;
    files_uuid: string;
}
