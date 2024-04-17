export default interface Project {
    name: string;
    deadline: Date;
    // groupProjectType: string;
    // selectedTeachers: string[]; // Assuming you store only teacher IDs
    subject_id: String;
    requirements: [];
    description: String;
    id: number;
    name: string;
    deadline: Date;
    description: string;
    subject_id: number;
    capacity: number;
}

export enum FilterOptions {
    All = "All",
    Completed = "Completed",
    Active = "Active",
}
