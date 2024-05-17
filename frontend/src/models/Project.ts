export default interface Project {
    id: number;
    name: string;
    deadline: Date;
    subject_id: number;
    requirements: Requirement[];
    description: string;
    capacity: number;
    enroll_deadline: Date;
    publish_date: Date;
    test_files_uuid: string;
}

export interface ProjectForm {
    name: string;
    deadline: Date;
    subject_id: number;
    requirements: Requirement[];
    description: string;
    capacity: number;
    enroll_deadline: Date;
    publish_date: Date;
    test_files_uuid: string;
}

export interface Deadline {
    project: Project;
    status: string;
}

export enum FilterOptions {
    All = "All",
    Completed = "Completed",
    Active = "Active",
}

export interface Requirement {
    mandatory: boolean;
    value: string;
}
