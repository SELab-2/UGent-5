import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { createProject } from "@/services/project"; // Ensure the path is correct

const PROJECT_QUERY_KEY = "projects"; // If you want to invalidate all project queries, you might not need the subject_id here

export function useCreateProjectMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
        },
        onError: (error) => {
            console.error("Could not create project", error);
            alert("Could not create project");
        },
    });
}
