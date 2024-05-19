<template>
    <div class="projectbtn" @click="navigateToProject">
        <div :class="submissionToClass(latestSubmissionStatus)"></div>
        <div class="leftcontent">
            <h3>{{ project.name }}</h3>
            <p v-if="!isSubjectLoading" class="p">{{ subject!.name }}</p>
        </div>
        <div class="rightcontent">
            {{ $d(project.deadline, "short") }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import router from "@/router";
import type Project from "@/models/Project";
import type Submission from "@/models/Submission";
import { Status } from "@/models/Submission";
import { useSubjectQuery } from "@/queries/Subject";
import { useUserProjectSubmissionsQuery } from "@/queries/Submission";

const props = defineProps<{
    project: Project;
}>();

const { project } = toRefs(props);

const { data: submissions } = useUserProjectSubmissionsQuery(project.value.id);

const latestSubmissionStatus = computed(() => {
    if (!submissions.value || submissions.value.length === 0) return null;
    return [...submissions.value].sort((a, b) => b.date.getTime() - a.date.getTime())[0];
});

const { data: subject, isLoading: isSubjectLoading } = useSubjectQuery(project.value.subject_id);

function submissionToClass(submission: Submission | null) {
    return {
        block: true,
        in_progress: submission?.status === Status.InProgress,
        accepted: submission?.status === Status.Accepted,
        rejected: submission?.status === Status.Rejected || submission?.status === Status.Crashed,
        none: !submission,
    };
}

const navigateToProject = () => {
    router.push(`/project/${project.value.id}`);
};
</script>

<style scoped>
.projectbtn {
    margin: 5px;
    background-color: rgb(var(--v-theme-background));
    display: flex;
    transition: background-color 0.3s;
    align-items: center;
    cursor: pointer;
    height: 65px;
    border-radius: 2px;
}

.projectbtn:hover {
    background-color: rgb(var(--v-theme-tertiary));
}

.block {
    margin-left: 10px;
    width: 5px;
    height: 100%;
}

.none {
    background-color: gray;
}

.accepted {
    background-color: green;
}

.rejected {
    background-color: darkred;
}

.in_progress {
    background-color: orange;
}

.leftcontent {
    margin-left: 20px;
}

.rightcontent {
    margin-right: 20px;
    position: absolute;
    right: 0;
}

.p {
    color: rgb(var(--v-theme-textsecondary));
}
</style>
