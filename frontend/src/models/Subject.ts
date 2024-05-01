export default interface Subject {
    id: number;
    name: string;
    academic_year: number;
}

export interface UserSubjectList {
    as_student: Subject[];
    as_instructor: Subject[];
}
