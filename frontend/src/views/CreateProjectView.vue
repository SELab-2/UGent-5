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
import {ref, computed, watch} from "vue";
import CheckBox from "@/components/project/CheckboxList.vue";
import DatePicker from "@/components/project/DatePicker.vue";
import RadioButtonList from "@/components/project/RadiobuttonList.vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { useRoute } from 'vue-router';
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import { useSubjectInstructorsQuery, useSubjectStudentsQuery } from "@/queries/Subject";
import { useMySubjectsQuery } from "@/queries/User";
import { useCreateProjectMutation } from "@/queries/Project";
import {useCreateGroupsMutation, useJoinGroupMutation} from "@/queries/Group";

const route = useRoute();
const project_title = ref("");
const deadline = ref(new Date());
const capacity = ref(1);
const selectedCourse = ref(Number(route.params.subjectId));
const publishDate = ref(new Date());
const selectedGroupProject = ref("student");
const quillEditor = ref(null);

const { data: instructorsData, isLoading, isError } = useSubjectInstructorsQuery(selectedCourse);
const { data: studentsData } = useSubjectStudentsQuery(selectedCourse);
const { data: mySubjectsData } = useMySubjectsQuery();


const teachers = computed(() => instructorsData.value?.filter(t => t.is_teacher).map(formatInstructor) || []);
const assistants = computed(() => instructorsData.value?.filter(a => !a.is_teacher).map(formatInstructor) || []);
const courses = computed(() => mySubjectsData.value?.as_instructor.map(({ name, id }) => ({ text: name, value: id })) || []);

const groupProjectOptions = [
    { label: "Random Groups", value: "random" },
    { label: "Student Picked Groups", value: "student" }
];

const createProjectMutation = useCreateProjectMutation();
const createGroupsMutation = useCreateGroupsMutation();
const joinGroupMutation = useJoinGroupMutation();

async function submitForm() {
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

        if (selectedGroupProject.value === "student") {
            const emptyGroup = { project_id: createdProjectId, score: 0, team_name: "Group 1" };
            await createGroupsMutation.mutateAsync({ projectId: createdProjectId, groups: [emptyGroup] });
            console.log("One empty group created");
        } else if (selectedGroupProject.value === "random") {
            const groups = divideStudentsIntoGroups(studentsData.value, capacity.value);
            const groupsToCreate = groups.map((group, i) => ({
                project_id: createdProjectId,
                score: 0,
                team_name: "Group " + (i + 1),
            }));
            const createdGroups = await createGroupsMutation.mutateAsync({ projectId: createdProjectId, groups: groupsToCreate });
            console.log("Random groups created");

            createdGroups.forEach((groupId, index) => {
                groups[index].forEach((student) => {
                    joinGroupMutation.mutateAsync({
                        groupId: groupId,
                        uid: student.uid,
                    });
                });
            });
            console.log("Students have been added to the groups successfully");
        }
    } catch (error) {
        console.error("Error during project or group creation:", error);
    }
}

function shuffle(array) {
    let shuffledArray = [...array];
    let currentIndex = shuffledArray.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
            shuffledArray[randomIndex], shuffledArray[currentIndex]];
    }

    return shuffledArray;
}

function divideStudentsIntoGroups(students, capacity) {
    students = shuffle(students);
    let groups = [];
    const numberOfGroups = Math.ceil(students.length / capacity);
    for (let i = 0; i < numberOfGroups; i++) {
        groups.push(students.slice(i * capacity, (i + 1) * capacity));
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
