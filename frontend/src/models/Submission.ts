export default interface Submission {
    id: number;
    group_id: number;
    date: Date;
    project_id: number;
    status: number;
    files_uuid: string;
}

export enum SubmissionStatus {
    Denied = 0,
    InProgress = 1,
    Accepted = 2,
}
