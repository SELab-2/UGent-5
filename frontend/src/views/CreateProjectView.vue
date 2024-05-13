<template>
    <BackgroundContainer>
        <v-container>
            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field
                        v-model="project_title"
                        label="Title"
                        required
                        placeholder="Enter Title"
                    />
                </v-col>
                <v-col cols="12" md="6">
                    <CheckBoxList
                        v-model="selectedTeachers"
                        :title="'Teacher(s)'"
                        :items="teachers"
                        description="Assign Teachers"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <span v-if="isSubjectsLoading">Loading subjects...</span>
                    <span v-else-if="isSubjectsError"
                        >Error loading subjects: {{ subjectsError!.message }}</span
                    >
                    <v-select
                        v-else
                        v-model="selectedSubject"
                        :items="subjects"
                        item-value="value"
                        item-title="text"
                        label="Subject"
                        required
                        placeholder="Select Subject"
                    />
                </v-col>
                <v-col cols="12" md="6">
                    <CheckBoxList
                        v-model="selectedAssitants"
                        :title="'Assistants'"
                        :items="assistants"
                        description="Assign Assistants"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <DatePicker v-model="deadline" label="Deadline" required />
                    <DatePicker v-model="publishDate" label="Publish Date" required />
                </v-col>
                <v-col cols="12" md="6">
                    <RadioButtonList
                        v-model="selectedGroupProject"
                        :title="'Group Project Options'"
                        :options="groupProjectOptions"
                        @update:capacity="handleCapacityChange"
                        required
                    />
                </v-col>
            </v-row>
        </v-container>
        <v-container class="flex-container">
            <v-row>
                <v-col cols="16">
                    <v-card class="mb-0">
                        <v-card-title class="headline">Assignment</v-card-title>
                    </v-card>
                </v-col>
            </v-row>
            <v-row class="mt-0">
                <v-col cols="12">
                    <QuillEditor ref="quillEditor" theme="snow" class="quill-editor" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" class="text-right">
                    <v-btn @click="submitForm">Submit</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import CheckBoxList from "@/components/project/CheckboxList.vue";
import type { CheckBoxItem } from "@/components/project/CheckboxList.vue";
import DatePicker from "@/components/project/DatePicker.vue";
import RadioButtonList from "@/components/project/RadiobuttonList.vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import { useRoute } from "vue-router";
import {
    useSubjectsQuery,
    useSubjectInstructorsQuery,
    useSubjectStudentsQuery,
} from "@/queries/Subject";
import { useCreateProjectMutation } from "@/queries/Project";
import { useCreateGroupsMutation, useAddToGroupMutation } from "@/queries/Group";
import { ref, computed, reactive } from "vue";
import type User from "@/models/User";
import type { ProjectForm } from "@/models/Project";
import type { GroupForm } from "@/models/Group";

const route = useRoute();

// Form data
const project_title = ref("");
const selectedSubject = ref(Number(route.params.subjectId));
const selectedTeachers = reactive<CheckBoxItem[]>([]);
const selectedAssitants = reactive<CheckBoxItem[]>([]);
const deadline = ref(new Date());
const publishDate = ref(new Date());
const selectedGroupProject = ref("student");
const capacity = ref(1);
const quillEditor = ref<typeof QuillEditor | null>(null);

const {
    data: subjectsData,
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
    error: subjectsError,
} = useSubjectsQuery();
const { data: instructorsData } = useSubjectInstructorsQuery(selectedSubject);
const { data: studentsData } = useSubjectStudentsQuery(selectedSubject);

const teachers = computed(
    () => instructorsData.value?.filter((t) => t.is_teacher).map(formatInstructor) || []
);
const assistants = computed(
    () => instructorsData.value?.filter((a) => !a.is_teacher).map(formatInstructor) || []
);
const subjects = computed(
    () =>
        subjectsData.value?.as_instructor.map(({ name, id }) => ({ text: name, value: id })) || []
);

const groupProjectOptions = [
    { label: "Random Groups", value: "random" },
    { label: "Student Picked Groups", value: "student" },
];

const createProjectMutation = useCreateProjectMutation();
const createGroupsMutation = useCreateGroupsMutation();
const joinGroupMutation = useAddToGroupMutation();

async function submitForm() {
    const projectData: ProjectForm = {
        name: project_title.value,
        deadline: deadline.value,
        description: quillEditor.value?.getQuill().root.innerHTML || "",
        subject_id: selectedSubject.value,
        is_visible: true,
        capacity: capacity.value,
        requirements: [],
    };

    try {
        const createdProjectId = await createProjectMutation.mutateAsync(projectData);

        if (selectedGroupProject.value === "student") {
            const emptyGroup: GroupForm = {
                project_id: createdProjectId,
                score: 0,
                team_name: "Group 1",
            };
            await createGroupsMutation.mutateAsync({
                projectId: createdProjectId,
                groups: [emptyGroup],
            });
        } else if (selectedGroupProject.value === "random") {
            const groups = divideStudentsIntoGroups(studentsData.value || [], capacity.value);
            const groupsToCreate = groups.map((_, i) => ({
                project_id: createdProjectId,
                score: 0,
                team_name: "Group " + (i + 1),
            }));
            const createdGroups = await createGroupsMutation.mutateAsync({
                projectId: createdProjectId,
                groups: groupsToCreate,
            });

            createdGroups.forEach((group, index) => {
                groups[index].forEach((student) => {
                    joinGroupMutation.mutateAsync({
                        groupId: group.id,
                        uid: student.uid,
                    });
                });
            });
        }
    } catch (error) {
        console.error("Error during project or group creation:", error);
    }
}

function shuffle(array: any[]) {
    let shuffledArray = [...array];
    let currentIndex = shuffledArray.length,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
            shuffledArray[randomIndex],
            shuffledArray[currentIndex],
        ];
    }

    return shuffledArray;
}

function divideStudentsIntoGroups(students: User[], capacity: number) {
    students = shuffle(students);
    let groups = [];
    const numberOfGroups = Math.ceil(students.length / capacity);
    for (let i = 0; i < numberOfGroups; i++) {
        groups.push(students.slice(i * capacity, (i + 1) * capacity));
    }

    return groups;
}

function formatInstructor(user: User): CheckBoxItem {
    const checked = false;
    return { id: user.uid, label: user.given_name, checked };
}

const handleCapacityChange = (newCapacity: number) => {
    capacity.value = newCapacity;
};
</script>

<style>
.flex-container {
    display: flex;
    flex-direction: column;
}

.v-row:not(:last-child) {
    margin-bottom: 16px; /* Adjust as needed */
}

.quill-editor {
    /* Add min-height or height as necessary to control the size of the editor */
    min-height: 150px; /* Example min-height */
}
</style>
