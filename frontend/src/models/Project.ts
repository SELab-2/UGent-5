export default interface Project {
    id: number;
    name: string;
    deadline: Date;
    // groupProjectType: string;
    // selectedTeachers: string[]; // Assuming you store only teacher IDs
    subject_id: number;
    requirements: [];
    description: String;
    capacity: number;
}

export interface ProjectForm {
    name: string;
    deadline: Date;
    description: string;
    subject_id: number;
    is_visible: boolean;
    capacity: number;
    requirements: [];
}

export enum FilterOptions {
    All = "All",
    Completed = "Completed",
    Active = "Active",
}
