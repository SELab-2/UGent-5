export default interface Project {
    id: number;
    name: string;
    deadline: Date;
    description: string;
    subject_id: number;
    test_files_uuid: string;
}

export enum FilterOptions {
    All = "All",
    Completed = "Completed",
    Active = "Active",
}
