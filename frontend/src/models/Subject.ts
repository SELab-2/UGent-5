export default interface Subject {
    id: number;
    name: string;
    academic_year: number;
    uuid: string;
    email: string;
}

export interface UserSubjectList {
    as_student: Subject[];
    as_instructor: Subject[];
}


export enum SubjectRole {
    Student = "student",
    Instructor = "instructor",
}
