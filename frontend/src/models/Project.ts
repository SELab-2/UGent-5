export default interface Project {
    id: number;
    name: string;
    deadline: Date;
    // groupProjectType: string;
    // selectedTeachers: string[]; // Assuming you store only teacher IDs
    subject_id: number;
    requirements: [];
    description: string;
    capacity: number;
}

export interface ProjectForm {
    name: string;
    deadline: Date;
    description: string;
    subject_id: number;
    test_files_uuid: string;
    is_visible: boolean;
    capacity: number;
    requirements: [];
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
