export default interface Subject {
    id: number;
    name: string;
    academic_year: number;
    email: string;
}

export interface UserSubjectList {
    as_student: Subject[];
    as_instructor: Subject[];
}

export enum SubjectRole {
    Student = "student",
    Instructor = "instructor",
    Admin = "admin",
    None = "none",
}

export interface SubjectFilter {
    showInstructorSubjects: boolean;
    showStudentSubjects: boolean;
}

export interface SubjectDetails {
    subjectData: Subject;
    role: SubjectRole;
}

export default interface SubjectForm {
    name: string;
    email: string;
    academic_year: number;
}
