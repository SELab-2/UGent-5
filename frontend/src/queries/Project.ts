import {useQuery, UseQueryReturnType} from "@tanstack/vue-query/build/modern";
import {getProject} from "@/services/project";
import Project from "@/models/Project";
import {Ref} from "vue";


export function useProjectQuery(projectId: Ref<number | undefined>): UseQueryReturnType<Project, Error> {
    return useQuery<Project, Error>({ queryFn: () => getProject(projectId) });
}
