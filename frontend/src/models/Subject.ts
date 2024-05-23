export default interface Subject {
    id: number;
    name: string;
}

export interface UserSubjectList {
    as_student: Subject[];
    as_instructor: Subject[];
}
