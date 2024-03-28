import {
    useQuery,
    type UseQueryReturnType,
} from "@tanstack/vue-query";
import type Project from "@/models/Project";
import { getProject } from "@/services/project";

function PROJECT_QUERY_KEY(id: number): (string|number)[] {
    return ["project", id];
}

export function useProjectQuery(id: number): UseQueryReturnType<Project, Error> {
    return useQuery<Project, Error>({ queryKey: PROJECT_QUERY_KEY(id), queryFn: () => getProject(id) });
}
