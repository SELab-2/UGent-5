export enum Status {
    InProgress = 1,
    Accepted = 2,
    Rejected = 3,
    Crashed = 4,
}

export interface TestResult {
    succeeded: boolean;
    value: string;
}

export default interface Submission {
    id: number;
    group_id: number;
    date: Date;
    project_id: number;
    status: Status;
    files_uuid: string;
    remarks: string;
    stdout: string | undefined;
    stderr: string | undefined;
    testresults: TestResult[];
}
