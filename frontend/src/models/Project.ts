export default interface Project {
    id: number;
    name: string;
    deadline: Date;
    description: string;
    subject_id: number;
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
