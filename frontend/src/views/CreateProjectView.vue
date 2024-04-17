<template>
    <background-container>
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
                    <CheckBox
                        :title="'Teacher(s)'"
                        :items="teachers"
                        placeholder="Assign Teachers"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <span v-if="isLoading">Loading subjects...</span>
                    <span v-else-if="isError">Error loading subjects: {{ error.message }}</span>
                    <v-select
                        v-model="selectedCourse"
                        :items="courses"
                        item-value="value"
                        item-title="text"
                        label="Course"
                        required
                        placeholder="Select Course"
                    />
                </v-col>
                <v-col cols="12" md="6">
                    <CheckBox
                        :title="'Assistants'"
                        :items="assistants"
                        placeholder="Assign Assistants"
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
    </background-container>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from "vue";
import CheckBox from "@/components/CheckboxList.vue";
import DatePicker from "@/components/DatePicker.vue";
import RadioButtonList from "@/components/RadiobuttonList.vue";
import type Project from "@/models/Project";
import { useInstructorsForSubjectQuery, useStudentsForSubjectQuery } from "@/queries/Subject";
import { useMySubjectsQuery } from "@/queries/User";
import { useCreateGroupsMutation, useJoinGroupMutation } from "@/queries/Group";
import { useCreateProjectMutation } from "@/queries/Project";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import type Group from "@/models/Group";

const project_title = ref("");
const deadline = ref(new Date());
const capacity = ref(1);
const selectedCourse = ref(undefined);
const publishDate = ref(new Date());
const selectedGroupProject = ref("course");
const quillEditor = ref(null);

const { data: instructorsData, isLoading, isError } = useInstructorsForSubjectQuery(selectedCourse);
const {
    data: studentsData,
    isError: isStudentsError,
    error: studentsError,
    isLoading: isStudentsLoading,
} = useStudentsForSubjectQuery(selectedCourse);
const { data: mySubjectsData } = useMySubjectsQuery();

const teachers = computed(
    () => instructorsData.value?.filter((t) => t.is_teacher).map(formatInstructor) || []
);
const assistants = computed(
    () => instructorsData.value?.filter((a) => !a.is_teacher).map(formatInstructor) || []
);

const courses = computed(
    () =>
        mySubjectsData.value?.as_instructor.map(({ name, id }) => ({ text: name, value: id })) || []
);
const groupProjectOptions = [
    { label: "Use Course Groups", value: "course" },
    { label: "Random Groups", value: "random" },
    { label: "Student Picked Groups", value: "student" },
];

const createProjectMutation = useCreateProjectMutation();
const createGroupsMutation = useCreateGroupsMutation();
const joinGroupMutation = useJoinGroupMutation(); // Moved to top-level setup

async function submitForm() {
    if (selectedGroupProject.value === "random" && selectedCourse.value) {
        if (isStudentsError.value) {
            console.error("Error fetching students:", studentsError.value.message);
            return;
        }

        const students = studentsData.value;
        const groups = divideStudentsIntoGroups(students, capacity.value);

        const projectData = {
            name: project_title.value,
            deadline: deadline.value.toISOString(),
            description: quillEditor.value?.getQuill().root.innerHTML || "",
            subject_id: selectedCourse.value,
            capacity: capacity.value,
        };

        try {
            const createdProjectId = await createProjectMutation.mutateAsync(projectData);
            console.log("Project created successfully with ID:", createdProjectId);

            const groupsToCreate = groups.map((group, i) => ({
                project_id: createdProjectId,
                score: 0,
                team_name: "Group " + (i + 1),
            }));

            const createdGroups = await createGroupsMutation.mutateAsync({
                projectId: createdProjectId,
                groups: groupsToCreate,
            });
            console.log("Created groups with IDs:", createdGroups);

            // Use the mutation function directly here
            createdGroups.forEach((groupId, index) => {
                groups[index].forEach((student) => {
                    joinGroupMutation.mutateAsync({
                        groupId: groupId,
                        uid: student.uid,
                    });
                });
            });

            console.log("Students have been added to the groups successfully");
        } catch (error) {
            console.error("Error during project or group creation:", error);
        }
    }
}

function divideStudentsIntoGroups(students, capacity) {
    console.log("Groups formed:", students.length, capacity);
    let groups = [];
    for (let i = 0; i < students.length; i += capacity) {
        groups.push(students.slice(i, i + capacity));
    }
    return groups;
}

function formatInstructor({ uid, given_name, checked = false }) {
    return { id: uid, label: given_name, checked };
}

const handleCapacityChange = (newCapacity) => {
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
